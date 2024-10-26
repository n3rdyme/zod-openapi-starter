/* eslint-disable */
import { ErrorDetails, TodoItemList } from "../generated/index.mjs";

/**
 * Retrieve a list of to-do items
 */
export const getTodos = async (request: unknown, context: any): Promise<TodoItemList> => {
  return {
    "items": [
      {
        "id": "1ff40043-5f0c-ba67-2ac2-000f3c11d589",
        "title": "consequat cillum aliquip officia ex",
        "description": "est",
        "completed": false
      },
      {
        "id": "67675d9a-80c3-72d0-abcf-33fdab6e34fb",
        "title": "reprehenderit Lorem sint id enim",
        "description": "consequat laborum exercitation pariatur",
        "completed": false
      },
      {
        "id": "380332f7-7e5e-8612-c925-b46b9db62129",
        "title": "mollit ut",
        "description": "magna",
        "completed": false
      }
    ]
  };
};

/* {
  "verb": "get",
  "tags": [],
  "route": "/todos",
  "pathRoute": "/todos",
  "operationId": "getTodos",
  "operationName": "getTodos",
  "response": {
    "imports": [
      {
        "name": "TodoItemList",
        "schemaName": "TodoItemList"
      },
      {
        "name": "ErrorDetails",
        "schemaName": "ErrorDetails"
      }
    ],
    "definition": {
      "success": "TodoItemList",
      "errors": "ErrorDetails"
    },
    "isBlob": false,
    "types": {
      "success": [
        {
          "value": "TodoItemList",
          "imports": [
            {
              "name": "TodoItemList",
              "schemaName": "TodoItemList"
            }
          ],
          "type": "object",
          "schemas": [],
          "isEnum": false,
          "originalSchema": {
            "type": "object",
            "properties": {
              "items": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/TodoItem"
                }
              }
            },
            "required": [
              "items"
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
                  "oneOf": [
                    {
                      "type": "object",
                      "properties": {},
                      "additionalProperties": true
                    },
                    {
                      "type": "string"
                    },
                    {
                      "type": "number"
                    },
                    {
                      "type": "boolean"
                    }
                  ]
                }
              },
              "data": {
                "oneOf": [
                  {
                    "type": "object",
                    "properties": {},
                    "additionalProperties": true
                  },
                  {
                    "type": "string"
                  },
                  {
                    "type": "number"
                  },
                  {
                    "type": "boolean"
                  }
                ]
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
        "description": "A list of to-do items",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/TodoItemList"
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
    "definition": "",
    "implementation": "",
    "imports": [],
    "schemas": [],
    "isOptional": false,
    "formData": "",
    "formUrlEncoded": "",
    "contentType": ""
  },
  "params": [],
  "props": [],
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
    "operationId": "getTodos",
    "description": "Retrieve a list of to-do items",
    "responses": {
      "200": {
        "description": "A list of to-do items",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/TodoItemList"
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
