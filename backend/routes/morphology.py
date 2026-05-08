"""
Module 5 — Morphological Operations
Covers: erosion, dilation, opening, closing, skeletonize, boundary, contours
"""
import cv2
import numpy as np
from flask import Blueprint, request, jsonify
from utils.image_utils import decode_base64_image, encode_image_base64, compute_histogram, compute_fft

morphology_bp = Blueprint("morphology", __name__)


def _respond(img):
    return jsonify({"result": encode_image_base64(img), "histogram": compute_histogram(img), "fft": compute_fft(img)})


def _get_kernel(ksize):
    ksize = ksize if ksize % 2 == 1 else ksize + 1
    return cv2.getStructuringElement(cv2.MORPH_RECT, (ksize, ksize))


@morphology_bp.route("/erode", methods=["POST"])
def erode():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    ksize = int(data.get("ksize", 5))
    iterations = int(data.get("iterations", 1))
    out = cv2.erode(img, _get_kernel(ksize), iterations=iterations)
    return _respond(out)


@morphology_bp.route("/dilate", methods=["POST"])
def dilate():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    ksize = int(data.get("ksize", 5))
    iterations = int(data.get("iterations", 1))
    out = cv2.dilate(img, _get_kernel(ksize), iterations=iterations)
    return _respond(out)


@morphology_bp.route("/opening", methods=["POST"])
def opening():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    ksize = int(data.get("ksize", 5))
    out = cv2.morphologyEx(img, cv2.MORPH_OPEN, _get_kernel(ksize))
    return _respond(out)


@morphology_bp.route("/closing", methods=["POST"])
def closing():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    ksize = int(data.get("ksize", 5))
    out = cv2.morphologyEx(img, cv2.MORPH_CLOSE, _get_kernel(ksize))
    return _respond(out)


@morphology_bp.route("/hit_miss", methods=["POST"])
def hit_miss():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, binary = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)
    kernel = np.array([[0, 1, 0], [1, -1, 1], [0, 1, 0]], dtype=np.int8)
    out = cv2.morphologyEx(binary, cv2.MORPH_HITMISS, kernel)
    return _respond(cv2.cvtColor(out, cv2.COLOR_GRAY2BGR))


@morphology_bp.route("/skeletonize", methods=["POST"])
def skeletonize():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, binary = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)
    skel = np.zeros_like(binary)
    kernel = cv2.getStructuringElement(cv2.MORPH_CROSS, (3, 3))
    temp = binary.copy()
    while True:
        eroded = cv2.erode(temp, kernel)
        dilated = cv2.dilate(eroded, kernel)
        sub = cv2.subtract(temp, dilated)
        skel = cv2.bitwise_or(skel, sub)
        temp = eroded.copy()
        if cv2.countNonZero(temp) == 0:
            break
    return _respond(cv2.cvtColor(skel, cv2.COLOR_GRAY2BGR))


@morphology_bp.route("/boundary", methods=["POST"])
def boundary():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, binary = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    eroded = cv2.erode(binary, kernel)
    boundary_img = cv2.subtract(binary, eroded)
    return _respond(cv2.cvtColor(boundary_img, cv2.COLOR_GRAY2BGR))


@morphology_bp.route("/contours", methods=["POST"])
def contours():
    data = request.get_json()
    img = decode_base64_image(data["image"])
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, binary = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)
    contour_list, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    out = img.copy()
    cv2.drawContours(out, contour_list, -1, (0, 255, 0), 2)
    return _respond(out)
