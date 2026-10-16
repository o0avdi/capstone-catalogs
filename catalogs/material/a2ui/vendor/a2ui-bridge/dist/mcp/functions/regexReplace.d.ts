/**
 * TODO: Replace this file with imports from `@a2ui/mcp-catalog/v0_9` once published to NPM.
 */
import { type FunctionImplementation } from '@a2ui/web_core/v0_9';
import { type FunctionApiDefinition } from './common.js';
/** Function API definition for `regexReplace`. */
export declare const RegexReplaceApi: FunctionApiDefinition;
/**
 * Replaces all matches of an RE2 pattern with literal replacement text.
 *
 * Replacement text is escaped so `$1` and similar sequences are inserted literally
 * rather than interpreted as capture group references.
 *
 * @throws A2uiExpressionError if `pattern` is not a valid RE2 regular expression.
 */
export declare const RegexReplaceImplementation: FunctionImplementation;
