# evernote-mcp-write — Project Discontinued

**Status: Discontinued (May 26, 2026).** The source code has been removed from this branch. Git history is preserved.

## What this was

A planned fork of [brentmid/evernote-mcp-server](https://github.com/brentmid/evernote-mcp-server) intended to add **write capabilities** (`createNote`, plus an optional `EVERNOTE_WRITE_OPS` config gate for future `update` and `delete`) to the existing read-only Evernote MCP server. Phases 1–4 of the implementation (createNote tool, Thrift wiring, config gate, setup docs) were completed locally but never released.

## Why it was shut down

Evernote is **no longer issuing new API keys**, which made it impossible for new users to set up this MCP server even if the code worked. Without a path for anyone other than the original author to actually run it, there was no point in releasing it.

From Evernote Support, May 26, 2026 (verbatim):

> Hi there,
>
> Thank you for reaching out about API access.
>
> At this time, we're no longer issuing new Evernote API keys. However, we're actively working on a new MCP (Model Context Protocol) integration that will provide a more modern way to connect Evernote with AI tools and workflows.
>
> You can register your interest, sign up to be notified when it becomes available, and share more about your intended use case here: https://evernote.com/mcp.
>
> If there are capabilities or types of access you'd need beyond what MCP integrations typically support, please include those details in the form as well. This feedback helps inform future development.
>
> We appreciate your interest in building with Evernote and thank you for your patience.
>
> Best regards,
>
> Evernote Support team

## If you're looking for a write-enabled Evernote MCP

As of May 2026 the practical options are:

- **Wait for Evernote's official MCP** — sign up at https://evernote.com/mcp to be notified and to influence the capability set. This is the only path forward for anyone who doesn't already have an Evernote API key.
- **Use an existing community MCP only if you already have an active API key from before Evernote stopped issuing them.** [brentmid/evernote-mcp-server](https://github.com/brentmid/evernote-mcp-server) is the read-only baseline this fork was built on.

There is no longer a viable path to set up a community write-enabled Evernote MCP from scratch.

## Repo contents

- `README.md` — this file
- `LICENSE` — MIT license, attribution preserved for the original upstream author (brentmid)
- `CHANGELOG.md` — upstream change log, preserved for historical context
- Git history — the two write-capability commits (`createNote` + `EVERNOTE_WRITE_OPS` gate) are preserved if anyone ever wants to reference the approach

## License

MIT. Original upstream code copyright belongs to the brentmid project; see `LICENSE`.
