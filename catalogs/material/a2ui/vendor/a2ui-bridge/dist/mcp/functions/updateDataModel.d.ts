/**
 * TODO: Replace this file with imports from `@a2ui/mcp-catalog/v0_9` once published to NPM.
 */
import { type FunctionImplementation } from '@a2ui/web_core/v0_9';
import { type FunctionApiDefinition } from './common.js';
/** Function API definition for `updateDataModel`. */
export declare const UpdateDataModelApi: FunctionApiDefinition;
/**
 * Writes multiple path-value pairs to the surface data model.
 *
 * Ignores `null` or `undefined` updates without throwing an error.
 *
 * @throws A2uiExpressionError if `updates` is not a plain object, `null`, or `undefined`.
 */
export declare const UpdateDataModelImplementation: FunctionImplementation;
