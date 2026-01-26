# NEXT: Upcoming Tasks

**Current Sprint**: v3.0 Development (Jan 26 - Feb 14, 2026)
**Previous Sprint**: [v2.9 Guardian Optimization](docs/archive/sprint-v2.9-jan-2026.md) ✅ Complete

---

## 🎯 v3.0 Development Focus

**Timeline**: 3 weeks
**Status**: 🚧 Planning

### Technical Improvements

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **Website Performance Optimization** | [TECH-1] | 4-6h | 🟡 MED | ⏸️ Planned |
| **Guardian Enhancements** | [TECH-2] | 3-4h | 🟡 MED | ⏸️ Planned |
| **Migration Experience Improvements** | [TMS-277-282] | 4-5h | 🟡 MED | ⏸️ Planned |
| **Version Release (v2.7.0)** | [REL-1] | 1-2h | 🟢 LOW | ⏸️ Deferred |

### Website Performance Optimization [TECH-1]

**Goal**: Reduce CSS bundle size, improve Lighthouse scores

**Tasks**:
- Remove unused CSS components (~2.1KB savings)
- Extract inline styles from homepage
- Clean up dead code in components
- Run performance benchmarks

**Status**: Documented in `tmp/WEBSITE-OPTIMIZATION-TASKS.md`

### Guardian Enhancements [TECH-2]

**Goal**: Improve Guardian reliability and usability

**Ideas**:
- Add `--watch` mode for continuous validation
- Improve confidence score accuracy
- Add custom confidence threshold flag
- Better error messages for common violations

**Status**: To be planned

### Migration Experience [TMS-277-282]

**Goal**: Smoother migration process for new users

**Tasks**:
- Improve error messages in `cortex migrate`
- Add dry-run mode
- Better progress indicators
- Migration validation checks

**Status**: To be planned

---

## 📋 Deferred Items (v3.1+)

**See**: [Future Enhancements](FUTURE-ENHANCEMENTS.md) for complete backlog

- Guardian GitHub Action & PR Bot (TMS-287)
- Custom Templates Architecture (TMS-241)
- MCP Server Integration
- Advanced token analytics

---

## 🗂️ Sprint Archive

- **v2.9**: [Guardian Optimization](docs/archive/sprint-v2.9-jan-2026.md) ✅ Complete (Jan 25-26, 2026)
- **v2.7**: [Guardian MVP](docs/archive/sprint-v2.7-jan-2026.md) ✅ Complete (Jan 19-23, 2026)
- **v2.6.1**: [Emergency Patch](docs/archive/sprint-v2.6.1-emergency-patch.md) ✅
- **v2.6**: [Integrity & Atomicity](docs/archive/sprint-v2.6-integrity-atomicity.md) ✅
- **v2.5**: [Guidance & Growth](docs/archive/sprint-v2.5-guidance-growth.md) ✅
- **v2.4**: [Scaling Intelligence](docs/archive/sprint-v2.4-scaling-intelligence.md) ✅
- **v2.3**: [Confidence & Comfort](docs/archive/sprint-v2.3-confidence-comfort.md) ✅
- **v2.2**: [Automation & Precision](docs/archive/sprint-2026-01.md) ✅
- **v2.1**: [Foundation](docs/archive/sprint-2026-01-dogfooding.md) ✅

<!-- @cortex-tms-version 2.6.1 -->
