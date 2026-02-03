# Hero Video Script - 60-Second Demo

**Duration**: 60 seconds
**Format**: Text-only animation (no voiceover)
**Target**: Homepage hero section, YouTube intro
**CTA**: Install via npm

**Design Choice**: Text-only format chosen deliberately for:
- Faster production and iteration
- Muted autoplay on homepage (no audio needed)
- Viewers can read at their own pace
- Easier to update (no voice re-recording)
- Phase 2 tutorials will still exercise AI voice pipeline if needed

---

## Full Script with Timestamps

### Scene 1: The Problem (0:00-0:10)
**Text**: "Tired of AI agents hallucinating project conventions?"

**Visual Direction**:
- Dark background with subtle grid
- Text fades in, center-aligned
- Red warning icon or glitch effect
- Fade to white for emphasis

**Timing**:
- Fade in: 0.5s
- Hold: 2s
- Fade out: 0.5s

---

### Scene 2: The Solution (0:10-0:20)
**Text**: "Cortex TMS organizes your docs into tiers—HOT, WARM, COLD."

**Visual Direction**:
- 3-tier pyramid appears
- Each tier labeled and color-coded:
  - HOT: Bright green (#4CAF50)
  - WARM: Orange (#FF9800)
  - COLD: Blue (#2196F3)
- HOT tier pulses/highlights

**Timing**:
- Pyramid builds: 1s
- Tier labels appear: 0.5s each
- Hold: 1s

---

### Scene 3: The Value (0:20-0:35)
**Text**: "Your AI reads only what matters. Faster. Cheaper. No drift."

**Visual Direction**:
- Split into 3 benefits, each appearing sequentially:
  - "⚡ Faster" (green)
  - "💰 Cheaper" (green)
  - "🎯 No drift" (green)
- Checkmarks appear next to each
- Background gradient shift

**Timing**:
- Each benefit: 1s appearance + 1s hold
- Total: ~4s

---

### Scene 4: Demo - Terminal Commands (0:35-0:50)
**Text**: Terminal mockup showing:
```
$ cortex-tms init
✓ Created 9 documentation files

$ cortex-tms status
💰 Context Savings (Estimate)
  HOT tier (active): 32,450 tokens
  Full repository: 101,234 tokens
  Reduction: 68%
```

**Note**: Output matches actual CLI format for authenticity.

**Visual Direction**:
- Terminal window (dark theme, green text)
- Typewriter effect for commands
- Output appears line by line
- Token savings highlighted in bright green
- Percentage emphasized (larger font)

**Timing**:
- Command 1 types: 2s
- Output appears: 2s
- Command 2 types: 2s
- Stats appear: 3s
- Hold on final stats: 2s

---

### Scene 5: Call to Action (0:50-1:00)
**Text**:
```
Install now:
npm install -g cortex-tms

cortex-tms.org
```

**Visual Direction**:
- Clean, centered layout
- Install command in code block (easy to read)
- Website URL below
- Logo watermark (subtle, bottom corner)
- Fade to black

**Timing**:
- Fade in: 0.5s
- Hold: 2.5s
- Fade out: 0.5s

---

## Key Messages (Extracted for Reuse)

### One-Line Hook
"Tired of AI agents hallucinating project conventions?"

### Value Proposition (3 words)
"Faster. Cheaper. No drift."

### Core Concept
"Cortex TMS organizes your docs into tiers—HOT, WARM, COLD. Your AI reads only what matters."

### Quantified Benefit
"~60-70% context reduction in real projects" (or use specific example: "68% reduction")

### CTA
"npm install -g cortex-tms"

---

## Channel Variations

### Homepage Hero Text
```markdown
# Stop AI Hallucinations. Start with Structure.

Cortex TMS organizes your docs into HOT, WARM, and COLD tiers.
Your AI reads only what matters—faster, cheaper, with no drift.

[Install Now] [Watch Demo]
```

### Twitter/X Post (280 chars)
```
Tired of AI agents hallucinating your project conventions?

Cortex TMS uses tiered docs (HOT/WARM/COLD) so your AI reads only what matters.

⚡ 60-70% context reduction
💰 Lower costs
🎯 No drift

npm install -g cortex-tms
```

### LinkedIn Post
```
Are your AI coding agents hallucinating project conventions?

Cortex TMS solves this with a simple concept: Tiered Memory.

HOT tier: Active sprint + patterns (what AI needs now)
WARM tier: Recent decisions (context when needed)
COLD tier: Archives (out of the way)

Result: Your AI stays focused. Often 60-70% context reduction in real projects, lower costs, zero drift.

Try it: npm install -g cortex-tms
Docs: cortex-tms.org
```

### GitHub README Intro
```markdown
# Cortex TMS - Tiered Memory System for AI Agents

Stop wasting tokens. Stop hallucinating conventions. Start with structure.

Cortex TMS organizes your documentation into HOT, WARM, and COLD tiers,
so your AI reads only what matters for the current task.

**Result**: Often 60-70% context reduction in real projects, faster responses, lower costs, no drift.
```

---

## Production Notes

### Typography
- **Main text**: Sans-serif, bold, 60-80px
- **Terminal text**: Monospace, 40-50px
- **Subtext/CTA**: Sans-serif, 50-60px

### Color Palette
- **Background**: Dark (#0a0a0a to #1a1a1a gradient)
- **Primary text**: White (#ffffff)
- **Accent (HOT tier)**: Bright green (#4CAF50)
- **Accent (success)**: Green (#4CAF50)
- **Accent (warning)**: Red/Orange for "problem" scene
- **Terminal**: Dark gray bg (#212121), green text (#4CAF50)

### Animation Style
- **Smooth transitions**: 0.3-0.5s easing
- **Text animations**: Fade in, typewriter effect for terminal
- **Emphasis**: Scale up, color shift, glow
- **Keep it simple**: No distracting effects

### Accessibility
- **High contrast**: White on dark, 4.5:1 minimum
- **Large text**: Readable at 1080p
- **Clear timing**: 2-3 seconds per message minimum
- **Text remains on screen**: Long enough to read twice

---

## User Testing Questions

After showing test viewers (3-5 people):

1. **"What is this tool?"** (validates understanding)
2. **"What action would you take after this video?"** (validates CTA)
3. **"What's the main benefit you remember?"** (validates messaging)

**Target answers**:
1. "It organizes docs so AI doesn't read everything"
2. "Install it / try it / visit the website"
3. "Saves tokens / faster / prevents hallucinations"

---

## Export Settings

- **Resolution**: 1920x1080 (1080p)
- **Frame rate**: 30fps (sufficient for text)
- **Format**: MP4 (H.264)
- **File size target**: <10MB for 60 seconds
- **Aspect ratio**: 16:9 (YouTube standard)

---

## Success Criteria

- [ ] Script timing totals 60 seconds (±2s)
- [ ] All key messages present
- [ ] CTA clear and actionable
- [ ] Terminal demo shows real output
- [ ] 3/5 testers understand the tool
- [ ] 3/5 testers can state next action

---

**Next Step**: Build this animation in Motion Canvas (`videos/test-video/`)

<!-- @cortex-tms-version 3.1.0 -->
