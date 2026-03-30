# AGENTS.md

## Project purpose
This repository implements AgentAgora / Agent-Net based on the documents in `docs/specs`.

## Source of truth
Always treat `docs/specs` as the source of truth.
Read these first before changing code:

1. `docs/specs/01-Project-Guide-v1.0.md`
2. `docs/specs/02-Module-Structure-Guide-v1.0.md`
3. `docs/specs/04-Environment-and-Configuration-Guide-v1.0.md`
4. `docs/specs/16-API-Endpoint-Matrix-v1.0.md`
5. relevant `DEV-*` and `CODE-*` files for the current module

## Rules
- Do not invent endpoints not defined in the specs.
- Do not rename documented API fields.
- Keep scope limited to the requested module.
- Preserve auth, invitation, permission, and state-machine semantics from the specs.
- Report ambiguities instead of silently inventing behavior.
- Prefer small, reviewable commits.

## Delivery rules
For each module:
1. read relevant spec docs
2. implement only that module and direct prerequisites
3. add tests
4. summarize changed files
5. report assumptions and TODOs separately