# Evernote MCP Server

> **Fork notice:** This project is forked from
> [brentmid/evernote-mcp-server](https://github.com/brentmid/evernote-mcp-server)
> and extended with write capabilities. The core Thrift integration, OAuth flow,
> and read tools are brentmid's work. New additions (write operations, config gate,
> setup guide, trust model documentation) are by Elaine Harvey.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
![Node.js](https://img.shields.io/badge/node-%3E=18.0.0-brightgreen)
[![Last Commit](https://img.shields.io/github/last-commit/brentmid/evernote-mcp-server)](https://github.com/brentmid/evernote-mcp-server/commits/main)
[![Issues](https://img.shields.io/github/issues/brentmid/evernote-mcp-server)](https://github.com/brentmid/evernote-mcp-server/issues)
[![Stars](https://img.shields.io/github/stars/brentmid/evernote-mcp-server?style=social)](https://github.com/brentmid/evernote-mcp-server/stargazers)

A local MCP server that connects Claude Desktop (or any MCP-compatible LLM) with your Evernote account, allowing contextual queries and searches over your notes using natural language.

## 🎯 Project Goal

Enable local, secure AI-assisted access to your Evernote notes. For example:

> "Summarize all my Evernotes regarding my Sea Pro boat."

This project allows the LLM to send MCP calls like `createSearch`, `getNote`, and `getNoteContent`, which are translated into API calls to Evernote. The response is returned to the LLM in a structured format.

## 🚀 What's New in v2.0+

**v2.0.0: Production-Ready Docker Deployment**
- 🐳 **One-command setup**: `docker-compose up` for instant deployment
- 🔐 **Persistent authentication**: OAuth tokens survive container restarts
- 🛡️ **Security-first**: Red Hat Hummingbird minimal base images with zero CVEs
- ⚡ **Optimized builds**: Multi-stage Docker builds for minimal production footprint
- 🔧 **Auto-configuration**: SSL certificates and environment setup handled automatically

**v2.0.1: Enhanced MCP Protocol Support**
- 🌐 **Remote MCP Server**: HTTP/JSON-RPC 2.0 support for containerized Claude Desktop integration
- 🔄 **Dual Integration Modes**: Choose between local stdin/stdout or remote HTTPS integration
- 📋 **MCP Specification Compliance**: Updated tool definitions and method names to match official MCP spec
- 🎯 **Intelligent Responses**: Human-readable summaries instead of raw JSON dumps
- 🌍 **Cross-Platform Compatibility**: Overcomes Docker stdin/stdout limitations for Windows/Linux

**v2.1.0: Container Stability and Error Resilience**
- 🛡️ **Global Error Handling**: Added uncaught exception and unhandled rejection handlers to prevent process crashes
- 🔄 **Container Stability**: Eliminated 2-3 minute restart cycles in containerized deployments (Podman/Docker)
- 📊 **Enhanced Error Logging**: Improved production error visibility with timestamps and PID tracking
- 🎯 **Graceful Degradation**: Server continues running even with authentication or API failures
- 🚫 **Removed Process Exits**: Replaced fatal process.exit() calls with graceful error handling
- ⚡ **Production Tested**: Container stability verified in production mode without DEV_MODE debug logging

**v2.1.1: Production Logging Optimization**
- 🧹 **Minimal Production Logging**: Cleaned up verbose debugging code for production deployments
- 🎯 **Essential Stability Components**: Maintained critical signal handlers and global error handling
- 📝 **DEV_MODE Conditional Logging**: Optional debug output only appears when DEV_MODE=true
- ⚡ **Event Loop Stability**: Minimal keepalive prevents Node.js from becoming inactive in containers
- ✅ **Verified Container Stability**: 10+ minute stability testing confirmed no restart cycles in production mode

## ✅ Features

- Supports **read-only Evernote access** (searching, reading, and listing notes)
- **OAuth 1.0a authentication** with browser auto-launch for secure authorization
- **Automatic token persistence** in .env file for seamless re-authentication
- **🆕 v1.1.0: Automatic token expiration detection** - Server checks token validity on startup
- **🆕 v1.1.0: Interactive re-authentication prompts** - User-friendly prompts when tokens expire
- **🆕 v1.1.0: Enhanced error handling** - Specific EDAMUserException error code reporting
- **🆕 v1.1.0: Proactive token management** - Prevents API failures from expired credentials
- **🆕 v1.1.1: Automatic .env token persistence** - Tokens saved to .env file automatically (replaced macOS Keychain for cross-platform compatibility)
- **🆕 v1.1.2: Security hardening** - Zero CVEs with npm overrides for vulnerable dependencies
- **🆕 v2.0.0: Production-ready Docker deployment** - Full containerization with Chainguard secure images
- **🆕 v2.0.1: Enhanced MCP protocol compliance** - Remote HTTP/JSON-RPC server support and intelligent response formatting
- **🆕 v2.1.0: Container stability improvements** - Eliminated restart cycles with global error handling and graceful degradation
- **🆕 v2.1.1: Production logging optimization** - Clean minimal logging for production with DEV_MODE conditional debug output
- **HTTPS-only server** with self-signed certificates for local development
- Designed to work with **Claude Desktop MCP integrations**, with future-proofing for other LLMs (e.g., ChatGPT Desktop)
- **Configurable debug logging** via `DEV_MODE` environment variable with automatic token redaction for security
- Easy to extend later for note creation, updates, or deletion

## 🧰 Tech Stack

- Node.js + Express with HTTPS
- Evernote API (OAuth 1.0a + REST)
- Environment variable token storage with dotenv
- MCP protocol compliance
- Docker containerization with Chainguard secure base images

## 🗝️ Authentication

Evernote uses OAuth 1.0a (not OAuth 2.0) for API authentication:

- **First-time setup**: Browser-based OAuth 1.0a flow with automatic token exchange
- **Token storage**: Access tokens automatically saved to .env file for persistence
- **Automatic reuse**: Stored tokens are automatically loaded and used for subsequent API calls
- **Production environment**: Uses Evernote production API (sandbox decommissioned)
- **Cross-platform compatibility**: Works on macOS, Linux, and Windows with file-based token storage

## 🔒 Security

### Vulnerability Management

This project uses npm `overrides` to ensure all dependencies use secure versions, eliminating nested vulnerable packages:

```json
{
  "overrides": {
    "ws": "^8.18.3"
  }
}
```

**Why overrides are needed**: Dependencies like `thrift` may bundle their own vulnerable versions (e.g., `ws@5.2.4`) in nested `node_modules`. Standard npm updates only affect top-level dependencies, leaving vulnerable nested packages. The `overrides` field forces ALL instances of a package to use the secure version.

**Security features**:
- ✅ Zero CVEs in Docker vulnerability scans
- ✅ Chainguard secure base images (distroless, minimal attack surface) 
- ✅ HTTPS-only with certificate validation
- ✅ Read-only Evernote API access
- ✅ No third-party data transmission except to Evernote
- ✅ Automatic token redaction in debug logs

## 💻 Setup

### 🐳 Docker Deployment (Recommended)

**Quick Start**:
```bash
git clone https://github.com/brentmid/evernote-mcp-server.git
cd evernote-mcp-server
cp .env.example .env
# Edit .env with your Evernote API credentials
docker-compose up --build
```

**What you get**:
- ✅ Instant setup with zero local dependencies
- ✅ Production-ready Chainguard secure base images
- ✅ Automatic SSL certificate generation
- ✅ OAuth tokens persist across container restarts
- ✅ Zero CVE security scanning

### 🛠️ Local Development

**Requirements**:
- Node.js 18+ 
- OpenSSL for SSL certificate generation
- Evernote developer account and API credentials
- **Docker Desktop** (for containerized deployment)
- GitHub SSH key configured via 1Password (for development)
- Visual Studio Code with GitHub Copilot and Copilot Chat extensions (for development)

### Clone & Setup

```bash
git clone git@github.com:brentmid/evernote-mcp-server.git
cd evernote-mcp-server
npm install
```

#### Get Evernote API Credentials

1. **Register your application** at [Evernote Developers](https://dev.evernote.com/)
2. **Create a new app** and note your Consumer Key and Consumer Secret
3. **Set callback URL** to `https://localhost:3443/oauth/callback`

#### Configure Environment Variables

Set your Evernote API credentials:

```bash
# Add to your shell profile (.zshrc, .bashrc, etc.)
export EVERNOTE_CONSUMER_KEY="your-consumer-key-here"
export EVERNOTE_CONSUMER_SECRET="your-consumer-secret-here"

# Optional: Enable detailed debug logging for development
export DEV_MODE=true

# Reload your shell or run:
source ~/.zshrc
```

#### Generate SSL Certificates

The server runs over HTTPS and requires SSL certificates for local development:

```bash
# Create certificate directory
mkdir cert

# Generate self-signed certificate (valid for 365 days)
openssl req -x509 -newkey rsa:4096 -keyout cert/localhost.key -out cert/localhost.crt -days 365 -nodes -subj "/C=US/ST=Local/L=Local/O=Local/OU=Local/CN=localhost"
```

#### Start the Server

```bash
npx node index.js
```

The server will start on `https://localhost:3443`. Your browser will show a security warning for the self-signed certificate - this is normal for local development.

### ⏰ Token Expiration Handling (v1.1.0+)

The server now automatically checks for expired authentication tokens on startup:

**For Valid Tokens:**
```
🚀 Starting Evernote MCP Server...
🔍 Token status: Token valid until 8/21/2025, 1:20:00 AM
✅ Using existing valid authentication tokens
✅ Authentication ready
🌐 Evernote MCP Server listening on HTTPS port 3443
```

**For Expired Tokens:**
```
🚀 Starting Evernote MCP Server...
🔍 Token status: Token expired on 6/16/2025, 9:55:49 PM
⚠️  Your Evernote authentication tokens have expired.
Would you like to re-authenticate now? (y/N): y
🧹 Re-authenticating with Evernote...
🚀 Starting Evernote OAuth flow...
```

If you choose `N` (no), the server will exit gracefully with instructions to restart and choose `y` when ready to re-authenticate.

### First Run & OAuth Flow

1. **Generate SSL certificates** (see setup instructions above)
2. **Set environment variables** with your Evernote API credentials
3. **Start the server**: `npx node index.js`
4. **Complete OAuth authentication**:
   - Server automatically opens your browser to Evernote's authorization page
   - Accept the self-signed certificate warning in your browser
   - Log in to your Evernote account and authorize the application
   - You'll be redirected back to the server with a success message
   - Access token is automatically stored in .env file for future use

#### OAuth Flow Details

The server implements Evernote's OAuth 1.0a flow:

1. **Request Token**: Server generates temporary request token
2. **User Authorization**: Browser opens Evernote authorization URL
3. **Callback**: User authorizes app, Evernote redirects to callback URL
4. **Access Token**: Server exchanges request token for permanent access token
5. **Storage**: Access token stored securely in .env file

**Note**: The server uses Evernote's production environment (sandbox has been decommissioned by Evernote).

## 🐳 Docker Deployment

### Quick Start with Docker

The easiest way to run the Evernote MCP server is using Docker with the provided Chainguard-based secure container image:

```bash
# Clone the repository
git clone https://github.com/brentmid/evernote-mcp-server.git
cd evernote-mcp-server

# Copy environment template
cp .env.example .env

# Edit .env with your Evernote API credentials
vim .env

# Build and run the container
docker-compose up --build
```

The server will be available at `https://localhost:3443`.

### Docker Architecture

The Docker setup uses **Chainguard's secure Node.js base image** (`cgr.dev/chainguard/node:latest`) which provides:

- **Zero vulnerabilities** - Minimal attack surface with only essential packages
- **Signed container images** - All images signed with Sigstore for supply chain security
- **SBOM included** - Software Bill of Materials generated at build time
- **Non-root execution** - Containers run as non-root user for enhanced security
- **Minimal size** - Only 145MB compared to 1.12GB for standard Node.js images

### Docker Files Overview

The Docker setup includes several key files:

#### `Dockerfile`
Multi-stage build process:
- **Builder stage**: Uses `cgr.dev/chainguard/node:latest-dev` with git and openssl for setup
- **Production stage**: Uses minimal `cgr.dev/chainguard/node:latest` for runtime
- **GitHub integration**: Clones latest code directly from your GitHub repository
- **SSL certificates**: Automatically generates self-signed certificates for HTTPS
- **Security**: Runs as non-root user with minimal dependencies

#### `docker-compose.yml`
Orchestration configuration:
- **Environment variables**: Loads from `.env` file or environment
- **Port mapping**: Exposes HTTPS port 3443 to host
- **Health checks**: Built-in container health monitoring
- **Restart policy**: Automatically restarts on failure
- **Build arguments**: Configurable GitHub repository URL

#### `.dockerignore`
Optimizes build context by excluding:
- Node modules, logs, and development files
- Git repository data and documentation
- Test files and configurations
- SSL certificates (generated in container)

#### `.env.example`
Template for environment variables:
```env
EVERNOTE_CONSUMER_KEY=your_consumer_key_here
EVERNOTE_CONSUMER_SECRET=your_consumer_secret_here
DEV_MODE=false
```

### Docker Build Options

#### Option 1: Docker Compose (Recommended)
```bash
# Build and run with compose
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop and remove
docker-compose down
```

#### Option 2: Direct Docker Build
```bash
# Build image
docker build \
  --build-arg GITHUB_REPO_URL=https://github.com/yourusername/evernote-mcp-server.git \
  -t evernote-mcp-server .

# Run container
docker run -d \
  --name evernote-mcp \
  -p 3443:3443 \
  -e EVERNOTE_CONSUMER_KEY=your_key \
  -e EVERNOTE_CONSUMER_SECRET=your_secret \
  evernote-mcp-server

# View logs
docker logs -f evernote-mcp
```

### Automated Container Updates

The repository includes `evernote-mcp-daily-rebuild.sh`, a shell script designed for daily automated rebuilds to keep your Chainguard base images up to date:

```bash
# Set up daily rebuild (example cron job)
0 2 * * * /path/to/your/evernote-mcp-server/evernote-mcp-daily-rebuild.sh >> /tmp/evernote-mcp-rebuild.log 2>&1
```

**What the script does:**
- Pulls the latest `cgr.dev/chainguard/node:latest` base image
- Rebuilds the container with `--no-cache` to ensure fresh dependencies
- Restarts the service with zero downtime using Docker Compose

**Security benefits:**
- Ensures you always have the latest security patches from Chainguard
- Maintains zero-CVE status with automated base image updates
- No manual intervention required for security updates

### Docker Configuration

#### Environment Variables
The container accepts these environment variables:
- `EVERNOTE_CONSUMER_KEY` - Your Evernote API consumer key (required)
- `EVERNOTE_CONSUMER_SECRET` - Your Evernote API consumer secret (required)
- `DEV_MODE` - Enable debug logging (optional, default: false)
- `NODE_ENV` - Node.js environment (set to production in container)

#### Volume Mounts (Optional)
For persistent token storage across container restarts:
```yaml
volumes:
  - ./tokens:/app/tokens  # If implementing file-based token storage
```

#### Health Checks
The container includes built-in health monitoring:
- **Endpoint**: Internal HTTPS health check on port 3443
- **Interval**: Every 30 seconds
- **Timeout**: 10 seconds
- **Retries**: 3 attempts before marking unhealthy
- **Start period**: 40 seconds for initial startup

### Docker Troubleshooting

#### Common Issues

**Build fails with "git not found":**
- Ensure your GitHub repository is public or configure authentication
- Check the `GITHUB_REPO_URL` build argument in docker-compose.yml

**SSL certificate errors:**
- Certificates are auto-generated in the container
- Your browser will show security warnings for self-signed certificates (normal)
- Accept the certificate warning to proceed

**Container health check failures:**
- Check container logs: `docker-compose logs evernote-mcp-server`
- Verify environment variables are set correctly
- Ensure Evernote API credentials are valid

**Container restart loops (every 2-3 minutes):**
- ✅ **RESOLVED** (August 5, 2025): Container stability issue fixed by optimized health check implementation
- ✅ **Root cause identified**: Node.js health check command was creating accumulating timeout processes
- ✅ **Solution**: Simplified Node.js health check with proper timeout handling eliminates process accumulation
- **Details**: See CLAUDE.md for complete investigation timeline and technical resolution analysis
- **Diagnostic Tools**: Use provided debugging scripts for similar issues (see Debugging section below)
- **Status**: Container running stable with proper health checks, no restart cycles detected

**OAuth flow issues in container:**
- Complete OAuth flow may require running the server locally first
- Container inherits tokens from host if using volume mounts
- Consider running `node index.js` locally first, then containerize

#### Docker Logs and Debugging

```bash
# View container logs
docker-compose logs -f evernote-mcp-server

# Enable debug mode
echo "DEV_MODE=true" >> .env
docker-compose up --build

# Execute commands in running container
docker-compose exec evernote-mcp-server sh

# Check container health
docker-compose ps
```

### Security Considerations

The Docker setup implements several security best practices:

- **Minimal base image**: Chainguard's distroless Node.js image
- **Non-root execution**: Container runs as `node` user (non-root)
- **HTTPS only**: All communication over secure HTTPS
- **Environment isolation**: Secrets passed via environment variables
- **Network security**: Only necessary port (3443) exposed
- **Supply chain security**: Signed base images with SBOMs

### Performance Optimization

Docker deployment offers several performance benefits:
- **Consistent environment**: Identical runtime across different machines
- **Resource limits**: Can set CPU/memory limits via docker-compose
- **Caching**: Docker layer caching speeds up rebuilds
- **Scaling**: Easy to run multiple instances behind a load balancer

## 🔗 Claude Desktop Integration

The server supports two integration methods with Claude Desktop:

### Method 1: Local stdin/stdout Integration (Original)

After completing the server setup above, configure Claude Desktop for direct process execution.

**Step 1: Locate Claude Desktop Configuration**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Step 2: Configure Local MCP Server**

Choose one of these configurations based on your setup:

**Option A: Direct Node.js execution (local development)**
```json
{
  "mcpServers": {
    "evernote": {
      "command": "node",
      "args": ["/path/to/your/evernote-mcp-server/mcp-server.js"],
      "env": {
        "EVERNOTE_CONSUMER_KEY": "your-actual-consumer-key",
        "EVERNOTE_CONSUMER_SECRET": "your-actual-consumer-secret"
      }
    }
  }
}
```

**Option B: Docker container execution (recommended for production)**
```json
{
  "mcpServers": {
    "evernote": {
      "command": "docker",
      "args": [
        "exec", "-i", "--tty=false",
        "evernote-mcp-server-evernote-mcp-server-1",
        "node", "mcp-server.js"
      ]
    }
  }
}
```

**Option C: Podman container execution (Docker alternative)**
```json
{
  "mcpServers": {
    "evernote": {
      "command": "podman",
      "args": [
        "exec", "-i", "--tty=false",
        "evernote-mcp-server_evernote-mcp-server_1",
        "node", "mcp-server.js"
      ]
    }
  }
}
```

**📁 Example Configuration File**

An example `claude_desktop_config.json` file is included in this repository. To use it:

1. **Copy the example**: `cp claude_desktop_config.json ~/Library/Application\ Support/Claude/claude_desktop_config.json`
2. **Customize for your setup**:
   - **Docker users**: Update the container name if different (check with `docker ps`)
   - **Podman users**: Replace `docker` with `podman` and update container name (check with `podman ps`)
   - **Local setup**: Use Option A configuration instead
3. **Restart Claude Desktop** completely (⌘+Q then reopen)

**Container Name Customization**:
- **Default Docker Compose**: `evernote-mcp-server-evernote-mcp-server-1`
- **Default Podman Compose**: `evernote-mcp-server_evernote-mcp-server_1` (note: underscores instead of hyphens)
- **Custom container name**: Check your running containers with `docker ps` or `podman ps`
- **Different runtime**: Replace `docker` with `podman`, `nerdctl`, etc.

### Method 2: Remote HTTP/JSON-RPC Integration (New in v2.0.1)

For containerized deployments or cross-platform compatibility.

**Step 1: Start Containerized Server**
```bash
docker-compose up -d
```

**Step 2: Configure Remote MCP Server**
```json
{
  "mcpServers": {
    "evernote": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-everything",
        "--url", "https://localhost:3443/mcp"
      ],
      "env": {
        "NODE_TLS_REJECT_UNAUTHORIZED": "0"
      }
    }
  }
}
```

**Benefits of Remote Integration:**
- ✅ Works with Docker containers (overcomes stdin/stdout limitations)
- ✅ Cross-platform compatibility (Windows, Linux, macOS)
- ✅ Can connect to remote server instances
- ✅ Better for production deployments

**Important**: Replace the placeholder values with your actual Evernote API credentials.

### Step 3: Restart Claude Desktop

1. **Quit Claude Desktop** completely (⌘+Q or right-click dock icon → Quit)
2. **Reopen Claude Desktop**
3. **Verify connection**: You should see Evernote tools available in the interface

### Step 4: Test Integration

Try asking Claude to search your Evernote notes:

> "Search my Evernote for notes about project planning"

> "Find my most recent meeting notes in Evernote"

> "Show me all Evernote notes tagged with 'important'"

### Available Claude Desktop Tools

Once connected, Claude Desktop will have access to these Evernote tools:

- **`createSearch`**: Search notes using natural language queries
- **`getSearch`**: Retrieve cached search results
- **`getNote`**: Get detailed metadata for a specific note
- **`getNoteContent`**: Retrieve full note content in text, HTML, or ENML format

### Troubleshooting Claude Desktop Connection

**Connection fails with "upstream connect error":**
- Restart Claude Desktop completely (⌘+Q then reopen)
- Check credentials are correctly set in `claude_desktop_config.json`
- Ensure the server path in `args` is absolute and correct (`mcp-server.js` not `index.js`)
- Test MCP server standalone: `echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | node mcp-server.js`

**Tools not visible:**
- Wait a few seconds after Claude Desktop restart
- Check Claude Desktop console for error messages
- Verify OAuth authentication completed successfully by running `node index.js` first

**Authentication errors:**
- Complete OAuth flow by running the HTTPS server standalone first: `node index.js`
- **🆕 v1.1.0**: Server now automatically detects expired tokens and prompts for re-authentication
- Check tokens are stored in .env file or environment variables
- Verify Evernote API credentials are valid and active
- **🆕 v1.1.0**: If you get `EDAMUserException` errors, restart the server to check token expiration

### Configuration Alternatives

**Option 1: Environment Variables (Recommended)**
Set credentials in your shell environment and remove the `env` section from Claude Desktop config:

```bash
# In your ~/.zshrc or ~/.bashrc
export EVERNOTE_CONSUMER_KEY="your-consumer-key"
export EVERNOTE_CONSUMER_SECRET="your-consumer-secret"
```

Then use this simpler Claude Desktop configuration:
```json
{
  "mcpServers": {
    "evernote": {
      "command": "node",
      "args": ["/path/to/your/evernote-mcp-server/mcp-server.js"]
    }
  }
}
```

**Option 2: Launch from Terminal**
Open Claude Desktop from a terminal where environment variables are set:
```bash
# Set credentials
export EVERNOTE_CONSUMER_KEY="your-key"
export EVERNOTE_CONSUMER_SECRET="your-secret"

# Launch Claude Desktop
open -a "Claude"
```

## 🐛 Debug & Development

### Debug Logging

The server supports detailed debug logging via the `DEV_MODE` environment variable:

```bash
# Enable detailed debug logging
export DEV_MODE=true

# Or run with debug mode for a single session
DEV_MODE=true npx node index.js
```

**Debug Features:**
- **MCP Tool Invocations**: Detailed logging of all tool calls with timestamps
- **Evernote API Requests**: Full request payloads and parameters  
- **Evernote API Responses**: Response summaries and error details
- **Token Redaction**: Automatic redaction of sensitive information (tokens, secrets, keys)
- **Error Details**: Enhanced error logging with raw response data
- **Stderr Logging**: All debug messages go to stderr to avoid interfering with JSON-RPC protocol

**Normal vs Debug Mode:**
- **Normal**: Basic logging with key information only (to stderr)
- **Debug**: Detailed JSON logging with redacted sensitive data (to stderr)

**Important**: All emoji-based debug messages are sent to stderr, not stdout, ensuring clean JSON-RPC communication with Claude Desktop.

Example debug output:
```
🔧 [2025-06-17T00:07:56.351Z] MCP Tool Invocation: createSearch
📥 Args: {
  "query": "Sea Pro boat",
  "authenticationToken": "[REDACTED:19chars]"
}
🌐 [2025-06-17T00:07:57.123Z] Evernote API Request: /findNotesMetadata
📤 Request: {
  "filter": { "words": "Sea Pro boat" },
  "authenticationToken": "[REDACTED:19chars]"
}
```

### Container Debugging Tools

This repository includes comprehensive diagnostic scripts for troubleshooting container issues. These were developed during the investigation of container restart loops and are useful for future debugging.

#### Available Diagnostic Scripts

**1. `catch_sigterm_sender.sh` - SIGTERM Source Detection**
```bash
./catch_sigterm_sender.sh
```
- **Purpose**: Identifies which process sends SIGTERM signals to containers
- **Key Features**: Real-time process monitoring, SIGTERM correlation, system log analysis
- **Investigation Results**: Successfully identified podman-remote as health check executor
- **Usage**: Run when containers are receiving unexpected SIGTERM signals

**2. `test_manual_healthcheck.sh` - Health Check Reliability Testing**
```bash
./test_manual_healthcheck.sh
```
- **Purpose**: Tests health check reliability across multiple methods
- **Test Methods**: curl (host→container), Node.js (host→container), Node.js (container-internal)
- **Key Discovery**: Revealed 50% failure rate in host-based health checks vs 100% success for container-internal checks
- **Usage**: Run when containers show "unhealthy" status or health check failures

**3. `monitor_app_failure.sh` - Runtime Application Monitoring**
```bash
./monitor_app_failure.sh
```
- **Purpose**: Monitors Node.js application behavior during container failure cycles
- **Monitoring**: Memory usage, process state, resource usage, application logs
- **Key Discovery**: Detected accumulating timeout processes causing container crashes
- **Usage**: Run to capture detailed failure data during container restart cycles

**4. `analyze_app_code.sh` - Application Code Analysis**
```bash
./analyze_app_code.sh
```
- **Purpose**: Static analysis of application code for common failure patterns
- **Analysis**: Memory leaks, event listeners, error handlers, SSL issues, Docker configuration
- **Key Features**: Automated scanning for problematic code patterns
- **Usage**: First-line analysis tool for identifying potential application issues

#### Debugging Methodology

For container stability issues, follow this systematic approach:

**Phase 1: Code Analysis**
```bash
./analyze_app_code.sh
```
Check for obvious issues in application code before runtime investigation.

**Phase 2: Health Check Validation**
```bash
./test_manual_healthcheck.sh
```
Validate health check reliability across different methods to identify network or implementation issues.

**Phase 3: SIGTERM Source Detection**
```bash
./catch_sigterm_sender.sh
```
If containers are restarting, identify what process is sending termination signals.

**Phase 4: Runtime Monitoring**
```bash
./monitor_app_failure.sh
```
For ongoing issues, capture detailed runtime behavior during failure cycles.

#### Diagnostic Script Features

**All scripts include:**
- ✅ **Comprehensive documentation** with purpose, usage, and investigation results
- ✅ **Timestamped logging** for precise event correlation
- ✅ **No sensitive information** - safe for public GitHub repositories
- ✅ **Configurable parameters** - easily adaptable to different container setups
- ✅ **Background monitoring** - capture data without interfering with normal operation
- ✅ **Analysis guidance** - built-in tips for interpreting results

**Example usage for container restart investigation:**
```bash
# Quick health check validation
./test_manual_healthcheck.sh

# If health checks are failing, identify the SIGTERM sender
./catch_sigterm_sender.sh

# For deeper analysis, monitor runtime behavior
./monitor_app_failure.sh
```

#### Investigation Results Summary

**Container restart loop issue (August 5, 2025):**
- ✅ **Root Cause**: Node.js health check command creating accumulating timeout processes
- ✅ **Detection Method**: Runtime monitoring script revealed process accumulation pattern
- ✅ **Solution**: Simplified health check with proper timeout handling 
- ✅ **Result**: Container stability restored, no restart cycles

These tools provide a systematic approach to container debugging and can be adapted for other Node.js containerized applications.

## 🧪 Testing

The project includes a comprehensive test suite with **38 tests** covering all critical functionality:

### Test Commands

```bash
# Run all tests
npm test

# Run tests with coverage report  
npm run test:coverage

# Run tests in watch mode (for development)
npm run test:watch
```

### Test Structure

```
tests/
├── auth.test.js        # OAuth 1.0a authentication tests
├── server.test.js      # Express server route tests
├── integration.test.js # End-to-end workflow tests
├── setup.js           # Global test configuration
└── jest.config.js     # Jest configuration
```

### Test Coverage Details

#### 🔐 **auth.test.js** - OAuth Authentication (12 tests)
- **OAuth Parameter Generation**: Validates required OAuth 1.0a parameters
- **HMAC-SHA1 Signature Generation**: Tests cryptographic signatures with known test vectors
- **Token Storage**: Store/retrieve tokens in .env file and environment variables
- **Authentication Flow**: Existing token reuse vs new OAuth flow initiation
- **Configuration Validation**: Evernote endpoints and environment variables
- **Error Handling**: Network failures and environment variable access errors

#### 🌐 **server.test.js** - Express Server Routes (15 tests)
- **Health Check** (`GET /`): Server status and JSON responses
- **OAuth Callback** (`GET /oauth/callback`): 
  - Successful token exchange
  - Missing parameter validation
  - Invalid OAuth state handling
  - Error scenarios
- **MCP Endpoint** (`POST /mcp`):
  - Authenticated request handling
  - Unauthenticated request rejection (401)
  - JSON body parsing
  - Internal error handling
- **Content-Type Handling**: JSON validation and malformed request handling
- **Route Validation**: 404 errors for unknown routes and wrong HTTP methods

#### 🔄 **integration.test.js** - End-to-End Workflows (11 tests)
- **Complete OAuth Flow**: Simulated request token → authorization → access token exchange
- **OAuth State Management**: State preservation between request and callback phases
- **Browser Integration**: System browser launching for authorization
- **Error Scenarios**: Network failures, invalid responses, environment variable errors
- **Configuration Validation**: Endpoint URLs and credential validation
- **Token Lifecycle**: Storage, retrieval, and reuse patterns

### Coverage Requirements

The test suite maintains high coverage standards:
- **Branches**: 70% minimum coverage
- **Functions**: 80% minimum coverage  
- **Lines**: 80% minimum coverage
- **Statements**: 80% minimum coverage

### Test Features

- **Comprehensive Mocking**: All external dependencies (environment variables, browser, SSL, network)
- **Environment Isolation**: Test-specific environment variables prevent interference
- **Real Crypto Testing**: Actual HMAC-SHA1 signature validation with known test vectors
- **Error Scenario Coverage**: Network failures, malformed responses, access denials
- **Integration Validation**: Full OAuth workflow simulation without external API calls

### Running Specific Tests

```bash
# Run only authentication tests
npm test auth.test.js

# Run only server tests  
npm test server.test.js

# Run only integration tests
npm test integration.test.js

# Run tests matching a pattern
npm test -- --testNamePattern="OAuth"
```

The test suite ensures OAuth 1.0a implementation correctness, validates all server endpoints, and provides confidence in the authentication flow without requiring actual Evernote API calls or SSL certificates during testing. Claude Desktop can also be used to validate that your MCP server responds correctly to natural language prompts.

## 📋 Changelog

### v2.2.1 (Latest)
- Migrated container base images from Chainguard to Red Hat Project Hummingbird

### v2.2.0
- Fixed token expiration date parsing (removed erroneous *1000 multiplication)
- Fixed command injection vulnerability in openBrowser function

### v2.1.3
**🛡️ Reliable Health Check Implementation:**
- **Process-Based Health Check** - Implemented simple `/proc/1/stat` filesystem check avoiding gvproxy network issues
- **100% Health Check Reliability** - Verified 20/20 test passes with zero false positive failures
- **Container Stability Confirmed** - 8+ minutes stable operation with proper health monitoring restored
- **Generous Retry Configuration** - 45s interval, 15s timeout, 5 retries, 60s start period to prevent false positives
- **External Monitoring Compatible** - Provides standard Docker/Podman "(healthy)" status for monitoring systems
- **Network-Independent** - Eliminates gvproxy port forwarding dependencies that caused original restart loops

### v2.1.2
**🔧 Container Health Check Fix:**
- **Container Restart Loop Resolution** - Fixed 2-3 minute restart cycles by identifying unreliable health checks as root cause
- **Health Check Reliability Investigation** - Comprehensive diagnostic testing revealed occasional health check failures triggering container restarts
- **Temporary Health Check Disable** - Disabled problematic health checks to eliminate false positive failures
- **Container Stability Verified** - 8+ minute stable operation without restart cycles (previously failed every 2-3 minutes)
- **Production Impact** - Resolves frequent container restarts that affected service availability
- **Diagnostic Methodology** - Systematic testing approach to isolate health check vs application issues

### v2.1.1
**🧹 Production Logging Optimization:**
- **Minimal Production Logging** - Removed verbose debugging code (memory usage, private Node.js APIs)
- **Essential Stability Maintained** - Kept critical signal handlers and global error handling from v2.1.0
- **DEV_MODE Conditional** - Debug logging only appears when `DEV_MODE=true` environment variable is set
- **Event Loop Stability** - Minimal keepalive function prevents Node.js from becoming inactive in containers
- **Production Testing** - Verified 10+ minute container stability without restart cycles
- **Clean Production Logs** - Only essential startup and error messages appear in production mode

**🔧 Technical Implementation:**
- Replaced verbose 30-second heartbeat with minimal keepalive function
- Maintained SIGTERM, SIGINT, SIGQUIT signal handlers for production debugging
- Removed memory usage logging and private Node.js API calls (_getActiveHandles, _getActiveRequests)
- Added conditional logging: `if (process.env.DEV_MODE === 'true')` for debug output
- Preserved uncaught exception and unhandled rejection handlers from v2.1.0

**✅ Testing Results:**
- Container ran stably for 8+ minutes without restarts (target: 10+ minutes achieved)
- No restart cycles detected in production mode (DEV_MODE=false)
- Logs confirmed minimal output - only startup messages, no verbose heartbeat
- Container maintained "healthy" status throughout testing period

### v2.0.1
**🆕 Enhanced MCP Protocol Support:**
- **Remote MCP Server Support** - Added HTTP/JSON-RPC 2.0 protocol support at `/mcp` endpoint
- **Dual Integration Modes** - Support for both local stdin/stdout and remote HTTPS integration
- **MCP Specification Compliance** - Updated tool definitions and method names to match official MCP spec
- **Enhanced Tool Definitions** - Added `type: 'tool'` field and changed `inputSchema` to `parameters`
- **Intelligent Response Formatting** - Human-readable summaries instead of raw JSON dumps
- **Cross-Platform Docker Integration** - Overcomes stdin/stdout limitations for containerized deployments
- **CORS Support** - Proper CORS headers and OPTIONS handling for remote servers
- **Format Detection** - Automatic detection between legacy and JSON-RPC request formats

**🔧 Technical Improvements:**
- Dual-format endpoint routing with backward compatibility
- JSON-RPC 2.0 protocol implementation with error handling
- Enhanced user experience with contextual response summaries
- Required parameter validation (e.g., query parameter for createSearch)

### v2.0.0
**🐳 Production-Ready Docker Deployment:**
- Full containerization with Chainguard secure base images
- Zero-CVE security scanning and npm overrides
- OAuth token persistence across container restarts
- Multi-stage Docker builds for optimized production images

### v1.1.0
**🆕 New Features:**
- **Automatic token expiration detection** - Server checks token validity on startup
- **Interactive re-authentication prompts** - User-friendly prompts for expired tokens  
- **Enhanced error handling** - Specific EDAMUserException error code reporting
- **Proactive token management** - Prevents API failures from expired credentials

**🔧 Technical Improvements:**
- Added `checkTokenExpiration()` function with comprehensive validation
- Added `askUserConfirmation()` for interactive user prompts
- Added `clearStoredTokens()` for safe token cleanup
- Enhanced server startup flow with expiration checks
- Improved error messaging throughout authentication flow

**🧪 Testing:**
- All 38 existing tests continue to pass
- Token expiration functionality tested and validated

### v1.0.0 
- Initial release with full OAuth 1.0a implementation
- Complete Apache Thrift protocol integration
- Four MCP tools: createSearch, getSearch, getNote, getNoteContent
- Comprehensive test suite (38 tests)
- Claude Desktop MCP integration
- Cross-platform .env file token storage
- HTTPS server with self-signed certificates

## Trust Model and Data Privacy

This server runs entirely on your local machine as a stdio process.
No data passes through third-party servers.

### What leaves your machine and where

| Data | Destination | When |
|---|---|---|
| Consumer Key + Secret | `api.evernote.com` | OAuth setup only |
| Evernote access token | `api.evernote.com` | With every API request |
| Note titles, content, tags | `api.evernote.com` → returned to Claude Code | When reading or searching |
| Note content to create | Claude Code → this server → `api.evernote.com` | When createNote is called |
| Any note content in conversation | Anthropic's API | Same as anything typed to Claude directly |

### What this server cannot do

- The API endpoint is hardcoded to `https://api.evernote.com` — the server cannot
  contact any other URL
- No data is logged to files or sent to any analytics or telemetry service
- The source code is fully auditable: all logic is in `tools/*.js` and `mcp-server.js`

### Write operations gate

Write tools only appear in Claude's toolset when explicitly enabled in `.env`.
With `EVERNOTE_WRITE_OPS=` (empty), the server is functionally read-only even if
the Evernote API key has Full Access permissions.

### Evernote API key scope note

A Full Access key is required for write operations. This means the key has technical
permission to read, create, update, and delete notes — but this server only exposes
the operations listed in `EVERNOTE_WRITE_OPS`. Setting `EVERNOTE_WRITE_OPS=create`
means neither update nor delete tools will exist.

## 🔒 Security

- No third-party data sent anywhere except to Evernote via HTTPS.
- Authentication tokens stored securely in .env files and environment variables.
- Signing key usage (SSH-based GPG) is enforced on all commits.

## 📄 License

Original code licensed under MIT by brentmid. See `LICENSE` for full terms.
Additions in this fork licensed under MIT by Elaine Harvey. See `LICENSE-ADDITIONS` for full terms.

## 🙋‍♂️ Author

Maintained by [@brentmid](https://github.com/brentmid).  
This project is both a functional integration and an educational experience in MCP, Evernote’s API, GitHub workflows, and modern Node.js practices.

---

Pull requests and contributions are welcome after MVP completion. Check the Issues tab for known tasks.