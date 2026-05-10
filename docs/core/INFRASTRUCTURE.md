# Infrastructure & Deployment

This document tracks the infrastructure assets and deployment configuration for the Cortex TMS project.

---

## 🌐 Domains

**Registered**: 2026-01-18

| Domain | Purpose | Status | Target Audience |
|:-------|:--------|:------:|:----------------|
| **cortex-tms.org** | Open source community hub | ✅ Active | Developers, contributors, OSS users |
| **cortex-tms.dev** | Technical documentation & CLI reference | ✅ Active | Developer tools, API docs, integrations |
| **cortextms.dev** | Alternate/redirect | ✅ Active | SEO, typo prevention |

**DNS Configuration**: TBD (pending Starlight deployment)

**Future Acquisition Targets**:
- **cortex-tms.com** - Currently taken, potential future acquisition for business/enterprise focus

---

### Domain Strategy: Community vs Product Separation

**Why Three Domains?**

This multi-domain strategy follows the pattern used by successful open-source projects (Next.js, Supabase, TypeScript) to create clear separation between community/OSS and product/business concerns.

#### cortex-tms.org (Community & Open Source) 🌍
**TLD Meaning**: .org signals trust, community, non-profit focus

**Planned Content**:
- Community documentation and tutorials
- Open source contribution guidelines
- Project blog and case studies
- Community showcase (projects using Cortex TMS)
- Free tier documentation and resources
- GitHub sponsorship/donation information

**Audience**: Developers exploring the tool, contributors, OSS community

**Example Sites**: nextjs.org, supabase.org, typescriptlang.org

#### cortex-tms.dev (Developer Tools & Technical) 🛠️
**TLD Meaning**: .dev signals developer tooling, enforced HTTPS, technical focus

**Planned Content**:
- CLI tool documentation and API reference
- Technical integration guides
- Release notes and changelog
- Developer tools (validators, playground concepts)
- NPM package documentation

**Audience**: Developers actively using the CLI, integrators, power users

**Benefits**:
- Enforced HTTPS (security by default)
- Modern, developer-focused TLD
- Matches npm package name (`cortex-tms`)

#### cortextms.dev (Redirect Only) 🔄
**Purpose**:
- Prevents typo squatting (users might forget the hyphen)
- Redirects to primary domain (TBD: .org or .dev)
- SEO protection

---

### Implementation Plan (v2.7)

**Short-term (Week 1-2)**: Launch Primary Site
- Deploy Starlight to **cortex-tms.org** (recommended primary)
- Focus on community/OSS content (most approachable)
- Redirect: `cortextms.dev` → `cortex-tms.org`
- Keep `cortex-tms.dev` parked for future use

**Mid-term (Post-v2.7)**: Differentiate Domains
- **cortex-tms.org**: Community hub, tutorials, showcase, blog
- **cortex-tms.dev**: Technical API docs, CLI reference, integrations

**Long-term**: Domain Evolution
- .org = Community & open source focus
- .dev = Technical documentation & developer tools
- Future domain acquisitions: As project needs evolve

---

### Recommended Primary Domain

**For v2.7 Launch**: Use **cortex-tms.org** as primary

**Why .org over .dev for primary?**
1. **Trust Signal**: .org = community-first, not profit-driven (important for OSS adoption)
2. **Broader Appeal**: More approachable for non-technical stakeholders
3. **Future-Proof**: Easier to separate .org (community) and .com (business) later
4. **Industry Pattern**: Most successful OSS projects lead with .org (Next.js, Supabase, TypeScript)

**Keep .dev for**:
- Technical deep-dives
- API reference documentation
- CLI-specific content
- Developer tools

---

## 🏗️ Repository Structure

**Current** (as of v4.1.0):
```
GitHub Organization: cortex-tms
└── cortex-tms/cortex-tms (public)
    ├── Main CLI package
    ├── Documentation
    └── Templates
```

**Transferred**: 2026-01-18 to GitHub organization `cortex-tms`

**Planned** (v2.7+):
```
GitHub Organization: cortex-tms
├── cortex-tms/cortex-tms (public) - Main CLI package (current)
└── cortex-tms/docs (public) - Starlight documentation site (planned)
```

**Repository Decision Status**: 🔄 In Progress (TMS-270c)

---

## 📦 NPM Package

**Package Name**: `cortex-tms`
**Registry**: https://www.npmjs.com/package/cortex-tms
**Current Version**: 4.1.0 (stable)

**Distribution Tags**:
- `latest`: 4.1.0

**Install Command**:
```bash
npm install -g cortex-tms@latest
```

---

## 🚀 Deployment Targets

### Documentation Site (Planned - TMS-270d)

**Platform**: TBD (options: Vercel, Netlify, Cloudflare Pages)
**Framework**: Starlight (Astro-based)
**Domain**: cortex-tms.dev
**Status**: 🔄 Planned (Week 1-2 of v2.7)

**Requirements**:
- Automatic deployments from main branch
- Preview deployments for PRs
- SSL/TLS (enforced by .dev TLD)
- CDN for global performance

---

## 🔐 Access Control

### Public Assets
- NPM package: `cortex-tms`
- GitHub repo: `github.com/cortex-tms/cortex-tms`
- Documentation site: `cortex-tms.org` (planned)

---

## 📊 Analytics & Monitoring (Planned)

**Planned for v2.7 Phase 2**:
- Website analytics: TBD (Plausible, Fathom, or Simple Analytics recommended)
- NPM download tracking: Via npm stats API
- Error tracking: TBD
- Performance monitoring: TBD

**Privacy-First Approach**:
- No Google Analytics (GDPR-friendly alternatives)
- No user tracking across sites
- Minimal data collection

---

## 🔄 CI/CD Pipeline

**Current** (v4.1.0):
```
GitHub Actions:
├── .github/workflows/tms-validate.yml
│   ├── Runs on: push to main, PRs
│   ├── Jobs: validate, docs-check, test, build
│   └── Status: ✅ Active
```

**Planned** (v2.7):
```
Documentation Site:
├── Auto-deploy on push to main
├── Preview deploys for PRs
└── Build cache optimization
```

---

## 🏷️ Version Management

**Source of Truth**: `package.json` version field

**Automated Sync**:
- 34 files automatically synchronized via `pnpm run docs:sync`
- Version metadata tags: `<!-- @cortex-tms-version X.Y.Z -->`
- CHANGELOG.md validated for version entries

**Release Process**:
- Tools: Atomic Release Engine (`scripts/release.js`)
- Distribution: NPM + GitHub Releases

---

## 📝 Configuration Files

| File | Purpose | Location |
|:-----|:--------|:---------|
| `.cortexrc` | Project configuration | Root directory |
| `package.json` | NPM package metadata | Root directory |
| `tsconfig.json` | TypeScript compilation | Root directory |
| `vitest.config.ts` | Test configuration | Root directory (planned) |

---

## 🔧 Development Environment

**Required Tools**:
- Node.js >=18.0.0
- pnpm (preferred) or npm
- Git
- GitHub CLI (`gh`) - for release automation
- TypeScript 5.7+

**Optional Tools**:
- VS Code (recommended IDE)
- Cortex TMS VS Code snippets (auto-installed)

---

## 📚 Related Documentation

- Repository structure: See `ARCHITECTURE.md` (planned)
- Git standards: See `docs/core/GIT-STANDARDS.md`
- Task management: See `NEXT-TASKS.md`

---

**Last Updated**: 2026-01-18
**Status**: Living document - updated as infrastructure evolves

<!-- @cortex-tms-version 4.0.2 -->
