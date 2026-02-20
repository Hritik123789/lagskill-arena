#!/usr/bin/env bash
set -o errexit

echo "=== Simple Build (Binary Wheels Only) ==="

# Upgrade pip
pip install --upgrade pip setuptools wheel

# Try alternative requirements file first (older pydantic with wheels)
if [ -f "requirements-render.txt" ]; then
    echo "Using requirements-render.txt (optimized for Render)..."
    pip install --only-binary=:all: -r requirements-render.txt || \
    pip install -r requirements-render.txt
else
    echo "Using requirements.txt..."
    pip install --prefer-binary -r requirements.txt
fi

echo "=== Build complete ==="
