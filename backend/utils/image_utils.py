"""
Utility helpers for encoding/decoding images between OpenCV and base64,
and for computing per-channel histograms.
"""
import base64
import numpy as np
import cv2


def decode_base64_image(b64_string: str) -> np.ndarray:
    """Decode a base64-encoded image string into an OpenCV BGR ndarray."""
    # Strip data-URI prefix if present
    if "," in b64_string:
        b64_string = b64_string.split(",", 1)[1]
    img_bytes = base64.b64decode(b64_string)
    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img


def encode_image_base64(img: np.ndarray, fmt: str = ".png") -> str:
    """Encode an OpenCV ndarray to a base64 PNG/JPEG string with data-URI prefix."""
    success, buffer = cv2.imencode(fmt, img)
    if not success:
        raise ValueError("Failed to encode image")
    b64 = base64.b64encode(buffer).decode("utf-8")
    mime = "image/png" if fmt == ".png" else "image/jpeg"
    return f"data:{mime};base64,{b64}"


def compute_histogram(img: np.ndarray) -> dict:
    """
    Compute per-channel histograms.
    Returns a dict with keys 'labels', 'r', 'g', 'b' (or 'gray').
    """
    labels = list(range(256))
    if len(img.shape) == 2 or img.shape[2] == 1:
        gray = img if len(img.shape) == 2 else img[:, :, 0]
        hist = cv2.calcHist([gray], [0], None, [256], [0, 256]).flatten().tolist()
        return {"labels": labels, "r": hist, "g": hist, "b": hist}
    else:
        b_hist = cv2.calcHist([img], [0], None, [256], [0, 256]).flatten().tolist()
        g_hist = cv2.calcHist([img], [1], None, [256], [0, 256]).flatten().tolist()
        r_hist = cv2.calcHist([img], [2], None, [256], [0, 256]).flatten().tolist()
        return {"labels": labels, "r": r_hist, "g": g_hist, "b": b_hist}


def compute_fft(img: np.ndarray) -> str:
    """
    Compute FFT magnitude spectrum of a grayscale version of the image.
    Returns the spectrum encoded as a base64 PNG.
    """
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
    fft_color = cv2.applyColorMap(magnitude_uint8, cv2.COLORMAP_VIRIDIS)
    return encode_image_base64(fft_color)
