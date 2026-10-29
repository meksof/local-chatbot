# local-chatbot

![local-chatbot demo](./demo_ia-agent.png)

A chat app to interact with local AI models via the [Ollama](https://ollama.com) API. Built with Angular 20, styled with Tailwind CSS following an Ollama-inspired minimal design system.

## Prerequisites

- [Node.js](https://nodejs.org) (v18+)
- [Ollama](https://ollama.com) running locally at `http://localhost:11434`
- At least one model pulled (e.g. `ollama pull llama3`)

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

The app will be available at `http://localhost:4200`.

## Available Scripts

| Command       | Description                                      |
|---------------|--------------------------------------------------|
| `npm start`   | Start the dev server (`ng serve`)                |
| `npm run build` | Build for production                           |
| `npm run watch` | Build in watch mode (development configuration) |
| `npm test`    | Run unit tests with Karma                        |
| `npm run e2e` | Run end-to-end tests with Playwright             |

## Ollama API

The app expects the Ollama API at `http://localhost:11434` and uses the following endpoints:

| Endpoint        | Purpose                     |
|-----------------|-----------------------------|
| `/api/generate` | Generate model responses    |
| `/api/tags`     | List all available models   |
| `/api/ps`       | List currently running models |

Use `.rest/ollama.http` to manually test these endpoints.

## Documentation

| Document | Description |
|----------|-------------|
| [ROADMAP.md](ROADMAP.md) | Planned features and open TODOs |
| [docs/SPEC.md](docs/SPEC.md) | The v0 specification and general rules |
| [docs/design/DESIGN.md](docs/design/DESIGN.md) | UI design system — colors, typography, components, and layout |
| [docs/adr/001-design-system.md](docs/adr/001-design-system.md) | ADR: adoption of the Ollama-inspired design system |
| [docs/features/web-search.md](docs/features/web-search.md) | Feature spec: web search integration |

## Feature Implementation Workflow

New features follow a spec-first approach:

1. **Write a spec** — create a markdown file under `docs/features/<feature-name>.md` describing the problem, expected behavior, and user flow.
2. **Update `docs/SPEC.md`** — add the feature to the features list and link to the spec file.
3. **Add a TODO** in `ROADMAP.md` with a reference to the spec.
4. **Implement** — build the feature following the rules defined in `docs/SPEC.md`, the design system in `docs/design/DESIGN.md`, and the feature details in `docs/features/<feature-name>.md`.
5. (optional) **Write an ADR** — any meaningful deviation from - the app rules, new libraries or architecture decisions - create an ADR under `docs/adr/`.
6. **Mark as done** — check off the item in both `ROADMAP.md` and `docs/SPEC.md`.

## UI Design System Workflow

The design system is documented in [`docs/design/DESIGN.md`](docs/design/DESIGN.md) and formalized as Tailwind tokens in `tailwind.config.js`. When working on UI:

1. **Consult the design system first** — colors, typography, spacing, border radius, and component specs are all defined in `docs/design/DESIGN.md`.
2. **Use semantic Tailwind classes** — tokens like `bg-canvas`, `text-ink`, `bg-surface-dark`, `font-display` map directly to design system values. Avoid raw Tailwind color or spacing utilities for anything covered by the token set.
3. **Pill geometry for interactive elements** — every button, input, and select uses `rounded-full`. Cards use `rounded-ds-lg` (12px). No exceptions.
4. **Record decisions as ADRs** — any meaningful deviation from or extension of the design system should be documented as an ADR under `docs/adr/`.
