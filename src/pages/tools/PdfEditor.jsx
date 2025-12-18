import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useDropzone } from 'react-dropzone'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { Upload, Download, FileText, Type, Save } from 'lucide-react'

const PdfEditor = () => {
    const [file, setFile] = useState(null)
    const [pdfDoc, setPdfDoc] = useState(null)
    const [textInput, setTextInput] = useState('')
    const [pages, setPages] = useState([]) // Placeholder for page preview if we had time
    const [isProcessing, setIsProcessing] = useState(false)

    const onDrop = async (acceptedFiles) => {
        const f = acceptedFiles[0]
        if (f && f.type === 'application/pdf') {
            setFile(f)
            const arrayBuffer = await f.arrayBuffer()
            const doc = await PDFDocument.load(arrayBuffer)
            setPdfDoc(doc)
            // Ideally we render pages here to allow clicking to add text
            // For simplified version, we just append text to first page or all pages?
            // Let's just say "Add Text to First Page" for this basic version
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false
    })

    const addTextToPdf = async () => {
        if (!pdfDoc || !textInput) return
        setIsProcessing(true)

        try {
            const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
            const pages = pdfDoc.getPages()
            const firstPage = pages[0]
            const { width, height } = firstPage.getSize()

            firstPage.drawText(textInput, {
                x: 50,
                y: height - 50,
                size: 24,
                font: helveticaFont,
                color: rgb(0, 0, 0),
            })

            const pdfBytes = await pdfDoc.save()
            const blob = new Blob([pdfBytes], { type: 'application/pdf' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = `edited-${file.name}`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (err) {
            console.error(err)
            alert("Error editing PDF")
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <>
            <Helmet>
                <title>Edit PDF - Add Text to PDF Online</title>
                <meta name="description" content="Add text to PDF documents online. Basic PDF editor for quick annotations. Free and secure." />
            </Helmet>

            <div className="container" style={{ padding: '3rem 1.5rem' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Basic PDF Editor</h1>
                        <p style={{ color: '#64748b' }}>Add text annotations to your PDF files.</p>
                    </header>

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
                                <p style={{ fontWeight: '500' }}>Drag & Drop PDF to Edit</p>
                            </div>
                        ) : (
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <FileText size={24} color="var(--primary)" />
                                        <span style={{ fontWeight: '600' }}>{file.name}</span>
                                    </div>
                                    <button onClick={() => { setFile(null); setPdfDoc(null) }} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>Cancel</button>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Add Text (Top Left of First Page)</label>
                                    <input
                                        type="text"
                                        value={textInput}
                                        onChange={(e) => setTextInput(e.target.value)}
                                        placeholder="Enter text to add..."
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', fontSize: '1rem' }}
                                    />
                                </div>

                                <button
                                    onClick={addTextToPdf}
                                    disabled={!textInput || isProcessing}
                                    className="btn-primary"
                                    style={{
                                        width: '100%', padding: '1rem',
                                        background: 'var(--primary)', color: 'white', border: 'none',
                                        borderRadius: '0.5rem', fontWeight: '600',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                        opacity: (!textInput || isProcessing) ? 0.5 : 1
                                    }}
                                >
                                    <Save size={20} /> Save PDF
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default PdfEditor
