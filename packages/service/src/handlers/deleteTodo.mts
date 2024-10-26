/* eslint-disable */
import { ErrorDetails } from "../generated/index.mjs";

/**
 * Delete a to-do item by ID
 */
export const deleteTodo = async (request: { id: string }, context: any): Promise<void> => {
  return;
};

/* {
  "verb": "delete",
  "tags": [],
  "route": "/todos/${id}",
  "pathRoute": "/todos/{id}",
  "operationId": "deleteTodo",
  "operationName": "deleteTodo",
  "response": {
    "imports": [
      {
        "name": "ErrorDetails",
        "schemaName": "ErrorDetails"
      }
    ],
    "definition": {
      "success": "void",
      "errors": "ErrorDetails"
    },
    "isBlob": false,
    "types": {
      "success": [
        {
          "value": "void",
          "imports": [],
          "schemas": [],
          "type": "void",
          "isEnum": false,
          "key": "204",
          "isRef": false,
          "hasReadonlyProps": false,
          "contentType": "application/json"
        }
      ],
      "errors": [
        {
          "value": "ErrorDetails",
          "imports": [
            {
              "name": "ErrorDetails",
              "schemaName": "ErrorDetails"
            }
          ],
          "type": "object",
          "schemas": [],
          "isEnum": false,
          "originalSchema": {
            "type": "object",
            "properties": {
              "statusCode": {
                "type": "integer",
                "format": "int32"
              },
              "code": {
                "type": "string"
              },
              "message": {
                "type": "string",
                "default": "Unknown Error"
              },
              "issues": {
                "type": "array",
                "items": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "object",
                      "properties": {},
                      "additionalProperties": true
                    }
                  ]
                }
              },
              "data": {
                "type": "object",
                "properties": {},
                "additionalProperties": true
              }
            },
            "required": [
              "statusCode"
            ]
          },
          "hasReadonlyProps": false,
          "isRef": true,
          "contentType": "application/json",
          "key": "5XX"
        }
      ]
    },
    "contentTypes": [
      "application/json"
    ],
    "schemas": [],
    "originalSchema": {
      "204": {
        "description": "To-do item deleted successfully"
      },
      "5XX": {
        "description": "Internal Server Error",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/ErrorDetails"
            }
          }
        }
      },
      "4XX": {
        "description": "Invalid Request Error",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/ErrorDetails"
            }
          }
        }
      }
    }
  },
  "body": {
    "definition": "",
    "implementation": "",
    "imports": [],
    "schemas": [],
    "isOptional": false,
    "formData": "",
    "formUrlEncoded": "",
    "contentType": ""
  },
  "params": [
    {
      "name": "id",
      "definition": "id: string",
      "implementation": "id: string",
      "required": true,
      "imports": [],
      "originalSchema": {
        "type": "string",
        "format": "uuid",
        "description": "The ID of the to-do item to update"
      }
    }
  ],
  "props": [
    {
      "name": "id",
      "definition": "id: string",
      "implementation": "id: string",
      "required": true,
      "imports": [],
      "originalSchema": {
        "type": "string",
        "format": "uuid",
        "description": "The ID of the to-do item to update"
      },
      "type": "param"
    }
  ],
  "override": {
    "mock": {
      "arrayMin": 1,
      "arrayMax": 10
    },
    "operations": {},
    "tags": {},
    "formData": true,
    "formUrlEncoded": true,
    "requestOptions": true,
    "components": {
      "schemas": {
        "suffix": "",
        "itemSuffix": "Item"
      },
      "responses": {
        "suffix": "Response"
      },
      "parameters": {
        "suffix": "Parameter"
      },
      "requestBodies": {
        "suffix": "Body"
      }
    },
    "hono": {
      "validator": true
    },
    "query": {
      "useQuery": true,
      "useMutation": true,
      "signal": true,
      "shouldExportMutatorHooks": true,
      "shouldExportHttpClient": true,
      "shouldExportQueryKey": true
    },
    "zod": {
      "strict": {
        "param": false,
        "query": false,
        "header": false,
        "body": false,
        "response": false
      },
      "generate": {
        "param": true,
        "query": true,
        "header": true,
        "body": true,
        "response": true
      },
      "coerce": {
        "param": false,
        "query": false,
        "header": false,
        "body": false,
        "response": false
      },
      "preprocess": {},
      "generateEachHttpStatus": false
    },
    "swr": {},
    "angular": {
      "provideIn": "root"
    },
    "fetch": {
      "includeHttpStatusReturnType": true
    },
    "useDates": false,
    "useDeprecatedOperations": true,
    "useNativeEnums": false,
    "suppressReadonlyModifier": false
  },
  "originalOperation": {
    "operationId": "deleteTodo",
    "description": "Delete a to-do item by ID",
    "parameters": [
      {
        "schema": {
          "type": "string",
          "format": "uuid",
          "description": "The ID of the to-do item to update"
        },
        "required": true,
        "name": "id",
        "in": "path"
      }
    ],
    "responses": {
      "204": {
        "description": "To-do item deleted successfully"
      },
      "5XX": {
        "description": "Internal Server Error",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/ErrorDetails"
            }
          }
        }
      },
      "4XX": {
        "description": "Invalid Request Error",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/ErrorDetails"
            }
          }
        }
      }
    }
  }
} */
