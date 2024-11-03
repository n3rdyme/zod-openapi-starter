#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Change to the directory where the script is located
cd "$(dirname "$0")"

# Set the version you want to install
PROTOC_VERSION="28.3"
PROTOC_ZIP="protoc-$PROTOC_VERSION-$(uname -s | tr '[:upper:]' '[:lower:]')-$(uname -m).zip"

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
