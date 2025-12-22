import React, { useEffect, useRef, useState } from 'react';
import { useEditor } from './EditorContext';
import * as pdfjsLib from 'pdfjs-dist';
import { Canvas, Image as FabricImage, IText, Rect, Circle, PencilBrush } from 'fabric';

const PDFPage = ({ page, pageIndex }) => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const {
        scale, registerCanvas, unregisterCanvas, activeTool, activeColor, activeSize,
        setSelectedObjectId, setActivePageIndex
    } = useEditor();

    const fabricCanvasRef = useRef(null);

    // State for the scale we are CURRENTLY rendered at
    // We initialize with 'scale' so first render is sharp.
    const [renderedScale, setRenderedScale] = useState(scale);

    // Debounce reference
    const debounceTimer = useRef(null);

    // Effect: Handle Scale Changes with Debounce
    useEffect(() => {
        // Clear pending
        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        // If scale changed significantly, debounce a re-render
        if (scale !== renderedScale) {
            debounceTimer.current = setTimeout(() => {
                setRenderedScale(scale);
            }, 300); // 300ms wait
        }

        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, [scale, renderedScale]);

    // Main Rendering Effect
    useEffect(() => {
        if (!page || !canvasRef.current) return;

        const renderPage = async () => {
            // Use renderedScale for high-res logic, not the fluid 'scale'
            const currentScale = renderedScale;

            // High DPI rendering for the underlying PDF image
            const pixelRatio = window.devicePixelRatio || 1;
            const targetScale = Math.max(pixelRatio, 2);
            const finalRenderScale = currentScale * targetScale;

            const renderViewport = page.getViewport({ scale: finalRenderScale });
            // Display viewport uses the current FIXED rendered scale (not fluid scale)
            const displayViewport = page.getViewport({ scale: currentScale });

            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            // Render Buffer (High Res)
            canvas.height = renderViewport.height;
            canvas.width = renderViewport.width;

            const renderContext = {
                canvasContext: context,
                viewport: renderViewport,
            };

            await page.render(renderContext).promise;

            const bgDataURL = canvas.toDataURL('image/png');

            // Dispose old fabric
            if (fabricCanvasRef.current) {
                fabricCanvasRef.current.dispose();
            }

            // Initialize Fabric
            const fCanvas = new Canvas(canvasRef.current, {
                height: displayViewport.height,
                width: displayViewport.width,
                selection: true
            });

            // Set PDF page as background
            try {
                const img = await FabricImage.fromURL(bgDataURL);
                img.scaleX = displayViewport.width / img.width;
                img.scaleY = displayViewport.height / img.height;
                fCanvas.backgroundImage = img;
                fCanvas.requestRenderAll();
            } catch (err) {
                console.error("Error setting background image", err);
            }

            // Re-attach drawing mode settings if tool is already active
            updateDrawingMode(fCanvas, activeTool, activeColor, activeSize);

            // Re-attach selection events
            fCanvas.on('selection:created', (e) => {
                if (e.selected && e.selected.length > 0)
                    setSelectedObjectId(e.selected[0]);
            });
            fCanvas.on('selection:cleared', () => setSelectedObjectId(null));

            // Re-attach mouse events (cleanly)
            attachMouseEvents(fCanvas, activeTool, activeColor, activeSize);

            fabricCanvasRef.current = fCanvas;
            registerCanvas(pageIndex, fCanvas);
        };

        renderPage();

        return () => {
            // Cleanup
            if (fabricCanvasRef.current) {
                fabricCanvasRef.current.dispose();
                unregisterCanvas(pageIndex);
            }
        };
    }, [page, renderedScale]); // Only re-run when DEBOUNCED scale changes (or page)


    // Helper to update drawing mode on a canvas
    const updateDrawingMode = (canvas, tool, color, size) => {
        if (!canvas) return;

        canvas.isDrawingMode = (tool === 'draw' || tool === 'highlight' || tool === 'eraser');

        if (tool === 'draw') {
            canvas.freeDrawingBrush = new PencilBrush(canvas);
            canvas.freeDrawingBrush.color = color;
            canvas.freeDrawingBrush.width = size;
        } else if (tool === 'highlight') {
            canvas.freeDrawingBrush = new PencilBrush(canvas);
            canvas.freeDrawingBrush.color = color + '80'; // 50% opacity
            canvas.freeDrawingBrush.width = 30;
        } else if (tool === 'eraser') {
            canvas.freeDrawingBrush = new PencilBrush(canvas);
            canvas.freeDrawingBrush.color = '#ffffff';
            canvas.freeDrawingBrush.width = 20;
        }
        canvas.requestRenderAll();
    };

    // Effect to update drawing properties when they change (without re-init fabric)
    useEffect(() => {
        updateDrawingMode(fabricCanvasRef.current, activeTool, activeColor, activeSize);
        // Also update click listeners
        attachMouseEvents(fabricCanvasRef.current, activeTool, activeColor, activeSize);
    }, [activeTool, activeColor, activeSize]);


    // Helper to attach mouse events
    const attachMouseEvents = (canvas, tool, color, size) => {
        if (!canvas) return;

        canvas.off('mouse:down');
        canvas.on('mouse:down', (opt) => {
            const pointer = canvas.getPointer(opt.e);

            // Prevent adding objects if interacting with selection
            if (canvas.getActiveObject() || canvas.getActiveObjects().length > 0) {
                if (opt.target) return;
            }

            if (tool === 'text') {
                const text = new IText('Type here', {
                    left: pointer.x,
                    top: pointer.y,
                    fontFamily: 'Helvetica',
                    fill: color,
                    fontSize: size
                });
                canvas.add(text);
                canvas.setActiveObject(text);
                text.enterEditing();
            } else if (tool === 'rect') {
                const rect = new Rect({
                    left: pointer.x,
                    top: pointer.y,
                    fill: 'transparent',
                    stroke: color,
                    strokeWidth: 2,
                    width: 100,
                    height: 60
                });
                canvas.add(rect);
                canvas.setActiveObject(rect);
            } else if (tool === 'circle') {
                const circle = new Circle({
                    left: pointer.x,
                    top: pointer.y,
                    fill: 'transparent',
                    stroke: color,
                    strokeWidth: 2,
                    radius: 50
                });
                canvas.add(circle);
                canvas.setActiveObject(circle);
            }
        });
    };


    // Calculate CSS transform based on difference between fluid 'scale' and 'renderedScale'
    // If rendered at 1.0, and zooming to 1.1, transform is 1.1/1.0 = 1.1
    // Guard against division by zero though scale shouldn't be 0
    const cssScale = renderedScale ? (scale / renderedScale) : 1;

    // Track visibility for active page index
    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
                    setActivePageIndex(pageIndex);
                }
            });
        }, {
            threshold: [0.1, 0.5, 0.9] // Multiple thresholds key
        });

        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, [pageIndex, setActivePageIndex]);

    return (
        <div
            id={`pdf-page-${pageIndex}`}
            ref={containerRef}
            style={{
                marginBottom: '2rem',
                position: 'relative' // For absolute positioning if needed, but flex column is fine
            }}
        >
            {/* Page Number Label */}
            <div style={{
                textAlign: 'center',
                marginBottom: '0.5rem',
                color: '#64748b',
                fontWeight: '600',
                fontSize: '0.9rem',
                userSelect: 'none'
            }}>
                Page {pageIndex + 1}
            </div>

            <div style={{
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                background: 'white',
                // Apply CSS Zoom
                transform: `scale(${cssScale})`,
                transformOrigin: 'top center',
                transition: 'transform 0.1s linear' // Smooth transition for CSS
            }}>
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
};

export default PDFPage;
