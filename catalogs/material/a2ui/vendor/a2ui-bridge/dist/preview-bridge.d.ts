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
import type { A2uiMessage } from '@a2ui/web_core/v0_9';
import { BridgeMessage, ThemePreference } from './bridge-message';
import { IframeMcpClient } from './iframe-mcp-client';
export * from './surface-resize-observer';
import type { RendererConfig, SurfaceStateSubscription } from './render-config';
/**
 * Debounce duration in milliseconds before rendering an error overlay.
 * Suppresses transient syntax error popups during rapid typing.
 */
export declare const ERROR_OVERLAY_DEBOUNCE_MS = 350;
/**
 * Determines whether a given value resembles an Error object.
 * Checks for the presence of standard Error properties like 'message' and 'stack'.
 *
 * @param val - The value to inspect.
 * @returns True if the value is shaped like an Error, false otherwise.
 */
export declare function isErrorLike(val: unknown): val is Error;
/**
 * Safely serializes an unknown value to a JSON string.
 * Handles cyclical structures and complex objects gracefully without throwing.
 *
 * @param val - The value to serialize.
 * @returns A JSON string representation, or a fallback string on failure.
 */
export declare function safeSerialize(val: unknown): string;
/**
 * A framework-agnostic processor interface that handles A2UI protocol payloads.
 * Exposes a single method to process raw incoming action arrays.
 */
export declare interface RendererProcessor {
    /**
     * Processes the incoming message payload array.
     * @param payload The array of A2UI protocol commands.
     */
    processMessages(payload: A2uiMessage[]): void;
}
/**
 * Core inter-frame communication transport orchestrating A2UI protocol synchronization
 * between the parent Shell container and the isolated sandbox frame running the renderer stack.
 *
 * Registered as a global runtime singleton (`window.a2uiBridge`), the bridge acts as the
 * bidirectional messaging gateway that translates JSON postMessage signals into reactive framework
 * states and handles cross-origin handshakes, user interactions, overlay states, and SPA redirects.
 *
 * ### 🔄 Bidirectional Interaction Signals
 * 1. **Shell ➡️ Bridge (Incoming Messages)**:
 *    - `RENDER_A2UI`: Raw protocol layout payloads containing component layout blueprints.
 *    - `DATA_MODEL_CHANGE`: Incremental state mutations synchronized across frame contexts.
 *    - `SET_BLOCKING_STATE`: Blocks browser interactions by launching a full-screen dynamic overlay.
 *    - `GET_CATALOG`: Fetches catalog metadata definitions, stripping potential JS security prefixes.
 *
 * 2. **Bridge ➡️ Shell (Outgoing Messages)**:
 *    - `RENDERER_READY`: Bootstrap handshake signal dispatched when the sandbox window is ready.
 *    - `SEND_TO_SERVER`: Relays user inputs and interactions (clicks, keyups) from components back to the composer.
 *    - `DATA_MODEL_CHANGE`: Transmits state value modifications back upward for cross-surface bindings.
 *    - `FORCE_UNBLOCK`: Emergency override signal allowing users to force-unblock locked frames.
 *
 * ### 🕒 Lifecycle Phases
 *
 * #### Phase 1: Bootstrapping & Handshake
 * Instantiated on module load. Immediately hooks into window postMessage events.
 * The handshake signal `RENDERER_READY` is deferred until a dynamic framework renderer
 * has been successfully bootstrapped and attached, structurally resolving dynamic inter-frame timing races.
 *
 * #### Phase 2: Renderer Registration
 * Framework catalogs (Angular, Lit) wire themselves into the bridge context using {@link attachRenderer}.
 * This sets up core processing hooks, lifecycle state handlers (`onSurfaceReady`, `onSurfaceCleared`),
 * and reactive data binding pipelines.
 *
 * #### Phase 3: The "Two-Step Layout Dispatch"
 * To prevent rendering race-conditions, flickers, and memory leaks on hot-reloads or template swaps,
 * the bridge utilizes a specialized double-tick scheduling model upon receiving `createSurface` commands:
 * - **Step 1 (Sync Reset)**: Synchronously dispatches a `null` payload to immediately trigger unmounting/reset
 *   of any active rendering layout.
 * - **Step 2 (Deferred Mount)**: Defers rendering the actual blueprint layout to the next event loop tick
 *   using `setTimeout(..., 0)` to guarantee clean canvas initialization.
 *
 * #### Phase 4: Reactive State Mapping
 * Upon surface registration, the bridge constructs a dynamic, deep reactive observer map
 * mapping surface events to data model mutations, converting state changes to outbox posts.
 * A central connection registry manages active surface subscriptions, preventing linear memory leak growth.
 *
 * #### Phase 5: Complete Teardown
 * When the parent frame refreshes, hot-reloads, or in test environments, the {@link destroy} method
 * fully cleanses the runtime space: removing window listeners, canceling pending macro-task timers,
 * destroying overlays, and invoking connection unsubscriptions to guarantee a clean slate.
 */
export declare class PreviewBridge {
    /** The single active framework rendering stack connection hook. */
    private activeRenderer;
    /** Indicates whether the bridge is actively listening for incoming messages. */
    private isListening;
    /**
     * A reference to the dynamically injected blocking overlay element in the DOM, or null if no overlay is active.
     * Used to prevent user interaction and display status messages during layout processing.
     */
    private overlayElement;
    /** The scheduled macro-task timer identifier deferred for layout payload processing. */
    private renderTimeoutId?;
    /** The registry of active framework surface connections currently linked and managed by the bridge. */
    private activeConnections;
    /** Tracks the currently applied theme in the DOM to avoid redundant DOM mutations. */
    private currentAppliedTheme?;
    /** Handles DOM mutations and window viewport resizing to broadcast dimension updates to the host. */
    private readonly surfaceResizeObserver;
    private readonly cachedParentOrigin;
    /** Cached iframe MCP proxy client. */
    private mcpClient;
    /**
     * Returns the IframeMcpClient proxy, creating and caching it if needed.
     */
    getMcpClient(): IframeMcpClient;
    /**
     * Returns the currently attached renderer processor, if any.
     */
    getActiveProcessor(): RendererProcessor | undefined;
    /**
     * Initializes a new PreviewBridge instance.
     * Sets up the global window message listener, observes layout dimensions, and applies initial theme from URL if present.
     */
    constructor();
    /**
     * Measures the rendered content's maximum scroll/offset dimensions and dispatches a
     * `SURFACE_RESIZE` message to the host window if dimensions have changed.
     *
     * This is triggered on:
     * 1. DOM mutations and element resize events via ResizeObserver.
     * 2. Window viewport resize events.
     * 3. Initial renderer attachment (`attachRenderer`).
     * 4. A2UI surface lifecycle events (`RENDER_A2UI` and surface clearing).
     *
     * @param force When true, bypasses the dimension deduplication cache.
     */
    dispatchSurfaceResize(force?: boolean): void;
    /**
     * Applies light/dark mode theme styles and attributes to document.documentElement and document.body.
     * Toggles the `.dark-theme` class, sets `color-scheme` CSS style, and `data-theme` attribute.
     *
     * @param theme The target theme ('light' or 'dark').
     */
    applyThemeToDom(theme: ThemePreference): void;
    private initThemeFromUrl;
    /**
     * Attaches a framework rendering processor to the bridge, centralizing payload processing,
     * dynamic surface ID extraction, and connection management.
     *
     * @param processor The framework-specific message processor.
     * @param config The configuration object containing the surface group and lifecycle callbacks.
     * @return A subscription handle to detach the renderer and clean up surface connections.
     */
    attachRenderer(processor: RendererProcessor, config: RendererConfig): SurfaceStateSubscription;
    /**
     * Cleanly tears down the active bridge instance, disposing of resources and removing event listeners.
     * Unsubscribes all active surface group connections, clears pending timers, removes global window
     * listeners, deletes any active blocking overlay DOM elements, and resets internal registries.
     * Highly critical to invoke in hot-reloads or test tear-downs to avoid memory leaks and test pollution.
     */
    destroy(): void;
    private resolveExpectedParentOrigin;
    /**
     * Safe cross-origin messenger that transmits a bridge message upward to the parent host window.
     * Incorporates environment checks to prevent errors in non-browser contexts and permits
     * self-transmission in test environments.
     *
     * @param message The structured bridge message package containing type and payload.
     */
    sendMessage(message: BridgeMessage): void;
    /**
     * Envelopes and dispatches a user interaction or catalog event payload back to the Composer parent frame.
     * Wraps the event payload into a standard `SEND_TO_SERVER` message.
     *
     * @param action The declarative action payload containing click, input, or navigation events.
     * @param [version='v0.9'] The A2UI protocol specification version.
     */
    sendAction(action: unknown, version?: string): void;
    /**
     * Event listener callback for the incoming messages from the Shell.
     *
     * Safely filters messages to ensure they originate from the same window or the parent window,
     * and dispatches incoming messaging events to specialized static methods.
     *
     * @param event The raw window message event.
     */
    private readonly messageListener;
    /**
     * Routes incoming MCP_RESPONSE messages to the IframeMcpClient pending request.
     */
    private handleMcpResponse;
    /**
     * Handles incoming theme change requests.
     */
    private handleSetTheme;
    /**
     * Handles incoming blocking overlay requests.
     */
    private handleSetBlockingState;
    /**
     * Dynamic interceptor mapping incoming state changes back into a standard render lifecycle payload.
     */
    private handleIncomingDataModelChange;
    /**
     * Orchestrates applying rendering payloads using the Two-Step Dispatch pattern.
     * If a createSurface instruction is present, it synchronously triggers a clear/unmount,
     * then defers the rendering actual layout command payload to a clean event cycle task.
     */
    private dispatchRenderA2ui;
    /**
     * Renders the specified payload array, mapping surface creation handles,
     * or delegates a resetting null command.
     */
    private handleRenderA2ui;
    /**
     * Resets active renderer properties, clearing tracking handles and posting delete signals.
     */
    private resetActiveRendererState;
    /**
     * Encapsulates the multi-level reactive subscription pipeline between surface lifecycle
     * events and data model mutations, automatically formatting and transmitting synchronization
     * payloads (`DATA_MODEL_CHANGE`) back to the parent Composer window.
     * Incorporates defensive guards for mock structures and a Map Connection Registry to prevent
     * duplicate listeners and memory leaks during tab switching or hot-reloading.
     *
     * @param surfaceGroup The surface group or catalog renderer service model to connect.
     * @return A unified teardown handle exposing a single unsubscribe method to cleanly reclaim all child observers.
     */
    private connectSurfaceGroup;
    /**
     * Attaches the incoming postMessage listener to the global window object.
     * Prevents redundant registrations by guarding with the `isListening` state flag
     * and checking for the presence of a browser window context.
     */
    private initMessageListener;
    /**
     * Manages the lifecycle and styling of the full-screen user-blocking overlay.
     * Displays status messages when layout rendering processes are active and injects a
     * manual fallback button to force-unblock interactions by notifying the parent frame.
     *
     * @param blocked Indicates if the user-blocking overlay should be shown (true) or removed (false).
     * @param [customMessage] Optional text message to display on the overlay.
     */
    private handleBlockingOverlay;
    /**
     * Handles static requests to retrieve catalog configuration definitions.
     * Attempts to fetch from the catalog endpoint, implements fallback mechanisms to handle SPA
     * router redirects, strips JSON vulnerability safety prefixes, and transmits the resulting
     * JSON payload or error status back to the host container.
     */
    private fetchWithTimeout;
    /**
     * Coordinates in-memory retrieval (`catalogJson`) vs. HTTP network fetching
     * (including SPA HTML fallback to `/catalog.json`).
     */
    private resolveCatalog;
    /**
     * Strips potential XSSI vulnerability prefixes (`)]}'\n`) and executes `JSON.parse()`.
     */
    private parseCatalogData;
    /**
     * Handles static requests to retrieve catalog configuration definitions.
     * Attempts to fetch from the catalog endpoint, implements fallback mechanisms to handle SPA
     * router redirects, strips JSON vulnerability safety prefixes, and transmits the resulting
     * JSON payload or error status back to the host container.
     */
    private handleGetCatalog;
    /**
     * Invokes the getComponentUsages callback and returns the resolved usages.
     */
    private handleGetComponentUsages;
    /**
     * Safely triggers the onCatalogResolved callback if registered in the active renderer config.
     */
    private notifyCatalogResolved;
}
declare global {
    interface Window {
        a2uiBridge: PreviewBridge;
    }
}
/**
 * The global singleton Preview Bridge instance.
 */
export declare const a2uiBridge: PreviewBridge;
