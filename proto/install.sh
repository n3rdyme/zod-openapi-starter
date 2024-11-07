#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Change to the directory where the script is located
cd "$(dirname "$0")"

# Set the version you want to install
PROTOC_VERSION="28.3"

# Detect OS and Architecture
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

# Set ARCH and adjust OS for supported values
if [[ "$OS" == "darwin" ]]; then
  OS="osx"
  if [[ "$ARCH" == "arm64" || "$ARCH" == "aarch64" ]]; then
    ARCH="universal_binary"
  fi
elif [[ "$OS" == "linux" ]]; then
  if [[ "$ARCH" == "aarch64" ]]; then
    ARCH="aarch_64"
  fi
else
  echo "Unsupported OS: $OS, expected darwin or linux"
  exit 1
fi

# Ensure that the user's go/bin directory is in the PATH
if [[ ":$PATH:" != *":~/go/bin:"* ]]; then
  export PATH=$PATH:~/go/bin  
fi

# Ensure that curl is in the PATH
if ! command -v curl > /dev/null 2>&1; then
  echo "curl does not exist in PATH, please install:"
  echo "> sudo apt-get install curl"
  exit 1
fi
# Ensure that unzip is in the PATH
if ! command -v unzip > /dev/null 2>&1; then
  echo "unzip does not exist in PATH, please install:"
  echo "> sudo apt-get install unzip"
  exit 1
fi
# Ensure that go is in the PATH
if ! command -v go > /dev/null 2>&1; then
  echo "go does not exist in PATH, please install:"
  echo "https://golang.org/doc/install"
  exit 1
fi

# Install the gnostic and gnostic-grpc tools
if ! command -v gnostic > /dev/null 2>&1; then
  go install github.com/google/gnostic@latest
fi
if ! command -v gnostic-grpc > /dev/null 2>&1; then
  go install github.com/googleapis/gnostic-grpc@latest
fi

# Install the protoc compiler (local copy)
if [ ! -f ./protoc ]; then
  # Create a directory to store the downloaded file
  mkdir -p ./.temp

  # Download the specified version of protoc
  echo "Downloading protoc version $PROTOC_VERSION..."
  PROTOC_ZIP="protoc-$PROTOC_VERSION-$OS-$ARCH.zip"
  PROTOC_URL="https://github.com/protocolbuffers/protobuf/releases/download/v$PROTOC_VERSION/$PROTOC_ZIP"
  curl -LsSf $PROTOC_URL > ./.temp/protoc.zip
  
  # Unzip and install
  unzip -oq ./.temp/protoc.zip -d ./.temp/
  mv ./.temp/bin/protoc ./protoc
  cp -r ./.temp/include/google .

  # Remove the temporary directory
  rm -rf ./.temp

  # Verify the installation
  echo "Installed protoc version:"
  ./protoc --version
fi
