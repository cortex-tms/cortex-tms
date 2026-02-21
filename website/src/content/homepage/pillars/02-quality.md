---
type: pillar
icon: clock
title: Freshness
description: Detect when governance docs go stale relative to code changes. Git-based staleness detection catches drift before AI agents read outdated docs.
order: 2
beforeMetric:
  label: 'Stale docs undetected'
  value: '100'
  barWidth: '100%'
afterMetric:
  label: 'Staleness detected'
  value: '15'
  barWidth: '15%'
impactText: 'Docs stay current with code'
---
