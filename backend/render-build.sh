#!/usr/bin/env bash
# exit on error
set -o errexit

# Upgrade pip
pip install --upgrade pip

# Install packages with pre-built wheels only (no source builds)
pip install --only-binary=:all: -r requirements.txt || pip install -r requirements.txt
