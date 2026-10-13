/**
 * TODO: Replace this file with imports from `@a2ui/mcp-catalog/v0_9` once published to NPM.
 *
 * Type guards and recursive resolution utilities for A2UI dynamic values.
 *
 * While `DataContext.resolveDynamicValue` resolves a single top-level `DynamicValue`,
 * these helpers recursively traverse nested objects and arrays to resolve embedded
 * data bindings and function calls.
 */
import type { DataBinding, DataContext, FunctionCall } from '@a2ui/web_core/v0_9';
/** Union of dynamic expression types (`DataBinding` or `FunctionCall`) that require runtime evaluation. */
export type DynamicExpression = DataBinding | FunctionCall;
/**
 * Checks whether `value` is a `DataBinding` (`{path: string}`).
 *
 * Objects with additional properties alongside `path` are treated as literal objects.
 */
export declare function isDataBinding(value: unknown): value is DataBinding;
/**
 * Checks whether `value` is a `FunctionCall` (`{call: string, args?, returnType?}`).
 */
export declare function isFunctionCall(value: unknown): value is FunctionCall;
/** Checks whether `value` is a `DataBinding` or a `FunctionCall`. */
export declare function isDynamicExpression(value: unknown): value is DynamicExpression;
/**
 * Recursively resolves all dynamic expressions (`DataBinding` and `FunctionCall`)
 * nested within `value`.
 *
 * Traverses arrays and plain objects while preserving their structure, and
 * repeatedly resolves chained expressions until a concrete value is reached or
 * `MAX_RESOLUTION_DEPTH` is hit. Pending Promises from async functions are
 * passed through as-is.
 *
 * @param value The value or container to resolve.
 * @param context The data context used for evaluation.
 * @param depth Internal recursion depth counter.
 */
export declare function resolveDynamicValueDeep<T = unknown>(value: unknown, context: DataContext, depth?: number): T;
/**
 * Resolves each property value in a key-value record (such as function arguments).
 *
 * Resolves entries individually rather than evaluating the record itself as a
 * dynamic expression, so records containing `path` or `call` keys are preserved
 * as plain objects.
 */
export declare function resolveDynamicRecord(record: Record<string, unknown>, context: DataContext, depth?: number): Record<string, unknown>;
