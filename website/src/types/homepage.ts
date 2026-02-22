/**
 * Type definitions for homepage collection entries
 */

import type { CollectionEntry } from 'astro:content'

export type IconType = 'flame' | 'shield' | 'bar-chart' | 'file-text' | 'key' | 'zap' | 'monitor'
export type PillarIconType = 'file-text' | 'clock' | 'shield'

export type HeroEntry = CollectionEntry<'homepage'> & {
  data: {
    type: 'hero'
    title: string
    subtitle: string
    tagline: string
    description: string
    primaryButton: {
      text: string
      href: string
      variant: 'neon' | 'prism'
    }
    secondaryButton?: {
      text: string
      href: string
      variant: 'neon' | 'prism'
    }
  }
}

export type FeatureEntry = CollectionEntry<'homepage'> & {
  data: {
    type: 'feature'
    icon: IconType
    title: string
    order: number
  }
  body: string
}

export type StepEntry = CollectionEntry<'homepage'> & {
  data: {
    type: 'step'
    number: number
    title: string
  }
  body: string
}

export type InstallationEntry = CollectionEntry<'homepage'> & {
  data: {
    type: 'installation'
    commands: Array<{
      label: string
      code: string
      recommended: boolean
    }>
  }
}

export type BlockquoteEntry = CollectionEntry<'homepage'> & {
  data: {
    type: 'blockquote'
    author: string
  }
  body: string
}

export type CTAEntry = CollectionEntry<'homepage'> & {
  data: {
    type: 'cta'
    title: string
    description: string
    primaryButton: {
      text: string
      href: string
    }
    secondaryButton?: {
      text: string
      href: string
    }
  }
}

export type DemoTerminalEntry = CollectionEntry<'homepage'> & {
  data: {
    type: 'demo-terminal'
    title: string
    command: string
    model: string
  }
  body: string
}

export type GuardianShowcaseEntry = CollectionEntry<'homepage'> & {
  data: {
    type: 'guardian-showcase'
    title: string
    subtitle: string
    docsLink: string
    features: string[]
  }
}

export type DashboardShowcaseEntry = CollectionEntry<'homepage'> & {
  data: {
    type: 'dashboard-showcase'
    title: string
    subtitle: string
    description: string
    liveBadge: string
    docsLink: string
    docsLinkText: string
    benefits: { value: string; valueStyle: 'gradient' | 'live'; title: string; caption: string }[]
  }
}

export type DashboardPreviewEntry = CollectionEntry<'homepage'> & {
  data: {
    type: 'dashboard-preview'
    project: string
    time: string
    overview: {
      health: { score: number; rows: { key: string; value: string; color: string }[] }
      freshness: { percentage: number; rows: { key: string; value: string; color: string }[] }
      sprint: { name: string; percentage: number; done: number; inProgress: number; todo: number }
    }
    files: {
      activeFiles: { count: number; list: string[]; footer: string }
      distribution: { tier: 'HOT' | 'WARM' | 'COLD'; count: number; percentage: number }[]
      sizeHealth: { emoji: string; name: string; lines: number; maxLines: number }[]
    }
    health: {
      validation: { status: string; lastChecked: string }
      guardian: { status: string; lastReview: string; command: string }
    }
  }
}
