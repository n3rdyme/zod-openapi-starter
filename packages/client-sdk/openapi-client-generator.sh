#!/bin/bash
openapi-generator-cli generate -i ../service/src/openapi.json -g typescript-axios -o ./client-sdk
