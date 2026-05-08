"""
Module 2 — Frequency Domain Processing
Covers: FFT, LPF/HPF, geometric transforms, pyramids
"""
import cv2
import numpy as np
from flask import Blueprint, request, jsonify
from utils.image_utils import decode_base64_image, encode_image_base64, compute_histogram, compute_fft

frequency_bp = Blueprint("frequency", __name__)


def _respond(img):
    result = encode_image_base64(img)
    hist = compute_histogram(img)
    fft = compute_fft(img)
    return jsonify({"result": result, "histogram": hist, "fft": fft})


def _apply_frequency_filter(img, cutoff, low_pass=True):
    if len(img.shape) == 3:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    else:
        gray = img
    rows, cols = gray.shape
    crow, ccol = rows // 2, cols // 2
    gray_f = np.float32(gray)
    dft = np.fft.fft2(gray_f)
    dft_shift = np.fft.fftshift(dft)
    mask = np.zeros((rows, cols), np.uint8)
    if low_pass:
        cv2.circle(mask, (ccol, crow), cutoff, 1, -1)
    else:
        mask = np.ones((rows, cols), np.uint8)
        cv2.circle(mask, (ccol, crow), cutoff, 0, -1)
    filtered = dft_shift * mask
    f_ishift = np.fft.ifftshift(filtered)
    img_back = np.fft.ifft2(f_ishift)
    img_back = np.abs(img_back)
    img_back = cv2.normalize(img_back, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
    return cv2.cvtColor(img_back, cv2.COLOR_GRAY2BGR)


# ─── FFT Spectrum ─────────────────────────────────────────────────────────────

@frequency_bp.route("/fft_spectrum", methods=["POST"])
def fft_spectrum():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    if len(img.shape) == 3:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    else:
        gray = img
    gray_f = np.float32(gray)
    dft = cv2.dft(gray_f, flags=cv2.DFT_COMPLEX_OUTPUT)
    dft_shift = np.fft.fftshift(dft)
    magnitude = cv2.magnitude(dft_shift[:, :, 0], dft_shift[:, :, 1])
    magnitude_log = 20 * np.log(magnitude + 1)
    magnitude_norm = cv2.normalize(magnitude_log, None, 0, 255, cv2.NORM_MINMAX)
    magnitude_uint8 = np.uint8(magnitude_norm)
    out = cv2.applyColorMap(magnitude_uint8, cv2.COLORMAP_VIRIDIS)
    return _respond(out)


@frequency_bp.route("/lpf", methods=["POST"])
def lpf():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    cutoff = int(data.get("cutoff", 30))
    out = _apply_frequency_filter(img, cutoff, low_pass=True)
    return _respond(out)


@frequency_bp.route("/hpf", methods=["POST"])
def hpf():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    cutoff = int(data.get("cutoff", 30))
    out = _apply_frequency_filter(img, cutoff, low_pass=False)
    return _respond(out)


# ─── Geometric Transforms ─────────────────────────────────────────────────────

@frequency_bp.route("/rotate", methods=["POST"])
def rotate():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    angle = float(data.get("angle", 45))
    h, w = img.shape[:2]
    M = cv2.getRotationMatrix2D((w / 2, h / 2), angle, 1)
    out = cv2.warpAffine(img, M, (w, h), borderMode=cv2.BORDER_REFLECT)
    return _respond(out)


@frequency_bp.route("/scale", methods=["POST"])
def scale():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    fx = float(data.get("fx", 1.5))
    fy = float(data.get("fy", 1.5))
    out = cv2.resize(img, None, fx=fx, fy=fy, interpolation=cv2.INTER_LINEAR)
    # Resize back to original shape for display consistency
    out = cv2.resize(out, (img.shape[1], img.shape[0]))
    return _respond(out)


@frequency_bp.route("/translate", methods=["POST"])
def translate():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    tx = float(data.get("tx", 50))
    ty = float(data.get("ty", 50))
    h, w = img.shape[:2]
    M = np.float32([[1, 0, tx], [0, 1, ty]])
    out = cv2.warpAffine(img, M, (w, h), borderMode=cv2.BORDER_REFLECT)
    return _respond(out)


@frequency_bp.route("/flip", methods=["POST"])
def flip():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    direction = data.get("direction", "h")
    flip_code = {"h": 1, "v": 0, "both": -1}.get(direction, 1)
    out = cv2.flip(img, flip_code)
    return _respond(out)


# ─── Pyramids ─────────────────────────────────────────────────────────────────

@frequency_bp.route("/gaussian_pyramid", methods=["POST"])
def gaussian_pyramid():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    levels = int(data.get("levels", 2))
    current = img.copy()
    pyramid = [current]
    for _ in range(levels):
        current = cv2.pyrDown(current)
        pyramid.append(current)
    # Show all levels tiled horizontally
    target_h = img.shape[0]
    tiles = []
    for p in pyramid:
        resized = cv2.resize(p, (int(p.shape[1] * target_h / p.shape[0]), target_h))
        tiles.append(resized)
    out = np.hstack(tiles)
    return _respond(out)


@frequency_bp.route("/laplacian_pyramid", methods=["POST"])
def laplacian_pyramid():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    levels = int(data.get("levels", 2))
    current = img.copy()
    gp = [current]
    for _ in range(levels):
        current = cv2.pyrDown(current)
        gp.append(current)
    lp = []
    for i in range(levels):
        up = cv2.pyrUp(gp[i + 1], dstsize=(gp[i].shape[1], gp[i].shape[0]))
        lap = cv2.subtract(gp[i], up)
        lp.append(lap)
    lp.append(gp[-1])
    # Show top Laplacian level
    show = lp[0]
    show_norm = cv2.normalize(show, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
    return _respond(show_norm)
