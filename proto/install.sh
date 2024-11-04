#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Change to the directory where the script is located
cd "$(dirname "$0")"

# Set the version you want to install
PROTOC_VERSION="28.3"
PROTOC_ZIP="protoc-$PROTOC_VERSION-$(uname -s | tr '[:upper:]' '[:lower:]')-$(uname -m).zip"

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
  go install github.com/google/gnostic-grpc@latest
fi

# Install the protoc compiler (local copy)
if [ ! -f ./protoc ]; then
  # Create a directory to store the downloaded file
  mkdir -p ./.temp

  # Download the specified version of protoc
  echo "Downloading protoc version $PROTOC_VERSION..."
  # echo curl -sS -o ./.temp/protoc.zip "https://github.com/protocolbuffers/protobuf/releases/download/v$PROTOC_VERSION/$PROTOC_ZIP"
  
  curl -LsSf "https://github.com/protocolbuffers/protobuf/releases/download/v$PROTOC_VERSION/$PROTOC_ZIP" > ./.temp/protoc.zip
  # | unzip -d ./.temp/
  
  # Unzip and install
  unzip -oq ./.temp/protoc.zip -d ./.temp/
  # rm $PROTOC_ZIP

  mv ./.temp/bin/protoc ./protoc
  cp -r ./.temp/include/google/* ./google/

  # Remove the temporary directory
  rm -rf ./.temp

  # Verify the installation
  echo "Installed protoc version:"
  ./protoc --version
fi
