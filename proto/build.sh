#!/bin/bash

GRPC_SERVICE_NAME=openapiService


# Exit immediately if a command exits with a non-zero status
set -e

# Change to the directory where the script is located
cd "$(dirname "$0")"

# Ensure that the user's go/bin directory is in the PATH
if [[ ":$PATH:" != *":~/go/bin:"* ]]; then
  export PATH=$PATH:~/go/bin  
fi

# Install the protoc compiler and google protos
./install.sh

mkdir -p ./google

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
PACKAGE_DIR="./$GRPC_SERVICE_NAME"
mkdir -p $PACKAGE_DIR
PACKAGE_PATH="./$GRPC_SERVICE_NAME/$GRPC_SERVICE_NAME"
cp ../packages/api/dist/openapi.json $PACKAGE_PATH.json

# Before we convert to proto, update the openapi.json for better compatibility
node ./gnosticPrepare.mjs $PACKAGE_PATH.json

# Convert openapi.json to .pb file
gnostic --pb-out=$PACKAGE_PATH.pb $PACKAGE_PATH.json

# Convert .pb file to .proto file
if [ -f $PACKAGE_PATH.proto ]; then
  rm $PACKAGE_PATH.proto
fi
gnostic-grpc -input $PACKAGE_PATH.pb -output $PACKAGE_DIR

# Gnostic is terrible, so we need to fix the .proto file
node ./gnosticRepair.mjs $PACKAGE_PATH.json $PACKAGE_PATH.proto

# Build the .proto file with protoc to validate the proto file
./protoc -I=. --descriptor_set_out=$PACKAGE_DIR/$GRPC_SERVICE_NAME.pb --include_imports $PACKAGE_PATH.proto

# Copy the .proto file to the client-grpc/proto directory
mkdir -p ../packages/client-grpc/src/proto/google
cp -r ./google/* ../packages/client-grpc/src/proto/google
mkdir -p ../packages/client-grpc/src/proto/$GRPC_SERVICE_NAME
cp -r ./$GRPC_SERVICE_NAME/*.proto ../packages/client-grpc/src/proto/$GRPC_SERVICE_NAME

# Copy the .proto file to the service/src/proto directory
mkdir -p ../packages/service/src/proto/google
cp -r ./google/* ../packages/service/src/proto/google
mkdir -p ../packages/service/src/proto/$GRPC_SERVICE_NAME
cp -r ./$GRPC_SERVICE_NAME/*.proto ../packages/service/src/proto/$GRPC_SERVICE_NAME
