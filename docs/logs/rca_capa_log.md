# Bug, RCA & CAPA Tracking Log

This log records all identified bugs, root cause analyses (RCA), and corrective & preventive actions (CAPA) across the Chara Chhavani system.

---

## Log Template

```markdown
## [BUG-XXXX] <Brief Descriptive Title>

- **Date**: YYYY-MM-DD
- **Module / Component**: (e.g., Mobile Farmer App / Backend WebApi / MySQL GIS)
- **Severity**: Critical | High | Medium | Low
- **Status**: Identified | In-Progress | Verified & Closed

### 1. Bug Description & Reproduction
- **Description**: 
- **Steps to Reproduce**:
  1. 
  2. 
- **Expected Behavior**: 
- **Actual Behavior**: 
- **Logs / Error Trace**:

### 2. Root Cause Analysis (RCA) - 5 Whys
- **Why 1**: 
- **Why 2**: 
- **Why 3**: 
- **Why 4**: 
- **Why 5 (Root Cause)**: 

### 3. Corrective Action (Immediate Fix)
- <What immediate code/config change resolves this issue>

### 4. Preventive Action (Long-Term Prevention)
- <What guardrail, automated test, compiler rule, or architectural constraint prevents recurrence>

### 5. Re-Verification Results
- **Date Re-Tested**: 
- **Test Results**: 
- **Regression Check**: [Passed / Failed]
- **Sign-off**: [Approved to move to next task]
```
