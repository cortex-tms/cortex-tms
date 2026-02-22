import { defineCollection, z } from 'astro:content'
import { docsSchema } from '@astrojs/starlight/schema'

export const collections = {
  docs: defineCollection({ schema: docsSchema() }),
  blog: defineCollection({
    schema: z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.date(),
      updatedDate: z.date().optional(),
      author: z.string().default('Cortex TMS Team'),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      heroImage: z.string().optional(),
      heroAlt: z.string().optional(),
    }),
  }),
  homepage: defineCollection({
    schema: z.discriminatedUnion('type', [
      // Hero section
      z.object({
        type: z.literal('hero'),
        title: z.string(),
        subtitle: z.string(),
        tagline: z.string(),
        description: z.string(),
        primaryButton: z.object({
          text: z.string(),
          href: z.string(),
          variant: z.enum(['neon', 'prism']).default('neon'),
        }),
        secondaryButton: z
          .object({
            text: z.string(),
            href: z.string(),
            variant: z.enum(['neon', 'prism']).default('prism'),
          })
          .optional(),
      }),
      // Feature card
      z.object({
        type: z.literal('feature'),
        icon: z.enum(['flame', 'shield', 'bar-chart', 'file-text', 'key', 'zap', 'monitor']),
        title: z.string(),
        order: z.number(),
      }),
      // Step card
      z.object({
        type: z.literal('step'),
        number: z.number(),
        title: z.string(),
      }),
      // Installation section
      z.object({
        type: z.literal('installation'),
        commands: z.array(
          z.object({
            label: z.string(),
            code: z.string(),
            recommended: z.boolean().default(false),
          })
        ),
      }),
      // Pillar card
      z.object({
        type: z.literal('pillar'),
        icon: z.enum(['file-text', 'clock', 'shield']),
        title: z.string(),
        description: z.string(),
        order: z.number(),
        beforeMetric: z.object({
          label: z.string(),
          value: z.string(),
          barWidth: z.string(),
        }),
        afterMetric: z.object({
          label: z.string(),
          value: z.string(),
          barWidth: z.string(),
        }),
        impactText: z.string(),
      }),
      // Blockquote
      z.object({
        type: z.literal('blockquote'),
        author: z.string(),
      }),
      // CTA Box
      z.object({
        type: z.literal('cta'),
        title: z.string(),
        description: z.string(),
        primaryButton: z.object({
          text: z.string(),
          href: z.string(),
        }),
        secondaryButton: z.object({
          text: z.string(),
          href: z.string(),
        }).optional(),
      }),
      // Demo Terminal
      z.object({
        type: z.literal('demo-terminal'),
        title: z.string(),
        command: z.string(),
        model: z.string(),
      }),
      // Guardian Showcase
      z.object({
        type: z.literal('guardian-showcase'),
        title: z.string(),
        subtitle: z.string(),
        docsLink: z.string(),
        features: z.array(z.string()),
      }),
      // Dashboard Showcase
      z.object({
        type: z.literal('dashboard-showcase'),
        title: z.string(),
        subtitle: z.string(),
        description: z.string(),
        liveBadge: z.string(),
        docsLink: z.string(),
        docsLinkText: z.string(),
        benefits: z.array(z.object({
          value: z.string(),
          valueStyle: z.enum(['gradient', 'live']),
          title: z.string(),
          caption: z.string(),
        })),
      }),
      // Dashboard Preview
      z.object({
        type: z.literal('dashboard-preview'),
        project: z.string(),
        time: z.string(),
        overview: z.object({
          health: z.object({
            score: z.number(),
            rows: z.array(z.object({
              key: z.string(),
              value: z.string(),
              color: z.enum(['green', 'yellow', 'red', 'white', 'cyan', 'blue']),
            })),
          }),
          freshness: z.object({
            percentage: z.number(),
            rows: z.array(z.object({
              key: z.string(),
              value: z.string(),
              color: z.enum(['green', 'yellow', 'red', 'white', 'cyan', 'blue']),
            })),
          }),
          sprint: z.object({
            name: z.string(),
            percentage: z.number(),
            done: z.number(),
            inProgress: z.number(),
            todo: z.number(),
          }),
        }),
        files: z.object({
          activeFiles: z.object({
            count: z.number(),
            list: z.array(z.string()),
            footer: z.string(),
          }),
          distribution: z.array(z.object({
            tier: z.enum(['HOT', 'WARM', 'COLD']),
            count: z.number(),
            percentage: z.number(),
          })),
          sizeHealth: z.array(z.object({
            emoji: z.string(),
            name: z.string(),
            lines: z.number(),
            maxLines: z.number(),
          })),
        }),
        health: z.object({
          validation: z.object({
            status: z.string(),
            lastChecked: z.string(),
          }),
          guardian: z.object({
            status: z.string(),
            lastReview: z.string(),
            command: z.string(),
          }),
        }),
      }),
    ]),
  }),
}
