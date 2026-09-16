// Per-tool SEO page data for TheSimpleTools.
// Consumed by scripts/prerender-tools.mjs to emit static, crawlable
// /tools/<slug>/ pages (unique title, meta, how-to, FAQ + FAQPage schema).
// Keep slugs stable — they are public URLs listed in sitemap.xml.

export const SITE_ORIGIN = 'https://thesimpletools.yashgamershakya.workers.dev';

export const TOOLS_SEO = [
  {
    id: 'audio-converter',
    slug: 'online-audio-converter-mp3-wav-flac',
    pageTitle: 'Free Online Audio Converter — MP3, WAV, FLAC, OGG, M4A',
    metaDescription:
      'Convert audio free online between MP3, WAV, AAC, FLAC, OGG and M4A. 100% private in-browser conversion, no uploads, no signup.',
    h1: 'Free Online Audio Converter',
    tagline: 'MP3 ⇄ WAV ⇄ FLAC ⇄ OGG ⇄ AAC ⇄ M4A — right in your browser.',
    intro:
      'TheSimpleTools Audio Converter changes audio files from one format to another without uploading anything to a server. Your file is decoded with the Web Audio API and re-exported on your own device, so a private voice memo or an unreleased track never leaves your hands.',
    formats: ['MP3', 'WAV', 'AAC', 'FLAC', 'OGG', 'M4A'],
    steps: [
      'Drop your audio file into the converter workspace.',
      'Pick the target format and sample-rate options.',
      'Click convert and download the new file instantly.',
    ],
    faqs: [
      {
        q: 'Is the audio converter really free?',
        a: 'Yes. Every conversion runs locally in your browser with no account, no watermark and no file-size paywall.',
      },
      {
        q: 'Are my audio files uploaded anywhere?',
        a: 'No. Files are decoded and re-encoded in your browser memory and never sent to any server.',
      },
      {
        q: 'Which audio formats are supported?',
        a: 'MP3, WAV, AAC, FLAC, OGG and M4A, with configurable sample rates for high-fidelity export.',
      },
      {
        q: 'Does converting reduce audio quality?',
        a: 'Converting to a lossless format like WAV or FLAC preserves quality. Converting to a compressed format like MP3 trades a small amount of quality for a much smaller file.',
      },
    ],
  },
  {
    id: 'video-processor',
    slug: 'online-video-processor-converter-mp4-webm',
    pageTitle: 'Free Online Video Processor — MP4, WEBM, MOV, Frame Grabber',
    metaDescription:
      'Inspect, convert and grab full-resolution frames from MP4, WEBM, MOV, MKV and AVI videos. Free, private, 100% in-browser processing.',
    h1: 'Free Online Video Processor & Converter',
    tagline: 'Metadata, full-res frame capture and format conversion for everyday video.',
    intro:
      'TheSimpleTools Video Processor reads MP4, WEBM, MOV, MKV and AVI files directly in your browser. Check resolution, duration and aspect ratio, scrub to any timestamp to capture a full-resolution PNG or WebP frame, or transcode clips without installing desktop software.',
    formats: ['MP4', 'WEBM', 'MOV', 'MKV', 'AVI'],
    steps: [
      'Drop a video file into the processor workspace.',
      'Review its resolution, duration and aspect ratio.',
      'Scrub to any moment to capture a frame, or transcode and download.',
    ],
    faqs: [
      {
        q: 'Can I extract a still image from a video?',
        a: 'Yes. Pause or scrub to any timestamp and export a full-resolution PNG or WebP snapshot of that exact frame.',
      },
      {
        q: 'Is there a file-size limit?',
        a: 'Processing happens in your browser memory, so the practical limit is your device RAM. Short to medium clips work best.',
      },
      {
        q: 'Are my videos uploaded to a server?',
        a: 'Never. The video file stays on your device and every operation runs client-side.',
      },
      {
        q: 'Which video formats can I open?',
        a: 'MP4, WEBM, MOV, MKV and AVI in any modern desktop or mobile browser.',
      },
    ],
  },
  {
    id: 'exe-apk-bridge',
    slug: 'exe-to-apk-bridge-converter-online',
    pageTitle: 'EXE to APK Bridge Tools — PE Inspector & Package Wrapper',
    metaDescription:
      'Inspect Windows .exe files and generate Android-ready .apk wrapper packages. Free PE header inspector and mobile bridge utilities, 100% in-browser.',
    h1: 'Executable to Mobile Package Bridge',
    tagline: 'PE header inspection plus Android wrapper generation for .exe files.',
    intro:
      'The bridge workspace inspects Windows executable headers — architecture, sections and metadata — and helps you package an Android wrapper with a generated manifest. Everything is parsed locally, which is the safe way to peek inside an unfamiliar binary.',
    formats: ['EXE', 'APK', 'PE headers', 'AndroidManifest'],
    steps: [
      'Drop a Windows .exe file into the bridge workspace.',
      'Review the parsed PE header and architecture report.',
      'Generate the Android wrapper package and download it.',
    ],
    faqs: [
      {
        q: 'Does this actually convert an .exe into a working .apk?',
        a: 'Windows programs cannot run natively on Android. The tool inspects the executable and builds a documented wrapper package — it does not magically port desktop software.',
      },
      {
        q: 'Is it safe to inspect an .exe here?',
        a: 'Yes. The file is parsed statically in your browser and never executed, so nothing in it can run.',
      },
      {
        q: 'What details can I see about an .exe?',
        a: 'Machine architecture, section table, timestamps and other PE header metadata useful for developers and analysts.',
      },
    ],
  },
  {
    id: 'apk-utilities',
    slug: 'apk-extractor-viewer-online-apk-to-zip',
    pageTitle: 'Free APK Extractor & Viewer — APK to ZIP, DEX, Manifest',
    metaDescription:
      'Open any .apk in your browser: extract files, convert APK to ZIP, inspect DEX files and read the manifest. Free, private, no uploads.',
    h1: 'Free Android Package (APK) Utilities',
    tagline: 'APK extraction, APK-to-ZIP conversion and manifest inspection.',
    intro:
      'Drop any Android package file to browse its internals: DEX code files, assets, resources and the application manifest. Convert the whole package to a plain ZIP archive in one click. Analysts, students and curious users can all inspect apps without installing anything.',
    formats: ['APK', 'ZIP', 'DEX', 'AndroidManifest.xml'],
    steps: [
      'Drop an .apk file into the utilities workspace.',
      'Browse DEX files, assets, resources and the manifest.',
      'Export everything as a ZIP archive, or copy out single files.',
    ],
    faqs: [
      {
        q: 'How do I convert APK to ZIP?',
        a: 'Drop the .apk into the workspace and choose APK-to-ZIP export. An APK is already a ZIP-format archive, so conversion is instant and lossless.',
      },
      {
        q: 'Can I read an app manifest without installing the app?',
        a: 'Yes. The manifest inspector shows package name, version, permissions and components directly in your browser.',
      },
      {
        q: 'Is my APK file uploaded anywhere?',
        a: 'No. Extraction and conversion run entirely in client-side JavaScript on your device.',
      },
      {
        q: 'Can I see the app source code?',
        a: 'You can browse compiled DEX files, assets and resources. Full decompilation back to original source is not included.',
      },
    ],
  },
  {
    id: 'image-converter',
    slug: 'online-image-converter-png-jpg-webp',
    pageTitle: 'Free Online Image Converter — PNG, JPG, WEBP, Resize',
    metaDescription:
      'Convert images between PNG, JPEG and WEBP free online with quality control and custom resizing. Private in-browser conversion, no signup.',
    h1: 'Free Online Image Converter',
    tagline: 'PNG ⇄ JPEG ⇄ WEBP with quality slider and custom dimensions.',
    intro:
      'A universal image converter for everyday jobs: change formats, dial in compression quality, and resize to exact pixel dimensions while a live preview shows what you will get. Photographers, bloggers and developers use it to ship lighter images without visible quality loss.',
    formats: ['PNG', 'JPEG', 'JPG', 'WEBP', 'GIF', 'BMP'],
    steps: [
      'Drop an image into the converter workspace.',
      'Choose the target format, quality and output dimensions.',
      'Convert and download the optimized file instantly.',
    ],
    faqs: [
      {
        q: 'Which image format should I choose?',
        a: 'Use WEBP for the smallest web-ready files, JPEG for photographs with universal compatibility, and PNG when you need transparency or lossless quality.',
      },
      {
        q: 'Can I resize images while converting?',
        a: 'Yes. Enter any target width and height — the aspect ratio is preserved automatically unless you override it.',
      },
      {
        q: 'Are converted images watermarked?',
        a: 'No. Output files are clean, full-quality conversions with no watermark or branding.',
      },
      {
        q: 'Do my photos leave my device?',
        a: 'No. Conversion runs on a local canvas in your browser; nothing is uploaded.',
      },
    ],
  },
  {
    id: 'dev-suite',
    slug: 'developer-tools-json-xml-base64-regex-online',
    pageTitle: 'Free Developer Tools — JSON⇄XML, Base64, Regex, Minifier',
    metaDescription:
      'Free online dev toolkit: JSON to XML, Base64 encoder, YAML, JS/CSS minifier, string-case converter and interactive regex tester. No signup.',
    h1: 'Free Online Developer Tools Suite',
    tagline: 'Format, encode, minify and test — the everyday dev utilities in one tab.',
    intro:
      'A suite of the utilities developers reach for daily: convert between JSON, XML and YAML, encode or decode Base64, minify JavaScript and CSS, switch string casing, and test regular expressions against live input with highlighted matches.',
    formats: ['JSON', 'XML', 'YAML', 'Base64', 'RegExp', 'JS/CSS'],
    steps: [
      'Open the Developer Tools Suite from the tool directory.',
      'Pick a utility tab such as JSON⇄XML, Base64 or Regex Tester.',
      'Paste your input, transform it, and copy the result.',
    ],
    faqs: [
      {
        q: 'Can I convert JSON to XML and back?',
        a: 'Yes, in both directions, with validation that flags malformed input before converting.',
      },
      {
        q: 'Is there a regex tester?',
        a: 'Yes. An interactive tester highlights matches live as you type your pattern and test string.',
      },
      {
        q: 'Is my code sent to a server?',
        a: 'No. All parsing, encoding and minification run locally in your browser tab.',
      },
      {
        q: 'Can I minify JavaScript and CSS here?',
        a: 'Yes. Paste your source to get a compact production-ready version instantly.',
      },
    ],
  },
  {
    id: 'vector-suite',
    slug: 'svg-converter-rasterizer-online-4k',
    pageTitle: 'SVG Converter & 4K Rasterizer — SVG to PNG, WebP, HEIC',
    metaDescription:
      'Convert SVG vectors to PNG, WebP and JPG at up to 4K resolution, plus SVG optimizer. Free, precise, 100% in-browser.',
    h1: 'Vector & High-Resolution Image Suite',
    tagline: 'SVG-to-bitmap rasterization up to 4K, plus an SVG code optimizer.',
    intro:
      'Designers and front-end developers can rasterize SVG artwork to PNG, WebP or JPG at any resolution up to 4K Ultra HD, shrink SVG source with the optimizer, and convert between modern web formats — all with pixel-exact rendering in the browser.',
    formats: ['SVG', 'PNG', 'WEBP', 'JPG', 'HEIC'],
    steps: [
      'Drop an SVG file or paste SVG code into the suite.',
      'Choose the output format and rasterization resolution up to 4K.',
      'Download the rendered bitmap or the optimized SVG.',
    ],
    faqs: [
      {
        q: 'How do I convert SVG to PNG?',
        a: 'Drop the SVG into the suite, pick PNG and your target resolution, then download the rendered bitmap.',
      },
      {
        q: 'What is the maximum rasterization resolution?',
        a: 'Up to 4K Ultra HD (3840 px on the long edge) for crisp print and retina assets.',
      },
      {
        q: 'Does the SVG optimizer change how my graphic looks?',
        a: 'No. It removes redundant markup and precision without altering the rendered appearance.',
      },
    ],
  },
  {
    id: 'audio-enhancer',
    slug: 'ai-audio-enhancer-noise-removal-online',
    pageTitle: 'Free AI Audio Enhancer — Noise Removal & Normalization',
    metaDescription:
      'Clean up recordings free online: background noise removal, loudness normalization and EQ boost with a live spectrum visualizer. No uploads.',
    h1: 'AI Audio Enhancer',
    tagline: 'Noise gate, normalization and clarity boost with a live 60 FPS visualizer.',
    intro:
      'Podcasters, students and creators can rescue noisy recordings: the enhancer applies a noise gate, evens out loudness, cleans up harsh frequencies and adds bass and clarity — while a real-time spectrum visualizer shows exactly what is happening to your sound.',
    formats: ['MP3', 'WAV', 'M4A', 'OGG'],
    steps: [
      'Drop a recording into the enhancer workspace.',
      'Tune noise removal, normalization and EQ to taste.',
      'Preview the result and export the enhanced audio.',
    ],
    faqs: [
      {
        q: 'Can this remove background noise from a recording?',
        a: 'Yes. The noise gate and frequency cleanup reduce hiss, hum and room noise while preserving speech clarity.',
      },
      {
        q: 'Will it fix quiet or uneven volume?',
        a: 'Yes. Loudness normalization brings the whole track to a consistent, comfortable level.',
      },
      {
        q: 'Is my recording uploaded anywhere?',
        a: 'No. DSP processing runs on the Web Audio API locally in your browser.',
      },
    ],
  },
  {
    id: 'crypto-calc',
    slug: 'scientific-calculator-hash-generator-online',
    pageTitle: 'Free Scientific Calculator, Hash Generator & Web Utilities',
    metaDescription:
      'Free scientific calculator with history, SHA-256/MD5/HMAC hashing, URL tools, color converter, unit converter and UUID generator. No signup.',
    h1: 'Calculators & Web Utilities',
    tagline: 'Scientific math, crypto hashes, URL tools, colors, units and UUIDs.',
    intro:
      'A combined desk of utilities: a scientific and standard calculator with live history, URL encoder and parameter parser, HEX/RGB/HSL color converter, SHA-256, MD5 and HMAC hashing, unit conversions and one-click UUID v4 generation.',
    formats: ['SHA-256', 'MD5', 'HMAC', 'UUID v4', 'URL', 'HEX/RGB/HSL'],
    steps: [
      'Open the Calculators & Web Utilities workspace.',
      'Switch to the calculator, hash lab, color or unit tab you need.',
      'Compute and copy results with one click.',
    ],
    faqs: [
      {
        q: 'Can I generate SHA-256 hashes online here?',
        a: 'Yes — plus MD5 and HMAC variants. Hashing uses the Web Crypto API locally, so secret inputs never leave your device.',
      },
      {
        q: 'Does the calculator keep a history?',
        a: 'Yes. Every calculation is logged in a live history panel you can revisit and reuse.',
      },
      {
        q: 'How do I generate a UUID v4?',
        a: 'Open the UUID tab and click generate — each ID is cryptographically random and ready to copy.',
      },
    ],
  },
  {
    id: 'batch-suite',
    slug: 'batch-image-converter-zip-online',
    pageTitle: 'Batch Image Converter — Multi-File Convert & ZIP Export',
    metaDescription:
      'Convert many images at once free online: drag-and-drop batch processing with mass checksums and instant ZIP download. No signup.',
    h1: 'Batch Processing Suite',
    tagline: 'Drop many files, convert them all, download one ZIP.',
    intro:
      'When one file at a time is too slow, the batch suite takes over: drag in a whole folder of images, convert them to your target format in one pass, verify integrity with mass checksums, and download everything packaged as a single ZIP archive.',
    formats: ['PNG', 'JPEG', 'WEBP', 'ZIP', 'Checksums'],
    steps: [
      'Drag and drop multiple files into the batch workspace.',
      'Choose the shared target format and options.',
      'Process the queue and download the ZIP archive.',
    ],
    faqs: [
      {
        q: 'How many files can I batch convert?',
        a: 'The queue handles dozens of typical images comfortably; the practical limit is your device memory.',
      },
      {
        q: 'What do I get at the end?',
        a: 'All converted files plus optional checksums, packaged into a single ZIP download.',
      },
      {
        q: 'Are batch files uploaded to a server?',
        a: 'No. Every file is processed locally and only leaves your machine inside the ZIP you download.',
      },
    ],
  },
  {
    id: 'image-upscaler',
    slug: 'image-upscaler-to-4k-online-240p-480p',
    pageTitle: 'Free Image Upscaler to 4K — 240p, 480p to HD Online',
    metaDescription:
      'Upscale images free online from 240p or 480p to 1080p, 1440p or 4K with multi-pass enhancement and sharpening. No uploads, no signup.',
    h1: 'Free Image Upscaler to 4K',
    tagline: 'Low-res 240p / 480p photos boosted to crisp 1080p, 1440p or 4K.',
    intro:
      'Breathe new life into small, blurry or old images. The upscaler detects whether your source is 240p-class, 480p, 1080p or 1440p, then progressively enlarges it in high-quality passes to 1080p Full HD, 1440p QHD or 4K Ultra HD — finishing with an adjustable sharpening filter and your choice of PNG, WEBP or JPEG output.',
    formats: ['240p', '480p', '1080p', '1440p', '4K Ultra HD'],
    steps: [
      'Drop a low-resolution image into the upscaler workspace.',
      'Pick a target: 1080p Full HD, 1440p QHD, 4K Ultra HD or custom.',
      'Tune sharpening and format, then upscale and download.',
    ],
    faqs: [
      {
        q: 'Can I upscale a 240p image to 4K?',
        a: 'Yes. The multi-pass engine enlarges 240p-class images step by step up to 3840×2160 with smoothing and sharpening to keep edges clean.',
      },
      {
        q: 'Will upscaling make a blurry photo perfectly sharp?',
        a: 'Upscaling adds pixels and enhances edges, but it cannot recover detail that was never captured. Results look dramatically cleaner, not magically re-photographed.',
      },
      {
        q: 'Which output format is best after upscaling?',
        a: 'PNG preserves maximum quality, WEBP gives the smallest files, and JPEG is the universal choice for sharing.',
      },
      {
        q: 'Is the upscaled image uploaded anywhere?',
        a: 'No. All enlargement and filtering run on a local canvas in your browser.',
      },
    ],
  },
  {
    id: 'media-reducer',
    slug: 'reduce-video-image-size-to-25mb-online',
    pageTitle: 'Reduce Video & Image to 25MB — Free Size Reducer Online',
    metaDescription:
      'Shrink any video or image to a 25MB portable file free online. Max-fidelity fit keeps quality first, resolution only if needed. No uploads.',
    h1: 'Video & Image Size Reducer — 25 MB',
    tagline: 'Oversized media squeezed under 25 MB with original quality preserved.',
    intro:
      'Hitting Discord, email or upload limits? The size reducer compresses any video or image down to a standard 25 MB portable file. Its smart-fit engine lowers quality first and touches resolution only when necessary, so you always keep the largest file that still fits — the highest-fidelity result possible at the target size.',
    formats: ['MP4', 'WEBM', 'MOV', 'JPEG', 'PNG', 'WEBP', '25 MB'],
    steps: [
      'Drop a video or image into the reducer workspace.',
      'Confirm the 25 MB target (8, 16 and 50 MB presets available).',
      'Shrink and download the portable file instantly.',
    ],
    faqs: [
      {
        q: 'How do I reduce a video to 25MB?',
        a: 'Drop the video into the reducer, keep the 25 MB target, and click shrink. The tool re-encodes it in your browser at the highest bitrate that still fits under 25 MB.',
      },
      {
        q: 'Will my video lose quality?',
        a: 'As little as possible. Quality is reduced before resolution, so most files keep their original dimensions with only optimized compression.',
      },
      {
        q: 'Can I compress a photo to under 25MB?',
        a: 'Yes. Images are binary-searched for the highest JPEG or WEBP quality that fits, with downscaling only as a last resort.',
      },
      {
        q: 'What if my file is already under 25MB?',
        a: 'The tool detects that and downloads your original untouched — no pointless re-encoding.',
      },
    ],
  },
];
