/**
 * TODO: Replace this file with imports from `@a2ui/mcp-catalog/v0_9` once published to NPM.
 */
import { type FunctionImplementation } from '@a2ui/web_core/v0_9';
import { type FunctionApiDefinition } from './common.js';
/**
 * Function API definition for `jmespath`, using standard JMESPath syntax
 * (https://jmespath.org).
 */
export declare const JmespathApi: FunctionApiDefinition;
/**
 * Evaluates a JMESPath expression against `data` and returns the result.
 *
 * Deeply resolves dynamic values in both `expression` and `data` before evaluation.
 * Returns `null` if a queried field does not exist.
 *
 * @throws A2uiExpressionError if `expression` is not a valid JMESPath string.
 */
export declare const JmespathImplementation: FunctionImplementation;
