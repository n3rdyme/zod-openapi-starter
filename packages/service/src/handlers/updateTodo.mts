/* eslint-disable */
import { ErrorDetails, TodoItem, UpdateTodoRequest } from "../generated/index.mjs";

/**
 * Update an existing to-do item by ID
 */
export const updateTodo = async (request: { id: string } & UpdateTodoRequest, context: any): Promise<TodoItem> => {
  return {
    "id": "e0fd5564-673e-7669-a583-4ea3a8e905fb",
    "title": "labore officia",
    "description": "anim qui culpa eu",
    "completed": false
  };
};

/* {
  "verb": "put",
  "tags": [],
  "route": "/todos/${id}",
  "pathRoute": "/todos/{id}",
  "operationId": "updateTodo",
  "operationName": "updateTodo",
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
          "key": "200"
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
      "200": {
        "description": "The updated to-do item",
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
            "$ref": "#/components/schemas/UpdateTodoRequest"
          }
        }
      }
    },
    "definition": "UpdateTodoRequest",
    "implementation": "updateTodoRequest",
    "imports": [
      {
        "name": "UpdateTodoRequest",
        "schemaName": "UpdateTodoRequest"
      }
    ],
    "schemas": [],
    "isOptional": false,
    "contentType": "application/json"
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
    },
    {
      "name": "updateTodoRequest",
      "definition": "updateTodoRequest: UpdateTodoRequest",
      "implementation": "updateTodoRequest: UpdateTodoRequest",
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
    "operationId": "updateTodo",
    "description": "Update an existing to-do item by ID",
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
    "requestBody": {
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/UpdateTodoRequest"
          }
        }
      }
    },
    "responses": {
      "200": {
        "description": "The updated to-do item",
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
