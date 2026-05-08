"""
Module 1 — Basic Image Processing
Covers: point operations, noise addition, linear filters, noise removal
"""
import cv2
import numpy as np
from flask import Blueprint, request, jsonify
from utils.image_utils import decode_base64_image, encode_image_base64, compute_histogram, compute_fft

basic_bp = Blueprint("basic", __name__)


def _respond(img, original=None):
    result = encode_image_base64(img)
    hist = compute_histogram(img)
    fft = compute_fft(img)
    return jsonify({"result": result, "histogram": hist, "fft": fft})


# ─── Point Operations ───────────────────────────────────────────────────────

@basic_bp.route("/grayscale", methods=["POST"])
def grayscale():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    out = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)
    return _respond(out)


@basic_bp.route("/brightness", methods=["POST"])
def brightness():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    value = float(data.get("value", 50))
    out = cv2.convertScaleAbs(img, alpha=1, beta=value)
    return _respond(out)


@basic_bp.route("/contrast", methods=["POST"])
def contrast():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    alpha = float(data.get("alpha", 1.5))
    out = cv2.convertScaleAbs(img, alpha=alpha, beta=0)
    return _respond(out)


@basic_bp.route("/negative", methods=["POST"])
def negative():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    out = cv2.bitwise_not(img)
    return _respond(out)


@basic_bp.route("/gamma", methods=["POST"])
def gamma():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    gamma_val = float(data.get("gamma", 1.5))
    inv_gamma = 1.0 / gamma_val
    table = np.array([((i / 255.0) ** inv_gamma) * 255 for i in range(256)], dtype="uint8")
    out = cv2.LUT(img, table)
    return _respond(out)


# ─── Linear Filters ─────────────────────────────────────────────────────────

@basic_bp.route("/mean_filter", methods=["POST"])
def mean_filter():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    ksize = int(data.get("ksize", 5))
    ksize = ksize if ksize % 2 == 1 else ksize + 1
    out = cv2.blur(img, (ksize, ksize))
    return _respond(out)


@basic_bp.route("/gaussian_filter", methods=["POST"])
def gaussian_filter():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    ksize = int(data.get("ksize", 5))
    sigma = float(data.get("sigma", 0))
    ksize = ksize if ksize % 2 == 1 else ksize + 1
    out = cv2.GaussianBlur(img, (ksize, ksize), sigma)
    return _respond(out)


@basic_bp.route("/sharpen", methods=["POST"])
def sharpen():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    strength = float(data.get("strength", 1.0))
    kernel = np.array([
        [0,  -1,  0],
        [-1, 4 + (1 / max(strength, 0.01)),  -1],
        [0,  -1,  0]
    ])
    sharpened = cv2.filter2D(img, -1, kernel)
    out = cv2.addWeighted(img, 1, sharpened, strength, 0)
    out = np.clip(out, 0, 255).astype(np.uint8)
    return _respond(out)


@basic_bp.route("/box_filter", methods=["POST"])
def box_filter():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    ksize = int(data.get("ksize", 5))
    ksize = ksize if ksize % 2 == 1 else ksize + 1
    out = cv2.boxFilter(img, -1, (ksize, ksize))
    return _respond(out)


# ─── Noise Addition ──────────────────────────────────────────────────────────

@basic_bp.route("/noise_salt_pepper", methods=["POST"])
def noise_salt_pepper():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    amount = float(data.get("amount", 0.02))
    noisy = img.copy()
    h, w = img.shape[:2]
    total = h * w
    num_salt = int(total * amount * 0.5)
    num_pepper = int(total * amount * 0.5)
    # Salt
    coords = [np.random.randint(0, d, num_salt) for d in (h, w)]
    noisy[coords[0], coords[1]] = 255
    # Pepper
    coords = [np.random.randint(0, d, num_pepper) for d in (h, w)]
    noisy[coords[0], coords[1]] = 0
    return _respond(noisy)


@basic_bp.route("/noise_gaussian", methods=["POST"])
def noise_gaussian():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    mean = float(data.get("mean", 0))
    std = float(data.get("std", 25))
    noise = np.random.normal(mean, std, img.shape).astype(np.float32)
    out = np.clip(img.astype(np.float32) + noise, 0, 255).astype(np.uint8)
    return _respond(out)


@basic_bp.route("/noise_speckle", methods=["POST"])
def noise_speckle():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    intensity = float(data.get("intensity", 0.1))
    noise = np.random.randn(*img.shape).astype(np.float32)
    out = np.clip(img.astype(np.float32) + img.astype(np.float32) * noise * intensity, 0, 255).astype(np.uint8)
    return _respond(out)


# ─── Noise Removal ───────────────────────────────────────────────────────────

@basic_bp.route("/denoise_median", methods=["POST"])
def denoise_median():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    ksize = int(data.get("ksize", 5))
    ksize = ksize if ksize % 2 == 1 else ksize + 1
    out = cv2.medianBlur(img, ksize)
    return _respond(out)


@basic_bp.route("/denoise_gaussian", methods=["POST"])
def denoise_gaussian():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    ksize = int(data.get("ksize", 5))
    ksize = ksize if ksize % 2 == 1 else ksize + 1
    out = cv2.GaussianBlur(img, (ksize, ksize), 0)
    return _respond(out)


@basic_bp.route("/denoise_bilateral", methods=["POST"])
def denoise_bilateral():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    d = int(data.get("d", 9))
    sigma_color = float(data.get("sigma_color", 75))
    sigma_space = float(data.get("sigma_space", 75))
    out = cv2.bilateralFilter(img, d, sigma_color, sigma_space)
    return _respond(out)


@basic_bp.route("/denoise_nlm", methods=["POST"])
def denoise_nlm():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    h = float(data.get("h", 10))
    out = cv2.fastNlMeansDenoisingColored(img, None, h, h, 7, 21)
    return _respond(out)
