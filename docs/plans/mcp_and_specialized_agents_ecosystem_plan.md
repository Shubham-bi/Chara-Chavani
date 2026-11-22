# Dev Plan & Task Checklist: MCP Servers, Specialized Agents & Playwright Ecosystem

**Module / Task:** Implementation of MCP Server Configurations, Specialized AI Agent Personas, Playwright E2E Automation & Architectural Guide  
**Document Version:** 1.0.0  
**Status:** In-Progress  
**Lifecycle Stage:** Stage 3 (Plan & Task List)  
**Author:** Lead Enterprise Solutions Architect & QA SDET  

---

## 1. High-Level Architectural Approach

1. **Model Context Protocol (MCP) Configuration Consolidation:**
   - Update `mcp_config.json` with all recommended MCP servers:
     - `mysql`: Database inspection & spatial queries (`@modelcontextprotocol/server-mysql`)
     - `dotnet-execution`: CLI & Roslyn diagnostics (`dotnet-cli`)
     - `openapi-swagger`: API spec and endpoint fetching (`@modelcontextprotocol/server-fetch`)
     - `figma`: Design tokens and UI wireframes (`@modelcontextprotocol/server-figma`)
     - `chrome-devtools`: Web debugging and network tracing (`chrome-devtools-plugin`)
     - `git`: Version control and branch management (`@modelcontextprotocol/server-git`)
     - `filesystem`: Monorepo file read/write (`@modelcontextprotocol/server-filesystem`)
     - `playwright`: Web browser automated testing (`@executeautomation/playwright-mcp-server`)
     - `ldplayer`: Android emulator automation, APK install, GPS injection (`tools/mcp-ldplayer/mcp_ldplayer/mcp_server.py`)
2. **Specialized AI Agent Personas Implementation:**
   - Define formal persona markdown files in `.agents/personas/`:
     - `dotnet-backend-architect.md`
     - `react-native-mobile-engineer.md`
     - `mysql-data-architect.md`
     - `api-contract-sync-agent.md`
     - `qa-geofence-tester.md`
     - `playwright-e2e-engineer.md`
     - `ldplayer-mobile-automation-agent.md`
     - `devops-release-agent.md`
3. **Playwright E2E Web Admin Automation Setup:**
   - Create `playwright.config.ts`.
   - Implement `tests/e2e-web/web-admin-dashboard.spec.ts` to test the live Web Admin Dashboard at `http://localhost:3000`.
   - Add `"test:playwright"` script to root `package.json`.
   - Run Playwright test suite and verify 100% pass.
4. **Lifecycle Verification & Governance Documentation:**
   - Update `docs/logs/challenges_and_solutions.md`.
   - Author comprehensive guide `docs/MCP_AND_SPECIALIZED_AGENTS_GUIDE.md` detailing the entire ecosystem.
   - Run all linters and tests to guarantee zero regressions.

---

## 2. Granular Task Checklist

### Phase 1: Model Context Protocol (MCP) Consolidation
- [x] **Task 1.1:** Update `mcp_config.json` with all 9 MCP servers.
- [x] **Task 1.2:** Validate JSON schema and environment variables for local database and emulator paths.

### Phase 2: Specialized AI Agent Personas
- [x] **Task 2.1:** Scaffold `.agents/personas/` directory.
- [x] **Task 2.2:** Author `dotnet-backend-architect.md`.
- [x] **Task 2.3:** Author `react-native-mobile-engineer.md`.
- [x] **Task 2.4:** Author `mysql-data-architect.md`.
- [x] **Task 2.5:** Author `api-contract-sync-agent.md`.
- [x] **Task 2.6:** Author `qa-geofence-tester.md`.
- [x] **Task 2.7:** Author `playwright-e2e-engineer.md`.
- [x] **Task 2.8:** Author `ldplayer-mobile-automation-agent.md`.
- [x] **Task 2.9:** Author `devops-release-agent.md`.

### Phase 3: Playwright Test Automation Harness
- [x] **Task 3.1:** Create `playwright.config.ts` targeting `http://localhost:3000`.
- [x] **Task 3.2:** Implement `tests/e2e-web/web-admin-dashboard.spec.ts`.
- [x] **Task 3.3:** Configure `"test:playwright"` in `package.json`.
- [x] **Task 3.4:** Execute Playwright tests and verify 100% pass.

### Phase 4: Verification, Guide & Sign-off
- [x] **Task 4.1:** Verify `npm run lint:all` with 0 errors.
- [x] **Task 4.2:** Verify `npm run typecheck` across all workspaces.
- [x] **Task 4.3:** Verify `dotnet test` (67/67 passing).
- [x] **Task 4.4:** Record challenges and solutions in `docs/logs/challenges_and_solutions.md`.
- [x] **Task 4.5:** Author master document `docs/MCP_AND_SPECIALIZED_AGENTS_GUIDE.md`.
- [x] **Task 4.6:** Commit and push changes to remote repository.
