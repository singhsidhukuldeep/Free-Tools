import React, { useState, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { useDropzone } from 'react-dropzone'
import imageCompression from 'browser-image-compression'
import { Upload, Download, ArrowRight, Image as ImageIcon } from 'lucide-react'

const ImageCompressor = () => {
  const [originalImage, setOriginalImage] = useState(null)
  const [compressedImage, setCompressedImage] = useState(null)
  const [isCompressing, setIsCompressing] = useState(false)
  const [quality, setQuality] = useState(0.8)

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0]
    if (file) {
      setOriginalImage(file)
      compressImage(file, quality)
    }
  }, [quality])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  })

  const compressImage = async (file, q) => {
    setIsCompressing(true)
    try {
      const options = {
        maxSizeMB: 2,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: q
      }
      const compressedFile = await imageCompression(file, options)
      setCompressedImage(compressedFile)
    } catch (error) {
      console.error(error)
    } finally {
      setIsCompressing(false)
    }
  }

  const handleQualityChange = (e) => {
    const newQuality = parseFloat(e.target.value)
    setQuality(newQuality)
    if (originalImage) {
      compressImage(originalImage, newQuality)
    }
  }

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const downloadImage = () => {
    if (!compressedImage) return
    const link = document.createElement('a')
    link.href = URL.createObjectURL(compressedImage)
    link.download = `compressed-${originalImage.name}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <Helmet>
        <title>Free Image Compressor - Compress PNG, JPG, WebP Online</title>
        <meta name="description" content="Compress images online for free without losing quality. Optimize PNG, JPG, JPEG, and WebP files for faster website loading." />
      </Helmet>

      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Image Compressor</h1>
            <p style={{ color: '#64748b' }}>Optimize your images for web usage efficiently.</p>
          </header>

          {!originalImage ? (
            <div
              {...getRootProps()}
              style={{
                border: '2px dashed var(--border)',
                borderRadius: '1rem',
                padding: '4rem 2rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: isDragActive ? 'var(--secondary)' : 'white',
                transition: 'all 0.2s'
              }}
            >
              <input {...getInputProps()} />
              <div style={{
                width: '64px', height: '64px',
                background: 'var(--secondary)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem',
                color: 'var(--primary)'
              }}>
                <Upload size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                {isDragActive ? 'Drop image here' : 'Drag & Drop image here'}
              </h3>
              <p style={{ color: '#64748b' }}>or click to select file</p>
              <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '1rem' }}>Supports PNG, JPG, WebP</p>
            </div>
          ) : (
            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '1rem', padding: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Controls */}
                <div style={{ paddingBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontWeight: '600' }}>Compression Quality</span>
                    <span style={{ color: '#64748b' }}>{Math.round(quality * 100)}%</span>
                  </div>
                  <input
                    type="range" min="0.1" max="1.0" step="0.1"
                    value={quality}
                    onChange={handleQualityChange}
                    style={{ width: '100%', cursor: 'pointer' }}
                  />
                </div>

                {/* Comparison Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                  {/* Original */}
                  <div>
                    <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '600', color: '#64748b' }}>Original</span>
                      <span style={{ padding: '0.25rem 0.75rem', background: '#f1f5f9', borderRadius: '99px', fontSize: '0.875rem' }}>
                        {formatSize(originalImage.size)}
                      </span>
                    </div>
                    <div style={{
                      height: '250px', background: '#f8fafc', borderRadius: '0.75rem',
                      overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1px solid var(--border)'
                    }}>
                      <img src={URL.createObjectURL(originalImage)} alt="Original" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                    </div>
                  </div>

                  {/* Compressed */}
                  <div>
                    <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '600', color: 'var(--primary)' }}>Compressed</span>
                      <span style={{ padding: '0.25rem 0.75rem', background: '#dbeafe', color: '#1e40af', borderRadius: '99px', fontSize: '0.875rem' }}>
                        {compressedImage ? formatSize(compressedImage.size) : '...'}
                      </span>
                    </div>
                    <div style={{
                      height: '250px', background: '#f8fafc', borderRadius: '0.75rem',
                      overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1px solid var(--border)', position: 'relative'
                    }}>
                      {isCompressing ? (
                        <div style={{ color: 'var(--primary)', fontWeight: '600' }}>Compressing...</div>
                      ) : (
                        compressedImage && <img src={URL.createObjectURL(compressedImage)} alt="Compressed" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                  <button
                    onClick={() => setOriginalImage(null)}
                    className="btn-secondary"
                    style={{
                      padding: '0.75rem 1.5rem', borderRadius: '0.5rem',
                      background: 'white', border: '1px solid var(--border)', fontWeight: '600'
                    }}
                  >
                    Upload New
                  </button>
                  <button
                    onClick={downloadImage}
                    className="btn-primary"
                    disabled={!compressedImage || isCompressing}
                    style={{
                      padding: '0.75rem 2rem', borderRadius: '0.5rem',
                      background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '600',
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      opacity: (!compressedImage || isCompressing) ? 0.5 : 1
                    }}
                  >
                    <Download size={20} /> Download Compressed
                  </button>
                </div>

              </div>
            </div>
          )}

          <section style={{ marginTop: '5rem', color: '#475569' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--foreground)' }}>Local Image Compression</h2>
            <p style={{ marginBottom: '1rem' }}>
              We use advanced browser technologies to compress your images locally. This means your photos never leave your device, ensuring 100% privacy.
              Supports reducing file size while maintaining visual quality for faster websites and easier sharing.
            </p>
          </section>
        </div>
      </div>
    </>
  )
}

export default ImageCompressor
