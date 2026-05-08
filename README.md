<div align="center">

<img src="https://raw.githubusercontent.com/Hassassin-10/CV-Filter/main/frontend/src/assets/hero.png" alt="CV Filter Banner" width="100%" />

# 🔬 CV Filter — Interactive Computer Vision Lab

**A full-stack, browser-based Computer Vision laboratory for image processing, edge detection, segmentation, morphology, and Fourier analysis — powered by OpenCV and React.**

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.x-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![OpenCV](https://img.shields.io/badge/OpenCV-4.13-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white)](https://opencv.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[**🚀 Live Demo**](#) · [**📖 Documentation**](#modules) · [**🐛 Report Bug**](https://github.com/Hassassin-10/CV-Filter/issues) · [**✨ Request Feature**](https://github.com/Hassassin-10/CV-Filter/issues)

</div>

---

## ✨ Overview

**CV Filter** is an interactive Computer Vision laboratory that lets you upload any image and apply 48+ image processing operations in real time — directly in your browser. Built as a VTU Mini Project / Academic Demonstration tool, it covers the complete Computer Vision curriculum from basic point operations to advanced morphological processing.

```
Upload Image → Select Module → Adjust Parameters → Apply → Compare → Download
```

---

## 🖼️ Screenshots

| Landing Page | Processing Workspace |
|:---:|:---:|
| ![Landing](https://raw.githubusercontent.com/Hassassin-10/CV-Filter/main/frontend/src/assets/hero.png) | ![Workspace](https://raw.githubusercontent.com/Hassassin-10/CV-Filter/main/frontend/src/assets/hero.png) |

| Histogram Analysis | FFT Spectrum | Theory Modal |
|:---:|:---:|:---:|
| Channel-wise R/G/B histogram | Viridis-colored FFT magnitude | Formula + OpenCV function |

---

## 🧩 Modules

CV Filter is organized into **5 processing modules**, each mapped to a Flask blueprint:

### ⚡ Module 1 — Basic Image Processing
> Point operations, linear filters, noise addition and removal

| Category | Operations |
|---|---|
| **Point Operations** | Grayscale, Brightness, Contrast, Negative, Gamma Correction |
| **Linear Filters** | Mean Filter, Gaussian Filter, Sharpen, Box Filter |
| **Add Noise** | Salt & Pepper, Gaussian, Speckle |
| **Noise Removal** | Median Filter, Gaussian Blur, Bilateral Filter, Non-Local Means |

### 〰️ Module 2 — Frequency Domain
> FFT visualization, ideal filters, geometric transformations, image pyramids

| Category | Operations |
|---|---|
| **Fourier Transform** | FFT Spectrum, Low Pass Filter (LPF), High Pass Filter (HPF) |
| **Geometric Transforms** | Rotate, Scale, Translate, Flip (H/V/Both) |
| **Pyramids** | Gaussian Pyramid, Laplacian Pyramid |

### ✂️ Module 3 — Segmentation & Restoration
> Edge detection, thresholding, region-based segmentation

| Category | Operations |
|---|---|
| **Edge Detection** | Sobel, Prewitt, Laplacian, Canny |
| **Thresholding** | Binary, Adaptive, Otsu's |
| **Region Segmentation** | Watershed |

### 🎨 Module 4 — Color Image Processing
> Color model conversion, enhancement, and HSV-based segmentation

| Category | Operations |
|---|---|
| **Color Models** | RGB → HSV, RGB → HSI, Grayscale, Channel Extraction (R/G/B/H/S/V) |
| **Enhancement** | Histogram Equalization, Color Smoothing, Color Sharpening |
| **Segmentation** | HSV Color Mask / Object Isolation |

### 🔷 Module 5 — Morphological Operations
> Shape analysis, skeleton extraction, contour detection

| Category | Operations |
|---|---|
| **Basic Morphology** | Erosion, Dilation, Opening, Closing |
| **Advanced Morphology** | Hit-or-Miss, Skeletonize, Boundary Extraction, Contour Detection |

---

## 🗂️ Project Structure

```
CV Filter/
│
├── backend/                    # Python Flask API
│   ├── app.py                  # Entry point — registers all blueprints
│   ├── requirements.txt
│   ├── routes/
│   │   ├── basic.py            # Module 1 — 15 operations
│   │   ├── frequency.py        # Module 2 — 9 operations
│   │   ├── segmentation.py     # Module 3 — 8 operations
│   │   ├── color.py            # Module 4 — 8 operations
│   │   └── morphology.py       # Module 5 — 8 operations
│   └── utils/
│       └── image_utils.py      # Base64 encode/decode, histogram, FFT utils
│
└── frontend/                   # React + Vite + Tailwind CSS
    └── src/
        ├── App.jsx             # Root layout
        ├── index.css           # Design system (tokens, glass, animations)
        ├── hooks/
        │   └── useImageProcessor.js   # API state + operation chaining
        ├── data/
        │   └── operations.js   # All 48+ ops with params + theory info
        └── components/
            ├── Sidebar.jsx     # Collapsible module/operation tree
            ├── ControlPanel.jsx  # Dynamic sliders / dropdowns per op
            ├── Workspace.jsx   # Dual-panel + compare slider
            ├── HistogramPanel.jsx  # Live R/G/B histogram (Chart.js)
            ├── FFTPanel.jsx    # FFT magnitude spectrum viewer
            ├── UploadZone.jsx  # Drag-and-drop image uploader
            └── InfoModal.jsx   # Theory + formula + OpenCV function
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| Python | 3.10 or higher |
| Node.js | 18 or higher |
| npm | 9 or higher |

---

### 1. Clone the Repository

```bash
git clone https://github.com/Hassassin-10/CV-Filter.git
cd CV-Filter
```

---

### 2. Setup the Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

> The Flask API will start at **`http://localhost:5001`**

---

### 3. Setup the Frontend

Open a **new terminal** in the project root:

```bash
cd frontend
npm install
npm run dev
```

> The React app will start at **`http://localhost:5173`**

---

### 4. Open the App

Navigate to **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🔌 API Reference

All endpoints accept `POST` requests with a JSON body:

```json
{
  "image": "data:image/png;base64,...",
  "param1": value,
  "param2": value
}
```

All endpoints return:

```json
{
  "result": "data:image/png;base64,...",
  "histogram": { "labels": [...], "r": [...], "g": [...], "b": [...] },
  "fft": "data:image/png;base64,..."
}
```

### Endpoint Reference

| Module | Endpoint Prefix | Example Route |
|---|---|---|
| Basic | `/api/basic/` | `/api/basic/canny` |
| Frequency | `/api/frequency/` | `/api/frequency/lpf` |
| Segmentation | `/api/segmentation/` | `/api/segmentation/canny` |
| Color | `/api/color/` | `/api/color/to_hsv` |
| Morphology | `/api/morphology/` | `/api/morphology/erode` |

**Health Check:**
```bash
GET http://localhost:5001/api/health
# → { "status": "ok", "message": "CV Filter backend running" }
```

---

## 🎨 UI Features

| Feature | Description |
|---|---|
| 🌙 Dark Theme | Deep navy glassmorphism design with cyan/purple accents |
| 📂 Drag & Drop | Upload PNG, JPG, BMP, TIFF, WEBP images |
| ⚡ Operation Chaining | Apply multiple ops sequentially on the same image |
| 🔀 Compare Slider | Drag to compare original vs processed side-by-side |
| 📊 Live Histogram | Per-channel R/G/B histogram (Chart.js), collapsible |
| 〰️ FFT Spectrum | Viridis-colored magnitude spectrum display |
| ℹ️ Theory Modals | Formula + description + OpenCV function per operation |
| ↺ Use as Original | Promote the processed image as the new original |
| ↓ Download | Save the processed result as PNG |

---

## 📚 Key Formulas

| Operation | Formula |
|---|---|
| Grayscale | `Y = 0.299R + 0.587G + 0.114B` |
| Gamma | `I'(x,y) = (I/255)^(1/γ) × 255` |
| Sobel | `G = √(Gx² + Gy²)` |
| Otsu Threshold | Maximizes between-class variance `σ²_B` |
| Erosion | `(A ⊖ B)(x,y) = min{ A(x+i, y+j) \| (i,j)∈B }` |
| Dilation | `(A ⊕ B)(x,y) = max{ A(x-i, y-j) \| (i,j)∈B }` |
| FFT | `F(u,v) = Σ f(x,y) e^(-j2π(ux/M + vy/N))` |

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 6, Tailwind CSS v4 |
| **Charts** | Chart.js + react-chartjs-2 |
| **Upload** | react-dropzone |
| **HTTP Client** | Axios |
| **Icons** | lucide-react |
| **Backend** | Python 3, Flask 3, Flask-CORS |
| **Vision** | OpenCV 4.13, NumPy, Pillow |
| **Advanced** | scikit-image, scipy, matplotlib |

---

## 🗺️ Roadmap

- [x] Module 1 — Basic Image Processing (15 ops)
- [x] Module 2 — Frequency Domain (9 ops)
- [x] Module 3 — Segmentation (8 ops)
- [x] Module 4 — Color Processing (8 ops)
- [x] Module 5 — Morphological Operations (8 ops)
- [x] Live histogram (R/G/B channels)
- [x] FFT spectrum visualization
- [x] Theory/formula modals
- [x] Compare slider
- [x] Operation chaining
- [ ] Real-time webcam processing
- [ ] AI face/object detection (YOLOv8)
- [ ] GAN image super-resolution
- [ ] Export processing pipeline as PDF report
- [ ] Deploy to Render + Vercel

---

## 🎓 Viva Preparation

<details>
<summary><b>What is Computer Vision?</b></summary>
Computer Vision is a field of AI that enables computers to understand, interpret, and extract information from images and videos.
</details>

<details>
<summary><b>Why is Median Filter better than Mean Filter for Salt & Pepper noise?</b></summary>
The Median filter replaces each pixel with the median of its neighborhood, which is resistant to extreme outlier values (salt=255, pepper=0). The Mean filter averages all values, so extreme pixels distort the result and blur edges.
</details>

<details>
<summary><b>What is Otsu's Thresholding?</b></summary>
Otsu's method automatically finds the optimal global threshold by maximizing the between-class variance of pixel intensities — no manual threshold needed.
</details>

<details>
<summary><b>What does the FFT magnitude spectrum tell us?</b></summary>
Bright regions near the center represent low-frequency components (flat areas, background). Bright regions far from center represent high-frequency components (edges, texture). Applying a circular mask in the frequency domain implements ideal LPF or HPF.
</details>

<details>
<summary><b>Difference between Erosion and Dilation?</b></summary>

| | Erosion | Dilation |
|---|---|---|
| Effect | Shrinks bright regions | Expands bright regions |
| Formula | Min of neighborhood | Max of neighborhood |
| Use | Remove small noise | Fill holes |
| Together | Opening (erode→dilate) | Closing (dilate→erode) |
</details>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [OpenCV](https://opencv.org) — the backbone of all image processing operations
- [Flask](https://flask.palletsprojects.com) — lightweight Python web framework
- [React](https://react.dev) + [Vite](https://vitejs.dev) — fast modern frontend tooling
- [Chart.js](https://www.chartjs.org) — histogram visualization
- VTU curriculum — module structure inspired by the Computer Vision Laboratory syllabus

---

<div align="center">

**Made with ❤️ for Computer Vision enthusiasts and VTU students**

⭐ Star this repo if it helped you! ⭐

</div>
