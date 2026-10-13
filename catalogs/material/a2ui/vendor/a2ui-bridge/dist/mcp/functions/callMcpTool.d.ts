/**
 * TODO: Replace this file with imports from `@a2ui/mcp-catalog/v0_9` once published to NPM.
 */
import { type A2uiMessage, type FunctionImplementation, type SurfaceModel } from '@a2ui/web_core/v0_9';
import type { Client } from '@modelcontextprotocol/sdk/client/index.js';
import type { CallToolResult, ReadResourceResult } from '@modelcontextprotocol/sdk/types.js';
import type { FunctionApiDefinition } from './common.js';
/** MIME type identifying an A2UI payload in an MCP resource. */
export declare const A2UI_MIME_TYPE = "application/a2ui+json";
/** Subset of the MCP `Client` or `IframeMcpClient` interface used by this catalog. */
export interface McpToolClient {
    callTool?: (params: {
        name: string;
        arguments?: Record<string, unknown>;
    }) => Promise<unknown>;
    request?: Client['request'];
    readResource?: Client['readResource'];
    listTools?: Client['listTools'];
}
/** Processor interface capable of processing A2UI messages and optionally looking up surfaces. */
export interface McpMessageProcessor {
    processMessages(messages: A2uiMessage[]): void;
    model?: {
        getSurface?(surfaceId: string): SurfaceModel | undefined;
    };
}
/**
 * Resolves the connected MCP client for a given tool name.
 *
 * May return `null` or `undefined` if no client is currently available,
 * which causes the tool call to fail with an error.
 */
export type McpClientResolver = (toolName: string) => McpToolClient | undefined | null | Promise<McpToolClient | undefined | null>;
/**
 * Function API definition for `callMcpTool`.
 *
 * Payloads reference tools by name; the host application is responsible for
 * routing each tool name to the appropriate MCP server client.
 */
export declare const CallMcpToolApi: FunctionApiDefinition;
/**
 * Creates the `callMcpTool` function implementation.
 *
 * Invokes the named MCP tool, processes any referenced or inline `application/a2ui+json`
 * resources through `processor`, and returns the raw `CallToolResult`.
 *
 * @param getMcpClientForTool Callback that resolves the MCP client for a tool name.
 * @param processor Message processor that receives A2UI messages decoded from tool results.
 */
export declare function createCallMcpToolImplementation(getMcpClientForTool: McpClientResolver, processor: McpMessageProcessor): FunctionImplementation;
/**
 * Extracts unique string URIs from `_meta.ui.resourceUri` on a tool descriptor or result.
 * Accepts either a single URI string or an array of URI strings.
 */
export declare function readUiResourceUris(source: {
    _meta?: unknown;
} | undefined): string[];
/**
 * Extracts inline A2UI messages from `CallToolResult.content` blocks.
 *
 * Only embedded resource blocks with `mimeType: "application/a2ui+json"` are
 * parsed; plain text blocks are ignored.
 *
 * @throws Error if an A2UI resource block contains invalid JSON.
 */
export declare function extractA2uiMessages(content: CallToolResult['content'] | undefined): A2uiMessage[];
/**
 * Parses A2UI messages from a `resources/read` response for all content blocks
 * matching `application/a2ui+json`.
 *
 * @throws Error if an A2UI content block contains invalid JSON.
 */
export declare function parseA2uiMessages(resource: ReadResourceResult | undefined, uri: string): A2uiMessage[];
