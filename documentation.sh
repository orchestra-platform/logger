#!/bin/bash

echo "Generating documentation"

documentation build index.js \
    --shallow \
    --format md \
    --output README.md

echo "Done"
