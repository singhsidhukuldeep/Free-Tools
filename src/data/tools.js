import {
    Type,
    QrCode,
    FileImage,
    Minimize2,
    MoveHorizontal,
    FileText, // For Merge PDF and Paste to Markdown
    Image as ImageIcon, // For Jpg to PDF
    Scissors, // Bg Remover
    Maximize, // Resizer
    Settings, // Compress PDF
    Edit3, // PDF Editor
    Sparkles // Humanize AI
} from 'lucide-react'

export const tools = [
    {
        id: 'word-counter',
        name: 'Word Counter',
        description: 'Count words, characters, and reading time in real-time.',
        path: '/word-counter',
        icon: Type,
        category: 'text',
        featured: true
    },
    {
        id: 'humanize-text',
        name: 'Humanize AI Text',
        description: 'Refine AI-generated text to look more natural.',
        path: '/humanize-text',
        icon: Sparkles,
        category: 'text',
        featured: true
    },
    {
        id: 'paste-to-markdown',
        name: 'Paste to Markdown',
        description: 'Convert pasted HTML/Rich Text to Markdown.',
        path: '/paste-to-markdown',
        icon: FileText,
        category: 'utility',
        featured: true
    },
    {
        id: 'qr-generator',
        name: 'QR Generator',
        description: 'Create customizable QR codes for URLs and text.',
        path: '/qr-generator',
        icon: QrCode,
        category: 'utility',
        featured: true
    },
    {
        id: 'image-compressor',
        name: 'Image Compressor',
        description: 'Compress PNG, JPG, and WebP images efficiently.',
        path: '/image-compressor',
        icon: Minimize2,
        category: 'image',
        featured: true
    },
    {
        id: 'bg-remover',
        name: 'Background Remover',
        description: 'Remove image backgrounds automatically with AI.',
        path: '/bg-remover',
        icon: Scissors,
        category: 'image',
        featured: true
    },
    // PDF Section
    {
        id: 'pdf-to-jpg',
        name: 'PDF to JPG',
        description: 'Convert PDF pages to high-quality images.',
        path: '/pdf-to-jpg',
        icon: FileImage,
        category: 'pdf',
        featured: true
    },
    {
        id: 'jpg-to-pdf',
        name: 'JPG to PDF',
        description: 'Convert images to a single PDF document.',
        path: '/jpg-to-pdf',
        icon: ImageIcon,
        category: 'pdf',
        featured: false
    },
    {
        id: 'merge-pdf',
        name: 'Merge PDF',
        description: 'Combine multiple PDF files into one.',
        path: '/merge-pdf',
        icon: FileText,
        category: 'pdf',
        featured: false
    },
    {
        id: 'compress-pdf',
        name: 'Compress PDF',
        description: 'Optimize PDF structure and remove metadata.',
        path: '/compress-pdf',
        icon: Settings,
        category: 'pdf',
        featured: false
    },
    {
        id: 'pdf-editor',
        name: 'PDF Editor',
        description: 'Add text annotations to PDF documents.',
        path: '/pdf-editor',
        icon: Edit3,
        category: 'pdf',
        featured: false
    },
    // Image Section
    {
        id: 'image-resizer',
        name: 'Image Resizer',
        description: 'Resize images by pixel dimensions or percentage.',
        path: '/image-resizer',
        icon: Maximize,
        category: 'image',
        featured: false
    },
    {
        id: 'merge-images',
        name: 'Merge Images',
        description: 'Join images horizontally or vertically.',
        path: '/merge-images',
        icon: MoveHorizontal,
        category: 'image',
        featured: false
    }
]

export const categories = [
    { id: 'all', name: 'All Tools' },
    { id: 'pdf', name: 'PDF Tools' },
    { id: 'image', name: 'Image Tools' },
    { id: 'text', name: 'Text Tools' },
    { id: 'utility', name: 'Utilities' }
]
