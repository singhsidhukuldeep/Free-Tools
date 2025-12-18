import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { tools, categories } from '../data/tools'
import './Home.css'

const Home = () => {
    const [activeCategory, setActiveCategory] = useState('all')

    const filteredTools = activeCategory === 'all'
        ? tools
        : tools.filter(tool => tool.category === activeCategory)

    return (
        <>
            <Helmet>
                <title>Free Online Tools - PDF, Image, and Text Utilities</title>
                <meta name="description" content="Free, fast, and secure online tools. Convert PDFs, compress images, generate QR codes, and more directly in your browser." />
            </Helmet>

            <div className="home-page">
                <section className="hero-section">
                    <div className="container">
                        <h1 className="hero-title">
                            Your Everyday Tools <br />
                            <span> Simplified & Free </span>
                        </h1>
                        <p className="hero-subtitle">
                            Premium quality tools for developers, designers, and everyone.
                            <br />
                            <span className="glow-text">100% free, client-side, and privacy-focused.</span>
                        </p>

                        <div className="categories-nav">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(cat.id)}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        <div className="tools-grid">
                            {filteredTools.map(tool => (
                                <Link to={tool.path} key={tool.id} className="tool-card">
                                    <div className="tool-icon-wrapper">
                                        <tool.icon size={24} />
                                    </div>
                                    <div className="tool-info">
                                        <h3>{tool.name}</h3>
                                        <p>{tool.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default Home
