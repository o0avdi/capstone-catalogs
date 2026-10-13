/**
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { McpRequestPayload, McpResponsePayload } from './bridge-message.js';
/**
 * Proxies MCP `callTool` requests from inside the preview iframe to the parent shell
 * via postMessage (`MCP_REQUEST` / `MCP_RESPONSE`).
 */
export declare class IframeMcpClient {
    private readonly sendMcpRequest;
    private readonly timeoutMs;
    private pendingRequests;
    constructor(sendMcpRequest: (payload: McpRequestPayload) => void, timeoutMs?: number);
    callTool(params: {
        name: string;
        arguments?: Record<string, unknown>;
    }): Promise<unknown>;
    handleResponse(payload: McpResponsePayload): void;
}
