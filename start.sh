#!/bin/sh

# Start both backend (Go API) and frontend (Vite React client) in parallel from the project root.
# Logs for each service are prefixed for clarity.

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Ensure frontend dependencies are installed
if [ ! -d "web-client/node_modules" ]; then
  echo "${CYAN}Installing frontend dependencies...${NC}"
  (cd web-client && npm install)
fi

# Ensure .env exists for backend
if [ ! -f "api/.env" ]; then
  echo "${CYAN}Creating empty api/.env file...${NC}"
  touch api/.env
fi

# Start backend
echo "${CYAN}Starting backend (Go API)...${NC}"
(cd api && go run cmd/api/main.go) 2>&1 | sed "s/^/[$(date +%H:%M:%S)] ${GREEN}BACKEND${NC}: /" &

# Start frontend
echo "${CYAN}Starting frontend (Vite React client)...${NC}"
(cd web-client && npm run dev) 2>&1 | sed "s/^/[$(date +%H:%M:%S)] ${RED}FRONTEND${NC}: /" &

wait
