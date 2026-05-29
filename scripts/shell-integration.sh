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
