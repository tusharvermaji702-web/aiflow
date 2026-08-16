import Link from "next/link";

const GROUPS: { name: string; tools: { slug: string; name: string; description: string }[] }[] = [
  {
    name: "PDF",
    tools: [
      { slug: "merge-pdf", name: "Merge PDF", description: "Combine multiple PDFs into one." },
      { slug: "split-pdf", name: "Split PDF", description: "Export every page as its own file." },
      { slug: "rotate-pdf", name: "Rotate PDF", description: "Rotate every page 90/180/270°." },
      { slug: "remove-pages", name: "Delete Pages", description: "Remove specific pages from a PDF." },
      { slug: "extract-pages", name: "Extract Pages", description: "Pull specific pages into a new PDF." },
      { slug: "watermark-pdf", name: "Add Watermark", description: "Stamp diagonal text on every page." },
      { slug: "page-numbers", name: "Add Page Numbers", description: "Stamp page numbers on every page." },
      { slug: "images-to-pdf", name: "JPG/PNG to PDF", description: "Combine images into one PDF." },
      { slug: "metadata-viewer", name: "View Metadata", description: "See a PDF's title, author, and dates." },
      { slug: "metadata-remover", name: "Remove Metadata", description: "Strip identifying details from a PDF." },
    ],
  },
  {
    name: "Image",
    tools: [
      { slug: "compress-image", name: "Compress Image", description: "Shrink file size with a quality slider." },
      { slug: "image-resizer", name: "Image Resizer", description: "Resize to exact pixel dimensions." },
      { slug: "image-cropper", name: "Image Cropper", description: "Drag to select and crop a region." },
      { slug: "image-converter", name: "Image Converter", description: "Convert between PNG, JPEG, WebP." },
      { slug: "pixelate-image", name: "Pixelate Image", description: "Apply a mosaic effect." },
      { slug: "colour-inverter", name: "Colour Inverter", description: "Invert every pixel's colour." },
      { slug: "image-to-text", name: "Image to Text (OCR)", description: "Extract text from a photo or screenshot." },
    ],
  },
  {
    name: "Video & Audio",
    tools: [
      { slug: "video-trimmer", name: "Video Trimmer", description: "Cut a video to a start and end time." },
      { slug: "audio-trimmer", name: "Audio Trimmer", description: "Cut audio to a start and end time." },
      { slug: "extract-audio", name: "Extract Audio from Video", description: "Pull the audio track out as MP3." },
      { slug: "audio-converter", name: "Audio Converter", description: "Convert between MP3, WAV, OGG." },
    ],
  },
  {
    name: "Text & Data",
    tools: [
      { slug: "word-counter", name: "Word Counter", description: "Live word, character, sentence counts." },
      { slug: "json-formatter", name: "JSON Formatter", description: "Pretty-print or minify JSON." },
      { slug: "case-converter", name: "Case Converter", description: "UPPER, lower, Title, camelCase & more." },
      { slug: "diff-checker", name: "Text Diff Checker", description: "Compare two blocks of text." },
      { slug: "base64-encoder", name: "Base64 Encoder", description: "Encode or decode text and files." },
    ],
  },
  {
    name: "Everyday tools",
    tools: [
      { slug: "qr-code", name: "QR Code Generator", description: "Turn text or a link into a QR code." },
      { slug: "url-shortener", name: "URL Shortener", description: "Turn a long link into a short one." },
      { slug: "colour-picker", name: "Colour Picker", description: "Pick a colour, copy hex or RGB." },
      { slug: "password-generator", name: "Password Generator", description: "Generate a secure random password." },
      { slug: "unit-converter", name: "Unit Converter", description: "Length, weight, and temperature." },
      { slug: "age-calculator", name: "Age Calculator", description: "Exact age from a date of birth." },
      { slug: "files-to-zip", name: "Create ZIP File", description: "Bundle files into one archive." },
    ],
  },
  {
    name: "Media & devices",
    tools: [
      { slug: "webcam-test", name: "Webcam Test", description: "Check your camera works." },
      { slug: "microphone-test", name: "Microphone Test", description: "Check your mic with a live level meter." },
      { slug: "text-to-speech", name: "Text to Speech", description: "Have your browser read text aloud." },
      { slug: "screen-recorder", name: "Screen Recorder", description: "Record your screen, download as .webm." },
    ],
  },
];

export default function UtilitiesPage() {
  return (
    <main className="section">
      <div className="shell">
        <p className="eyebrow">Utilities</p>
        <h1 style={{ fontSize: 32, marginTop: 8 }}>Real tools, not just links</h1>
        <p className="lede" style={{ marginTop: 8 }}>
          Most tools run entirely in your browser — files are never uploaded to a
          server. The URL Shortener is the one exception, since it needs a database
          to remember your links.
        </p>

        {GROUPS.map((group) => (
          <div key={group.name} style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: 20 }}>{group.name}</h2>
            <div className="grid-cards" style={{ marginTop: 16 }}>
              {group.tools.map((tool) => (
                <Link key={tool.slug} href={`/utilities/${tool.slug}`} className="card" style={{ display: "block" }}>
                  <h3 style={{ fontSize: 16 }}>{tool.name}</h3>
                  <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 8 }}>
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
