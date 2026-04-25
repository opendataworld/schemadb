# Repository Agent Instructions

Scope: entire repository.

This repository follows the shared OpenAutonomyX instruction layer in `openautonomyx/common-instructions` and is scoped to OpenDataWorld schema/database documentation and related content.

## Shared references

Use these shared references as the default baseline:

- `standards/engineering-execution-standard.md`
- `policies/context-and-guardrails-policy.md`
- `policies/test-and-process-improvement-policy.md`
- `policies/airgapped-operation-policy.md`

Do not duplicate shared policies here. Reference them and keep this repository focused on schema-specific documentation and assets.

## In scope

- Schema documentation
- Data model notes
- Registry and catalog guidance
- Schema examples and validation expectations
- Review notes for schema changes

## Out of scope

- Organization-level vision or strategy source documents
- Generic prompt packs
- Product implementation details owned by another repository
- Large private datasets or binary model artifacts unless explicitly approved

## Documentation rules

1. Keep schema docs precise, versioned, and reviewable.
2. Document compatibility and migration impact when schema behavior changes.
3. Include examples for important schema patterns.
4. Record substantial schema or documentation changes in `reviews/` when applicable.
5. Require reviewer approval and HITL sign-off for production-facing schema changes.
