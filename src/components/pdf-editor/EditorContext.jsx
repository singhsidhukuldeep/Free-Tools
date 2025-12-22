import React, { createContext, useContext, useState, useRef } from 'react';

const EditorContext = createContext();

export const EditorProvider = ({ children }) => {
    const [scale, setScale] = useState(1.0);
    const [activeTool, setActiveTool] = useState('cursor');
    const [activeColor, setActiveColor] = useState('#000000');
    const [activeSize, setActiveSize] = useState(2);
    const [selectedObjectId, setSelectedObjectId] = useState(null);
    const [activePageIndex, setActivePageIndex] = useState(0);
    const [pages, setPages] = useState([]); // Array of { pageNum, viewport, image }
    const [canvasRefs, setCanvasRefs] = useState({}); // Map page index to fabric canvas instance
    const [isProcessing, setIsProcessing] = useState(false);
    const [pdfDoc, setPdfDoc] = useState(null); // The loaded PDFDocument from pdf-lib
    const [fileName, setFileName] = useState('');

    // Helper to register a canvas instance
    const registerCanvas = (pageIndex, fabricCanvas) => {
        setCanvasRefs(prev => ({ ...prev, [pageIndex]: fabricCanvas }));
    };

    const unregisterCanvas = (pageIndex) => {
        setCanvasRefs(prev => {
            const newRefs = { ...prev };
            delete newRefs[pageIndex];
            return newRefs;
        });
    };

    return (
        <EditorContext.Provider value={{
            activeTool, setActiveTool,
            activeColor, setActiveColor,
            activeSize, setActiveSize,
            scale, setScale,
            activePageIndex, setActivePageIndex,
            pages, setPages,
            canvasRefs, registerCanvas, unregisterCanvas,
            isProcessing, setIsProcessing,
            pdfDoc, setPdfDoc,
            selectedObjectId, setSelectedObjectId,
            fileName, setFileName
        }}>
            {children}
        </EditorContext.Provider>
    );
};

export const useEditor = () => useContext(EditorContext);
