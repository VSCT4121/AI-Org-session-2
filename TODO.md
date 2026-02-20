# New Slides: Generative AI Foundations & Prompt Engineering

## Task
Create 2 new slides and insert them at the correct positions in the deck.

## Steps

- [x] Read and analyze all existing slides to understand design patterns and content flow
- [x] Create `deep-learning-slide-10a-generative-ai-foundations.html` (slide 11)
  - Amber/orange color theme
  - What is Generative AI definition + Input→Output flow
  - Discriminative vs Generative comparison
  - 4 core architecture cards: GANs, VAEs, Diffusion Models, Transformers/LLMs
  - Key Concepts row: Temperature, Sampling, Latent Space, Tokenization
  - Animated stagger on load + cycling concept highlight
- [x] Create `deep-learning-slide-10b-prompt-engineering.html` (slide 13)
  - Emerald/green color theme
  - Prompt Anatomy breakdown (System, Context, Instruction, Input, Format)
  - Live annotated example prompt
  - 4 technique cards: Zero-Shot, Few-Shot, Chain-of-Thought, Role Prompting
  - Best Practices grid (6 items)
  - Animated stagger on load + cycling highlights
- [x] Update `index.html` slides array to insert new slides at correct positions
- [x] Update counter from "1 / 12" to "1 / 14"
- [x] Verified all slides render correctly in browser (slides 11 and 13)

---

# Slide 08 - Transformer Architecture Footer Fix

## Task
Replace the redundant "Innovations Footer" chips in `deep-learning-slide-08-transformers.html` with a "Built on This Architecture" models footer (Option C).

## Steps

- [x] Analyze current footer content and design issues
- [x] Plan replacement with real-world LLM model chips
- [x] Get user approval for Option C
- [x] Replace CSS: `.innovations-row`, `.innov-chip`, `.innov-icon`, `.innov-label` → new `.models-footer` styles
- [x] Replace HTML: 5 redundant component chips → 5 LLM model chips (GPT-4, BERT, T5, Llama 3, Gemini)
- [x] Add clear visible section title "Built on This Architecture"
- [x] Add proper 2px purple top border + subtle background for clear boundary
- [x] Fixed pre-existing broken `@keyframes flow-up-dummy` CSS rule
- [x] All changes verified — no CSS errors
