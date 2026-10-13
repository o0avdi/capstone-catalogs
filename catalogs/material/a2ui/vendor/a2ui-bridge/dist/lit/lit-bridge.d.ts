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
import { LitElement, TemplateResult } from 'lit';
import { Catalog, ComponentApi } from '@a2ui/web_core/v0_9';
import type { MarkdownRenderer } from '@a2ui/web_core/types/types';
import { ThemePreference, type ComponentUsages } from '../index.js';
/**
 * Options block configuring custom element generation and static payload injection
 * for the Lit component rendering sandbox.
 */
export interface LitSandboxOptions {
    /** The custom tag name of the custom HTML elements shell (Default: 'app-root') */
    elementTagName?: string;
    /** Optional custom markdown rendering delegate callback hook */
    markdownRenderer?: MarkdownRenderer;
    /** Optional preloaded catalog JSON data, provided directly in memory. */
    catalogJson?: unknown;
    /** Optional callback to retrieve component usage samples. */
    getComponentUsages?: () => Promise<ComponentUsages>;
    /** Optional callback when theme changes. */
    onThemeChange?: (theme: ThemePreference) => void;
}
/**
 * Event payload interface representing an incoming context-request event
 * used to intercept and resolve dynamic provider contexts.
 */
export interface ContextRequestEventPayload extends Event {
    /** Target context identifier or metadata structure */
    context?: {
        id?: string;
        __context__?: string;
    } | string;
    /** Resolution callback function invoked with the satisfied provider value */
    callback?: (renderer: unknown) => void;
}
/**
 * Root rendering sandbox container element hosting A2UI dynamic surface layouts.
 * Integrates contextual providers, manages active surface subscriptions, and
 * delegates remote message processing.
 */
export declare class A2uiSandboxRoot extends LitElement {
    /** The static catalog list shared by all sandbox element instances */
    static catalogs: Catalog<ComponentApi>[];
    /** Optional preloaded catalog JSON data shared statically */
    static catalogJson?: unknown;
    /** Optional custom markdown renderer callback shared statically */
    static markdownRenderer?: MarkdownRenderer;
    /** Optional callback to retrieve component usage samples shared statically */
    static getComponentUsages?: () => Promise<ComponentUsages>;
    /** Optional callback when theme changes shared statically */
    static onThemeChange?: (theme: ThemePreference) => void;
    static styles: import("lit").CSSResult;
    private processor;
    private markdownProvider;
    get markdownRenderer(): MarkdownRenderer | undefined;
    set markdownRenderer(value: MarkdownRenderer | undefined);
    private surface?;
    private debouncedError;
    private debounceTimeout;
    private rendererConnection;
    private contextRequestListener;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private renderErrorOverlay;
    render(): TemplateResult;
}
/**
 * Dynamic entry point that bootstraps the Lit Component Rendering Sandbox.
 * Registers element mappings inside browser-level CustomElement registries, binds
 * configuration schemas, and injects optional preloaded static catalog payloads.
 *
 * @param catalogs The array of component catalogs defining local layouts.
 * @param options Optional configuration options block holding the HTML tag name and preloaded catalog JSON data.
 * @return The A2uiSandboxRoot custom element constructor value ready for nominal references.
 */
export declare function bootstrapLitSandbox<T extends ComponentApi>(catalogs: Catalog<T>[], options?: LitSandboxOptions): typeof A2uiSandboxRoot;
