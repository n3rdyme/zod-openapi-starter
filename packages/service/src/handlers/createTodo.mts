/* eslint-disable */
import { CreateTodoRequest, ErrorDetails, TodoItem } from "../generated/index.mjs";

/**
 * Create a new to-do item
 */
export const createTodo = async (request: CreateTodoRequest, context: any): Promise<TodoItem> => {
  return {
    "id": "9624c4e5-d4c2-fd53-24a3-db9575835dd6",
    "title": "et esse",
    "description": "tempor",
    "completed": false
  };
};

/* {
  "verb": "post",
  "tags": [],
  "route": "/todos",
  "pathRoute": "/todos",
  "operationId": "createTodo",
  "operationName": "createTodo",
  "response": {
    "imports": [
      {
        "name": "TodoItem",
        "schemaName": "TodoItem"
      },
      {
        "name": "ErrorDetails",
        "schemaName": "ErrorDetails"
      }
    ],
    "definition": {
      "success": "TodoItem",
      "errors": "ErrorDetails"
    },
    "isBlob": false,
    "types": {
      "success": [
        {
          "value": "TodoItem",
          "imports": [
            {
              "name": "TodoItem",
              "schemaName": "TodoItem"
            }
          ],
          "type": "object",
          "schemas": [],
          "isEnum": false,
          "originalSchema": {
            "type": "object",
            "properties": {
              "id": {
                "type": "string",
                "format": "uuid"
              },
              "title": {
                "type": "string",
                "minLength": 1
              },
              "description": {
                "type": "string"
              },
              "completed": {
                "type": "boolean"
              }
            },
            "required": [
              "id",
              "title",
              "completed"
            ]
          },
          "hasReadonlyProps": false,
          "isRef": true,
          "contentType": "application/json",
          "key": "201"
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
      "201": {
        "description": "The created to-do item",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/TodoItem"
            }
          }
        }
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
    "originalSchema": {
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/CreateTodoRequest"
          }
        }
      }
    },
    "definition": "CreateTodoRequest",
    "implementation": "createTodoRequest",
    "imports": [
      {
        "name": "CreateTodoRequest",
        "schemaName": "CreateTodoRequest"
      }
    ],
    "schemas": [],
    "isOptional": false,
    "contentType": "application/json"
  },
  "params": [],
  "props": [
    {
      "name": "createTodoRequest",
      "definition": "createTodoRequest: CreateTodoRequest",
      "implementation": "createTodoRequest: CreateTodoRequest",
      "default": false,
      "required": true,
      "type": "body"
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
    "operationId": "createTodo",
    "description": "Create a new to-do item",
    "requestBody": {
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/CreateTodoRequest"
          }
        }
      }
    },
    "responses": {
      "201": {
        "description": "The created to-do item",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/TodoItem"
            }
          }
        }
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
