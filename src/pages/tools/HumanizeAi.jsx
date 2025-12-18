import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Sparkles, Copy, RefreshCw } from 'lucide-react'
import { humanizeString } from 'humanize-ai-lib'
import './HumanizeAi.css'

const HumanizeAi = () => {
    const [inputText, setInputText] = useState('')
    const [outputText, setOutputText] = useState('')
    const [copied, setCopied] = useState(false)

    const handleInputChange = (e) => {
        const text = e.target.value
        setInputText(text)

        // Auto-humanize immediately
        if (text.trim()) {
            const result = humanizeString(text)
            // Access the .text property as discovered earlier
            setOutputText(result.text || '')
        } else {
            setOutputText('')
        }
    }

    const handleCopy = () => {
        if (!outputText) return
        navigator.clipboard.writeText(outputText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleClear = () => {
        setInputText('')
        setOutputText('')
    }

    return (
        <>
            <Helmet>
                <title>Humanize AI Text - Free Online Tools</title>
                <meta name="description" content="Refine AI-generated text to make it look more natural. Remove artifacts and formatting issues instantly." />
            </Helmet>

            <div className="container humanize-tool">
                <div className="tool-header-section">
                    <h1>Humanize AI Text</h1>
                    <p className="tool-description">
                        Make AI-generated text feel more natural by removing common machine artifacts and formatting quirks.
                    </p>
                </div>

                <div className="converter-container">
                    <div className="split-layout">
                        {/* Input Section */}
                        <div className="panel-wrapper">
                            <div className="panel-header">
                                <h3>Input Text</h3>
                                <button className="action-icon-btn" onClick={handleClear}>
                                    <RefreshCw size={14} /> Clear
                                </button>
                            </div>
                            <textarea
                                className="custom-textarea"
                                placeholder="Paste your AI-generated text here..."
                                value={inputText}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Arrow Indicator (Visual only, no button) */}
                        <div className="controls-wrapper">
                            <div className="arrow-indicator">
                                <Sparkles size={24} className="text-primary animate-pulse" />
                            </div>
                        </div>

                        {/* Output Section */}
                        <div className="panel-wrapper">
                            <div className="panel-header">
                                <h3>Humanized Result</h3>
                                <button
                                    className="action-icon-btn"
                                    onClick={handleCopy}
                                    disabled={!outputText}
                                >
                                    <Copy size={14} /> {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                            <textarea
                                className="custom-textarea"
                                placeholder="Result will appear here automatically..."
                                value={outputText}
                                readOnly
                            />
                        </div>
                    </div>
                </div>

                {/* Additional Info / SEO Content */}
                <div className="info-section">
                    <h2>Why Humanize AI Text?</h2>
                    <p>
                        AI models often leave subtle formatting artifacts like "smart quotes", specific dash types,
                        or zero-width characters that can give away that the text was machine-generated.
                        This tool cleans up these artifacts to make your text look cleaner and more standard.
                    </p>
                </div>
            </div>
        </>
    )
}

export default HumanizeAi
