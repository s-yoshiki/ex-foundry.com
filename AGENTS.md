# Repository guide

This repository is the reference pnpm/Turborepo layout for ex-foundry projects.

- Run commands from the repository root.
- Use Node.js 26 and the pinned pnpm version.
- Applications belong in `apps/*`.
- Shared source packages belong in `packages/*`.
- Infrastructure and repository-local CLI tools belong in `scripts/*`.
- Keep framework-specific code inside its application.
- Keep API routes and tests in `apps/api`.
- Add shared Tailwind CSS 4 tokens to `packages/tailwind-config/theme.css`.
- Do not edit generated directories such as `dist`, `.turbo`, or `node_modules`.

Before hand-off, run:

```sh
pnpm check
pnpm typecheck
pnpm test
pnpm build
```
