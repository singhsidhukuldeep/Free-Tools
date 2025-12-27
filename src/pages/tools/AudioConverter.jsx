import React, { useState, useEffect, useRef } from 'react'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import ToolLayout from '../../components/tools/ToolLayout'
import RelatedTools from '../../components/tools/RelatedTools'
import { Upload, Download, FileAudio, Loader2, RefreshCw, AlertCircle, Music } from 'lucide-react'

const features = [
    { title: 'Universal Support', desc: 'Convert between MP3, WAV, M4A, OGG, and FLAC.' },
    { title: 'Privacy Focused', desc: 'No server uploads. Conversion happens locally on your device.' },
    { title: 'High Quality', desc: 'Maintain audio fidelity with professional-grade transcoding.' }
]

const faqs = [
    {
        question: "Is it free?",
        answer: "Yes, 100% free and unlimited. No caps on the number of files."
    },
    {
        question: "Supported formats?",
        answer: "We support converting to MP3, WAV, OGG, FLAC, and M4A/AAC."
    },
    {
        question: "Is it secure?",
        answer: "Absolutely. The file never leaves your computer. The 'server' is effectively your own web browser."
    }
]

const formats = [
    { value: 'mp3', label: 'MP3 (Universal)' },
    { value: 'wav', label: 'WAV (High Quality)' },
    { value: 'ogg', label: 'OGG (Web)' },
    { value: 'flac', label: 'FLAC (Lossless)' },
    { value: 'm4a', label: 'M4A (AAC)' }
]

const AudioConverter = () => {
    const [loaded, setLoaded] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [audioFile, setAudioFile] = useState(null)
    const [targetFormat, setTargetFormat] = useState('mp3')
    const [processing, setProcessing] = useState(false)
    const [progress, setProgress] = useState(0)
    const [message, setMessage] = useState('Loading converter...')
    const [downloadUrl, setDownloadUrl] = useState(null)
    const [error, setError] = useState(null)
    const ffmpegRef = useRef(new FFmpeg())

    const load = async () => {
        setIsLoading(true)
        const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm'
        const ffmpeg = ffmpegRef.current

        // Timeout handling
        const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Loading timed out. Check your internet connection.")), 30000)
        )

        ffmpeg.on('log', ({ message }) => {
            // console.log(message)
        })
        ffmpeg.on('progress', ({ progress }) => {
            setProgress(Math.round(progress * 100))
        })

        try {
            await Promise.race([
                ffmpeg.load({
                    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
                }),
                timeout
            ])
            setLoaded(true)
            setMessage('Ready')
        } catch (err) {
            console.error(err)
            setError('Failed to load conversion engine. Please disable AdBlockers or try a different browser.')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [])

    const handleUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            setAudioFile(file)
            setDownloadUrl(null)
            setProgress(0)
            setError(null)
        }
    }

    const convertAudio = async () => {
        if (!audioFile) return
        setProcessing(true)
        setError(null)

        const ffmpeg = ffmpegRef.current
        const inputExt = audioFile.name.split('.').pop()
        const inputFile = `input.${inputExt}`
        const outputFile = `output.${targetFormat}`

        try {
            await ffmpeg.writeFile(inputFile, await fetchFile(audioFile))
            await ffmpeg.exec(['-i', inputFile, outputFile])

            const data = await ffmpeg.readFile(outputFile)
            const typeMap = {
                mp3: 'audio/mpeg',
                wav: 'audio/wav',
                ogg: 'audio/ogg',
                flac: 'audio/flac',
                m4a: 'audio/mp4'
            }

            const url = URL.createObjectURL(new Blob([data.buffer], { type: typeMap[targetFormat] }))
            setDownloadUrl(url)
            setMessage('Done!')
        } catch (err) {
            console.error(err)
            setError('Conversion failed. The file format might be unsupported.')
        } finally {
            setProcessing(false)
        }
    }

    const handleRetry = () => {
        setError(null)
        setLoaded(false)
        load()
    }

    return (
        <ToolLayout
            title="Audio Converter"
            description="Convert between audio formats (MP3, WAV, OGG, FLAC) instantly."
            seoTitle="Online Audio Converter - Free MP3, WAV, FLAC Converter"
            seoDescription="Convert audio files online for free. Support for MP3, WAV, OGG, M4A, and FLAC formats. Secure client-side processing."
            features={features}
            faqs={faqs}
        >
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Main Card */}
                <div
                    className={`bg-white border rounded-2xl p-8 shadow-sm transition-all ${processing ? 'opacity-90 pointer-events-none' : ''
                        }`}
                >
                    <div className="flex flex-col items-center text-center">
                        {error ? (
                            <div className="error-card animate-in fade-in zoom-in duration-200">
                                <div className="error-icon-wrapper">
                                    <AlertCircle size={32} strokeWidth={2} />
                                </div>
                                <h3 className="error-title">Optimization Failed</h3>
                                <p className="error-message">
                                    {error}
                                </p>
                                <div className="error-actions">
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="btn-refresh"
                                    >
                                        Refresh Page
                                    </button>
                                    <button
                                        onClick={handleRetry}
                                        className="btn-retry"
                                    >
                                        Try Again
                                    </button>
                                </div>
                                <p className="error-tip">
                                    Tip: If this persists, try Chrome or Desktop. AdBlockers can sometimes block the engine.
                                </p>
                            </div>
                        ) : isLoading ? (
                            <div className="py-8">
                                <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4 mx-auto" />
                                <h3 className="text-xl font-semibold text-gray-800">Initializing...</h3>
                                <p className="text-gray-500 mt-2">Preparing secure conversion environment</p>
                            </div>
                        ) : !audioFile ? (
                            <>
                                <label
                                    htmlFor="audio-upload"
                                    className={`
                                        w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-all
                                        ${!loaded ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}
                                >
                                    <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4">
                                        <Music size={32} />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800">Select Audio File</h3>
                                    <p className="text-gray-500 mt-2">MP3, WAV, M4A, OGG, etc.</p>
                                    <input
                                        type="file"
                                        id="audio-upload"
                                        style={{ display: 'none' }}
                                        accept="audio/*"
                                        onChange={handleUpload}
                                        disabled={!loaded}
                                    />
                                </label>
                            </>
                        ) : (
                            <div className="w-full">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                                            <FileAudio size={20} />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-medium text-gray-900 truncate max-w-[200px]">{audioFile.name}</p>
                                            <p className="text-xs text-gray-500">{(audioFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    {!downloadUrl && (
                                        <button
                                            onClick={() => setAudioFile(null)}
                                            className="text-gray-400 hover:text-red-500 text-sm font-medium"
                                        >
                                            Change
                                        </button>
                                    )}
                                </div>

                                {!downloadUrl ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-center gap-4">
                                            <span className="font-medium text-gray-700">Convert to:</span>
                                            <select
                                                value={targetFormat}
                                                onChange={(e) => setTargetFormat(e.target.value)}
                                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                            >
                                                {formats.map(f => (
                                                    <option key={f.value} value={f.value}>{f.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <button
                                            onClick={convertAudio}
                                            disabled={processing}
                                            className={`
                                                w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2
                                                ${processing ? 'bg-gray-400' : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all'}
                                            `}
                                        >
                                            {processing ? (
                                                <>
                                                    <Loader2 className="animate-spin" />
                                                    Converting... {progress}%
                                                </>
                                            ) : (
                                                <>
                                                    <RefreshCw size={22} />
                                                    Convert Now
                                                </>
                                            )}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                        <div className="p-4 bg-green-50 text-green-700 rounded-xl flex items-center justify-center gap-2">
                                            <AlertCircle size={20} />
                                            Conversion Successful!
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                onClick={() => {
                                                    setAudioFile(null)
                                                    setDownloadUrl(null)
                                                }}
                                                className="py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                                            >
                                                Convert Another
                                            </button>
                                            <a
                                                href={downloadUrl}
                                                download={`converted.${targetFormat}`}
                                                className="py-3 px-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 shadow-md flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5"
                                            >
                                                <Download size={20} />
                                                Download
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Info */}
                {!error && (
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 text-sm text-gray-600 text-center">
                        <p>
                            Your files are processed securely in your browser using <strong>WebAssembly</strong> technology.
                            No data is sent to our servers.
                        </p>
                    </div>
                )}

                {/* Related Tools */}
                <div style={{ marginTop: '4rem' }}>
                    <RelatedTools />
                </div>

                {/* About Section */}
                <div className="about-section" style={{ background: 'var(--card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border)', marginTop: '2rem' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', fontWeight: '700' }}>About Audio Converter</h2>
                    <p style={{ lineHeight: '1.6', color: '#64748b', marginBottom: '1rem' }}>
                        Seamlessly convert your audio files between all popular formats including MP3, WAV, OGG, and FLAC.
                        Our client-side technology ensures your files remain private and secure on your own device.
                    </p>
                </div>

                {/* Features */}
                <div className="features-section" style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card" style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)', background: 'var(--card)' }}>
                            <div style={{ width: '48px', height: '48px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                {index === 0 ? <RefreshCw color="var(--primary)" size={24} /> :
                                    index === 1 ? <AlertCircle color="var(--primary)" size={24} /> :
                                        <Music color="var(--primary)" size={24} />}
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '600' }}>{feature.title}</h3>
                            <p style={{ color: '#64748b', lineHeight: '1.6' }}>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </ToolLayout>
    )
}

export default AudioConverter
