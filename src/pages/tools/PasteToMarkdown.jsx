import React, { useState, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { Copy, RefreshCw } from 'lucide-react'
import TurndownService from 'turndown'
import './PasteToMarkdown.css'

const PasteToMarkdown = () => {
    const [content, setContent] = useState('')
    const [copied, setCopied] = useState(false)
    const editorRef = useRef(null)

    const handlePaste = (e) => {
        // Prevent default paste behavior
        e.preventDefault()

        // Get clipboard content
        const clipboardData = e.clipboardData || window.clipboardData
        const htmlContent = clipboardData.getData('text/html')
        const textContent = clipboardData.getData('text/plain')

        // If HTML exists, convert it; otherwise use plain text
        let markdown = ''
        if (htmlContent) {
            const turndownService = new TurndownService({
                headingStyle: 'atx',
                codeBlockStyle: 'fenced',
                hr: '---'
            })
            markdown = turndownService.turndown(htmlContent)
        } else {
            markdown = textContent
        }

        // Insert markdown at cursor position or replace selection
        // For simplicity in this specific "tool" context, we might just replace everything 
        // OR append. The user said "it directly gives markdown", implying the INPUT becomes the OUTPUT.
        // So let's set the content directly.

        setContent(markdown)
    }

    const handleCopy = () => {
        if (!content) return
        navigator.clipboard.writeText(content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleClear = () => {
        setContent('')
    }

    return (
        <>
            <Helmet>
                <title>Paste to Markdown - Free Online Tools</title>
                <meta name="description" content="Convert rich text directly to Markdown. Just paste and get Markdown." />
            </Helmet>

            <div className="container markdown-tool">
                <div className="tool-header-section">
                    <h1>Paste to Markdown</h1>
                    <p className="tool-description">
                        No clicks needed. Just press <strong>Cmd+V</strong> (or Ctrl+V) to paste, and it instantly becomes Markdown.
                    </p>
                </div>

                <div className="converter-container single-layout">
                    <div className="panel-wrapper full-width">
                        <div className="panel-header">
                            <h3>Markdown Editor</h3>
                            <div className="action-buttons">
                                <button
                                    className="action-icon-btn"
                                    onClick={handleClear}
                                    disabled={!content}
                                >
                                    <RefreshCw size={14} /> Clear
                                </button>
                                <button
                                    className="copy-btn"
                                    onClick={handleCopy}
                                    disabled={!content}
                                >
                                    <Copy size={16} /> {copied ? 'Copied!' : 'Copy Markdown'}
                                </button>
                            </div>
                        </div>

                        <textarea
                            ref={editorRef}
                            className="custom-textarea large-editor"
                            placeholder="Paste your rich text here (Cmd+V) to convert it to Markdown instantly..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onPaste={handlePaste}
                        />
                    </div>
                </div>

                <div className="info-section">
                    <h2>How it works</h2>
                    <p>
                        When you paste rich text (from Google Docs, Word, or websites), we intercept the paste event,
                        read the HTML data from your clipboard, and convert it to clean Markdown syntax on the fly.
                    </p>
                </div>
            </div>
        </>
    )
}

export default PasteToMarkdown
