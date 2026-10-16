/**
 * TODO: Replace this file with imports from `@a2ui/mcp-catalog/v0_9` once published to NPM.
 *
 * Shared utilities for MCP catalog data functions.
 *
 * Because A2UI resolves arguments before invoking a function, nested async
 * calls (like `callMcpTool`) arrive as pending Promises. Data functions use
 * `asyncable` and `withSettledArgs` to accept and await Promise arguments
 * automatically while remaining synchronous when all arguments are already
 * resolved.
 */
import { type createFunctionImplementation } from '@a2ui/web_core/v0_9';
import { RE2JS } from 're2js';
import { z } from 'zod/v3';
export interface FunctionApiDefinition {
    name: string;
    returnType: Parameters<typeof createFunctionImplementation>[0]['returnType'];
    schema: unknown;
    description?: string;
}
/** Checks whether a value is a Promise-like object. */
export declare function isThenable(value: unknown): value is PromiseLike<unknown>;
/**
 * Widens a Zod schema to accept either a resolved value or a pending Promise.
 */
export declare function asyncable<T extends z.ZodTypeAny>(schema: T): z.ZodTypeAny;
/**
 * Executes `body` once all arguments have resolved.
 *
 * Runs synchronously if no arguments contain Promises, preserving reactive bindings,
 * or returns a Promise if any argument is asynchronous.
 */
export declare function withSettledArgs<T>(args: Record<string, unknown>, body: (settled: Record<string, unknown>) => T): T | Promise<T>;
/**
 * Compiles and caches an RE2 regular expression.
 *
 * @param source The regular expression string to compile.
 * @param fn The name of the calling function for error reporting.
 * @throws A2uiExpressionError if the pattern is invalid.
 */
export declare function pattern(source: string, fn: string): ReturnType<typeof RE2JS.compile>;
/**
 * Applies `fn` to a single string or maps it across an array of strings.
 *
 * Converts null and undefined values to empty strings.
 */
export declare function overValue<T>(value: unknown, fn: (item: string) => T): T | T[];
