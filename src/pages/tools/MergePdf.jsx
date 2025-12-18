import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useDropzone } from 'react-dropzone'
import { PDFDocument } from 'pdf-lib'
import { Upload, Download, FileText, ArrowUp, ArrowDown, X, Loader2 } from 'lucide-react'

const MergePdf = () => {
    const [files, setFiles] = useState([])
    const [isProcessing, setIsProcessing] = useState(false)

    const onDrop = (acceptedFiles) => {
        // Filter only PDFs
        const newFiles = acceptedFiles.filter(f => f.type === 'application/pdf')
        setFiles(prev => [...prev, ...newFiles])
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] }
    })

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    const moveFile = (index, direction) => {
        const newFiles = [...files]
        if (direction === 'up' && index > 0) {
            [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]]
        } else if (direction === 'down' && index < newFiles.length - 1) {
            [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]]
        }
        setFiles(newFiles)
    }

    const mergePdfs = async () => {
        if (files.length < 2) return
        setIsProcessing(true)

        try {
            const mergedPdf = await PDFDocument.create()

            for (const file of files) {
                const arrayBuffer = await file.arrayBuffer()
                const pdf = await PDFDocument.load(arrayBuffer)
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
                copiedPages.forEach((page) => mergedPdf.addPage(page))
            }

            const pdfBytes = await mergedPdf.save()
            const blob = new Blob([pdfBytes], { type: 'application/pdf' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = 'merged-document.pdf'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error(error)
            alert('Error merging PDFs')
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <>
            <Helmet>
                <title>Merge PDF - Combine PDF Files Online for Free</title>
                <meta name="description" content="Merge multiple PDF files into one single document. Fast, free, and secure client-side PDF merger." />
            </Helmet>

            <div className="container" style={{ padding: '3rem 1.5rem' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Merge PDF Files</h1>
                        <p style={{ color: '#64748b' }}>Combine multiple PDFs into one organized document.</p>
                    </header>

                    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '1rem', padding: '2rem' }}>
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
                                <span style={{ fontWeight: '500' }}>Drop PDFs here or click to upload</span>
                            </div>
                        </div>

                        {files.length > 0 && (
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Files to Merge ({files.length})</h3>
                                <div style={{ display: 'grid', gap: '0.75rem' }}>
                                    {files.map((file, index) => (
                                        <div key={index} style={{
                                            display: 'flex', alignItems: 'center', gap: '1rem',
                                            padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '0.5rem', background: 'white'
                                        }}>
                                            <div style={{ width: '24px', textAlign: 'center', color: '#94a3b8' }}>{index + 1}</div>
                                            <div style={{ padding: '0.5rem', background: '#fee2e2', borderRadius: '0.25rem', color: '#dc2626' }}>
                                                <FileText size={20} />
                                            </div>
                                            <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '500' }}>
                                                {file.name}
                                            </div>
                                            <div style={{ fontSize: '0.875rem', color: '#64748b', marginRight: '1rem' }}>
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => moveFile(index, 'up')} disabled={index === 0} style={{ padding: '0.25rem', background: 'transparent', border: 'none', cursor: index === 0 ? 'default' : 'pointer', opacity: index === 0 ? 0.3 : 1 }}><ArrowUp size={18} /></button>
                                                <button onClick={() => moveFile(index, 'down')} disabled={index === files.length - 1} style={{ padding: '0.25rem', background: 'transparent', border: 'none', cursor: index === files.length - 1 ? 'default' : 'pointer', opacity: index === files.length - 1 ? 0.3 : 1 }}><ArrowDown size={18} /></button>
                                                <button onClick={() => removeFile(index)} style={{ padding: '0.25rem', background: 'transparent', border: 'none', color: '#ef4444' }}><X size={18} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={mergePdfs}
                            disabled={files.length < 2 || isProcessing}
                            className="btn-primary"
                            style={{
                                width: '100%', padding: '1rem',
                                background: 'var(--primary)', color: 'white', border: 'none',
                                borderRadius: '0.5rem', fontWeight: '600',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                opacity: (files.length < 2 || isProcessing) ? 0.5 : 1
                            }}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="spin" size={20} /> Processing...
                                    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                                </>
                            ) : (
                                <>
                                    <Download size={20} /> Merge PDF
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MergePdf
