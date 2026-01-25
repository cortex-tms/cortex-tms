# Implementation Plan: Guardian Structured JSON Output

**Task ID**: [OPT-1] Structured JSON Output - Replace string matching
**Effort**: 6-8 hours
**Goal**: Improve Guardian accuracy from 65.5% baseline by replacing brittle string matching with structured JSON output

---

## Current State Analysis

### Problem
Guardian currently uses string matching to detect violations:
- `detectViolationInResponse()` in `guardian-accuracy.test.ts` (lines 707-758)
- Searches for keywords: "❌ major violations", "violation", "should use", etc.
- Ambiguous when LLM response contains both violation and compliance indicators
- False positives/negatives from keyword collisions

**Example Failure Case**:
```
Response: "✅ Compliant overall. However, violation examples in the docs..."
```
String matcher sees "violation" → incorrectly flags as violation.

### Current Implementation
- **File**: `src/commands/review.ts` - Guardian command (aliased as "review")
- **File**: `src/utils/llm-client.ts` - LLM API client (OpenAI + Anthropic)
- **File**: `src/__tests__/guardian-accuracy.test.ts` - Accuracy tests with string matching
- **Output**: Raw text from LLM, no structured parsing
- **Accuracy**: 65.5% baseline (needs improvement to 80%+)

---

## Proposed Solution

### JSON Schema Design

```typescript
interface GuardianResult {
  summary: {
    status: 'compliant' | 'minor_issues' | 'major_violations';
    message: string;
  };
  violations: Array<{
    pattern: string;           // e.g., "Pattern 1: Placeholder Syntax"
    line?: number;             // Optional line number
    issue: string;             // What's wrong
    recommendation: string;    // How to fix
    severity: 'minor' | 'major';
  }>;
  positiveObservations: string[];
}
```

### Implementation Approach

**Strategy**: Native JSON mode for OpenAI, prompt engineering for Anthropic, with fallback to text parsing

#### Phase 1: Update LLM Client (2-3h)
**File**: `src/utils/llm-client.ts`

1. **Add JSON mode support to LLMConfig**:
   ```typescript
   export interface LLMConfig {
     provider: 'openai' | 'anthropic';
     apiKey: string;
     model?: string;
     timeoutMs?: number;
     responseFormat?: 'text' | 'json';  // NEW
   }
   ```

2. **Update OpenAI API call** (lines 63-117):
   - Add `response_format: { type: "json_object" }` when `responseFormat: 'json'`
   - OpenAI natively supports JSON mode (gpt-4-turbo, gpt-4o)

3. **Update Anthropic API call** (lines 132-195):
   - Anthropic doesn't have native JSON mode
   - Append JSON format instruction to system message when `responseFormat: 'json'`
   - Example: "You must respond with valid JSON matching this schema: {...}"

4. **Add JSON validation helper**:
   ```typescript
   function parseGuardianJSON(content: string): GuardianResult | null {
     try {
       const parsed = JSON.parse(content);
       // Validate schema (check required fields)
       if (!parsed.summary?.status || !Array.isArray(parsed.violations)) {
         return null;
       }
       return parsed as GuardianResult;
     } catch {
       return null;
     }
   }
   ```

#### Phase 2: Update Review Command (2-3h)
**File**: `src/commands/review.ts`

1. **Update system prompt** (lines 156-206):
   - Add JSON schema to output format section
   - Specify exact field names and types
   - Example:
     ```markdown
     # Output Format
     You MUST respond with valid JSON matching this schema:
     {
       "summary": {
         "status": "compliant" | "minor_issues" | "major_violations",
         "message": "Brief overall assessment"
       },
       "violations": [
         {
           "pattern": "Pattern name",
           "line": 42,  // optional
           "issue": "What's wrong",
           "recommendation": "How to fix",
           "severity": "minor" | "major"
         }
       ],
       "positiveObservations": ["Good practice 1", "Good practice 2"]
     }
     ```

2. **Update runReviewCommand** (lines 47-151):
   - Pass `responseFormat: 'json'` to LLM config
   - Parse JSON response
   - Format for display (pretty-print with emojis)
   - Fallback to raw text if JSON parsing fails

3. **Add display formatter**:
   ```typescript
   function formatGuardianResult(result: GuardianResult): string {
     let output = '';

     // Summary
     const statusEmoji = {
       compliant: '✅',
       minor_issues: '⚠️ ',
       major_violations: '❌',
     }[result.summary.status];

     output += `${statusEmoji} ${result.summary.message}\n\n`;

     // Violations
     if (result.violations.length > 0) {
       output += '## Violations\n\n';
       result.violations.forEach(v => {
         const severityIcon = v.severity === 'major' ? '❌' : '⚠️ ';
         output += `${severityIcon} **${v.pattern}**\n`;
         if (v.line) output += `   Line: ${v.line}\n`;
         output += `   Issue: ${v.issue}\n`;
         output += `   Fix: ${v.recommendation}\n\n`;
       });
     }

     // Positive observations
     if (result.positiveObservations.length > 0) {
       output += '## Positive Observations\n\n';
       result.positiveObservations.forEach(obs => {
         output += `✅ ${obs}\n`;
       });
     }

     return output;
   }
   ```

#### Phase 3: Update Accuracy Tests (2h)
**File**: `src/__tests__/guardian-accuracy.test.ts`

1. **Replace `detectViolationInResponse()`** (lines 707-758):
   ```typescript
   function detectViolationInResponse(response: string): boolean {
     // Try JSON parsing first
     try {
       const result = JSON.parse(response) as GuardianResult;
       return result.summary.status !== 'compliant' || result.violations.length > 0;
     } catch {
       // Fallback to string matching (for backwards compatibility)
       return detectViolationInResponseLegacy(response);
     }
   }

   // Rename old function to detectViolationInResponseLegacy()
   ```

2. **Add JSON validation tests**:
   - Test that responses are valid JSON
   - Test that schema fields are present
   - Test violation detection accuracy

3. **Run accuracy test suite**:
   - Baseline: 65.5%
   - Target: 80%+
   - Document improvement

#### Phase 4: Add TypeScript Types (0.5h)
**File**: `src/types/guardian.ts` (NEW)

```typescript
export interface GuardianResult {
  summary: {
    status: 'compliant' | 'minor_issues' | 'major_violations';
    message: string;
  };
  violations: Array<{
    pattern: string;
    line?: number;
    issue: string;
    recommendation: string;
    severity: 'minor' | 'major';
  }>;
  positiveObservations: string[];
}

export interface Violation {
  pattern: string;
  line?: number;
  issue: string;
  recommendation: string;
  severity: 'minor' | 'major';
}
```

---

## Implementation Steps

### Step 1: Create feature branch
```bash
git checkout -b feat/guardian-json-output
```

### Step 2: Phase 1 - LLM Client Updates (2-3h)
1. Add `responseFormat` to `LLMConfig` interface
2. Update `callOpenAI()` to support JSON mode
3. Update `callAnthropic()` with JSON prompt engineering
4. Add `parseGuardianJSON()` helper
5. Add unit tests for JSON parsing

### Step 3: Phase 2 - Review Command Updates (2-3h)
1. Create `src/types/guardian.ts` with types
2. Update system prompt with JSON schema
3. Update `runReviewCommand()` to use JSON mode
4. Add `formatGuardianResult()` formatter
5. Add fallback to text mode if JSON fails

### Step 4: Phase 3 - Test Updates (2h)
1. Update `detectViolationInResponse()` with JSON parsing
2. Add JSON validation tests
3. Run accuracy test suite: `npm test guardian-accuracy`
4. Document accuracy improvement

### Step 5: Phase 4 - Documentation & Integration (0.5h)
1. Update CHANGELOG.md with accuracy improvements
2. Update README.md with JSON output feature
3. Run full test suite: `npm test`
4. Run validation: `node bin/cortex-tms.js validate --strict`

### Step 6: Commit & PR
1. Commit with conventional commit format
2. Create PR with accuracy metrics

---

## Testing Strategy

### Unit Tests
- JSON parsing (valid/invalid JSON)
- Schema validation (missing fields, wrong types)
- Fallback to text mode

### Integration Tests
- OpenAI JSON mode works
- Anthropic JSON prompt engineering works
- Display formatting works

### Accuracy Tests
- Run guardian-accuracy.test.ts
- Compare baseline (65.5%) vs new accuracy (target 80%+)
- Document false positive/negative rates

---

## Success Criteria

1. ✅ All tests pass
2. ✅ Accuracy improves from 65.5% → 80%+
3. ✅ JSON parsing works for both OpenAI and Anthropic
4. ✅ Graceful fallback to text mode if JSON fails
5. ✅ Display output is user-friendly
6. ✅ Validation passes: `cortex-tms validate --strict`

---

## Risks & Mitigations

| Risk | Mitigation |
|:-----|:-----------|
| Anthropic JSON prompt engineering unreliable | Add fallback to text parsing |
| JSON schema changes break existing tests | Keep legacy string matcher as fallback |
| Accuracy doesn't improve | Add "Safe Mode" in follow-up task (OPT-1b) |
| OpenAI JSON mode rate limited | Document rate limit handling |

---

## Follow-up Tasks (Not in scope)

- **[OPT-1b]** Guardian Safe Mode - High-confidence violations only (3-4h)
- **[OPT-2]** Detection Logic Refactor - Regex with word boundaries (4-6h)
- **[OPT-3]** Retry Logic - Exponential backoff for API failures (3-4h)

---

## Files to Modify

1. `src/utils/llm-client.ts` - Add JSON mode support
2. `src/commands/review.ts` - Update prompts and parsing
3. `src/__tests__/guardian-accuracy.test.ts` - Update detection logic
4. `src/types/guardian.ts` - NEW - TypeScript types
5. `CHANGELOG.md` - Document accuracy improvement
6. `README.md` - Document JSON output feature

---

## Estimated Timeline

| Phase | Effort | Description |
|:------|:-------|:------------|
| LLM Client | 2-3h | JSON mode + parsing |
| Review Command | 2-3h | Prompts + formatting |
| Accuracy Tests | 2h | JSON detection + validation |
| Types & Docs | 0.5h | TypeScript + changelog |
| **Total** | **6-8h** | Full implementation |

---

## Open Questions

None - ready to implement.
