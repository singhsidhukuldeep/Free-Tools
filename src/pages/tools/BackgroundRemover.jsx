import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useDropzone } from 'react-dropzone'
import { removeBackground } from '@imgly/background-removal'
import { Upload, Download, Scissors, Loader2, AlertTriangle } from 'lucide-react'

const BackgroundRemover = () => {
    const [file, setFile] = useState(null)
    const [processedImage, setProcessedImage] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState(null)

    // Configure imgly: publicPath identifies where the wasm/onnx models are
    // By default it tries to fetch from CDN. For a static site, this is good.
    // We can let it use the default CDN.

    const onDrop = (acceptedFiles) => {
        const f = acceptedFiles[0]
        if (f) {
            setFile(Object.assign(f, { preview: URL.createObjectURL(f) }))
            setProcessedImage(null)
            setError(null)
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: false
    })

    const removeBackground = async () => {
        if (!file) return
        setIsProcessing(true)
        setError(null)

        try {
            const blob = await removeBackground(file)
            const url = URL.createObjectURL(blob)
            setProcessedImage(url)
        } catch (err) {
            console.error(err)
            setError('Failed to process image. Your browser might not support the necessary features or network is blocked.')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleDownload = () => {
        if (!processedImage) return
        const link = document.createElement('a')
        link.href = processedImage
        link.download = `removed-bg-${file.name.split('.')[0]}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <>
            <Helmet>
                <title>Free Background Remover - Remove Image Background Online</title>
                <meta name="description" content="Remove image background automatically in seconds. Free AI text-to-transparent tool. 100% client-side privacy." />
            </Helmet>

            <div className="container" style={{ padding: '3rem 1.5rem' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Background Remover</h1>
                        <p style={{ color: '#64748b' }}>Remove backgrounds instantly with AI. 100% Free.</p>
                    </header>

                    <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', color: '#92400e', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                        <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                            <strong>Note:</strong> This tool runs entirely in your browser using WebAssembly.
                            The first time you run it, it may download ~80MB of AI models. Subsequent usages will be much faster.
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {/* Input */}
                        <div>
                            <h3 style={{ marginBottom: '1rem', fontWeight: '600' }}>Original Image</h3>
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
                                    }}
                                >
                                    <input {...getInputProps()} />
                                    <div style={{
                                        width: '64px', height: '64px',
                                        background: '#fce7f3',
                                        borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        margin: '0 auto 1.5rem',
                                        color: '#db2777'
                                    }}>
                                        <Scissors size={32} />
                                    </div>
                                    <p style={{ fontWeight: '500' }}>Click or drop image</p>
                                </div>
                            ) : (
                                <div style={{ position: 'relative', border: '1px solid var(--border)', borderRadius: '0.5rem', overflow: 'hidden' }}>
                                    <img src={file.preview} alt="Original" style={{ width: '100%', display: 'block' }} />
                                    <button
                                        onClick={() => setFile(null)}
                                        style={{
                                            position: 'absolute', top: '0.5rem', right: '0.5rem',
                                            background: 'rgba(255,255,255,0.8)', padding: '0.25rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer'
                                        }}
                                    >
                                        Change
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Output */}
                        <div>
                            <h3 style={{ marginBottom: '1rem', fontWeight: '600' }}>Result</h3>
                            <div style={{
                                width: '100%', minHeight: '300px',
                                background: '#fee2e2 url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ib3BhY2l0eSI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZmZmIiAvPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZmZmIiAvPjwvc3ZnPg==")',
                                borderRadius: '0.5rem',
                                border: '1px solid var(--border)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                position: 'relative'
                            }}>
                                {isProcessing ? (
                                    <div style={{ textAlign: 'center' }}>
                                        <Loader2 className="spin" size={48} style={{ color: 'var(--primary)', marginBottom: '1rem', animation: 'spin 1s linear infinite' }} />
                                        <p>Removing background...</p>
                                        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>This might take a moment.</p>
                                        <style>{`@keyframes spin { 100 % { transform: rotate(360deg); } } `}</style>
                                    </div>
                                ) : processedImage ? (
                                    <img src={processedImage} alt="Processed" style={{ maxWidth: '100%', maxHeight: '400px' }} />
                                ) : (
                                    <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                                        {file ? 'Ready to process' : 'Waiting for image...'}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={processedImage ? handleDownload : removeBackground}
                                disabled={!file || isProcessing}
                                className="btn-primary"
                                style={{
                                    width: '100%', padding: '1rem', marginTop: '1rem',
                                    background: processedImage ? '#16a34a' : 'var(--primary)',
                                    color: 'white', border: 'none',
                                    borderRadius: '0.5rem', fontWeight: '600',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                    opacity: (!file || isProcessing) ? 0.5 : 1
                                }}
                            >
                                {processedImage ? (
                                    <><Download size={20} /> Download Result</>
                                ) : (
                                    <><Scissors size={20} /> Remove Background</>
                                )}
                            </button>
                            {error && <p style={{ color: '#dc2626', marginTop: '0.5rem', fontSize: '0.875rem' }}>{error}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BackgroundRemover
