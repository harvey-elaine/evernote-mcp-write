# Setup Guide — evernote-mcp-write

Complete setup instructions for running this MCP server locally and registering it with Claude Code. This guide assumes no prior context with the project.

## Prerequisites

- Node.js 18 or newer
- Git
- A GitHub account (only needed if cloning your own fork; you can also clone this repo directly)
- An Evernote account (free tier works)

## Step 1 — Get Evernote API credentials

1. Visit [https://dev.evernote.com/key.php](https://dev.evernote.com/key.php).
2. Request an API key with **Full Access**. A Basic Access key is read-only and will reject write operations.
3. Evernote reviews API key requests manually. Allow up to 5 business days.
4. You will receive a Consumer Key and Consumer Secret via email.

> Note: A Full Access key has technical permission to read, create, update, and delete notes. This server only exposes the operations listed in `EVERNOTE_WRITE_OPS` (see Step 3), so the effective scope is whatever you configure — not the maximum the key allows.

## Step 2 — Clone and install

```bash
git clone https://github.com/harvey-elaine/evernote-mcp-write.git
cd evernote-mcp-write
npm install
```

## Step 3 — Configure `.env`

```bash
cp .env.example .env
```

Edit `.env` and fill in at minimum:

```
EVERNOTE_CONSUMER_KEY=your_consumer_key_here
EVERNOTE_CONSUMER_SECRET=your_consumer_secret_here
EVERNOTE_WRITE_OPS=create
```

`EVERNOTE_WRITE_OPS` controls which write tools are exposed to Claude. Valid values are `create`, `update`, `delete` (comma-separated). Leave the variable empty or unset for read-only mode. Only `create` is implemented in this version.

## Step 4 — Authenticate with Evernote (one time)

```bash
node index.js
```

The server will open your browser to Evernote's OAuth authorization page.

- Accept the self-signed certificate warning. This is expected — the local server uses a self-signed cert for its OAuth callback URL.
- Log in to your Evernote account.
- Click Authorize.
- You will see a success message in the browser.

The access token is written automatically to your `.env` file. This step only needs to be done once; the token persists across server restarts. If the token ever expires, re-run `node index.js`.

## Step 5 — Register with Claude Code

```bash
claude mcp add evernote -- node /full/path/to/evernote-mcp-write/mcp-server.js
```

Use the full absolute path to `mcp-server.js`. Restart Claude Code after adding so it picks up the new server.

On Windows the path will look like `C:\Users\you\evernote-mcp-write\mcp-server.js`.

## Step 6 — Verify

In Claude Code, try:

- *"Search my Evernote for [something you know exists]"* — confirms read works.
- *"Create a note titled 'MCP Setup Test' with content 'Testing Evernote MCP write capability.'"* — confirms write works.
- Check Evernote to confirm the note was created.

If `createNote` does not appear as an available tool, see the troubleshooting table below.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| OAuth fails with SSL error | Self-signed cert rejected | Accept the browser warning. As a last resort, run with `NODE_TLS_REJECT_UNAUTHORIZED=0` for the auth step only. |
| `"createNote is not enabled"` error | `EVERNOTE_WRITE_OPS` not set or empty | Add `EVERNOTE_WRITE_OPS=create` to `.env` and restart Claude Code. |
| `createNote` not in Claude's tool list | Wrong path in `claude mcp add` command, or Claude Code not restarted | Verify the path runs by executing `node /path/to/mcp-server.js` directly. Restart Claude Code. |
| `"Authentication failed"` | Access token expired | Re-run `node index.js` to re-authenticate. |
| API key rejected on write | Basic Access key in use | Request a new Full Access key at [dev.evernote.com/key.php](https://dev.evernote.com/key.php). |
| Tools list unchanged after code edits | MCP server processes are spawned per session | Restart Claude Code after every code or `.env` change. |

## Switching to read-only mode

Set `EVERNOTE_WRITE_OPS=` (empty) in `.env` and restart Claude Code. The `createNote` tool will disappear from Claude's tool list. The Evernote API key itself is unchanged — only the server's exposed surface is reduced.

## Development workflow

Claude Code spawns the MCP server as a child process at session start; there is no hot reload. After any change to server code or `.env`, restart Claude Code before testing. Plan for 2–3 restart cycles per feature: one to confirm the tool appears, one for the happy path, one for edge cases.

If you are running via Docker (`docker-compose up -d`), push your changes to the repo first — Docker builds pull from it — then `docker-compose down && docker-compose up -d` and restart Claude Code.

## References

- Original project: [brentmid/evernote-mcp-server](https://github.com/brentmid/evernote-mcp-server)
- Evernote developer portal: [dev.evernote.com](https://dev.evernote.com)
- Evernote NoteStore API: [dev.evernote.com/doc/reference/NoteStore.html](https://dev.evernote.com/doc/reference/NoteStore.html)
- ENML reference: [dev.evernote.com/doc/articles/enml.php](https://dev.evernote.com/doc/articles/enml.php)
