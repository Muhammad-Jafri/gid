#!/usr/bin/env bash
set -euo pipefail

REPO="Muhammad-Jafri/gid"
INSTALL_DIR="${HOME}/.local/bin"
SHARE_DIR="${HOME}/.local/share/gid"

# Detect OS and architecture
OS="$(uname -s)"
ARCH="$(uname -m)"

case "$OS" in
  Linux)  OS_NAME="linux" ;;
  Darwin) OS_NAME="darwin" ;;
  *)
    echo "Error: Unsupported OS: $OS" >&2
    exit 1
    ;;
esac

case "$ARCH" in
  x86_64)        ARCH_NAME="x64" ;;
  arm64|aarch64) ARCH_NAME="arm64" ;;
  *)
    echo "Error: Unsupported architecture: $ARCH" >&2
    exit 1
    ;;
esac

BINARY_NAME="gid-${OS_NAME}-${ARCH_NAME}"
DOWNLOAD_URL="https://github.com/${REPO}/releases/latest/download/${BINARY_NAME}"

echo "Installing gid..."
echo "  Platform: ${OS_NAME}-${ARCH_NAME}"

mkdir -p "$INSTALL_DIR"
mkdir -p "$SHARE_DIR"

# Download binary
echo "  Downloading binary..."
if command -v curl &>/dev/null; then
  curl -fsSL "$DOWNLOAD_URL" -o "${INSTALL_DIR}/gid"
elif command -v wget &>/dev/null; then
  wget -qO "${INSTALL_DIR}/gid" "$DOWNLOAD_URL"
else
  echo "Error: curl or wget is required." >&2
  exit 1
fi
chmod +x "${INSTALL_DIR}/gid"

# Write credential helper
cat > "${INSTALL_DIR}/gid-cred-helper" <<'EOF'
#!/usr/bin/env bash
case "${1}" in
  get)
    echo "username=${GID_GITHUB_USERNAME}"
    echo "password=${GID_GITHUB_TOKEN}"
    ;;
esac
EOF
chmod +x "${INSTALL_DIR}/gid-cred-helper"

# Write shell integration
cat > "${SHARE_DIR}/shell-integration.sh" <<'EOF'
# gid shell integration

gid() {
  if [[ "$1" == "use" ]]; then
    if [[ -z "$2" ]]; then
      echo "Usage: gid use <profile-name>" >&2
      return 1
    fi
    local output
    output=$(command gid use "$2") || return 1
    eval "$output"
    echo "Switched to profile: $2"
  else
    command gid "$@"
  fi
}

# Auto-activate last used profile in new shell sessions
_gid_autoload() {
  local active="${HOME}/.config/gid/active"
  [[ -f "$active" ]] || return 0
  local profile
  profile=$(cat "$active")
  [[ -n "$profile" ]] || return 0
  local output
  output=$(command gid use "$profile" 2>/dev/null) || return 0
  eval "$output"
}
_gid_autoload
EOF

# Add shell integration to rc files
INTEGRATION_LINE='source "${HOME}/.local/share/gid/shell-integration.sh"'

add_to_rc() {
  local rc="$1"
  if [[ -f "$rc" ]]; then
    if grep -q "gid shell integration" "$rc"; then
      echo "  Shell integration already present in $rc"
    else
      printf '\n# gid shell integration\n%s\n' "$INTEGRATION_LINE" >> "$rc"
      echo "  Added shell integration to $rc"
    fi
  fi
}

add_to_rc ~/.bashrc
add_to_rc ~/.zshrc

# Warn if ~/.local/bin is not in PATH
if [[ ":$PATH:" != *":${HOME}/.local/bin:"* ]]; then
  echo ""
  echo "Warning: ~/.local/bin is not in your PATH. Add this to your shell rc:"
  echo '  export PATH="$HOME/.local/bin:$PATH"'
fi

echo ""
echo "Done! Restart your shell or run:"
echo "  source ~/.bashrc   # bash"
echo "  source ~/.zshrc    # zsh"
echo ""
echo "Get started:"
echo "  gid add personal"
echo "  gid add work"
echo "  gid use personal"
