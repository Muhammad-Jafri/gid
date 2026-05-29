# gid

Switch between Git identities (name, email, GitHub token, SSH key) per shell session.

## Install

```bash
curl -fsSL https://raw.githubusercontent.com/Muhammad-Jafri/gid/main/install.sh | bash
```

Supports Linux and macOS (x64 and ARM64). Restart your shell after installing.

## Usage

```bash
gid add personal       # create a profile
gid use personal       # switch to it in the current shell
gid list               # list all profiles (* marks active)
gid show personal      # show profile details (token masked)
gid remove personal    # delete a profile
gid current            # print the active profile name
```

The last used profile is automatically activated in new shell sessions.

## How it works

`gid use <profile>` sets `GIT_AUTHOR_*`, `GIT_COMMITTER_*`, and a per-session credential helper so all git operations in that shell use the selected identity — without touching your global `~/.gitconfig`.

## Requirements

- Linux or macOS (x64 / ARM64)
- bash or zsh
