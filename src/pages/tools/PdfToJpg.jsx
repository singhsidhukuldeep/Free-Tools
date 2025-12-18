import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useDropzone } from 'react-dropzone'
import * as PDFJS from 'pdfjs-dist'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { Upload, Download, FileText, Image as ImageIcon, Loader2 } from 'lucide-react'

// Worker setup for Vite
PDFJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.min.mjs`

const PdfToJpg = () => {
  const [file, setFile] = useState(null)
  const [pages, setPages] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const onDrop = async (acceptedFiles) => {
    const f = acceptedFiles[0]
    if (f && f.type === 'application/pdf') {
      setFile(f)
      await processPdf(f)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  })

  const processPdf = async (pdfFile) => {
    setIsProcessing(true)
    setPages([])
    setProgress(0)

    try {
      const arrayBuffer = await pdfFile.arrayBuffer()
      const pdf = await PDFJS.getDocument(arrayBuffer).promise
      const totalPages = pdf.numPages
      const newPages = []

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i)
        const scale = 2 // High resolution
        const viewport = page.getViewport({ scale })

        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.height = viewport.height
        canvas.width = viewport.width

        await page.render({ canvasContext: context, viewport }).promise

        const imgData = canvas.toDataURL('image/jpeg', 0.8)
        newPages.push({ id: i, data: imgData })
        setProgress(Math.round((i / totalPages) * 100))
      }

      setPages(newPages)
    } catch (error) {
      console.error('Error processing PDF:', error)
      alert('Error processing PDF. Please try a valid file.')
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadAll = async () => {
    const zip = new JSZip()
    pages.forEach((page) => {
      const data = page.data.split(',')[1]
      zip.file(`page-${page.id}.jpg`, data, { base64: true })
    })
    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, 'converted-images.zip')
  }

  const downloadSingle = (page) => {
    saveAs(page.data, `page-${page.id}.jpg`)
  }

  return (
    <>
      <Helmet>
        <title>PDF to JPG Converter - Free Online Tool</title>
        <meta name="description" content="Convert PDF pages to JPG images instantly. Free, secure, and works in your browser. Download pages individually or as a ZIP archive." />
      </Helmet>

      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>PDF to JPG Converter</h1>
            <p style={{ color: '#64748b' }}>Extract images from your PDF documents securely.</p>
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
                background: '#fee2e2',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem',
                color: '#dc2626'
              }}>
                <FileText size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Drag & Drop PDF here
              </h3>
              <p style={{ color: '#64748b' }}>or click to select file</p>
            </div>
          ) : (
            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '1rem', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ padding: '0.75rem', background: '#fee2e2', borderRadius: '0.5rem', color: '#dc2626' }}>
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>{file.name}</h3>
                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>{pages.length} Pages • {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={() => setFile(null)}
                    className="btn-secondary"
                    style={{
                      padding: '0.5rem 1rem', borderRadius: '0.5rem',
                      background: 'white', border: '1px solid var(--border)', fontWeight: '600'
                    }}
                  >
                    Convert Another
                  </button>
                  {pages.length > 0 && (
                    <button
                      onClick={downloadAll}
                      className="btn-primary"
                      style={{
                        padding: '0.5rem 1.5rem', borderRadius: '0.5rem',
                        background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '600',
                        display: 'flex', alignItems: 'center', gap: '0.5rem'
                      }}
                    >
                      <Download size={18} /> Download All (ZIP)
                    </button>
                  )}
                </div>
              </div>

              {isProcessing && (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                  <Loader2 className="spin" size={48} style={{ color: 'var(--primary)', marginBottom: '1rem', animation: 'spin 1s linear infinite' }} />
                  <p style={{ fontWeight: '500' }}>Processing PDF... {progress}%</p>
                  <style>{`@keyframes spin { 100 % { transform: rotate(360deg); } } `}</style>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {pages.map((page) => (
                  <div key={page.id} style={{
                    border: '1px solid var(--border)', borderRadius: '0.75rem', overflow: 'hidden',
                    background: '#f8fafc'
                  }}>
                    <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                      <img src={page.data} alt={`Page ${page.id} `} style={{ maxWidth: '100%', maxHeight: '100%', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                    </div>
                    <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#64748b' }}>Page {page.id}</span>
                      <button
                        onClick={() => downloadSingle(page)}
                        style={{ padding: '0.25rem', color: 'var(--primary)', background: 'transparent', border: 'none' }}
                        title="Download"
                      >
                        <Download size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default PdfToJpg
