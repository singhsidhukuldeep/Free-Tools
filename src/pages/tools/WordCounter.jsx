import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Copy, Trash2 } from 'lucide-react'

const WordCounter = () => {
    const [text, setText] = useState('')

    const stats = {
        words: text.trim() === '' ? 0 : text.trim().split(/\s+/).length,
        chars: text.length,
        charsNoSpace: text.replace(/\s/g, '').length,
        sentences: text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(Boolean).length,
        paragraphs: text.trim() === '' ? 0 : text.split(/\n+/).filter(Boolean).length,
        readingTime: Math.ceil(text.trim().split(/\s+/).length / 200) + ' min'
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(text)
        // Could add toast here
    }

    const handleClear = () => setText('')

    return (
        <>
            <Helmet>
                <title>Word Counter - Free Online Character & Word Count Tool</title>
                <meta name="description" content="Free online word counter and character counter. Count words, characters, sentences, and paragraphs in real-time. checks reading time." />
            </Helmet>

            <div className="container" style={{ padding: '3rem 1.5rem' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Word Counter</h1>
                        <p style={{ color: '#64748b' }}>Real-time word, character, and sentence counting.</p>
                    </header>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                        gap: '1rem',
                        marginBottom: '1.5rem'
                    }}>
                        <StatBox label="Words" value={stats.words} />
                        <StatBox label="Characters" value={stats.chars} />
                        <StatBox label="Sentences" value={stats.sentences} />
                        <StatBox label="Paragraphs" value={stats.paragraphs} />
                        <StatBox label="Reading Time" value={stats.readingTime} />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '0.5rem',
                            marginBottom: '0.5rem'
                        }}>
                            <button
                                onClick={handleCopy}
                                className="btn-secondary"
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid var(--border)',
                                    background: 'white',
                                    fontSize: '0.875rem',
                                    fontWeight: '500'
                                }}
                            >
                                <Copy size={16} /> Copy Text
                            </button>
                            <button
                                onClick={handleClear}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid var(--border)',
                                    background: '#fef2f2',
                                    color: '#ef4444',
                                    fontSize: '0.875rem',
                                    fontWeight: '500'
                                }}
                            >
                                <Trash2 size={16} /> Clear
                            </button>
                        </div>

                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Type or paste your text here..."
                            style={{
                                width: '100%',
                                minHeight: '400px',
                                padding: '1.5rem',
                                borderRadius: '1rem',
                                border: '1px solid var(--border)',
                                fontSize: '1rem',
                                lineHeight: '1.6',
                                resize: 'vertical',
                                fontFamily: 'inherit',
                                outline: 'none',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                            }}
                        />
                    </div>

                    <section style={{ marginTop: '4rem', color: '#475569' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--foreground)' }}>About Word Counter</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            Our free online Word Counter is a simple yet powerful tool for writers, students, and professionals.
                            It provides instant statistics about your text, helping you meet word count requirements for essays, articles, or social media posts.
                        </p>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--foreground)' }}>Features</h3>
                        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                            <li>Real-time counting of words and characters</li>
                            <li>Sentence and paragraph tracking</li>
                            <li>Estimated reading time calculation</li>
                            <li>Works 100% in your browser - no data is sent to any server</li>
                        </ul>
                    </section>
                </div>
            </div>
        </>
    )
}

const StatBox = ({ label, value }) => (
    <div style={{
        background: 'var(--card)',
        padding: '1rem',
        borderRadius: '0.75rem',
        border: '1px solid var(--border)',
        textAlign: 'center',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
    }}>
        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.25rem' }}>
            {value}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05rem' }}>
            {label}
        </div>
    </div>
)

export default WordCounter
