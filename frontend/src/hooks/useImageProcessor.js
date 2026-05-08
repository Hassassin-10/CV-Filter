import { useState, useCallback } from 'react'
import axios from 'axios'

export function useImageProcessor() {
  const [originalImage, setOriginalImage] = useState(null)   // base64
  const [processedImage, setProcessedImage] = useState(null) // base64
  const [histogramData, setHistogramData] = useState(null)
  const [fftData, setFftData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeOperation, setActiveOperation] = useState(null)

  const loadImage = useCallback((base64) => {
    setOriginalImage(base64)
    setProcessedImage(null)
    setHistogramData(null)
    setFftData(null)
    setError(null)
    setActiveOperation(null)
  }, [])

  const applyOperation = useCallback(async (module, operation, params = {}) => {
    if (!originalImage) return
    setLoading(true)
    setError(null)
    setActiveOperation(operation)

    // Use processedImage as input if it exists (chaining), else original
    const imageToProcess = processedImage || originalImage

    try {
      const res = await axios.post(`/api/${module}/${operation}`, {
        image: imageToProcess,
        ...params,
      })
      setProcessedImage(res.data.result)
      if (res.data.histogram) setHistogramData(res.data.histogram)
      if (res.data.fft) setFftData(res.data.fft)
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Processing failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [originalImage, processedImage])

  const resetToOriginal = useCallback(() => {
    setProcessedImage(null)
    setHistogramData(null)
    setFftData(null)
    setError(null)
    setActiveOperation(null)
  }, [])

  const swapToProcessed = useCallback(() => {
    if (processedImage) {
      setOriginalImage(processedImage)
      setProcessedImage(null)
      setHistogramData(null)
      setFftData(null)
      setActiveOperation(null)
    }
  }, [processedImage])

  return {
    originalImage,
    processedImage,
    histogramData,
    fftData,
    loading,
    error,
    activeOperation,
    loadImage,
    applyOperation,
    resetToOriginal,
    swapToProcessed,
  }
}
