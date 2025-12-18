import React, { useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import QRCode from 'qrcode'
import { Download, RefreshCw, Smartphone } from 'lucide-react'

const QrGenerator = () => {
    const [text, setText] = useState('https://freetools.site')
    const [options, setOptions] = useState({
        width: 300,
        margin: 2,
        color: {
            dark: '#000000',
            light: '#ffffff'
        }
    })
    const [qrDataUrl, setQrDataUrl] = useState('')
    const canvasRef = useRef(null)

    useEffect(() => {
        generateQr()
    }, [text, options])

    const generateQr = async () => {
        try {
            if (!text) return
            const url = await QRCode.toDataURL(text, options)
            setQrDataUrl(url)
        } catch (err) {
            console.error(err)
        }
    }

    const handleDownload = () => {
        if (!qrDataUrl) return
        const link = document.createElement('a')
        link.href = qrDataUrl
        link.download = 'qrcode.png'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <>
            <Helmet>
                <title>Free QR Code Generator - Create Custom QR Codes</title>
                <meta name="description" content="Generate free, custom QR codes instantly. No sign-up required. Download high-quality PNG QR codes for websites, text, wifi, and more." />
            </Helmet>

            <div className="container" style={{ padding: '3rem 1.5rem' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>QR Code Generator</h1>
                        <p style={{ color: '#64748b' }}>Create permanent, high-quality QR codes for free.</p>
                    </header>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
                        {/* Input Section */}
                        <div className="card" style={{
                            background: 'white',
                            padding: '2rem',
                            borderRadius: '1rem',
                            border: '1px solid var(--border)',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                        }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Content</label>
                                <input
                                    type="text"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Enter URL or text"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '0.5rem',
                                        border: '1px solid var(--border)',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Colors</label>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <span style={{ fontSize: '0.875rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>Foreground</span>
                                        <input
                                            type="color"
                                            value={options.color.dark}
                                            onChange={(e) => setOptions({ ...options, color: { ...options.color, dark: e.target.value } })}
                                            style={{ width: '100%', height: '40px', cursor: 'pointer' }}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <span style={{ fontSize: '0.875rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>Background</span>
                                        <input
                                            type="color"
                                            value={options.color.light}
                                            onChange={(e) => setOptions({ ...options, color: { ...options.color, light: e.target.value } })}
                                            style={{ width: '100%', height: '40px', cursor: 'pointer' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Size & Margin</label>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <input
                                        type="range" min="100" max="1000" step="50"
                                        value={options.width}
                                        onChange={(e) => setOptions({ ...options, width: parseInt(e.target.value) })}
                                        style={{ flex: 1 }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Preview Section */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#f8fafc',
                            padding: '2rem',
                            borderRadius: '1rem',
                            border: '1px solid var(--border)'
                        }}>
                            <div style={{
                                background: 'white',
                                padding: '1rem',
                                borderRadius: '0.5rem',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                marginBottom: '1.5rem'
                            }}>
                                {qrDataUrl && <img src={qrDataUrl} alt="QR Code" style={{ maxWidth: '100%', height: 'auto' }} />}
                            </div>

                            <button
                                onClick={handleDownload}
                                className="btn-primary"
                                style={{
                                    background: 'var(--primary)',
                                    color: 'white',
                                    padding: '0.75rem 2rem',
                                    borderRadius: '0.5rem',
                                    border: 'none',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <Download size={20} /> Download PNG
                            </button>
                        </div>
                    </div>

                    <section style={{ marginTop: '5rem', color: '#475569' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--foreground)' }}>How to use the QR Generator</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            Simply enter your URL, text, or email in the content box. The QR code will automatically update in real-time.
                            You can customize the colors to match your brand and adjust the size for high-resolution printing.
                        </p>
                    </section>
                </div>
            </div>
        </>
    )
}

export default QrGenerator
