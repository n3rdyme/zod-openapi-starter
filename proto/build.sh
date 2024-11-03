#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Change to the directory where the script is located
cd "$(dirname "$0")"

mkdir -p ./google

# Install the protoc compiler and google protos
./install.sh

# Import "google/api/annotations.proto";
# https://github.com/googleapis/googleapis/raw/refs/heads/master/google/api/annotations.proto
mkdir -p ./google/api
if [ ! -f ./google/api/annotations.proto ]; then
  curl -LsSf https://github.com/googleapis/googleapis/raw/refs/heads/master/google/api/annotations.proto > ./google/api/annotations.proto 
fi

# Import "google/api/http.proto";
# https://github.com/googleapis/googleapis/raw/refs/heads/master/google/api/http.proto
mkdir -p ./google/api
if [ ! -f ./google/api/http.proto ]; then
  curl -LsSf https://github.com/googleapis/googleapis/raw/refs/heads/master/google/api/http.proto > ./google/api/http.proto
fi

# Build the Descriptor as a binary .pb file
PACKAGE_DIR="./my/local"
mkdir -p $PACKAGE_DIR
PACKAGE_PATH="./my/local/service"
cp ../packages/api/dist/openapi.json $PACKAGE_PATH.json

# Convert openapi.json to .pb file
gnostic --pb-out=$PACKAGE_PATH.pb $PACKAGE_PATH.json

# Convert .pb file to .proto file
if [ -f $PACKAGE_PATH.proto ]; then
  rm $PACKAGE_PATH.proto
fi
gnostic-grpc -input $PACKAGE_PATH.pb -output $PACKAGE_DIR

# Build the .proto file with protoc to validate the proto file
./protoc -I=. --descriptor_set_out=./service.pb --include_imports $PACKAGE_PATH.proto
rm ./service.pb
