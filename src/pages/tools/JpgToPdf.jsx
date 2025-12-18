import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useDropzone } from 'react-dropzone'
import { jsPDF } from 'jspdf'
import { Upload, Download, FileText, X, ArrowUp, ArrowDown } from 'lucide-react'

const JpgToPdf = () => {
    const [images, setImages] = useState([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [settings, setSettings] = useState({
        pageSize: 'a4',
        orientation: 'portrait',
        margin: 10
    })

    const onDrop = (acceptedFiles) => {
        const newImages = acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }))
        setImages(prev => [...prev, ...newImages])
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpg', '.jpeg', '.png'] }
    })

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    const moveImage = (index, direction) => {
        const newImages = [...images]
        if (direction === 'up' && index > 0) {
            [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]]
        } else if (direction === 'down' && index < newImages.length - 1) {
            [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]]
        }
        setImages(newImages)
    }

    const generatePdf = async () => {
        if (images.length === 0) return
        setIsProcessing(true)

        try {
            const doc = new jsPDF({
                orientation: settings.orientation,
                unit: 'mm',
                format: settings.pageSize
            })

            const pageWidth = doc.internal.pageSize.getWidth()
            const pageHeight = doc.internal.pageSize.getHeight()
            const margin = settings.margin

            for (let i = 0; i < images.length; i++) {
                if (i > 0) doc.addPage()

                const img = images[i]
                const imgProps = await getImageProperties(img.preview)

                // Calculate dimensions to fit page maintaining aspect ratio
                const availableWidth = pageWidth - (margin * 2)
                const availableHeight = pageHeight - (margin * 2)
                const imgRatio = imgProps.width / imgProps.height

                let finalWidth = availableWidth
                let finalHeight = availableWidth / imgRatio

                if (finalHeight > availableHeight) {
                    finalHeight = availableHeight
                    finalWidth = availableHeight * imgRatio
                }

                const x = (pageWidth - finalWidth) / 2
                const y = (pageHeight - finalHeight) / 2

                doc.addImage(img.preview, 'JPEG', x, y, finalWidth, finalHeight)
            }

            doc.save('converted-images.pdf')
        } catch (error) {
            console.error(error)
            alert('Error creating PDF')
        } finally {
            setIsProcessing(false)
        }
    }

    const getImageProperties = (url) => {
        return new Promise((resolve) => {
            const img = new Image()
            img.onload = () => resolve({ width: img.width, height: img.height })
            img.src = url
        })
    }

    return (
        <>
            <Helmet>
                <title>JPG to PDF Converter - Free Online Tool</title>
                <meta name="description" content="Convert JPG, PNG images to PDF documents for free. Combine multiple images into a single PDF file securely in your browser." />
            </Helmet>

            <div className="container" style={{ padding: '3rem 1.5rem' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>JPG to PDF Converter</h1>
                        <p style={{ color: '#64748b' }}>Combine your images into a professional PDF document.</p>
                    </header>

                    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '1rem', padding: '2rem' }}>
                        {/* Upload Area */}
                        <div
                            {...getRootProps()}
                            style={{
                                border: '2px dashed var(--border)',
                                borderRadius: '0.75rem',
                                padding: '2rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                background: isDragActive ? 'var(--secondary)' : '#f8fafc',
                                marginBottom: '2rem'
                            }}
                        >
                            <input {...getInputProps()} />
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: '#64748b' }}>
                                <Upload size={24} />
                                <span style={{ fontWeight: '500' }}>Drop images here or click to upload</span>
                            </div>
                        </div>

                        {/* Controls */}
                        {images.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Page Size</label>
                                    <select
                                        value={settings.pageSize}
                                        onChange={(e) => setSettings({ ...settings, pageSize: e.target.value })}
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border)' }}
                                    >
                                        <option value="a4">A4</option>
                                        <option value="letter">Letter</option>
                                        <option value="legal">Legal</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Orientation</label>
                                    <select
                                        value={settings.orientation}
                                        onChange={(e) => setSettings({ ...settings, orientation: e.target.value })}
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border)' }}
                                    >
                                        <option value="portrait">Portrait</option>
                                        <option value="landscape">Landscape</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Margin (mm)</label>
                                    <input
                                        type="number"
                                        value={settings.margin}
                                        onChange={(e) => setSettings({ ...settings, margin: parseInt(e.target.value) })}
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border)' }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Image List */}
                        {images.length > 0 && (
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Selected Images ({images.length})</h3>
                                <div style={{ display: 'grid', gap: '0.75rem' }}>
                                    {images.map((img, index) => (
                                        <div key={img.preview} style={{
                                            display: 'flex', alignItems: 'center', gap: '1rem',
                                            padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '0.5rem', background: 'white'
                                        }}>
                                            <div style={{ width: '24px', textAlign: 'center', color: '#94a3b8' }}>{index + 1}</div>
                                            <img src={img.preview} alt="thumb" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '0.25rem' }} />
                                            <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {img.name}
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => moveImage(index, 'up')} disabled={index === 0} style={{ padding: '0.25rem', background: 'transparent', border: 'none', cursor: index === 0 ? 'default' : 'pointer', opacity: index === 0 ? 0.3 : 1 }}><ArrowUp size={18} /></button>
                                                <button onClick={() => moveImage(index, 'down')} disabled={index === images.length - 1} style={{ padding: '0.25rem', background: 'transparent', border: 'none', cursor: index === images.length - 1 ? 'default' : 'pointer', opacity: index === images.length - 1 ? 0.3 : 1 }}><ArrowDown size={18} /></button>
                                                <button onClick={() => removeImage(index)} style={{ padding: '0.25rem', background: 'transparent', border: 'none', color: '#ef4444' }}><X size={18} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action */}
                        <button
                            onClick={generatePdf}
                            disabled={images.length === 0 || isProcessing}
                            className="btn-primary"
                            style={{
                                width: '100%', padding: '1rem',
                                background: 'var(--primary)', color: 'white', border: 'none',
                                borderRadius: '0.5rem', fontWeight: '600',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                opacity: (images.length === 0 || isProcessing) ? 0.5 : 1
                            }}
                        >
                            {isProcessing ? 'Generating PDF...' : (
                                <>
                                    <Download size={20} /> Convert to PDF
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default JpgToPdf
