// src/bridge-message.ts
var ThemePreference = /* @__PURE__ */ ((ThemePreference2) => {
  ThemePreference2["LIGHT"] = "light";
  ThemePreference2["DARK"] = "dark";
  return ThemePreference2;
})(ThemePreference || {});

// src/instrumentation-overrides.ts
var isInstrumented;
var methods = [
  "log",
  "warn",
  "error",
  "info",
  "debug"
];
var originalConsoleMethods;
var originalOnError;
var rejectionHandler;
function deepCloneSafe(obj, ancestors = /* @__PURE__ */ new Set()) {
  if (obj instanceof Error) {
    return { message: obj.message, stack: obj.stack };
  }
  if (obj === void 0) return "undefined";
  if (obj instanceof Date) return obj.toISOString();
  if (obj instanceof RegExp) return obj.toString();
  if (obj instanceof Map) {
    return Array.from(obj.entries()).map(([k, v]) => [
      deepCloneSafe(k, ancestors),
      deepCloneSafe(v, ancestors)
    ]);
  }
  if (obj instanceof Set) {
    return Array.from(obj.values()).map((v) => deepCloneSafe(v, ancestors));
  }
  if (typeof obj === "function") return "[Function Callback]";
  if (typeof obj === "symbol") return obj.toString();
  if (typeof obj === "bigint") return `${obj.toString()}n`;
  if (typeof Node !== "undefined" && obj instanceof Node) return `[DOM Node: ${obj.nodeName}]`;
  if (typeof window !== "undefined" && obj === window) return "[Window Scope]";
  if (typeof obj === "object" && obj !== null) {
    if (ancestors.has(obj)) {
      return "[Circular Reference]";
    }
    ancestors.add(obj);
    try {
      if (Array.isArray(obj)) {
        return obj.map((item) => deepCloneSafe(item, ancestors));
      }
      const res = {};
      const record = obj;
      for (const key of Object.keys(record)) {
        try {
          res[key] = deepCloneSafe(record[key], ancestors);
        } catch {
          res[key] = "[Unserializable Property]";
        }
      }
      return res;
    } finally {
      ancestors.delete(obj);
    }
  }
  return obj;
}
function logTelemetryError(label, err) {
  const originalError = originalConsoleMethods && originalConsoleMethods.error || console.error;
  originalError.call(console, label, err);
}
function overrideConsoleMethods(sender) {
  if (!originalConsoleMethods) {
    originalConsoleMethods = {};
  }
  let isSerializing = false;
  methods.forEach((method) => {
    const current = console[method];
    if (current && current.__a2uiOriginal) {
      return;
    }
    const original = current;
    originalConsoleMethods[method] = original;
    const wrapper = (...args) => {
      original.apply(console, args);
      if (isSerializing) return;
      try {
        isSerializing = true;
        const message = args.map((arg) => {
          if (arg === void 0) return "undefined";
          if (arg instanceof Error) return arg.message;
          if (typeof arg === "string") return arg;
          const cloned = deepCloneSafe(arg);
          return typeof cloned === "string" ? cloned : JSON.stringify(cloned);
        }).join(" ");
        const errorArg = args.find((arg) => arg instanceof Error);
        const stack = errorArg ? errorArg.stack : void 0;
        sender.sendMessage({
          type: "CONSOLE_LOG" /* CONSOLE_LOG */,
          payload: {
            level: method,
            message,
            stack
          }
        });
      } catch (err) {
        logTelemetryError("A2UI Bridge Telemetry Error (Console):", err);
      } finally {
        isSerializing = false;
      }
    };
    wrapper.__a2uiOriginal = original;
    console[method] = wrapper;
  });
}
function overrideWindowError(sender) {
  originalOnError = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    try {
      sender.sendMessage({
        type: "CONSOLE_LOG" /* CONSOLE_LOG */,
        payload: {
          level: "error",
          message: String(message),
          stack: error ? error.stack : `${source || ""}:${lineno || 0}:${colno || 0}`
        }
      });
    } catch (err) {
      logTelemetryError("A2UI Bridge Telemetry Error (Window Error):", err);
    }
    if (originalOnError) {
      return originalOnError(message, source, lineno, colno, error);
    }
    return false;
  };
}
function overrideUnhandledRejection(sender) {
  rejectionHandler = (event) => {
    try {
      const message = event.reason instanceof Error ? event.reason.message : String(event.reason);
      const stack = event.reason instanceof Error ? event.reason.stack : void 0;
      sender.sendMessage({
        type: "CONSOLE_LOG" /* CONSOLE_LOG */,
        payload: {
          level: "error",
          message: `Unhandled Rejection: ${message}`,
          stack
        }
      });
    } catch (err) {
      logTelemetryError("A2UI Bridge Telemetry Error (Unhandled Rejection):", err);
    }
  };
  window.addEventListener("unhandledrejection", rejectionHandler);
}
function setupInstrumentationOverrides(sender) {
  if (isInstrumented || typeof window === "undefined") return;
  isInstrumented = true;
  overrideConsoleMethods(sender);
  overrideWindowError(sender);
  overrideUnhandledRejection(sender);
}
function teardownInstrumentationOverrides() {
  if (!isInstrumented || typeof window === "undefined") return;
  methods.forEach((method) => {
    if (originalConsoleMethods[method]) {
      console[method] = originalConsoleMethods[method];
    }
  });
  originalConsoleMethods = {};
  window.onerror = originalOnError;
  originalOnError = null;
  if (rejectionHandler) {
    window.removeEventListener("unhandledrejection", rejectionHandler);
    rejectionHandler = null;
  }
  isInstrumented = false;
}

// src/domain-origin-verification.ts
var DomainOriginVerificationService = class {
  /**
   * Verifies if a given message event comes from an explicitly trusted origin.
   *
   * Depends on the `?origin=` URL parameter pairing contract to dynamically authenticate
   * cross-origin communication with the parent Shell context.
   *
   * Note: This Javascript-level origin validation assumes the presence of a strict
   * outgoing HTTP CSP `frame-ancestors` policy configured on the hosting server
   * to protect against raw clickjacking and malicious iframe embedding prior to bridging.
   */
  static verifyStrictOrigin(eventOrigin, eventSource, parentWindow) {
    if (!eventSource || eventSource !== parentWindow) {
      return false;
    }
    if (typeof window !== "undefined") {
      if (eventOrigin === window.location.origin) {
        return true;
      }
      if (window.location.search) {
        try {
          const params = new URLSearchParams(window.location.search);
          const expectedOrigin = params.get("origin");
          if (expectedOrigin && eventOrigin === expectedOrigin) {
            return true;
          }
        } catch {
        }
      }
    }
    return false;
  }
};

// src/iframe-mcp-client.ts
var IframeMcpClient = class {
  constructor(sendMcpRequest, timeoutMs = 3e4) {
    this.sendMcpRequest = sendMcpRequest;
    this.timeoutMs = timeoutMs;
    this.pendingRequests = /* @__PURE__ */ new Map();
  }
  async callTool(params) {
    const requestId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `mcp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        reject(new Error(`MCP tool call "${params.name}" timed out after ${this.timeoutMs}ms`));
      }, this.timeoutMs);
      this.pendingRequests.set(requestId, { resolve, reject, timer });
      this.sendMcpRequest({
        requestId,
        toolName: params.name,
        args: params.arguments ?? {}
      });
    });
  }
  handleResponse(payload) {
    const pending = this.pendingRequests.get(payload.requestId);
    if (!pending) {
      return;
    }
    clearTimeout(pending.timer);
    this.pendingRequests.delete(payload.requestId);
    if (payload.error) {
      pending.reject(new Error(payload.error));
    } else {
      pending.resolve(payload.result);
    }
  }
};

// src/surface-resize-observer.ts
var SurfaceResizeObserver = class {
  constructor(onResize) {
    this.onResize = onResize;
    this.lastKnownHeight = null;
    this.lastKnownWidth = null;
    this.init();
  }
  /**
   * Initializes window resize listeners and DOM element observers.
   */
  init() {
    if (typeof window === "undefined") return;
    if (!this.windowViewportResizeListener) {
      this.windowViewportResizeListener = () => this.measureAndDispatch();
      window.addEventListener("resize", this.windowViewportResizeListener);
    }
    if (typeof document !== "undefined" && document.readyState === "loading") {
      if (!this.domContentLoadedListener) {
        this.domContentLoadedListener = () => {
          this.setupDomElementObservers();
          this.measureAndDispatch();
          this.domContentLoadedListener = void 0;
        };
        document.addEventListener("DOMContentLoaded", this.domContentLoadedListener, { once: true });
      }
      return;
    }
    this.setupDomElementObservers();
  }
  setupDomElementObservers() {
    if (typeof ResizeObserver === "undefined") return;
    if (!this.domResizeObserver) {
      this.domResizeObserver = new ResizeObserver(() => {
        this.measureAndDispatch();
      });
    }
    if (typeof document !== "undefined") {
      if (document.body) {
        this.domResizeObserver.observe(document.body);
      }
      if (document.documentElement && document.documentElement !== document.body) {
        this.domResizeObserver.observe(document.documentElement);
      }
    }
  }
  /**
   * Measures current scroll and offset dimensions of document body/documentElement,
   * dispatching a callback only if dimensions have changed since last measurement (or if forced).
   */
  measureAndDispatch(force = false) {
    if (typeof document === "undefined") return;
    const body = document.body;
    const docEl = document.documentElement;
    const height = Math.max(
      body?.scrollHeight || 0,
      body?.offsetHeight || 0,
      docEl?.offsetHeight || 0
    );
    const width = Math.max(body?.scrollWidth || 0, body?.offsetWidth || 0, docEl?.offsetWidth || 0);
    if (height <= 0) return;
    if (force || height !== this.lastKnownHeight || width !== this.lastKnownWidth) {
      this.lastKnownHeight = height;
      this.lastKnownWidth = width;
      this.onResize({ height, width });
    }
  }
  /**
   * Cleans up observers, window listeners, and resets cached dimensions.
   */
  destroy() {
    if (this.domResizeObserver) {
      this.domResizeObserver.disconnect();
      this.domResizeObserver = void 0;
    }
    if (this.windowViewportResizeListener) {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", this.windowViewportResizeListener);
      }
      this.windowViewportResizeListener = void 0;
    }
    if (this.domContentLoadedListener) {
      if (typeof document !== "undefined") {
        document.removeEventListener("DOMContentLoaded", this.domContentLoadedListener);
      }
      this.domContentLoadedListener = void 0;
    }
    this.lastKnownHeight = null;
    this.lastKnownWidth = null;
  }
};

// src/preview-bridge.ts
var ERROR_OVERLAY_DEBOUNCE_MS = 350;
function isErrorLike(val) {
  if (val instanceof Error || Object.prototype.toString.call(val) === "[object Error]") {
    return true;
  }
  return typeof val === "object" && val !== null && "message" in val && typeof val["message"] === "string" && "stack" in val && typeof val["stack"] === "string" && !("nodeType" in val) && !("component" in val);
}
function safeSerialize(val) {
  function sanitize(v, seen) {
    if (typeof v === "bigint") return `${v.toString()}n`;
    if (v !== null && typeof v === "object") {
      if (seen.has(v)) return "[Circular]";
      seen.add(v);
      let result;
      if (isErrorLike(v)) {
        result = {
          name: v.name || "Error",
          message: v.message,
          stack: v.stack
        };
      } else if ("nodeType" in v && v["nodeType"] === 1 && typeof v["tagName"] === "string") {
        result = `[Element: <${v["tagName"].toLowerCase()}>]`;
      } else if (Array.isArray(v)) {
        result = v.map((curr) => sanitize(curr, seen));
      } else {
        const objResult = {};
        for (const k of Object.keys(v)) {
          objResult[k] = sanitize(v[k], seen);
        }
        result = objResult;
      }
      seen.delete(v);
      return result;
    }
    return v;
  }
  try {
    const res = JSON.stringify(sanitize(val, /* @__PURE__ */ new WeakSet()));
    return res === void 0 ? "undefined" : res;
  } catch {
    return "[Unserializable]";
  }
}
var PreviewBridge = class {
  /**
   * Initializes a new PreviewBridge instance.
   * Sets up the global window message listener, observes layout dimensions, and applies initial theme from URL if present.
   */
  constructor() {
    /** The single active framework rendering stack connection hook. */
    this.activeRenderer = null;
    /** Indicates whether the bridge is actively listening for incoming messages. */
    this.isListening = false;
    /**
     * A reference to the dynamically injected blocking overlay element in the DOM, or null if no overlay is active.
     * Used to prevent user interaction and display status messages during layout processing.
     */
    this.overlayElement = null;
    /** The registry of active framework surface connections currently linked and managed by the bridge. */
    this.activeConnections = /* @__PURE__ */ new Set();
    /** Handles DOM mutations and window viewport resizing to broadcast dimension updates to the host. */
    this.surfaceResizeObserver = new SurfaceResizeObserver((dimensions) => {
      this.sendMessage({
        type: "SURFACE_RESIZE" /* SURFACE_RESIZE */,
        payload: dimensions
      });
    });
    this.cachedParentOrigin = null;
    /** Cached iframe MCP proxy client. */
    this.mcpClient = null;
    /**
     * Event listener callback for the incoming messages from the Shell.
     *
     * Safely filters messages to ensure they originate from the same window or the parent window,
     * and dispatches incoming messaging events to specialized static methods.
     *
     * @param event The raw window message event.
     */
    this.messageListener = (event) => {
      if (!DomainOriginVerificationService.verifyStrictOrigin(event.origin, event.source, window.parent))
        return;
      const data = event.data;
      if (!data || typeof data !== "object" || !data.type) return;
      switch (data.type) {
        case "SET_BLOCKING_STATE" /* SET_BLOCKING_STATE */:
          this.handleSetBlockingState(data.payload);
          break;
        case "DATA_MODEL_CHANGE" /* DATA_MODEL_CHANGE */:
          this.handleIncomingDataModelChange(data.payload);
          break;
        case "RENDER_A2UI" /* RENDER_A2UI */:
          this.dispatchRenderA2ui(
            data.payload !== void 0 ? data.payload : data,
            Boolean(data.isStreaming)
          );
          break;
        case "GET_CATALOG" /* GET_CATALOG */:
          void this.handleGetCatalog();
          break;
        case "GET_COMPONENT_USAGES" /* GET_COMPONENT_USAGES */:
          void this.handleGetComponentUsages();
          break;
        case "MCP_RESPONSE" /* MCP_RESPONSE */:
          this.handleMcpResponse(data.payload);
          break;
        case "SET_THEME" /* SET_THEME */:
          this.handleSetTheme(data.payload);
          break;
        default:
          console.warn(`PreviewBridge: Unrecognized incoming message type: ${data.type}`);
      }
    };
    if (typeof window !== "undefined" && window.location?.search) {
      const params = new URLSearchParams(window.location.search);
      this.cachedParentOrigin = params.get("origin");
    }
    this.initMessageListener();
    setupInstrumentationOverrides(this);
    this.initThemeFromUrl();
  }
  /**
   * Returns the IframeMcpClient proxy, creating and caching it if needed.
   */
  getMcpClient() {
    if (!this.mcpClient) {
      this.mcpClient = new IframeMcpClient((payload) => {
        this.sendMessage({
          type: "MCP_REQUEST" /* MCP_REQUEST */,
          payload
        });
      });
    }
    return this.mcpClient;
  }
  /**
   * Returns the currently attached renderer processor, if any.
   */
  getActiveProcessor() {
    return this.activeRenderer?.processor;
  }
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
  dispatchSurfaceResize(force = false) {
    this.surfaceResizeObserver.measureAndDispatch(force);
  }
  /**
   * Applies light/dark mode theme styles and attributes to document.documentElement and document.body.
   * Toggles the `.dark-theme` class, sets `color-scheme` CSS style, and `data-theme` attribute.
   *
   * @param theme The target theme ('light' or 'dark').
   */
  applyThemeToDom(theme) {
    if (typeof document === "undefined" || !document.documentElement) return;
    this.currentAppliedTheme = theme;
    const isDark = theme === "dark" /* DARK */;
    document.documentElement.classList.toggle("dark-theme", isDark);
    document.documentElement.style.colorScheme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    if (document.body) {
      document.body.classList.toggle("dark-theme", isDark);
      document.body.style.colorScheme = theme;
      document.body.setAttribute("data-theme", theme);
    }
  }
  initThemeFromUrl() {
    if (typeof window === "undefined" || !window.location || !window.location.search) return;
    const params = new URLSearchParams(window.location.search);
    const theme = params.get("theme");
    if (theme && Object.values(ThemePreference).includes(theme)) {
      this.applyThemeToDom(theme);
    }
  }
  /**
   * Attaches a framework rendering processor to the bridge, centralizing payload processing,
   * dynamic surface ID extraction, and connection management.
   *
   * @param processor The framework-specific message processor.
   * @param config The configuration object containing the surface group and lifecycle callbacks.
   * @return A subscription handle to detach the renderer and clean up surface connections.
   */
  attachRenderer(processor, config) {
    if (!config) {
      console.error("PreviewBridge: config parameter is required in RendererConfig.");
      return { unsubscribe: () => {
      } };
    }
    if (!config.surfaceGroup) {
      console.error("PreviewBridge: surfaceGroup parameter is required in RendererConfig.");
      return { unsubscribe: () => {
      } };
    }
    if (this.activeRenderer) {
      console.warn(
        "PreviewBridge: A renderer is already attached. Replacing the previous renderer."
      );
      this.resetActiveRendererState();
    }
    const surfaceConnection = this.connectSurfaceGroup(config.surfaceGroup);
    const activeSurfaceIds = /* @__PURE__ */ new Set();
    this.activeRenderer = {
      processor,
      config,
      activeSurfaceIds
    };
    if (this.currentAppliedTheme) {
      this.applyThemeToDom(this.currentAppliedTheme);
      if (config.onThemeChange) {
        try {
          config.onThemeChange(this.currentAppliedTheme);
        } catch (error) {
          console.error(
            "PreviewBridge: Error inside onThemeChange callback during attachment:",
            error
          );
        }
      }
    }
    this.sendMessage({
      type: "RENDERER_READY" /* RENDERER_READY */
    });
    this.dispatchSurfaceResize();
    const attachConnection = {
      unsubscribe: () => {
        if (this.activeRenderer?.processor === processor) {
          this.activeRenderer = null;
        }
        surfaceConnection.unsubscribe();
        this.activeConnections.delete(attachConnection);
      }
    };
    this.activeConnections.add(attachConnection);
    return attachConnection;
  }
  /**
   * Cleanly tears down the active bridge instance, disposing of resources and removing event listeners.
   * Unsubscribes all active surface group connections, clears pending timers, removes global window
   * listeners, deletes any active blocking overlay DOM elements, and resets internal registries.
   * Highly critical to invoke in hot-reloads or test tear-downs to avoid memory leaks and test pollution.
   */
  destroy() {
    teardownInstrumentationOverrides();
    this.surfaceResizeObserver.destroy();
    if (typeof window !== "undefined") {
      window.removeEventListener("message", this.messageListener);
    }
    if (this.renderTimeoutId !== void 0) {
      clearTimeout(this.renderTimeoutId);
      this.renderTimeoutId = void 0;
    }
    this.handleBlockingOverlay(false);
    this.isListening = false;
    this.activeRenderer = null;
    this.currentAppliedTheme = void 0;
    const connections = Array.from(this.activeConnections);
    for (const connection of connections) {
      try {
        connection.unsubscribe();
      } catch (err) {
        console.error("PreviewBridge: Error during connection unsubscribe:", err);
      }
    }
    this.activeConnections.clear();
    this.mcpClient = null;
  }
  resolveExpectedParentOrigin() {
    if (typeof window === "undefined") {
      return "*";
    }
    if (this.cachedParentOrigin && /^https?:\/\/[^/]+$/.test(this.cachedParentOrigin)) {
      return this.cachedParentOrigin;
    }
    return window.location.origin || "*";
  }
  /**
   * Safe cross-origin messenger that transmits a bridge message upward to the parent host window.
   * Incorporates environment checks to prevent errors in non-browser contexts and permits
   * self-transmission in test environments.
   *
   * @param message The structured bridge message package containing type and payload.
   */
  sendMessage(message) {
    if (typeof window !== "undefined" && window.parent && window.parent !== window) {
      const targetOrigin = this.resolveExpectedParentOrigin();
      try {
        window.parent.postMessage(message, targetOrigin);
      } catch (error) {
        if (error instanceof DOMException) {
          console.error("[PreviewBridge] Blocked cross-origin postMessage:", error);
        } else {
          throw error;
        }
      }
    }
  }
  /**
   * Envelopes and dispatches a user interaction or catalog event payload back to the Composer parent frame.
   * Wraps the event payload into a standard `SEND_TO_SERVER` message.
   *
   * @param action The declarative action payload containing click, input, or navigation events.
   * @param [version='v0.9'] The A2UI protocol specification version.
   */
  sendAction(action, version = "v0.9") {
    this.sendMessage({
      type: "SEND_TO_SERVER" /* SEND_TO_SERVER */,
      payload: {
        version,
        action
      }
    });
  }
  /**
   * Routes incoming MCP_RESPONSE messages to the IframeMcpClient pending request.
   */
  handleMcpResponse(payload) {
    const payloadObj = payload;
    if (!payloadObj || typeof payloadObj.requestId !== "string") return;
    this.mcpClient?.handleResponse(payloadObj);
  }
  /**
   * Handles incoming theme change requests.
   */
  handleSetTheme(payload) {
    const payloadObj = payload;
    if (payloadObj && Object.values(ThemePreference).includes(payloadObj.theme)) {
      const theme = payloadObj.theme;
      this.applyThemeToDom(theme);
      if (this.activeRenderer?.config.onThemeChange) {
        try {
          this.activeRenderer.config.onThemeChange(theme);
        } catch (error) {
          console.error("PreviewBridge: Error inside onThemeChange callback:", error);
        }
      }
    } else {
      console.warn("PreviewBridge: Malformed SET_THEME payload received:", payload);
    }
  }
  /**
   * Handles incoming blocking overlay requests.
   */
  handleSetBlockingState(payload) {
    const payloadObj = payload;
    const blocked = !!(payloadObj && payloadObj.blocked);
    const messageStr = payloadObj && payloadObj.message;
    this.handleBlockingOverlay(blocked, messageStr);
  }
  /**
   * Dynamic interceptor mapping incoming state changes back into a standard render lifecycle payload.
   */
  handleIncomingDataModelChange(payload) {
    const payloadObj = payload;
    if (payloadObj && payloadObj.updateDataModel) {
      const renderPayload = [
        {
          version: "v0.9",
          updateDataModel: payloadObj.updateDataModel
        }
      ];
      this.dispatchRenderA2ui(renderPayload);
    }
  }
  /**
   * Orchestrates applying rendering payloads using the Two-Step Dispatch pattern.
   * If a createSurface instruction is present, it synchronously triggers a clear/unmount,
   * then defers the rendering actual layout command payload to a clean event cycle task.
   */
  dispatchRenderA2ui(payload, isStreaming = false) {
    if (!this.activeRenderer) {
      console.warn(
        "PreviewBridge: Received RENDER_A2UI but no active renderer is attached. Ignoring payload."
      );
      return;
    }
    const hasCreateSurface = Array.isArray(payload) && payload.some((item) => item && typeof item === "object" && "createSurface" in item);
    if (hasCreateSurface) {
      try {
        this.handleRenderA2ui(null, isStreaming, false);
      } catch (err) {
        console.error("PreviewBridge: Error during RENDER_A2UI null reset dispatch:", err);
      }
      if (this.renderTimeoutId) {
        clearTimeout(this.renderTimeoutId);
      }
      this.renderTimeoutId = setTimeout(() => {
        try {
          this.handleRenderA2ui(payload, isStreaming);
        } catch (err) {
          console.error("PreviewBridge: Error during deferred RENDER_A2UI payload dispatch:", err);
        }
      }, 0);
    } else {
      try {
        this.handleRenderA2ui(payload, isStreaming);
      } catch (err) {
        console.error("PreviewBridge: Error during direct RENDER_A2UI payload dispatch:", err);
      }
    }
  }
  /**
   * Renders the specified payload array, mapping surface creation handles,
   * or delegates a resetting null command.
   */
  handleRenderA2ui(payload, isStreaming = false, scheduleResize = true) {
    if (!this.activeRenderer) return;
    if (payload === null) {
      this.resetActiveRendererState(scheduleResize);
      return;
    }
    if (Array.isArray(payload)) {
      const createSurfaceCommand = payload.find(
        (item) => item && typeof item === "object" && "createSurface" in item
      );
      let hasCreateSurface = false;
      let surfaceId;
      const createSurface = createSurfaceCommand && createSurfaceCommand.createSurface;
      if (createSurface) {
        hasCreateSurface = true;
        const catalogId = createSurface.catalogId;
        if (catalogId) {
          this.notifyCatalogResolved(catalogId);
        }
        surfaceId = createSurface.surfaceId;
        if (surfaceId) {
          const deleteMessage = {
            version: "v0.9",
            deleteSurface: {
              surfaceId
            }
          };
          try {
            this.activeRenderer.processor.processMessages([deleteMessage]);
          } catch (err) {
            console.debug("PreviewBridge: pre-delete of surface failed", surfaceId, err);
          }
          this.activeRenderer.activeSurfaceIds.add(surfaceId);
        } else {
          console.warn("PreviewBridge: createSurface command found, but no surfaceId present.");
        }
      }
      let clonedPayload = payload;
      if (typeof structuredClone === "function") {
        try {
          clonedPayload = structuredClone(payload);
        } catch {
          clonedPayload = payload;
        }
      }
      let rendered = false;
      try {
        this.activeRenderer.processor.processMessages(clonedPayload);
        rendered = true;
        if (this.activeRenderer.config.onError) {
          this.activeRenderer.config.onError(null);
        }
        this.sendMessage({ type: "RENDER_SUCCESS" /* RENDER_SUCCESS */ });
      } catch (err) {
        console.error("PreviewBridge: Error during message processing:", err);
        if (!isStreaming && this.activeRenderer.config.onError) {
          this.activeRenderer.config.onError(err instanceof Error ? err : new Error(String(err)));
        }
        this.sendMessage({
          type: "RENDER_ERROR" /* RENDER_ERROR */,
          error: safeSerialize(err)
        });
      }
      if (rendered && hasCreateSurface && surfaceId) {
        this.activeRenderer.config.onSurfaceReady(surfaceId);
      }
      setTimeout(() => this.dispatchSurfaceResize(), 0);
    } else {
      console.warn("PreviewBridge: Unexpected non-array RENDER_A2UI payload received:", payload);
    }
  }
  /**
   * Resets active renderer properties, clearing tracking handles and posting delete signals.
   */
  resetActiveRendererState(scheduleResize = true) {
    if (!this.activeRenderer) return;
    const { processor, config, activeSurfaceIds } = this.activeRenderer;
    for (const surfaceId of activeSurfaceIds) {
      try {
        processor.processMessages([
          {
            version: "v0.9",
            deleteSurface: {
              surfaceId
            }
          }
        ]);
      } catch (e) {
        console.warn(`PreviewBridge: Error clearing surface ${surfaceId} during reset:`, e);
      }
    }
    activeSurfaceIds.clear();
    if (config.onSurfaceCleared) {
      config.onSurfaceCleared();
    }
    if (scheduleResize) {
      setTimeout(() => this.dispatchSurfaceResize(), 0);
    }
  }
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
  connectSurfaceGroup(surfaceGroup) {
    const subscriptions = /* @__PURE__ */ new Map();
    if (!surfaceGroup || !surfaceGroup.onSurfaceCreated) {
      return { unsubscribe: () => {
      } };
    }
    const groupSubscription = surfaceGroup.onSurfaceCreated.subscribe(
      (surface) => {
        if (!surface || typeof surface !== "object" || !surface.id || !surface.dataModel) return;
        const existing = subscriptions.get(surface.id);
        if (existing) {
          existing.unsubscribe();
          subscriptions.delete(surface.id);
        }
        try {
          const modelSub = surface.dataModel.subscribe("", (newValue) => {
            this.sendMessage({
              type: "DATA_MODEL_CHANGE" /* DATA_MODEL_CHANGE */,
              payload: {
                updateDataModel: {
                  surfaceId: surface.id,
                  value: newValue
                }
              }
            });
          });
          if (modelSub) {
            subscriptions.set(surface.id, modelSub);
          }
        } catch (err) {
          console.error(`Error subscribing to data model for surface ${surface.id}:`, err);
        }
      }
    );
    const connection = {
      unsubscribe: () => {
        if (groupSubscription) {
          groupSubscription.unsubscribe();
        }
        subscriptions.forEach((sub) => sub.unsubscribe());
        subscriptions.clear();
        this.activeConnections.delete(connection);
      }
    };
    this.activeConnections.add(connection);
    return connection;
  }
  /**
   * Attaches the incoming postMessage listener to the global window object.
   * Prevents redundant registrations by guarding with the `isListening` state flag
   * and checking for the presence of a browser window context.
   */
  initMessageListener() {
    if (this.isListening || typeof window === "undefined") return;
    window.addEventListener("message", this.messageListener);
    this.isListening = true;
  }
  /**
   * Manages the lifecycle and styling of the full-screen user-blocking overlay.
   * Displays status messages when layout rendering processes are active and injects a
   * manual fallback button to force-unblock interactions by notifying the parent frame.
   *
   * @param blocked Indicates if the user-blocking overlay should be shown (true) or removed (false).
   * @param [customMessage] Optional text message to display on the overlay.
   */
  handleBlockingOverlay(blocked, customMessage) {
    if (typeof document === "undefined" || !document.body) return;
    if (blocked) {
      if (!this.overlayElement || !this.overlayElement.isConnected) {
        this.overlayElement = document.createElement("div");
        this.overlayElement.id = "a2ui-blocking-overlay";
        Object.assign(this.overlayElement.style, {
          position: "fixed",
          top: "0",
          left: "0",
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          zIndex: "999999",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "#ffffff",
          fontFamily: "sans-serif",
          backdropFilter: "blur(4px)"
        });
        const messageNode = document.createElement("p");
        messageNode.id = "a2ui-blocking-message";
        messageNode.innerText = customMessage || "Processing framework layouts...";
        this.overlayElement.appendChild(messageNode);
        const button = document.createElement("button");
        button.innerText = "Force Unblock";
        Object.assign(button.style, {
          marginTop: "16px",
          padding: "10px 20px",
          fontSize: "15px",
          fontWeight: "bold",
          cursor: "pointer",
          backgroundColor: "#f44336",
          color: "#ffffff",
          border: "none",
          borderRadius: "4px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
        });
        button.addEventListener("click", () => {
          this.sendMessage({
            type: "FORCE_UNBLOCK" /* FORCE_UNBLOCK */,
            payload: {}
          });
          this.handleBlockingOverlay(false);
        });
        this.overlayElement.appendChild(button);
        document.body.appendChild(this.overlayElement);
      } else {
        const msgElement = this.overlayElement.querySelector("#a2ui-blocking-message");
        if (msgElement) {
          msgElement.innerText = customMessage || "Processing framework layouts...";
        }
      }
    } else {
      if (this.overlayElement) {
        if (this.overlayElement.parentNode) {
          this.overlayElement.parentNode.removeChild(this.overlayElement);
        }
        this.overlayElement = null;
      }
    }
  }
  /**
   * Handles static requests to retrieve catalog configuration definitions.
   * Attempts to fetch from the catalog endpoint, implements fallback mechanisms to handle SPA
   * router redirects, strips JSON vulnerability safety prefixes, and transmits the resulting
   * JSON payload or error status back to the host container.
   */
  async fetchWithTimeout(url, timeoutMs = 3e3) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await window.fetch(url, { signal: controller.signal });
    } finally {
      clearTimeout(id);
    }
  }
  /**
   * Coordinates in-memory retrieval (`catalogJson`) vs. HTTP network fetching
   * (including SPA HTML fallback to `/catalog.json`).
   */
  async resolveCatalog() {
    const config = this.activeRenderer?.config;
    const inMemoryCatalog = config?.catalogJson ?? config?.catalog;
    if (inMemoryCatalog !== void 0) {
      return { rawData: inMemoryCatalog, isInMemory: true };
    }
    if (typeof window === "undefined" || !window.fetch) return null;
    let res = await this.fetchWithTimeout("catalog");
    if (!res.ok) {
      throw new Error(`Catalog fetch failed with status: ${res.status}`);
    }
    let rawText = await res.text();
    const trimmedLower = rawText.trim().toLowerCase();
    const isHtml = trimmedLower.startsWith("<!doctype") || trimmedLower.startsWith("<html");
    if (isHtml) {
      const fallbackRes = await this.fetchWithTimeout("catalog.json");
      if (!fallbackRes.ok) {
        throw new Error(
          `Catalog fetch returned HTML and fallback to catalog.json failed with status: ${fallbackRes.status}`
        );
      }
      const fallbackText = await fallbackRes.text();
      const fallbackTrimmedLower = fallbackText.trim().toLowerCase();
      if (fallbackTrimmedLower.startsWith("<!doctype") || fallbackTrimmedLower.startsWith("<html")) {
        throw new Error(
          "Catalog fetch returned HTML (SPA fallback) for both catalog and catalog.json. Ensure the catalog JSON is correctly hosted and served."
        );
      }
      res = fallbackRes;
      rawText = fallbackText;
    }
    return { rawData: rawText, isInMemory: false };
  }
  /**
   * Strips potential XSSI vulnerability prefixes (`)]}'\n`) and executes `JSON.parse()`.
   */
  parseCatalogData(data) {
    if (typeof data === "string") {
      const safetyPrefix = ")]}'\n";
      const jsonText = data.startsWith(safetyPrefix) ? data.substring(safetyPrefix.length) : data;
      return JSON.parse(jsonText);
    }
    return data;
  }
  /**
   * Handles static requests to retrieve catalog configuration definitions.
   * Attempts to fetch from the catalog endpoint, implements fallback mechanisms to handle SPA
   * router redirects, strips JSON vulnerability safety prefixes, and transmits the resulting
   * JSON payload or error status back to the host container.
   */
  async handleGetCatalog() {
    let resolved = null;
    try {
      resolved = await this.resolveCatalog();
      if (!resolved) return;
      const catalog = this.parseCatalogData(resolved.rawData);
      const catalogId = catalog?.catalogId;
      if (catalogId) {
        this.notifyCatalogResolved(catalogId);
      }
      this.sendMessage({
        type: "A2UI_CATALOG" /* A2UI_CATALOG */,
        payload: catalog
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (resolved?.isInMemory) {
        console.error("PreviewBridge: Error processing/parsing in-memory catalog:", error);
      }
      this.sendMessage({
        type: "A2UI_CATALOG" /* A2UI_CATALOG */,
        payload: {
          error: {
            message: errorMessage
          }
        }
      });
    }
  }
  /**
   * Invokes the getComponentUsages callback and returns the resolved usages.
   */
  async handleGetComponentUsages() {
    let usages = {};
    if (this.activeRenderer?.config.getComponentUsages) {
      try {
        usages = await this.activeRenderer.config.getComponentUsages();
      } catch (error) {
        console.error("PreviewBridge: Error invoking getComponentUsages:", error);
      }
    }
    this.sendMessage({
      type: "COMPONENT_USAGES" /* COMPONENT_USAGES */,
      payload: usages
    });
  }
  /**
   * Safely triggers the onCatalogResolved callback if registered in the active renderer config.
   */
  notifyCatalogResolved(catalogId) {
    if (this.activeRenderer?.config.onCatalogResolved) {
      try {
        this.activeRenderer.config.onCatalogResolved(catalogId);
      } catch (error) {
        console.error("PreviewBridge: Error inside onCatalogResolved callback:", error);
      }
    }
  }
};
var bridgeInstance = new PreviewBridge();
if (typeof window !== "undefined") {
  window.a2uiBridge = bridgeInstance;
}
var a2uiBridge = bridgeInstance;
export {
  ERROR_OVERLAY_DEBOUNCE_MS,
  PreviewBridge,
  SurfaceResizeObserver,
  a2uiBridge,
  isErrorLike,
  safeSerialize
};
