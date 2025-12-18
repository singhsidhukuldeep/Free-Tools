import React, { useState, useRef, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useDropzone } from 'react-dropzone'
import { Upload, Download, Maximize, Lock, Unlock } from 'lucide-react'

const ImageResizer = () => {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [lockAspectRatio, setLockAspectRatio] = useState(true)
  const [aspectRatio, setAspectRatio] = useState(1)
  const [resizedImage, setResizedImage] = useState(null)

  const canvasRef = useRef(null)

  const onDrop = (acceptedFiles) => {
    const f = acceptedFiles[0]
    if (f) {
      setFile(f)
      const url = URL.createObjectURL(f)
      setPreviewUrl(url)

      const img = new Image()
      img.onload = () => {
        setDimensions({ width: img.width, height: img.height })
        setAspectRatio(img.width / img.height)
      }
      img.src = url
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  })

  // Resize Logic
  useEffect(() => {
    if (!file || !dimensions.width || !dimensions.height) return

    const resize = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      canvas.width = dimensions.width
      canvas.height = dimensions.height

      // Smoothing options
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height)
        setResizedImage(canvas.toDataURL(file.type))
      }
      img.src = previewUrl
    }

    // Debounce slightly or run immediately? Immediate for responsiveness
    // But for performance in typing, maybe debounce.
    const timer = setTimeout(resize, 100)
    return () => clearTimeout(timer)
  }, [dimensions, file, previewUrl])


  const handleWidthChange = (e) => {
    const val = parseInt(e.target.value) || 0
    if (lockAspectRatio) {
      setDimensions({ width: val, height: Math.round(val / aspectRatio) })
    } else {
      setDimensions({ ...dimensions, width: val })
    }
  }

  const handleHeightChange = (e) => {
    const val = parseInt(e.target.value) || 0
    if (lockAspectRatio) {
      setDimensions({ width: Math.round(val * aspectRatio), height: val })
    } else {
      setDimensions({ ...dimensions, height: val })
    }
  }

  const handleDownload = () => {
    if (!resizedImage) return
    const link = document.createElement('a')
    link.href = resizedImage
    link.download = `resized-${file.name}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <Helmet>
        <title>Free Image Resizer - Resize Images Online</title>
        <meta name="description" content="Resize images online for free. Clean interface, high quality resizing, and privacy focused. Supports PNG, JPG, and WebP." />
      </Helmet>

      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Image Resizer</h1>
            <p style={{ color: '#64748b' }}>Resize images to exact pixel dimensions securely.</p>
          </header>

          {!file ? (
            <div
              {...getRootProps()}
              style={{
                border: '2px dashed var(--border)',
                borderRadius: '1rem',
                padding: '4rem 2rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: isDragActive ? 'var(--secondary)' : 'white',
                minHeight: '300px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <input {...getInputProps()} />
              <div style={{
                width: '64px', height: '64px',
                background: '#e0e7ff',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem',
                color: '#4f46e5'
              }}>
                <Maximize size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Drag & Drop image here
              </h3>
              <p style={{ color: '#64748b' }}>or click to select file</p>
            </div>
          ) : (
            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '1rem', padding: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>

                {/* Preview Area */}
                <div style={{
                  background: '#f8fafc', borderRadius: '0.5rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  minHeight: '400px', overflow: 'hidden', padding: '1rem', border: '1px solid var(--border)'
                }}>
                  <img src={resizedImage || previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }} />
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                    <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Resize Options</h3>

                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Width (px)</label>
                      <input
                        type="number"
                        value={dimensions.width}
                        onChange={handleWidthChange}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border)' }}
                      />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Height (px)</label>
                      <input
                        type="number"
                        value={dimensions.height}
                        onChange={handleHeightChange}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border)' }}
                      />
                    </div>

                    <button
                      onClick={() => setLockAspectRatio(!lockAspectRatio)}
                      style={{
                        background: lockAspectRatio ? 'var(--secondary)' : 'transparent',
                        border: '1px solid var(--border)',
                        padding: '0.5rem 1rem', borderRadius: '0.5rem', width: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        fontSize: '0.875rem', color: lockAspectRatio ? 'var(--primary)' : '#64748b'
                      }}
                    >
                      {lockAspectRatio ? <Lock size={16} /> : <Unlock size={16} />}
                      {lockAspectRatio ? 'Aspect Ratio Locked' : 'Aspect Ratio Unlocked'}
                    </button>
                  </div>

                  <div style={{ marginTop: 'auto' }}>
                    <button
                      onClick={handleDownload}
                      className="btn-primary"
                      style={{
                        width: '100%', padding: '0.75rem',
                        background: 'var(--primary)', color: 'white', border: 'none',
                        borderRadius: '0.5rem', fontWeight: '600',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                      }}
                    >
                      <Download size={18} /> Download Resized
                    </button>
                    <button
                      onClick={() => setFile(null)}
                      style={{
                        width: '100%', padding: '0.75rem', marginTop: '0.75rem',
                        background: 'white', border: '1px solid var(--border)',
                        borderRadius: '0.5rem', fontWeight: '500', color: '#64748b'
                      }}
                    >
                      Upload New Image
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Hidden Canvas for Processing */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      </div>
    </>
  )
}

export default ImageResizer
