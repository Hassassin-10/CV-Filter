"""
Module 4 — Color Image Processing
Covers: color model conversion, enhancement, segmentation
"""
import cv2
import numpy as np
from flask import Blueprint, request, jsonify
from utils.image_utils import decode_base64_image, encode_image_base64, compute_histogram, compute_fft

color_bp = Blueprint("color", __name__)


def _respond(img):
    return jsonify({"result": encode_image_base64(img), "histogram": compute_histogram(img), "fft": compute_fft(img)})


@color_bp.route("/to_hsv", methods=["POST"])
def to_hsv():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    return _respond(hsv)


@color_bp.route("/to_hsi", methods=["POST"])
def to_hsi():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    # Approximate HSI using HSV (OpenCV has no direct HSI)
    img_f = img.astype(np.float32) / 255.0
    B, G, R = img_f[:, :, 0], img_f[:, :, 1], img_f[:, :, 2]
    I = (R + G + B) / 3.0
    S = 1 - (3 / (R + G + B + 1e-6)) * np.minimum(np.minimum(R, G), B)
    num = 0.5 * ((R - G) + (R - B))
    den = np.sqrt((R - G)**2 + (R - B) * (G - B)) + 1e-6
    theta = np.arccos(np.clip(num / den, -1, 1))
    H = np.where(B <= G, theta, 2 * np.pi - theta)
    H = H / (2 * np.pi)
    hsi = np.stack([H, S, I], axis=-1)
    hsi = (np.clip(hsi, 0, 1) * 255).astype(np.uint8)
    return _respond(hsi)


@color_bp.route("/to_grayscale_color", methods=["POST"])
def to_grayscale_color():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return _respond(cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR))


@color_bp.route("/extract_channel", methods=["POST"])
def extract_channel():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    channel = data.get("channel", "R")
    ch_map = {"B": 0, "G": 1, "R": 2}
    if channel in ch_map:
        idx = ch_map[channel]
        out = np.zeros_like(img)
        out[:, :, idx] = img[:, :, idx]
    elif channel in ("H", "S", "V"):
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        idx = {"H": 0, "S": 1, "V": 2}[channel]
        ch = hsv[:, :, idx]
        out = cv2.cvtColor(ch, cv2.COLOR_GRAY2BGR)
    else:
        out = img
    return _respond(out)


@color_bp.route("/histogram_eq", methods=["POST"])
def histogram_eq():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    ycrcb = cv2.cvtColor(img, cv2.COLOR_BGR2YCrCb)
    ycrcb[:, :, 0] = cv2.equalizeHist(ycrcb[:, :, 0])
    out = cv2.cvtColor(ycrcb, cv2.COLOR_YCrCb2BGR)
    return _respond(out)


@color_bp.route("/color_smooth", methods=["POST"])
def color_smooth():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    ksize = int(data.get("ksize", 5))
    ksize = ksize if ksize % 2 == 1 else ksize + 1
    out = cv2.GaussianBlur(img, (ksize, ksize), 0)
    return _respond(out)


@color_bp.route("/color_sharpen", methods=["POST"])
def color_sharpen():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]], dtype=np.float32)
    out = cv2.filter2D(img, -1, kernel)
    return _respond(out)


@color_bp.route("/hsv_mask", methods=["POST"])
def hsv_mask():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    h_low = int(data.get("h_low", 40))
    h_high = int(data.get("h_high", 80))
    s_low = int(data.get("s_low", 50))
    s_high = int(data.get("s_high", 255))
    v_low = int(data.get("v_low", 50))
    v_high = int(data.get("v_high", 255))
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    lower = np.array([h_low, s_low, v_low])
    upper = np.array([h_high, s_high, v_high])
    mask = cv2.inRange(hsv, lower, upper)
    out = cv2.bitwise_and(img, img, mask=mask)
    return _respond(out)
