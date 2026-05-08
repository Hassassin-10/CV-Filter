# CV Filter — Interactive Computer Vision Lab

An interactive, browser-based Computer Vision laboratory for academic demonstration, VTU mini projects, and portfolio use. Users upload an image and apply a wide range of OpenCV-powered operations in real time.

---

## User Review Required

> [!IMPORTANT]
> **Technology Choices — Please confirm before we start:**
>
> 1. **Frontend**: The spec recommends React + Tailwind + Vite. I'll use this unless you prefer plain HTML/JS.
> 2. **Backend**: Python + Flask + OpenCV (already in your Flask Projects folder).
> 3. **Module scope**: Building all 5 modules (Basic Processing, Frequency Domain, Segmentation, Color, Morphology) in v1.

> [!WARNING]
> **Python dependencies required on your machine:**
> `opencv-python`, `numpy`, `pillow`, `scikit-image`, `matplotlib`, `flask`, `flask-cors`
> Node.js + npm are required for the React frontend (Vite).
> I'll generate a `requirements.txt` and install commands.

---

## Open Questions

> [!NOTE]
> No blockers — the spec is very detailed. I'll proceed with sensible defaults on anything unspecified (e.g. default kernel size = 5, noise amount = 2%).

---

## Proposed Changes

### Project Structure

```
CV Filter/
├── backend/
│   ├── app.py                  # Flask entry point + CORS
│   ├── routes/
│   │   ├── basic.py            # Module 1 — point ops, noise, linear filters
│   │   ├── frequency.py        # Module 2 — FFT, geometric transforms, pyramids
│   │   ├── segmentation.py     # Module 3 — edge detection, thresholding, watershed
│   │   ├── color.py            # Module 4 — color models, enhancement, segmentation
│   │   └── morphology.py       # Module 5 — erosion/dilation/skeletonize etc.
│   ├── utils/
│   │   └── image_utils.py      # encode/decode helpers
│   ├── uploads/                # temp uploaded images
│   └── requirements.txt
│
└── frontend/                   # Vite + React + Tailwind
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── components/
    │   │   ├── Sidebar.jsx         # collapsible module tree
    │   │   ├── Workspace.jsx       # original + processed panels
    │   │   ├── HistogramPanel.jsx  # live histogram chart
    │   │   ├── FFTPanel.jsx        # FFT spectrum view
    │   │   ├── ControlPanel.jsx    # sliders + dropdowns per operation
    │   │   ├── UploadZone.jsx      # drag-and-drop uploader
    │   │   └── InfoModal.jsx       # theory/formula popup
    │   ├── hooks/
    │   │   └── useImageProcessor.js  # API call wrapper + state
    │   ├── pages/
    │   │   └── HomePage.jsx
    │   └── index.css
    ├── index.html
    ├── tailwind.config.js
    └── vite.config.js
```

---

### Backend Routes (Flask)

#### [NEW] `backend/app.py`
- Flask app factory, CORS enabled, registers all blueprints
- Single `/api/process` POST endpoint accepting `{operation, params, image_base64}`
- Returns `{result_image_base64, histogram_data, fft_data}`

#### [NEW] `backend/routes/basic.py`
| Operation | Params |
|---|---|
| `grayscale` | — |
| `brightness` | `value` (-100 to +100) |
| `contrast` | `alpha` (0.1–3.0) |
| `negative` | — |
| `gamma` | `gamma` (0.1–3.0) |
| `mean_filter` | `ksize` (3/5/7/9/11) |
| `gaussian_filter` | `ksize`, `sigma` |
| `sharpen` | `strength` |
| `box_filter` | `ksize` |
| `noise_salt_pepper` | `amount` (0.01–0.1) |
| `noise_gaussian` | `mean`, `std` |
| `noise_speckle` | `intensity` |
| `denoise_median` | `ksize` |
| `denoise_gaussian` | `ksize` |
| `denoise_bilateral` | `d`, `sigma_color`, `sigma_space` |
| `denoise_nlm` | `h` |

#### [NEW] `backend/routes/frequency.py`
| Operation | Params |
|---|---|
| `fft_spectrum` | — |
| `lpf` | `cutoff` |
| `hpf` | `cutoff` |
| `rotate` | `angle` |
| `scale` | `fx`, `fy` |
| `translate` | `tx`, `ty` |
| `flip` | `direction` (h/v/both) |
| `gaussian_pyramid` | `levels` |
| `laplacian_pyramid` | `levels` |

#### [NEW] `backend/routes/segmentation.py`
| Operation | Params |
|---|---|
| `sobel` | `dx`, `dy`, `ksize` |
| `prewitt` | — |
| `laplacian` | `ksize` |
| `canny` | `t1`, `t2` |
| `thresh_binary` | `thresh` |
| `thresh_adaptive` | `block_size`, `C` |
| `thresh_otsu` | — |
| `watershed` | — |

#### [NEW] `backend/routes/color.py`
| Operation | Params |
|---|---|
| `to_hsv` | — |
| `to_hsi` | — |
| `to_grayscale` | — |
| `extract_channel` | `channel` (R/G/B/H/S/V) |
| `histogram_eq` | — |
| `color_smooth` | `ksize` |
| `color_sharpen` | — |
| `hsv_mask` | `h_low`,`h_high`,`s_low`,`s_high`,`v_low`,`v_high` |

#### [NEW] `backend/routes/morphology.py`
| Operation | Params |
|---|---|
| `erode` | `ksize`, `iterations` |
| `dilate` | `ksize`, `iterations` |
| `opening` | `ksize` |
| `closing` | `ksize` |
| `hit_miss` | — |
| `skeletonize` | — |
| `boundary` | — |
| `contours` | — |

---

### Frontend Components

#### [NEW] `frontend/src/App.jsx`
- Dark-themed layout: left sidebar (280px) + main workspace
- State: `originalImage`, `processedImage`, `selectedOp`, `params`, `histData`, `fftData`

#### [NEW] `frontend/src/components/Sidebar.jsx`
- Collapsible accordion sections for each of the 5 modules
- Each operation is a clickable item with an icon
- Active operation highlighted

#### [NEW] `frontend/src/components/Workspace.jsx`
- Side-by-side panels: **Original** | **Processed**
- Overlay badge showing operation name
- Download button on processed panel
- Compare slider (drag to reveal original underneath)

#### [NEW] `frontend/src/components/ControlPanel.jsx`
- Dynamically renders sliders / dropdowns / checkboxes based on `selectedOp`
- "Apply" button triggers API call
- Shows loading spinner during processing

#### [NEW] `frontend/src/components/HistogramPanel.jsx`
- Uses Chart.js to render R/G/B channel histograms
- Toggleable (collapsed by default)

#### [NEW] `frontend/src/components/FFTPanel.jsx`
- Displays FFT magnitude spectrum as an image
- Only visible when FFT-related operations are selected

#### [NEW] `frontend/src/components/InfoModal.jsx`
- Clicking the ℹ️ icon next to any operation opens a modal with:
  - Formula / theory
  - Use case
  - OpenCV function used

---

## Design System

- **Color palette**: Deep navy `#0a0f1e` background, cyan `#00d4ff` accent, purple `#7c3aed` secondary
- **Typography**: `Inter` from Google Fonts
- **Style**: Glassmorphism cards, smooth gradient headers, animated hover effects
- **Layout**: Responsive — sidebar collapses to bottom tabs on mobile

---

## Verification Plan

### Automated
- `npm run build` — ensures no TypeScript/JSX errors
- Flask `app.py` import check — ensures all cv2 operations load correctly

### Manual Browser Testing
- Upload a test image and cycle through all 5 module operations
- Verify histogram updates per operation
- Verify FFT panel shows for frequency ops
- Verify download button works
- Verify compare slider works

### Test Flow (Demo Pipeline)
1. Upload image → 2. Add salt & pepper noise → 3. Remove with median filter → 4. Canny edge detection → 5. Otsu threshold → 6. Erosion → 7. Download

---

## Build & Run

```bash
# Backend
cd backend
pip install -r requirements.txt
python app.py        # runs on :5000

# Frontend
cd frontend
npm install
npm run dev          # runs on :5173
```
