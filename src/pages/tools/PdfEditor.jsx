import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useDropzone } from 'react-dropzone'
import * as pdfjsLib from 'pdfjs-dist'
import { PDFDocument, rgb } from 'pdf-lib' // For saving
import { Upload, FileText } from 'lucide-react'
import { EditorProvider, useEditor } from '../../components/pdf-editor/EditorContext'
import Toolbar from '../../components/pdf-editor/Toolbar'
import Sidebar from '../../components/pdf-editor/Sidebar'
import PDFPage from '../../components/pdf-editor/PDFPage'
import PropertiesBar from '../../components/pdf-editor/PropertiesBar'

// Configure PDF.js worker
// Use local worker file copied to public directory for reliability
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const PdfEditorContent = () => {
    const {
        setPages, pages, isProcessing, setIsProcessing,
        setPdfDoc, canvasRefs, fileName, setFileName
    } = useEditor()
    const [file, setFile] = useState(null)

    const onDrop = async (acceptedFiles) => {
        const f = acceptedFiles[0]
        if (f && f.type === 'application/pdf') {
            setFile(f)
            setFileName(f.name)
            loadPdf(f)
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false
    })

    const loadPdf = async (file) => {
        setIsProcessing(true)
        try {
            const arrayBuffer = await file.arrayBuffer()

            // Load into PDF.js for rendering
            const loadingTask = pdfjsLib.getDocument(arrayBuffer)
            const pdf = await loadingTask.promise

            const loadedPages = []
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i)
                loadedPages.push(page)
            }
            setPages(loadedPages)

            // Keeping the raw bytes for saving later is useful, but pdf-lib can also load from bytes
            // We might just re-read the file or keep the buffer.
            // Let's keep the buffer in a way we can access, or just reload it on save.
            // Reloading on save saves memory.

        } catch (err) {
            console.error(err)
            alert("Error loading PDF")
            setFile(null)
        } finally {
            setIsProcessing(false)
        }
    }

    const handleDownload = async () => {
        if (!file) return;
        setIsProcessing(true);

        try {
            // Load original PDF with pdf-lib
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pdfPages = pdfDoc.getPages();

            // Iterate through every page and burn annotations
            // Note: pages in our state are PDF.js pages (1-indexed usually in loops, but 0-indexed in array)
            // canvasRefs is 0-indexed map

            for (let i = 0; i < pages.length; i++) {
                const fabricCanvas = canvasRefs[i];
                if (!fabricCanvas) continue;

                const pdfPage = pdfPages[i];
                const { width, height } = pdfPage.getSize();

                // Get objects from Fabric
                // We exclude the background image (the PDF page itself)
                const objects = fabricCanvas.getObjects();

                // Fabric Canvas Dimensions
                const cWidth = fabricCanvas.width;
                const cHeight = fabricCanvas.height;

                // Scale factor between Canvas and PDF
                // PDFPage rendered at active scale * 1.5 usually?
                // Wait, in PDFPage.jsx: 
                // const viewport = page.getViewport({ scale: scale * 1.5 });
                // We need to match coordinates.

                // Simplest way: Render the generic Fabric canvas to an image (PNG)
                // Overlay that PNG onto the PDF page.

                // 1. Export canvas to PNG (transparent bg)
                // We must hide the background object first (the PDF page image)
                const bg = fabricCanvas.backgroundImage;
                fabricCanvas.backgroundImage = null; // Hide
                const pngDataUrl = fabricCanvas.toDataURL({
                    format: 'png',
                    multiplier: 1 // Export at canvas resolution
                });
                fabricCanvas.backgroundImage = bg; // Restore

                // 2. Embed PNG
                const pngImage = await pdfDoc.embedPng(pngDataUrl);

                // 3. Draw PNG over page
                // We need to respect aspect ratio
                // Canvas width/height might differ from PDF point width/height
                // PDF.js viewport width/height is in pixels based on scale
                // PDF-lib width/height is in points (72 DPI usually)

                pdfPage.drawImage(pngImage, {
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                    opacity: 1,
                });
            }

            // Save and Download
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `edited-${file.name}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (err) {
            console.error("Save error:", err);
            alert("Failed to save PDF");
        } finally {
            setIsProcessing(false);
        }
    };

    if (!file) {
        return (
            <div className="container" style={{ padding: '4rem 1.5rem', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', background: 'linear-gradient(to right, var(--primary), #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Professional PDF Editor
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.25rem' }}>
                        Edit, sign, and annotate PDFs with our free, secure, client-side editor.
                    </p>
                </header>

                <div
                    {...getRootProps()}
                    style={{
                        width: '100%', maxWidth: '600px',
                        border: '3px dashed var(--border)',
                        borderRadius: '1.5rem',
                        padding: '4rem 2rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: isDragActive ? 'var(--secondary)' : 'white',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}
                >
                    <input {...getInputProps()} />
                    <div style={{
                        width: '80px', height: '80px', background: 'var(--secondary)',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1.5rem', color: 'var(--primary)'
                    }}>
                        <Upload size={40} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                        {isDragActive ? 'Drop PDF here' : 'Upload PDF Document'}
                    </h3>
                    <p style={{ color: '#64748b' }}>Drag & drop or click to browse</p>
                </div>

                <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1000px' }}>
                    {[
                        { title: 'Add Text & Images', desc: 'Easily insert text, images, and shapes onto your pages.' },
                        { title: 'Draw & Annotate', desc: 'Use the pen, highlighter, and eraser to mark up documents.' },
                        { title: '100% Secure', desc: 'Files are processed locally in your browser. No server uploads.' }
                    ].map((feat, i) => (
                        <div key={i} style={{ padding: '2rem', background: 'white', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>{feat.title}</h4>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{feat.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 3rem)', background: '#e2e8f0', overflow: 'hidden' }}>
            <style>{`
                /* Hide global footer on this page to prevent layout issues */
                .site-footer { display: none !important; }
                /* Prevent window scroll */
                body, html { overflow: hidden !important; }
                /* Ensure header doesn't overlap if it's sticky */
                .site-header { position: sticky; top: 0; z-index: 50; }
            `}</style>
            <Toolbar onDownload={handleDownload} />

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <Sidebar />

                <div style={{
                    flex: 1,
                    overflow: 'auto',
                    padding: '2rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    backgroundColor: '#cbd5e1'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {pages.map((page, index) => (
                            <PDFPage key={index} page={page} pageIndex={index} />
                        ))}
                    </div>
                </div>

                <PropertiesBar />
            </div>
        </div>
    )
}

const PdfEditor = () => {
    return (
        <EditorProvider>
            <Helmet>
                <title>Free Online PDF Editor - Edit PDFs Securely</title>
                <meta name="description" content="Professional PDF Editor. Add text, images, shapes, and freehand drawings to your PDF documents online. 100% free and client-side secure." />
            </Helmet>
            <PdfEditorContent />
        </EditorProvider>
    )
}

export default PdfEditor
