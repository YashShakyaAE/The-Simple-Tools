export const TOOLS_DATA = [
  {
    id: 'audio-converter',
    title: 'Audio Converter',
    badge: 'Fast & Lossless',
    badgeType: 'pro',
    category: 'audio-video',
    desc: 'Fast local conversion between MP3, WAV, AAC, FLAC, OGG, and M4A. High-fidelity audio decoding, sample rate configuration, and instant export.',
    tags: ['MP3', 'WAV', 'AAC', 'FLAC', 'OGG', 'M4A'],
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`
  },
  {
    id: 'video-processor',
    title: 'Video Processor & Converter',
    badge: 'HD Processing',
    badgeType: 'pro',
    category: 'audio-video',
    desc: 'High-definition video processor for MP4, MKV, AVI, MOV, and WEBM formats. Extract 4K frames, inspect codec metadata, and transcode.',
    tags: ['MP4', 'MKV', 'WEBM', 'MOV', 'Frame Grabber', 'Metadata'],
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="15" x="2" y="3" rx="2"></rect><polyline points="10 9 15 12 10 15"></polyline></svg>`
  },
  {
    id: 'exe-apk-bridge',
    title: 'Executable & Mobile Package Converter',
    badge: 'Bridge Utility',
    badgeType: 'ai',
    category: 'mobile-apk',
    desc: 'Desktop to mobile package utilities (.exe to .apk bridge tools). Inspect Windows PE headers, generate mobile wrappers, and build Android Manifest packages.',
    tags: ['.exe', '.apk', 'PE Header', 'Architecture', 'Bridge Wrapper'],
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="12" x="3" y="4" rx="2"></rect><line x1="2" x2="22" y1="20" y2="20"></line><path d="M12 16v4"></path></svg>`
  },
  {
    id: 'apk-utilities',
    title: 'Android Package Utilities',
    badge: 'Decompiler & ZIP',
    badgeType: 'pro',
    category: 'mobile-apk',
    desc: '.apk extraction, manifest decompilation inspector, and direct APK-to-ZIP package conversion. Browse DEX files, assets, and res folders directly client-side.',
    tags: ['APK Extraction', 'APK-to-ZIP', 'DEX Inspector', 'Manifest Viewer'],
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="18" x="5" y="3" rx="2"></rect><circle cx="12" cy="17" r="1"></circle></svg>`
  },
  {
    id: 'image-converter',
    title: 'Standard Image Converter',
    badge: 'Universal',
    badgeType: 'pro',
    category: 'converters',
    desc: 'Universal cross-conversion for .png, .jpeg, .jpg, and .webp with quality compression slider, custom dimension scaling, and instant file savings preview.',
    tags: ['PNG', 'JPEG', 'WEBP', 'Resizer', 'Compressor'],
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>`
  },
  {
    id: 'dev-suite',
    title: 'Developer Tools Suite',
    badge: 'Full Suite',
    badgeType: 'pro',
    category: 'dev-tools',
    desc: 'Data formatting tools including JSON to XML, XML to JSON, Base64 encoder/decoder, YAML, code minifiers, string case utilities, and interactive Regex tester.',
    tags: ['JSON ⇄ XML', 'Base64', 'YAML', 'Minifier', 'Regex Tester'],
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`
  },
  {
    id: 'vector-suite',
    title: 'Advanced Vector & Image Suite',
    badge: 'High-Res Vector',
    badgeType: 'pro',
    category: 'converters',
    desc: 'High-res vector and web graphics converter covering SVG, WebP, HEIC, PNG, and JPG. Multi-resolution SVG-to-Bitmap 4K rasterization and SVG code optimizer.',
    tags: ['SVG to PNG', '4K Rasterizer', 'SVG Optimizer', 'WebP', 'HEIC'],
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`
  },
  {
    id: 'audio-enhancer',
    title: 'AI Audio Enhancer',
    badge: 'AI Neural Filter',
    badgeType: 'ai',
    category: 'audio-video',
    desc: 'Background noise removal, audio normalization, frequency cleanup, and dynamic bass/clarity boost with real-time 60 FPS HTML5 canvas waveform spectrum visualizer.',
    tags: ['Noise Gate', 'Normalization', 'Spectrum Visualizer', 'EQ Boost'],
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"></path><path d="M17 5v14"></path><path d="M22 10v4"></path><path d="M7 5v14"></path><path d="M2 10v4"></path></svg>`
  },
  {
    id: 'crypto-calc',
    title: 'Calculators & Web Utilities',
    badge: 'Scientific & Web Suite',
    badgeType: 'pro',
    category: 'security-hash',
    desc: 'Interactive scientific & standard math calculator with live history, URL encoder & parameter parser, color converter, cryptographic hash suite (SHA-256, MD5, HMAC), unit converters, and UUID v4 generator.',
    tags: ['Calculator', 'Scientific Calc', 'URL Parser', 'Color Tool', 'SHA-256', 'MD5', 'UUID v4', 'Unit Calc'],
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"></rect><line x1="8" x2="16" y1="8" y2="8"></line><line x1="8" x2="16" y1="12" y2="12"></line><line x1="8" x2="16" y1="16" y2="16"></line></svg>`
  },
  {
    id: 'batch-suite',
    title: 'Custom Batch Suite',
    badge: 'Multi-File Drop',
    badgeType: 'pro',
    category: 'converters',
    desc: 'Multi-file drag-and-drop batch processing interface. Convert multiple images, calculate mass checksums, and package all output files into an instant ZIP archive.',
    tags: ['Drag & Drop', 'Batch Processing', 'Zip Exporter', 'Mass Actions'],
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>`
  },
  {
    id: 'image-upscaler',
    title: 'Image Upscaler to 4K',
    badge: 'HD → 4K AI Boost',
    badgeType: 'ai',
    category: 'converters',
    desc: 'Upscale 240p, 480p, 1080p and 1440p images to crisp 1080p, 1440p or 4K Ultra HD with multi-pass canvas enhancement and sharpening. 100% client-side.',
    tags: ['Upscaler', '240p to 4K', '480p to 4K', '1080p', '1440p', '4K', 'Enhancer'],
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>`
  },
  {
    id: 'media-reducer',
    title: 'Video & Image Size Reducer — 25 MB',
    badge: '≤ 25 MB Portable',
    badgeType: 'pro',
    category: 'audio-video',
    desc: 'Shrink any video or image down to a 25 MB standard portable file. Smart max-fidelity fit: quality reduced first, resolution only if needed. Originality preserved.',
    tags: ['25MB', 'Video Compressor', 'Image Compressor', 'Reduce Size', 'Portable', 'MP4', 'WEBM', 'JPEG'],
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>`
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'All Tools' },
  { id: 'converters', label: 'Converters' },
  { id: 'audio-video', label: 'Audio & Video' },
  { id: 'mobile-apk', label: 'Mobile & APK' },
  { id: 'dev-tools', label: 'Developer Suite' },
  { id: 'security-hash', label: 'Security & Hash' }
];
