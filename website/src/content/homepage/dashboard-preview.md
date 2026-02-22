---
type: dashboard-preview
project: cortex-tms
time: "2:47:35 PM"
overview:
  health:
    score: 92
    rows:
      - key: Validation
        value: healthy
        color: green
      - key: Guardian
        value: compliant
        color: green
      - key: Stale docs
        value: "1"
        color: yellow
  freshness:
    percentage: 95
    rows:
      - key: Fresh docs
        value: 19/20
        color: white
      - key: Oldest
        value: 23 days
        color: white
      - key: Status
        value: 1 need review
        color: white
  sprint:
    name: "v4.0.0 - Quality Governance & Staleness Detection"
    percentage: 90
    done: 9
    inProgress: 1
    todo: 0
files:
  activeFiles:
    count: 6
    list:
      - CLAUDE.md
      - NEXT-TASKS.md
      - docs/core/PATTERNS.md
      - docs/core/ARCHITECTURE.md
      - CHANGELOG.md
    footer: These files are always loaded by AI assistants
  distribution:
    - tier: HOT
      count: 6
      percentage: 27
    - tier: WARM
      count: 12
      percentage: 55
    - tier: COLD
      count: 4
      percentage: 18
  sizeHealth:
    - emoji: "🟡"
      name: NEXT-TASKS.md
      lines: 172
      maxLines: 200
    - emoji: "🟢"
      name: docs/core/PATTERNS.md
      lines: 98
      maxLines: 200
health:
  validation:
    status: HEALTHY
    lastChecked: 2m ago
  guardian:
    status: All Clear
    lastReview: 5 minutes ago
    command: "cortex-tms review <file>"
---
