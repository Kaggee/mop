#!/usr/bin/env bash
# Convenience launcher for wowsims-mop dev environment.
# Sources nvm, sets up Go/protoc PATHs, then runs whatever you pass in.
# Usage:
#   ./dev.sh                  -> WATCH=1 make devmode (best for vibe coding, sub-second TS reload)
#   ./dev.sh host             -> make host (rebuild + serve at http://localhost:8080)
#   ./dev.sh watch            -> WATCH=1 make host (watcher version of host)
#   ./dev.sh test             -> make test
#   ./dev.sh <anything else>  -> passes through, e.g. ./dev.sh make proto

set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 22 > /dev/null

export PATH="$PATH:$HOME/go-install/go/bin:$HOME/go/bin:$HOME/protoc/bin"
export GOPATH="$HOME/go"

case "${1:-}" in
  ""|devmode)
    WATCH=1 make devmode
    ;;
  host)
    make host
    ;;
  watch)
    WATCH=1 make host
    ;;
  test)
    make test
    ;;
  *)
    "$@"
    ;;
esac
