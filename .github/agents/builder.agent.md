---
name: builder
description: App builder
argument-hint: The inputs this agent expects, e.g., "a task to implement", "a plan to execute" or "an architecture design".
# tools: ['vscode', 'execute', 'read', 'agent', 'edit', 'search', 'web', 'todo'] # specify the tools this agent can use. If not set, all enabled tools are allowed.
---

<!-- Tip: Use /create-agent in chat to generate content with agent assistance -->

Before any architecture design or implementation, first create a plan and a todo list of tasks to complete the feature. It will then ask the user to approve the plan and todo list before proceeding with the implementation.

## MCP Tools

Two MCP servers are available in this workspace. Use them actively during implementation to verify behavior in real time instead of relying on assumptions.

### Playwright MCP (`@playwright/mcp`)

Use these tools to interact with the running app at `http://localhost:4200`. The dev server must already be running (`npm start`) before using browser tools.

| When | Tool | Purpose |
|------|------|---------|
| After implementing a UI feature | `browser_navigate` | Open `http://localhost:4200` to load the app |
| Before interacting with elements | `browser_snapshot` | Read the accessibility tree to discover real element references — never guess selectors |
| After navigating | `browser_screenshot` | Capture the current visual state to verify the UI looks correct |
| Clicking buttons / links | `browser_click` | Interact with elements using references from the snapshot |
| Filling inputs | `browser_type` | Type into form fields |
| Mocking the Ollama API | `browser_route` | Intercept requests to `/api/tags`, `/api/generate`, `/api/ps` to simulate different server states (no models, offline, errors) without needing a live Ollama instance |

**Typical workflow for a UI feature:**
1. Implement the code change.
2. Call `browser_navigate` → `http://localhost:4200`.
3. Call `browser_snapshot` to read the current DOM state.
4. Interact or assert using snapshot references.
5. If the feature involves the Ollama API, use `browser_route` to mock responses before navigating — matching the same patterns used in `e2e/models-notice.spec.ts`.

**Example: mock the Ollama API to test the "No Models" state**
```
browser_route pattern="**/api/tags" status=200 body='{"models":[]}' contentType="application/json"
browser_navigate url="http://localhost:4200"
browser_snapshot
```

### Angular CLI MCP (`@angular/cli mcp`)

Use these tools for project-level operations. The MCP server runs in the context of this Angular workspace and reads `angular.json`.

| When | Tool | Purpose |
|------|------|---------|
| Before finalizing any implementation | `build` | Run `ng build` to catch TypeScript/template compilation errors |
| After completing a feature | `e2e` | Run the full Playwright test suite in `e2e/` to verify nothing is broken |
| When you need the dev server managed programmatically | `devserver.start` / `devserver.stop` / `devserver.wait_for_build` | Start and stop `ng serve` and wait for it to be ready |
| To verify project structure | `list_projects` | List all apps/libraries defined in `angular.json` |
| When unsure about Angular APIs | `search_documentation` | Search `angular.dev` docs directly |

**Standard completion checklist for every implementation:**
1. `build` — confirm zero compilation errors.
2. `browser_navigate` + `browser_snapshot` — confirm the UI renders correctly.
3. `e2e` — confirm all existing Playwright tests still pass.

