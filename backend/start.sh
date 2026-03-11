#!/bin/zsh
# Запуск FastAPI бэкенда

PGBIN="$HOME/Applications/Postgres.app/Contents/Versions/16/bin"
PGDATA="$HOME/Library/Application Support/Postgres/var-16"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Запускаем PostgreSQL если не запущен
if ! "$PGBIN/pg_ctl" -D "$PGDATA" status &>/dev/null; then
  echo "▶ Запуск PostgreSQL..."
  "$PGBIN/pg_ctl" -D "$PGDATA" -l ~/Library/Logs/postgres16.log start
  sleep 2
fi

echo "▶ Запуск FastAPI на http://localhost:8000"
cd "$SCRIPT_DIR"
source .venv/bin/activate
export PYTHONPATH="$SCRIPT_DIR"
uvicorn app.main:app --reload --port 8000
