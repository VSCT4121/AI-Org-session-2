import os
import re

# All HTML slide files to patch (excluding archived and index.html)
SLIDE_FILES = [
    "deep-learning-intro-slide.html",
    "deep-learning-session2-agenda-slide.html",
    "deep-learning-slide-01-session1-recap.html",
    "deep-learning-slide-02-what-is-deep-learning.html",
    "deep-learning-slide-03-neural-network-architecture.html",
    "deep-learning-slide-04-deep-learning-applications.html",
    "deep-learning-slide-05-natural-language-processing-overview.html",
    "deep-learning-slide-06-nlp-processing-pipeline.html",
    "deep-learning-slide-07-core-nlp-tasks.html",
    "deep-learning-slide-08-transformers-and-llms.html",
    "deep-learning-slide-08-transformers.html",
    "deep-learning-slide-08b-llms.html",
    "deep-learning-slide-09-self-attention-mechanism.html",
    "deep-learning-slide-11-understanding-tokens.html",
    "deep-learning-slide-12-what-is-generative-ai.html",
    "deep-learning-slide-13-how-generative-ai-works.html",
    "deep-learning-slide-14-foundational-model.html",
    "deep-learning-slide-15-genai-applications-and-use-cases.html",
    "deep-learning-slide-16-prompt-engineering-section.html",
    "deep-learning-slide-17-what-is-prompt-engineering.html",
    "deep-learning-slide-18-the-power-of-roles-in-prompts.html",
    "deep-learning-slide-19-essential-prompt-components.html",
    "deep-learning-slide-20-advanced-techniques.html",
    "deep-learning-slide-21-thank-you-and-questions.html",
    "deep-learning-slide-genai-section.html",
    "deep-learning-slide-nlp-section.html",
    "deep-learning-slide-transformers-section.html",
    "deep-learning-title-slide.html",
]

LOGO_CSS = """
        /* Company Logo Overlay */
        .logo-overlay {
            position: absolute;
            top: 16px;
            right: 20px;
            z-index: 100;
        }
        .logo-overlay img {
            height: 50px;
            opacity: 0.95;
            object-fit: contain;
        }
"""

LOGO_HTML = """
    <!-- Company Logo -->
    <div class="logo-overlay">
        <img src="assets/Cogninelogo.png" alt="Cognine Logo">
    </div>
"""

def patch_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Skip if already patched
    if "logo-overlay" in content:
        print(f"  [SKIP] Already patched: {filepath}")
        return False

    # 1. Inject CSS before closing </style>
    if "</style>" not in content:
        print(f"  [WARN] No </style> found in: {filepath}")
        return False

    content = content.replace("</style>", LOGO_CSS + "</style>", 1)

    # 2. Inject logo HTML as first child of .slide-container
    # Match <div class="slide-container"> with any possible extra attributes
    pattern = r'(<div\s+class="slide-container"[^>]*>)'
    match = re.search(pattern, content)
    if not match:
        print(f"  [WARN] No .slide-container found in: {filepath}")
        return False

    insert_pos = match.end()
    content = content[:insert_pos] + LOGO_HTML + content[insert_pos:]

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"  [OK]   Patched: {filepath}")
    return True

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    patched = 0
    skipped = 0
    warned = 0

    print("=" * 60)
    print("Adding Cognine logo to all slides...")
    print("=" * 60)

    for filename in SLIDE_FILES:
        filepath = os.path.join(base_dir, filename)
        if not os.path.exists(filepath):
            print(f"  [MISS] File not found: {filename}")
            warned += 1
            continue
        result = patch_file(filepath)
        if result:
            patched += 1
        else:
            skipped += 1

    print("=" * 60)
    print(f"Done! Patched: {patched} | Skipped: {skipped} | Warnings: {warned}")
    print("=" * 60)

if __name__ == "__main__":
    main()
