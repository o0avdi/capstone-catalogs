/**
 * TODO: Replace this file with imports from `@a2ui/mcp-catalog/v0_9` once published to NPM.
 */
import { type FunctionImplementation } from '@a2ui/web_core/v0_9';
import { type FunctionApiDefinition } from './common.js';
/** Function API definition for `regexCapture`. */
export declare const RegexCaptureApi: FunctionApiDefinition;
/**
 * Matches a string (or each element of an array of strings) against an RE2 pattern
 * and returns the capture groups from the first match, or `null` if no match is found.
 *
 * @throws A2uiExpressionError if `pattern` is not a valid RE2 regular expression.
 */
export declare const RegexCaptureImplementation: FunctionImplementation;
