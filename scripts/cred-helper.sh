#!/usr/bin/env bash
# Git credential helper for gid.
# Reads GID_GITHUB_USERNAME and GID_GITHUB_TOKEN set by "gid use <profile>".
case "${1}" in
  get)
    echo "username=${GID_GITHUB_USERNAME}"
    echo "password=${GID_GITHUB_TOKEN}"
    ;;
esac
