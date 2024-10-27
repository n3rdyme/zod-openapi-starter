import createError from "@fastify/error";

/*
GREP REPLACE:
/\*\* (\d+) (\w+) (\w+)\s+(\d+)\s+([\w ']+).*
$0\nexport const $2 = // $1 $2\n  makeError($1, $4, "$2", "$3", "$5");
*/

/** 499 RequestCancelledError - CANCELLED	1	The operation was cancelled, typically by the caller. */
export const RequestCancelledError = // 499 RequestCancelledError
  makeError(499, 1, "RequestCancelledError", "CANCELLED", "The operation was cancelled");
/** 500 UnknownError UNKNOWN	2	Unknown error. For example, this error may be returned when a Status value received from another address space belongs to an error space that is not known in this address space. Also errors raised by APIs that do not return enough error information may be converted to this error. */
export const UnknownError = // 500 UnknownError
  makeError(500, 2, "UnknownError", "UNKNOWN", "Unknown error");
/** 400 BadRequestError INVALID_ARGUMENT	3	The client specified an invalid argument. Note that this differs from FAILED_PRECONDITION. INVALID_ARGUMENT indicates arguments that are problematic regardless of the state of the system (e.g., a malformed file name). */
export const BadRequestError = // 400 BadRequestError
  makeError(400, 3, "BadRequestError", "INVALID_ARGUMENT", "The client specified an invalid argument");
/** 504 GatewayTimeoutError DEADLINE_EXCEEDED	4	The deadline expired before the operation could complete. For operations that change the state of the system, this error may be returned even if the operation has completed successfully. For example, a successful response from a server could have been delayed long */
export const GatewayTimeoutError = // 504 GatewayTimeoutError
  makeError(504, 4, "GatewayTimeoutError", "DEADLINE_EXCEEDED", "The timeout deadline expired");
/** 404 NotFoundError NOT_FOUND	5	Some requested entity (e.g., file or directory) was not found. Note to server developers: if a request is denied for an entire class of users, such as gradual feature rollout or undocumented allowlist, NOT_FOUND may be used. If a request is denied for some users within a class of users, such as user-based access control, PERMISSION_DENIED must be used. */
export const NotFoundError = // 404 NotFoundError
  makeError(404, 5, "NotFoundError", "NOT_FOUND", "The requested resource was not found");
/** 409 AlreadyExistsError ALREADY_EXISTS	6	The entity that a client attempted to create (e.g., file or directory) already exists. */
export const AlreadyExistsError = // 409 AlreadyExistsError
  makeError(409, 6, "AlreadyExistsError", "ALREADY_EXISTS", "The resource already exists");
/** 403 ForbiddenError PERMISSION_DENIED	7	The caller does not have permission to execute the specified operation. PERMISSION_DENIED must not be used for rejections caused by exhausting some resource (use RESOURCE_EXHAUSTED instead for those errors). PERMISSION_DENIED must not be used if the caller can not be identified (use UNAUTHENTICATED instead for those errors). This error code does not imply the request is valid or the requested entity exists or satisfies other pre-conditions. */
export const ForbiddenError = // 403 ForbiddenError
  makeError(403, 7, "ForbiddenError", "PERMISSION_DENIED", "The caller does not have sufficient permissions");
/** 429 TooManyRequestsError RESOURCE_EXHAUSTED	8	Some resource has been exhausted, perhaps a per-user quota, or perhaps the entire file system is out of space. */
export const TooManyRequestsError = // 429 TooManyRequestsError
  makeError(429, 8, "TooManyRequestsError", "RESOURCE_EXHAUSTED", "Some resource has been exhausted");
/** 400 FailedConditionError FAILED_PRECONDITION	9	The operation was rejected because the system is not in a state required for the operation's execution. For example, the directory to be deleted is non-empty, an rmdir operation is applied to a non-directory, etc. Service implementors can use the following guidelines to decide between FAILED_PRECONDITION, ABORTED, and UNAVAILABLE: (a) Use UNAVAILABLE if the client can retry just the failing call. (b) Use ABORTED if the client should retry at a higher level (e.g., when a client-specified test-and-set fails, indicating the client should restart a read-modify-write sequence). (c) Use FAILED_PRECONDITION if the client should not retry until the system state has been explicitly fixed. E.g., if an "rmdir" fails because the directory is non-empty, FAILED_PRECONDITION should be returned since the client should not retry unless the files are deleted from the directory. */
export const FailedConditionError = // 400 FailedConditionError
  makeError(400, 9, "FailedConditionError", "FAILED_PRECONDITION", "The operation was rejected");
/** 409 ConflictError ABORTED	10	The operation was aborted, typically due to a concurrency issue such as a sequencer check failure or transaction abort. See the guidelines above for deciding between FAILED_PRECONDITION, ABORTED, and UNAVAILABLE. */
export const ConflictError = // 409 ConflictError
  makeError(409, 10, "ConflictError", "ABORTED", "The operation was aborted");
/** 400 OutOfRangeError OUT_OF_RANGE	11	The operation was attempted past the valid range. E.g., seeking or reading past end-of-file. Unlike INVALID_ARGUMENT, this error indicates a problem that may be fixed if the system state changes. For example, a 32-bit file system will generate INVALID_ARGUMENT if asked to read at an offset that is not in the range [0,2^32-1], but it will generate OUT_OF_RANGE if asked to read from an offset past the current file size. There is a fair bit of overlap between FAILED_PRECONDITION and OUT_OF_RANGE. We recommend using OUT_OF_RANGE (the more specific error) when it applies so that callers who are iterating through a space can easily look for an OUT_OF_RANGE error to detect when they are done. */
export const OutOfRangeError = // 400 OutOfRangeError
  makeError(400, 11, "OutOfRangeError", "OUT_OF_RANGE", "The operation was attempted past the valid range");
/** 501 NotImplementedError UNIMPLEMENTED	12	The operation is not implemented or is not supported/enabled in this service. */
export const NotImplementedError = // 501 NotImplementedError
  makeError(501, 12, "NotImplementedError", "UNIMPLEMENTED", "The operation is not implemented or is not supported");
/** 500 InternalServerError INTERNAL	13	Internal errors. This means that some invariants expected by the underlying system have been broken. This error code is reserved for serious errors. */
export const InternalServerError = // 500 InternalServerError
  makeError(500, 13, "InternalServerError", "INTERNAL", "Internal server error");
/** 503 ServiceUnavailableError UNAVAILABLE	14	The service is currently unavailable. This is most likely a transient condition, which can be corrected by retrying with a backoff. Note that it is not always safe to retry non-idempotent operations. */
export const ServiceUnavailableError = // 503 ServiceUnavailableError
  makeError(503, 14, "ServiceUnavailableError", "UNAVAILABLE", "The service is currently unavailable");
/** 500 UnrecoverableError DATA_LOSS	15	Unrecoverable data loss or corruption. */
export const UnrecoverableError = // 500 UnrecoverableError
  makeError(500, 15, "UnrecoverableError", "DATA_LOSS", "Unrecoverable data loss or corruption");
/** 401 UnauthorizedError UNAUTHENTICATED	16	The request does not have valid authentication credentials for the operation. */
export const UnauthorizedError = // 401 UnauthorizedError
  makeError(401, 16, "UnauthorizedError", "UNAUTHENTICATED", "The request is missing valid credentials");

/**
 * Creates a new error class
 */
function makeError(httpStatusCode: number, grpcStatusCode: number, name: string, code: string, reason: string) {
  return class ServerError extends createError("SVC_" + code, reason, httpStatusCode, Error) {
    readonly grpcCode: number;
    issues: (string | object)[] | undefined;
    data: unknown;

    constructor(
      message?: string | undefined,
      options?: { cause?: Error; issues?: Array<string | object>; data?: unknown },
    ) {
      super(message ?? reason, options);
      this.grpcCode = grpcStatusCode;
      this.issues = options?.issues;
      this.data = options?.data;
      this.cause = options?.cause;
      this.message = message ?? reason;
      this.name = name;

      Object.setPrototypeOf(this, ServerError.prototype);
    }
  };
}
