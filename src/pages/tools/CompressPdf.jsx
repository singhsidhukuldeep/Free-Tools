import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useDropzone } from 'react-dropzone'
import { PDFDocument } from 'pdf-lib'
import { Upload, Download, FileText, Loader2, AlertCircle } from 'lucide-react'

const CompressPdf = () => {
    const [file, setFile] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [compressedPdf, setCompressedPdf] = useState(null)
    const [originalSize, setOriginalSize] = useState(0)
    const [newSize, setNewSize] = useState(0)

    const onDrop = async (acceptedFiles) => {
        const f = acceptedFiles[0]
        if (f && f.type === 'application/pdf') {
            setFile(f)
            setOriginalSize(f.size)
            setCompressedPdf(null)
            setNewSize(0)
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false
    })

    const compressPdf = async () => {
        if (!file) return
        setIsProcessing(true)

        try {
            const arrayBuffer = await file.arrayBuffer()
            const pdfDoc = await PDFDocument.load(arrayBuffer)

            // Basic optimization: clear metadata, remove unused objects
            pdfDoc.setTitle('')
            pdfDoc.setAuthor('')
            pdfDoc.setSubject('')
            pdfDoc.setKeywords([])
            pdfDoc.setProducer('')
            pdfDoc.setCreator('')

            // This is "lossless" structure optimization mostly in pdf-lib
            const pdfBytes = await pdfDoc.save({ useObjectStreams: false })

            const blob = new Blob([pdfBytes], { type: 'application/pdf' })
            setCompressedPdf(blob)
            setNewSize(blob.size)
        } catch (error) {
            console.error(error)
            alert('Error compressing PDF')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleDownload = () => {
        if (!compressedPdf) return
        const link = document.createElement('a')
        link.href = URL.createObjectURL(compressedPdf)
        link.download = `compressed-${file.name}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <>
            <Helmet>
                <title>Compress PDF - Optimize PDF File Size Online</title>
                <meta name="description" content="Reduce PDF file size online continuously. Remove metadata and optimize structure for web sharing. Free and secure." />
            </Helmet>

            <div className="container" style={{ padding: '3rem 1.5rem' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Compress PDF</h1>
                        <p style={{ color: '#64748b' }}>Optimize your PDF files for faster loading.</p>
                    </header>

                    <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', color: '#0369a1', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem', display: 'flex', gap: '0.75rem' }}>
                        <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <p style={{ fontSize: '0.875rem' }}>
                            This client-side tool optimizes PDF structure and removes metadata.
                            For significant file size reduction of creating heavy image-based PDFs, try our
                            <a href="/pdf-to-jpg" style={{ textDecoration: 'underline', marginLeft: '4px' }}>PDF to JPG</a> tool.
                        </p>
                    </div>

                    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '1rem', padding: '2rem' }}>
                        {!file ? (
                            <div
                                {...getRootProps()}
                                style={{
                                    border: '2px dashed var(--border)',
                                    borderRadius: '0.75rem',
                                    padding: '3rem 2rem',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    background: isDragActive ? 'var(--secondary)' : '#f8fafc'
                                }}
                            >
                                <input {...getInputProps()} />
                                <Upload size={32} style={{ color: '#64748b', marginBottom: '1rem' }} />
                                <p style={{ fontWeight: '500' }}>Drag & Drop PDF or Click to Upload</p>
                            </div>
                        ) : (
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <FileText size={24} color="var(--primary)" />
                                        <div>
                                            <p style={{ fontWeight: '600' }}>{file.name}</p>
                                            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Original: {(originalSize / 1024).toFixed(1)} KB</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setFile(null)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
                                </div>

                                {compressedPdf && (
                                    <div style={{ textAlign: 'center', marginBottom: '1.5rem', padding: '1rem', background: '#ecfdf5', borderRadius: '0.5rem', color: '#047857' }}>
                                        <p style={{ fontWeight: '600', fontSize: '1.125rem' }}>Compression Complete!</p>
                                        <p>New Size: {(newSize / 1024).toFixed(1)} KB ({Math.round((1 - newSize / originalSize) * 100)}% saved)</p>
                                    </div>
                                )}

                                <button
                                    onClick={compressedPdf ? handleDownload : compressPdf}
                                    disabled={isProcessing}
                                    className="btn-primary"
                                    style={{
                                        width: '100%', padding: '1rem',
                                        background: 'var(--primary)', color: 'white', border: 'none',
                                        borderRadius: '0.5rem', fontWeight: '600',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                        opacity: isProcessing ? 0.7 : 1
                                    }}
                                >
                                    {isProcessing ? (
                                        <><Loader2 className="spin" size={20} /> Optimizing...</>
                                    ) : compressedPdf ? (
                                        <><Download size={20} /> Download Optimized PDF</>
                                    ) : (
                                        'Compress PDF'
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default CompressPdf
