// Sidebar operation tree with metadata for controls and info modals
export const MODULES = [
  {
    id: 'basic',
    label: 'Basic Processing',
    icon: '⚡',
    color: '#00d4ff',
    groups: [
      {
        label: 'Point Operations',
        ops: [
          { id: 'grayscale',    label: 'Grayscale',         params: [] },
          { id: 'brightness',   label: 'Brightness',         params: [{ key: 'value',  label: 'Value',  type: 'range', min: -100, max: 100, step: 1,   default: 50 }] },
          { id: 'contrast',     label: 'Contrast',           params: [{ key: 'alpha',  label: 'Alpha',  type: 'range', min: 0.1,  max: 3.0,  step: 0.1, default: 1.5 }] },
          { id: 'negative',     label: 'Negative',           params: [] },
          { id: 'gamma',        label: 'Gamma Correction',   params: [{ key: 'gamma',  label: 'Gamma',  type: 'range', min: 0.1,  max: 3.0,  step: 0.1, default: 1.5 }] },
        ],
      },
      {
        label: 'Linear Filters',
        ops: [
          { id: 'mean_filter',    label: 'Mean Filter',      params: [{ key: 'ksize', label: 'Kernel Size', type: 'select', options: [3,5,7,9,11], default: 5 }] },
          { id: 'gaussian_filter',label: 'Gaussian Filter',  params: [{ key: 'ksize', label: 'Kernel Size', type: 'select', options: [3,5,7,9,11], default: 5 }, { key: 'sigma', label: 'Sigma', type: 'range', min: 0, max: 5, step: 0.1, default: 0 }] },
          { id: 'sharpen',        label: 'Sharpen',          params: [{ key: 'strength', label: 'Strength', type: 'range', min: 0.1, max: 3, step: 0.1, default: 1.0 }] },
          { id: 'box_filter',     label: 'Box Filter',       params: [{ key: 'ksize', label: 'Kernel Size', type: 'select', options: [3,5,7,9,11], default: 5 }] },
        ],
      },
      {
        label: 'Add Noise',
        ops: [
          { id: 'noise_salt_pepper', label: 'Salt & Pepper Noise', params: [{ key: 'amount',    label: 'Amount',    type: 'range', min: 0.001, max: 0.1, step: 0.001, default: 0.02 }] },
          { id: 'noise_gaussian',    label: 'Gaussian Noise',      params: [{ key: 'std',       label: 'Std Dev',   type: 'range', min: 1,     max: 80,  step: 1,     default: 25 }] },
          { id: 'noise_speckle',     label: 'Speckle Noise',       params: [{ key: 'intensity', label: 'Intensity', type: 'range', min: 0.01,  max: 0.5, step: 0.01,  default: 0.1 }] },
        ],
      },
      {
        label: 'Noise Removal',
        ops: [
          { id: 'denoise_median',    label: 'Median Filter',       params: [{ key: 'ksize', label: 'Kernel Size', type: 'select', options: [3,5,7,9,11], default: 5 }] },
          { id: 'denoise_gaussian',  label: 'Gaussian Blur',       params: [{ key: 'ksize', label: 'Kernel Size', type: 'select', options: [3,5,7,9,11], default: 5 }] },
          { id: 'denoise_bilateral', label: 'Bilateral Filter',    params: [{ key: 'd', label: 'Diameter', type: 'range', min: 1, max: 15, step: 1, default: 9 }, { key: 'sigma_color', label: 'Sigma Color', type: 'range', min: 10, max: 150, step: 5, default: 75 }] },
          { id: 'denoise_nlm',       label: 'Non-Local Means',     params: [{ key: 'h', label: 'Filter Strength', type: 'range', min: 1, max: 30, step: 1, default: 10 }] },
        ],
      },
    ],
  },
  {
    id: 'frequency',
    label: 'Frequency Domain',
    icon: '〰️',
    color: '#7c3aed',
    groups: [
      {
        label: 'Fourier Transform',
        ops: [
          { id: 'fft_spectrum', label: 'FFT Spectrum',    params: [] },
          { id: 'lpf',          label: 'Low Pass Filter', params: [{ key: 'cutoff', label: 'Cutoff Radius', type: 'range', min: 5, max: 100, step: 1, default: 30 }] },
          { id: 'hpf',          label: 'High Pass Filter',params: [{ key: 'cutoff', label: 'Cutoff Radius', type: 'range', min: 5, max: 100, step: 1, default: 30 }] },
        ],
      },
      {
        label: 'Geometric Transforms',
        ops: [
          { id: 'rotate',    label: 'Rotate',     params: [{ key: 'angle', label: 'Angle (°)', type: 'range', min: -180, max: 180, step: 1, default: 45 }] },
          { id: 'scale',     label: 'Scale',      params: [{ key: 'fx', label: 'Scale X', type: 'range', min: 0.25, max: 3, step: 0.05, default: 1.5 }, { key: 'fy', label: 'Scale Y', type: 'range', min: 0.25, max: 3, step: 0.05, default: 1.5 }] },
          { id: 'translate', label: 'Translate',  params: [{ key: 'tx', label: 'Shift X', type: 'range', min: -200, max: 200, step: 1, default: 50 }, { key: 'ty', label: 'Shift Y', type: 'range', min: -200, max: 200, step: 1, default: 50 }] },
          { id: 'flip',      label: 'Flip',       params: [{ key: 'direction', label: 'Direction', type: 'select', options: ['h','v','both'], labels: ['Horizontal','Vertical','Both'], default: 'h' }] },
        ],
      },
      {
        label: 'Pyramids',
        ops: [
          { id: 'gaussian_pyramid',  label: 'Gaussian Pyramid',  params: [{ key: 'levels', label: 'Levels', type: 'range', min: 1, max: 4, step: 1, default: 2 }] },
          { id: 'laplacian_pyramid', label: 'Laplacian Pyramid', params: [{ key: 'levels', label: 'Levels', type: 'range', min: 1, max: 4, step: 1, default: 2 }] },
        ],
      },
    ],
  },
  {
    id: 'segmentation',
    label: 'Segmentation',
    icon: '✂️',
    color: '#10b981',
    groups: [
      {
        label: 'Edge Detection',
        ops: [
          { id: 'sobel',          label: 'Sobel',           params: [{ key: 'ksize', label: 'Kernel Size', type: 'select', options: [3,5,7], default: 3 }] },
          { id: 'prewitt',        label: 'Prewitt',         params: [] },
          { id: 'laplacian_edge', label: 'Laplacian',       params: [{ key: 'ksize', label: 'Kernel Size', type: 'select', options: [1,3,5,7], default: 3 }] },
          { id: 'canny',          label: 'Canny',           params: [{ key: 't1', label: 'Threshold 1', type: 'range', min: 0, max: 255, step: 1, default: 50 }, { key: 't2', label: 'Threshold 2', type: 'range', min: 0, max: 255, step: 1, default: 150 }] },
        ],
      },
      {
        label: 'Thresholding',
        ops: [
          { id: 'thresh_binary',   label: 'Binary Threshold',   params: [{ key: 'thresh', label: 'Threshold', type: 'range', min: 0, max: 255, step: 1, default: 127 }] },
          { id: 'thresh_adaptive', label: 'Adaptive Threshold', params: [{ key: 'block_size', label: 'Block Size', type: 'range', min: 3, max: 51, step: 2, default: 11 }, { key: 'C', label: 'C Value', type: 'range', min: -10, max: 20, step: 1, default: 2 }] },
          { id: 'thresh_otsu',     label: "Otsu's Threshold",   params: [] },
        ],
      },
      {
        label: 'Region Segmentation',
        ops: [
          { id: 'watershed', label: 'Watershed', params: [] },
        ],
      },
    ],
  },
  {
    id: 'color',
    label: 'Color Processing',
    icon: '🎨',
    color: '#f59e0b',
    groups: [
      {
        label: 'Color Models',
        ops: [
          { id: 'to_hsv',           label: 'Convert to HSV',  params: [] },
          { id: 'to_hsi',           label: 'Convert to HSI',  params: [] },
          { id: 'to_grayscale_color',label: 'Grayscale',      params: [] },
          { id: 'extract_channel',  label: 'Extract Channel', params: [{ key: 'channel', label: 'Channel', type: 'select', options: ['R','G','B','H','S','V'], default: 'R' }] },
        ],
      },
      {
        label: 'Color Enhancement',
        ops: [
          { id: 'histogram_eq',  label: 'Histogram Equalization', params: [] },
          { id: 'color_smooth',  label: 'Color Smoothing',        params: [{ key: 'ksize', label: 'Kernel Size', type: 'select', options: [3,5,7,9,11], default: 5 }] },
          { id: 'color_sharpen', label: 'Color Sharpening',       params: [] },
        ],
      },
      {
        label: 'Color Segmentation',
        ops: [
          { id: 'hsv_mask', label: 'HSV Color Mask', params: [
            { key: 'h_low',  label: 'H Low',  type: 'range', min: 0, max: 179, step: 1, default: 40 },
            { key: 'h_high', label: 'H High', type: 'range', min: 0, max: 179, step: 1, default: 80 },
            { key: 's_low',  label: 'S Low',  type: 'range', min: 0, max: 255, step: 1, default: 50 },
            { key: 's_high', label: 'S High', type: 'range', min: 0, max: 255, step: 1, default: 255 },
          ]},
        ],
      },
    ],
  },
  {
    id: 'morphology',
    label: 'Morphology',
    icon: '🔷',
    color: '#ec4899',
    groups: [
      {
        label: 'Basic Morphology',
        ops: [
          { id: 'erode',   label: 'Erosion',  params: [{ key: 'ksize', label: 'Kernel', type: 'select', options: [3,5,7,9,11], default: 5 }, { key: 'iterations', label: 'Iterations', type: 'range', min: 1, max: 5, step: 1, default: 1 }] },
          { id: 'dilate',  label: 'Dilation', params: [{ key: 'ksize', label: 'Kernel', type: 'select', options: [3,5,7,9,11], default: 5 }, { key: 'iterations', label: 'Iterations', type: 'range', min: 1, max: 5, step: 1, default: 1 }] },
          { id: 'opening', label: 'Opening',  params: [{ key: 'ksize', label: 'Kernel', type: 'select', options: [3,5,7,9,11], default: 5 }] },
          { id: 'closing', label: 'Closing',  params: [{ key: 'ksize', label: 'Kernel', type: 'select', options: [3,5,7,9,11], default: 5 }] },
        ],
      },
      {
        label: 'Advanced Morphology',
        ops: [
          { id: 'hit_miss',    label: 'Hit-or-Miss',        params: [] },
          { id: 'skeletonize', label: 'Skeletonize',        params: [] },
          { id: 'boundary',    label: 'Boundary Extraction',params: [] },
          { id: 'contours',    label: 'Contour Detection',  params: [] },
        ],
      },
    ],
  },
]

// Info/theory content keyed by operation id
export const OP_INFO = {
  grayscale:         { formula: 'Y = 0.299R + 0.587G + 0.114B', desc: 'Converts a color image to grayscale using luminance weights.', cv2: 'cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)' },
  brightness:        { formula: 'I\'(x,y) = I(x,y) + β', desc: 'Adds a constant value to all pixels, shifting brightness uniformly.', cv2: 'cv2.convertScaleAbs(img, beta=value)' },
  contrast:          { formula: 'I\'(x,y) = α × I(x,y)', desc: 'Multiplies all pixel values by alpha to scale contrast.', cv2: 'cv2.convertScaleAbs(img, alpha=alpha)' },
  negative:          { formula: 'I\'(x,y) = 255 - I(x,y)', desc: 'Inverts all pixel values producing a photographic negative.', cv2: 'cv2.bitwise_not(img)' },
  gamma:             { formula: 'I\'(x,y) = (I(x,y)/255)^(1/γ) × 255', desc: 'Applies non-linear gamma correction for display calibration.', cv2: 'cv2.LUT(img, table)' },
  mean_filter:       { formula: 'f(x,y) = (1/n²) Σ g(i,j)', desc: 'Replaces each pixel with the average of its neighborhood. Blurs image.', cv2: 'cv2.blur(img, (k,k))' },
  gaussian_filter:   { formula: 'G(x,y) = (1/2πσ²)e^(-(x²+y²)/2σ²)', desc: 'Weighted average using Gaussian distribution for natural smoothing.', cv2: 'cv2.GaussianBlur(img, (k,k), sigma)' },
  sharpen:           { formula: 'Kernel: [[0,-1,0],[-1,5,-1],[0,-1,0]]', desc: 'Enhances high-frequency edges by subtracting a blurred version.', cv2: 'cv2.filter2D(img, -1, kernel)' },
  noise_salt_pepper: { formula: 'P(salt) = P(pepper) = amount/2', desc: 'Random pixels are set to 255 (salt) or 0 (pepper) to simulate impulse noise.', cv2: 'noisy[coords] = 255 / 0' },
  denoise_median:    { formula: 'f(x,y) = median{g(i,j) in N(x,y)}', desc: 'Replaces each pixel with the median. Excellent for removing salt & pepper noise.', cv2: 'cv2.medianBlur(img, k)' },
  denoise_bilateral: { formula: 'w(i,j) ∝ exp(-||pos||²/2σ²_s) × exp(-||color||²/2σ²_c)', desc: 'Edge-preserving filter combining spatial and range Gaussian kernels.', cv2: 'cv2.bilateralFilter(img, d, σ_c, σ_s)' },
  sobel:             { formula: 'Gx = [[-1,0,1],[-2,0,2],[-1,0,1]], G = √(Gx²+Gy²)', desc: 'Computes gradient magnitude for horizontal/vertical edge detection.', cv2: 'cv2.Sobel(img, cv2.CV_64F, 1, 0)' },
  canny:             { formula: 'Non-max suppression + double thresholding + edge tracking', desc: 'Multi-stage optimal edge detector. Best for clean, thin edges.', cv2: 'cv2.Canny(img, t1, t2)' },
  thresh_otsu:       { formula: 'σ²_B(t) = ω₀(t)ω₁(t)[μ₀(t)-μ₁(t)]²', desc: 'Automatically finds optimal threshold by maximizing between-class variance.', cv2: 'cv2.threshold(img, 0, 255, cv2.THRESH_OTSU)' },
  watershed:         { formula: 'Topographic model → regional minima flooding', desc: 'Segments touching objects by treating intensity as a topographic surface.', cv2: 'cv2.watershed(img, markers)' },
  erode:             { formula: '(A ⊖ B)(x,y) = min{A(x+i,y+j) | (i,j)∈B}', desc: 'Erodes boundaries of foreground objects. Shrinks bright regions.', cv2: 'cv2.erode(img, kernel)' },
  dilate:            { formula: '(A ⊕ B)(x,y) = max{A(x-i,y-j) | (i,j)∈B}', desc: 'Expands boundaries of foreground objects. Grows bright regions.', cv2: 'cv2.dilate(img, kernel)' },
  opening:           { formula: 'A ∘ B = (A ⊖ B) ⊕ B', desc: 'Erosion followed by dilation. Removes small objects (noise).', cv2: 'cv2.morphologyEx(img, cv2.MORPH_OPEN, kernel)' },
  closing:           { formula: 'A • B = (A ⊕ B) ⊖ B', desc: 'Dilation followed by erosion. Fills small holes in objects.', cv2: 'cv2.morphologyEx(img, cv2.MORPH_CLOSE, kernel)' },
  fft_spectrum:      { formula: 'F(u,v) = Σ f(x,y) e^(-j2π(ux/M + vy/N))', desc: 'Transforms image to frequency domain. Bright center = low freq, edges = high freq.', cv2: 'np.fft.fft2(img)' },
  lpf:               { formula: 'H(u,v) = 1 if D(u,v) ≤ D₀, else 0', desc: 'Ideal low-pass filter. Keeps frequencies within cutoff radius, removes rest.', cv2: 'np.fft.fft2 + circular mask' },
  hpf:               { formula: 'H(u,v) = 0 if D(u,v) ≤ D₀, else 1', desc: 'Ideal high-pass filter. Removes low frequencies, keeps edges and detail.', cv2: 'np.fft.fft2 + inverted circular mask' },
  histogram_eq:      { formula: 's = T(r) = (L-1) Σ p_r(r_j)', desc: 'Redistributes pixel intensities for better contrast using cumulative distribution.', cv2: 'cv2.equalizeHist(channel)' },
}
