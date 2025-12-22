import React from 'react';
import { useEditor } from './EditorContext';

const PropertiesBar = () => {
    const { activeTool, activeColor, setActiveColor, activeSize, setActiveSize } = useEditor();

    const showColorPicker = ['text', 'draw', 'highlight', 'rect', 'circle'].includes(activeTool);
    const showSizePicker = ['text', 'draw', 'eraser'].includes(activeTool);

    if (!showColorPicker && !showSizePicker) return null;

    return (
        <div style={{
            width: '250px',
            borderLeft: '1px solid var(--border)',
            background: 'white',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            height: 'calc(100vh - 60px)'
        }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Properties</h3>

            {showColorPicker && (
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>Color</label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {['#000000', '#ef4444', '#22c55e', '#3b82f6', '#eab308', '#a855f7'].map(color => (
                            <div
                                key={color}
                                onClick={() => setActiveColor(color)}
                                style={{
                                    width: '24px', height: '24px', borderRadius: '50%', background: color,
                                    cursor: 'pointer',
                                    border: activeColor === color ? '2px solid var(--primary)' : '2px solid transparent',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                }}
                            />
                        ))}
                        <input
                            type="color"
                            value={activeColor}
                            onChange={(e) => setActiveColor(e.target.value)}
                            style={{ width: '24px', height: '24px', padding: 0, border: 'none', background: 'none' }}
                        />
                    </div>
                </div>
            )}

            {showSizePicker && (
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
                        {activeTool === 'text' ? 'Font Size' : 'Brush Size'}
                    </label>
                    <input
                        type="range"
                        min="8" max="72"
                        value={activeSize}
                        onChange={(e) => setActiveSize(parseInt(e.target.value))}
                        style={{ width: '100%' }}
                    />
                    <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                        {activeSize}px
                    </div>
                </div>
            )}

            <div style={{ marginTop: 'auto', padding: '1rem', background: '#f1f5f9', borderRadius: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
                <p><strong>Tip:</strong> Select an object to edit it.</p>
                <p style={{ marginTop: '0.5rem' }}>Use the Delete key to remove selected items.</p>
            </div>
        </div>
    );
};

export default PropertiesBar;
