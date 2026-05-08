"""
Module 3 — Segmentation and Restoration
Covers: edge detection, thresholding, watershed
"""
import cv2
import numpy as np
from flask import Blueprint, request, jsonify
from utils.image_utils import decode_base64_image, encode_image_base64, compute_histogram, compute_fft

segmentation_bp = Blueprint("segmentation", __name__)


def _respond(img):
    return jsonify({"result": encode_image_base64(img), "histogram": compute_histogram(img), "fft": compute_fft(img)})


@segmentation_bp.route("/sobel", methods=["POST"])
def sobel():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    ksize = int(data.get("ksize", 3))
    ksize = ksize if ksize % 2 == 1 else ksize + 1
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    sx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=ksize)
    sy = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=ksize)
    mag = cv2.normalize(cv2.magnitude(sx, sy), None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
    return _respond(cv2.cvtColor(mag, cv2.COLOR_GRAY2BGR))


@segmentation_bp.route("/prewitt", methods=["POST"])
def prewitt():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    kx = np.array([[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]], dtype=np.float32)
    ky = np.array([[-1, -1, -1], [0, 0, 0], [1, 1, 1]], dtype=np.float32)
    px = cv2.filter2D(gray.astype(np.float32), -1, kx)
    py = cv2.filter2D(gray.astype(np.float32), -1, ky)
    mag = cv2.normalize(np.sqrt(px**2 + py**2), None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
    return _respond(cv2.cvtColor(mag, cv2.COLOR_GRAY2BGR))


@segmentation_bp.route("/laplacian_edge", methods=["POST"])
def laplacian_edge():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    ksize = int(data.get("ksize", 3))
    ksize = ksize if ksize % 2 == 1 else ksize + 1
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    lap = cv2.Laplacian(gray, cv2.CV_64F, ksize=ksize)
    lap = cv2.normalize(np.abs(lap), None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
    return _respond(cv2.cvtColor(lap, cv2.COLOR_GRAY2BGR))


@segmentation_bp.route("/canny", methods=["POST"])
def canny():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    t1 = int(data.get("t1", 50))
    t2 = int(data.get("t2", 150))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, t1, t2)
    return _respond(cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR))


@segmentation_bp.route("/thresh_binary", methods=["POST"])
def thresh_binary():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    thresh_val = int(data.get("thresh", 127))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, binary = cv2.threshold(gray, thresh_val, 255, cv2.THRESH_BINARY)
    return _respond(cv2.cvtColor(binary, cv2.COLOR_GRAY2BGR))


@segmentation_bp.route("/thresh_adaptive", methods=["POST"])
def thresh_adaptive():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    block_size = int(data.get("block_size", 11))
    C = int(data.get("C", 2))
    block_size = max(3, block_size if block_size % 2 == 1 else block_size + 1)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    out = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, block_size, C)
    return _respond(cv2.cvtColor(out, cv2.COLOR_GRAY2BGR))


@segmentation_bp.route("/thresh_otsu", methods=["POST"])
def thresh_otsu():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, otsu = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    return _respond(cv2.cvtColor(otsu, cv2.COLOR_GRAY2BGR))


@segmentation_bp.route("/watershed", methods=["POST"])
def watershed():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    kernel = np.ones((3, 3), np.uint8)
    opening = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=2)
    sure_bg = cv2.dilate(opening, kernel, iterations=3)
    dist = cv2.distanceTransform(opening, cv2.DIST_L2, 5)
    _, sure_fg = cv2.threshold(dist, 0.7 * dist.max(), 255, 0)
    sure_fg = np.uint8(sure_fg)
    unknown = cv2.subtract(sure_bg, sure_fg)
    _, markers = cv2.connectedComponents(sure_fg)
    markers = markers + 1
    markers[unknown == 255] = 0
    markers = cv2.watershed(img.copy(), markers)
    out = img.copy()
    out[markers == -1] = [0, 255, 255]
    return _respond(out)
