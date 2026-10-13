/**
 * TODO: Replace this module with `@a2ui/mcp-catalog/v0_9` once published to NPM.
 * See README.md in this directory for details and the migration plan.
 */
import type { FunctionImplementation } from '@a2ui/web_core/v0_9';
import { type McpClientResolver, type McpMessageProcessor } from './functions/callMcpTool.js';
import type { FunctionApiDefinition } from './functions/common.js';
/** Identifier of the catalog these functions implement. */
export declare const MCP_CATALOG_ID = "https://a2ui.org/specification/v0_9/catalogs/mcp/mcp_catalog.json";
/**
 * API definitions and schemas for the catalog's data transformation functions.
 */
export declare const DATA_FUNCTION_APIS: readonly FunctionApiDefinition[];
/** Function implementations for the catalog's data transformation functions. */
export declare const DATA_FUNCTIONS: FunctionImplementation[];
/**
 * Creates all functions defined in the MCP catalog, including `callMcpTool`
 * and the data transformation functions.
 * Supports both `(processor, getMcpClientForTool)` and `(getMcpClientForTool, processor)` parameter orders.
 */
export declare function createMcpCatalogFunctions(processor: McpMessageProcessor, getMcpClientForTool: McpClientResolver): FunctionImplementation[];
export declare function createMcpCatalogFunctions(getMcpClientForTool: McpClientResolver, processor: McpMessageProcessor): FunctionImplementation[];
export { A2UI_MIME_TYPE, CallMcpToolApi, createCallMcpToolImplementation, extractA2uiMessages, parseA2uiMessages, readUiResourceUris, type McpClientResolver, type McpMessageProcessor, type McpToolClient, } from './functions/callMcpTool.js';
export { JmespathApi, JmespathImplementation } from './functions/jmespath.js';
export { RegexCaptureApi, RegexCaptureImplementation } from './functions/regexCapture.js';
export { RegexReplaceApi, RegexReplaceImplementation } from './functions/regexReplace.js';
export { SplitApi, SplitImplementation } from './functions/split.js';
export { UpdateDataModelApi, UpdateDataModelImplementation } from './functions/updateDataModel.js';
export { isThenable } from './functions/common.js';
