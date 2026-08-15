export type Tool = {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  pricing: "Free" | "Freemium" | "Paid";
  tags: string[];
  pros: string[];
  cons: string[];
  alternatives: string[];
  rating: number;
  lastVerified: string;
};

export const CATEGORIES = [
  { slug: "text", name: "Text", description: "Writing, rewriting, summarizing, and grammar tools.", count: 3 },
  { slug: "image", name: "Image", description: "Generation, editing, and image understanding.", count: 2 },
  { slug: "audio", name: "Audio", description: "Transcription, voice, and audio summarization.", count: 2 },
  { slug: "documents", name: "Documents", description: "PDF chat, summarizers, and document extraction.", count: 2 },
  { slug: "coding", name: "Coding", description: "Code explanation and debugging assistants.", count: 2 },
];

export const TOOLS: Tool[] = [
  {
    slug: "whisper",
    name: "Whisper",
    category: "Audio",
    tagline: "Speech to text transcription",
    description:
      "Converts spoken audio into accurate text across dozens of languages. Commonly used as the first step in lecture, meeting, and podcast workflows.",
    pricing: "Free",
    tags: ["transcription", "speech-to-text", "multilingual"],
    pros: ["High accuracy", "Handles accents well", "Open source"],
    cons: ["No built-in speaker labels", "Slower on long files"],
    alternatives: ["AssemblyAI", "Deepgram"],
    rating: 4.6,
    lastVerified: "Aug 2026",
  },
  {
    slug: "gpt-4",
    name: "GPT-4",
    category: "Text",
    tagline: "General purpose language model",
    description:
      "A large language model used for writing, summarizing, reasoning, and answering questions. The default text engine behind many AIFlow toolkit utilities.",
    pricing: "Freemium",
    tags: ["writing", "summarization", "reasoning"],
    pros: ["Versatile", "Strong reasoning", "Wide plugin support"],
    cons: ["Usage limits on free tier", "Can be verbose"],
    alternatives: ["Claude", "Gemini"],
    rating: 4.7,
    lastVerified: "Aug 2026",
  },
  {
    slug: "stable-diffusion",
    name: "Stable Diffusion",
    category: "Image",
    tagline: "Text to image generation",
    description:
      "Generates images from text prompts. Runs locally or via hosted APIs, making it a flexible base for product photography and illustration workflows.",
    pricing: "Free",
    tags: ["image-generation", "open-source"],
    pros: ["Free to self-host", "Highly customizable", "Large model ecosystem"],
    cons: ["Steeper learning curve", "Needs a capable GPU locally"],
    alternatives: ["Midjourney", "DALL-E"],
    rating: 4.4,
    lastVerified: "Aug 2026",
  },
  {
    slug: "grammar-improver",
    name: "Grammar Improver",
    category: "Text",
    tagline: "Cleans up grammar and phrasing",
    description:
      "Fixes grammar, awkward phrasing, and tone issues in any block of text. Used as a final pass in most AIFlow writing workflows.",
    pricing: "Free",
    tags: ["grammar", "editing"],
    pros: ["Fast", "Keeps original meaning", "Works on any language pair"],
    cons: ["Not a full style rewrite"],
    alternatives: ["Grammarly", "ProWritingAid"],
    rating: 4.3,
    lastVerified: "Aug 2026",
  },
  {
    slug: "pdf-summarizer",
    name: "PDF Summarizer",
    category: "Documents",
    tagline: "Condenses long PDFs into key points",
    description:
      "Extracts text from PDFs and produces a structured summary with key findings, useful as the first step in research and study workflows.",
    pricing: "Free",
    tags: ["pdf", "summarization", "research"],
    pros: ["Handles long documents", "Preserves section structure"],
    cons: ["Struggles with scanned/handwritten PDFs"],
    alternatives: ["PDF Chat", "Document Extractor"],
    rating: 4.5,
    lastVerified: "Aug 2026",
  },
  {
    slug: "pdf-chat",
    name: "PDF Chat",
    category: "Documents",
    tagline: "Ask questions directly against a document",
    description:
      "Lets you ask natural-language questions about a PDF's contents instead of reading the whole thing. Pairs well with the PDF Summarizer.",
    pricing: "Freemium",
    tags: ["pdf", "q&a"],
    pros: ["Fast lookups", "Cites source pages"],
    cons: ["Free tier caps document size"],
    alternatives: ["PDF Summarizer"],
    rating: 4.2,
    lastVerified: "Aug 2026",
  },
  {
    slug: "code-explainer",
    name: "Code Explainer",
    category: "Coding",
    tagline: "Explains what a code snippet does",
    description:
      "Breaks down unfamiliar code into a plain-language explanation, line by line or at a high level. Useful for onboarding onto new codebases.",
    pricing: "Free",
    tags: ["coding", "learning"],
    pros: ["Supports most languages", "Explains at adjustable depth"],
    cons: ["Can miss project-specific context"],
    alternatives: ["Debugging Assistant"],
    rating: 4.4,
    lastVerified: "Aug 2026",
  },
  {
    slug: "debugging-assistant",
    name: "Debugging Assistant",
    category: "Coding",
    tagline: "Finds and explains likely bugs",
    description:
      "Analyzes a code snippet and an error message to suggest likely causes and fixes, with reasoning shown so you can verify it.",
    pricing: "Freemium",
    tags: ["coding", "debugging"],
    pros: ["Explains its reasoning", "Works across common languages"],
    cons: ["Not a substitute for a real test suite"],
    alternatives: ["Code Explainer"],
    rating: 4.3,
    lastVerified: "Aug 2026",
  },
  {
    slug: "image-to-text",
    name: "Image to Text",
    category: "Image",
    tagline: "OCR and image description",
    description:
      "Extracts text from images (OCR) and can describe image contents for accessibility or cataloguing purposes.",
    pricing: "Free",
    tags: ["ocr", "accessibility"],
    pros: ["Fast", "Good on printed text"],
    cons: ["Handwriting accuracy varies"],
    alternatives: ["Stable Diffusion (for generation, not OCR)"],
    rating: 4.1,
    lastVerified: "Aug 2026",
  },
];

export type Workflow = {
  slug: string;
  title: string;
  description: string;
  steps: string[];
  category: string;
  runs: number;
};

export const WORKFLOWS: Workflow[] = [
  {
    slug: "lecture-to-quiz",
    title: "Lecture → Notes, Flashcards & Quiz",
    description: "Turn a recorded lecture into revision notes, flashcards, and a 20-question quiz.",
    steps: ["Lecture Audio", "Transcription", "Summary / Notes", "Key Concepts", "Flashcards", "20-Question Quiz"],
    category: "Study",
    runs: 1240,
  },
  {
    slug: "resume-to-interview-prep",
    title: "Resume + Job Description → Interview Prep",
    description: "Compare your resume against a job description and generate improvements and likely interview questions.",
    steps: ["Resume", "Job Description", "Match Analysis", "Missing Skills", "Resume Improvements", "Cover Letter", "Interview Questions"],
    category: "Job Search",
    runs: 860,
  },
  {
    slug: "papers-to-presentation",
    title: "Research Papers → Presentation",
    description: "Extract, summarize, and compare research papers, then generate a slide-ready presentation.",
    steps: ["Research Papers", "Text Extraction", "Summarization", "Comparison", "Key Findings", "Notes", "Presentation"],
    category: "Research",
    runs: 512,
  },
  {
    slug: "meeting-to-action-items",
    title: "Meeting Audio → Action Items",
    description: "Turn a recorded meeting into a summary, key decisions, and a clear action item list.",
    steps: ["Meeting Audio", "Transcription", "Summary", "Decisions", "Action Items"],
    category: "Productivity",
    runs: 934,
  },
  {
    slug: "video-to-social-posts",
    title: "Long Video → Social Posts",
    description: "Convert a long video into a transcript, highlight clips, captions, titles, and ready-to-post social copy.",
    steps: ["Long Video", "Transcript", "Highlights", "Captions", "Titles", "Social Posts"],
    category: "Content",
    runs: 703,
  },
];

export const PRICING_PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For trying out AIFlow's directory and basic tools.",
    features: ["Full AI tool directory", "Basic AI toolkit", "3 workflow runs / month", "500 MB storage"],
    cta: "Get started",
  },
  {
    name: "Pro",
    price: "$12",
    period: "/ month",
    description: "For regular use of the AI toolkit and workflow automation.",
    features: ["Everything in Free", "Unlimited workflow runs", "Private workflows", "Larger file uploads", "10 GB storage"],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Creator",
    price: "$24",
    period: "/ month",
    description: "For publishing and monetizing workflows.",
    features: ["Everything in Pro", "Publish workflows", "Workflow analytics", "Monetization options"],
    cta: "Start free trial",
  },
];
