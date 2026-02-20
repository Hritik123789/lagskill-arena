#!/usr/bin/env bash
# exit on error
set -o errexit

echo "=== LagSkillArena Build Script ==="
echo "Python version: $(python --version)"

# Upgrade pip and build tools
echo "Upgrading pip and build tools..."
pip install --upgrade pip setuptools wheel

# Set environment variables for binary preference
export PIP_PREFER_BINARY=1
export PIP_NO_CACHE_DIR=1

# Install Rust and Cargo (needed for pydantic-core if no wheel available)
if ! command -v cargo &> /dev/null; then
    echo "Installing Rust toolchain..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain stable
    source "$HOME/.cargo/env"
    export PATH="$HOME/.cargo/bin:$PATH"
    
    # Fix cargo permissions
    mkdir -p $HOME/.cargo/registry/cache
    mkdir -p $HOME/.cargo/registry/index
    chmod -R 755 $HOME/.cargo
fi

# Try to install with binary wheels first
echo "Installing Python packages (preferring binary wheels)..."
if pip install --prefer-binary --no-cache-dir -r requirements.txt; then
    echo "✅ Installation successful with binary wheels"
else
    echo "⚠️ Binary installation failed, trying with source compilation..."
    
    # Source cargo environment
    if [ -f "$HOME/.cargo/env" ]; then
        source "$HOME/.cargo/env"
    fi
    
    # Install with source compilation
    pip install --no-cache-dir -r requirements.txt
fi

echo "=== Build complete ==="
pip list | grep -E "fastapi|pydantic|uvicorn"
