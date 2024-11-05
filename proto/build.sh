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

# Read the x-service-name from the packages/api/dist/openapi.json file
export GRPC_SERVICE_NAME=$(node -e "console.log(require('../packages/api/dist/openapi.json').info['x-service-name']);");
export GRPC_PACKAGE_PATH=$(node -e "console.log(require('../packages/api/dist/openapi.json').info['x-package-name'].replace('.', '/'));");

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
PACKAGE_DIR="./$GRPC_PACKAGE_PATH"
mkdir -p $PACKAGE_DIR
PACKAGE_PATH="./$GRPC_PACKAGE_PATH/$GRPC_SERVICE_NAME"
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

mkdir -p ../packages/client-grpc/src/generated
./protoc \
  -I=. \
  --plugin=protoc-gen-ts_proto=../node_modules/.bin/protoc-gen-ts_proto \
  --ts_proto_out=../packages/client-grpc/src/generated \
  --ts_proto_opt=env=node \
  --ts_proto_opt=onlyTypes=true \
  --ts_proto_opt=useOptionals=messages \
  --ts_proto_opt=stringEnums=true \
  --ts_proto_opt=lowerCaseServiceMethods=true \
  --ts_proto_opt=snakeToCamel=true \
  --ts_proto_opt=outputPartialMethods=true \
  $PACKAGE_PATH.proto

# --ts_proto_opt=context=true \
  
# Copy the .proto file to the client-grpc/proto directory
mkdir -p ../packages/client-grpc/src/proto/google
cp -r ./google/* ../packages/client-grpc/src/proto/google
cp $PACKAGE_PATH.json ../packages/client-grpc/src/proto/serviceSpec.json
cp $PACKAGE_PATH.proto ../packages/client-grpc/src/proto/serviceSpec.proto

# Copy the .proto file to the service/src/proto directory
mkdir -p ../packages/service/src/proto/google
cp -r ./google/* ../packages/service/src/proto/google
cp $PACKAGE_PATH.json ../packages/service/src/proto/serviceSpec.json
cp $PACKAGE_PATH.proto ../packages/service/src/proto/serviceSpec.proto
