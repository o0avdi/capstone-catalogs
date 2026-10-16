var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};

// src/lit/lit-bridge.ts
import { LitElement, html, css } from "lit";
import { state } from "lit/decorators.js";
import { ContextProvider } from "@lit/context";
import { Context } from "@a2ui/lit/v0_9";
import {
  MessageProcessor
} from "@a2ui/web_core/v0_9";
import {
  a2uiBridge,
  ERROR_OVERLAY_DEBOUNCE_MS
} from "../index.js";
var A2uiSandboxRoot = class extends LitElement {
  constructor() {
    super(...arguments);
    // Core dynamic processing engine mapping actions outbox proxies
    this.processor = new MessageProcessor(
      this.constructor.catalogs,
      (action) => {
        a2uiBridge.sendAction(action);
      }
    );
    this.markdownProvider = new ContextProvider(this, {
      context: Context.markdown,
      initialValue: this.constructor.markdownRenderer
    });
    this.debouncedError = null;
    this.debounceTimeout = null;
    this.rendererConnection = null;
    this.contextRequestListener = (ev) => {
      const requestEv = ev;
      const ctx = requestEv.context;
      const resolved = typeof ctx === "object" && ctx !== null ? ctx.id || ctx.__context__ || ctx : ctx;
      const contextStr = resolved && typeof resolved.toString === "function" ? String(resolved) : typeof resolved === "string" ? resolved : "";
      if (this.markdownRenderer && contextStr.includes("A2UIMarkdown")) {
        requestEv.stopPropagation();
        requestEv.callback?.(this.markdownRenderer);
      }
    };
  }
  static {
    /** The static catalog list shared by all sandbox element instances */
    this.catalogs = [];
  }
  static {
    /** Optional preloaded catalog JSON data shared statically */
    this.catalogJson = void 0;
  }
  static {
    /** Optional custom markdown renderer callback shared statically */
    this.markdownRenderer = void 0;
  }
  static {
    /** Optional callback to retrieve component usage samples shared statically */
    this.getComponentUsages = void 0;
  }
  static {
    /** Optional callback when theme changes shared statically */
    this.onThemeChange = void 0;
  }
  static {
    this.styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .error-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      inset: 0;
      z-index: 9999;
      background-color: color-mix(in srgb, var(--a2ui-color-surface, canvas) 95%, transparent);
      color: var(--a2ui-color-error, #d32f2f);
      padding: 24px;
      font-family: monospace;
      overflow: auto;
      box-sizing: border-box;
    }

    .error-overlay h3 {
      margin-top: 0;
    }

    .error-overlay pre {
      white-space: pre-wrap;
      word-break: break-word;
      margin: 0;
    }
  `;
  }
  get markdownRenderer() {
    return this.markdownProvider.value;
  }
  set markdownRenderer(value) {
    this.markdownProvider.setValue(value);
  }
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("context-request", this.contextRequestListener);
    this.rendererConnection?.unsubscribe();
    this.rendererConnection = a2uiBridge.attachRenderer(this.processor, {
      surfaceGroup: this.processor.model,
      catalogJson: this.constructor.catalogJson,
      getComponentUsages: this.constructor.getComponentUsages,
      onThemeChange: this.constructor.onThemeChange,
      onCatalogResolved: (catalogId) => {
        for (const catalog of this.constructor.catalogs) {
          if (catalog) {
            catalog.id = catalogId;
          }
        }
      },
      onSurfaceReady: (surfaceId) => {
        this.surface = this.processor.model.getSurface(surfaceId);
        this.requestUpdate();
      },
      onSurfaceCleared: () => {
        this.surface = void 0;
        this.requestUpdate();
      },
      onError: (err) => {
        if (!err) {
          this.debouncedError = null;
          if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
        } else {
          if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
          this.debounceTimeout = setTimeout(() => {
            this.debouncedError = err;
          }, ERROR_OVERLAY_DEBOUNCE_MS);
        }
      }
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("context-request", this.contextRequestListener);
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = null;
    }
    if (this.rendererConnection) {
      this.rendererConnection.unsubscribe();
      this.rendererConnection = null;
    }
  }
  renderErrorOverlay() {
    if (!this.debouncedError) {
      return "";
    }
    return html`
      <div class="error-overlay">
        <h3>JSON Preview Error</h3>
        <pre>${this.debouncedError.message || String(this.debouncedError)}</pre>
      </div>
    `;
  }
  render() {
    if (!this.surface) {
      return html`
        <p style="color: #666; padding: 24px; font-family: sans-serif; text-align: center;">
          A2UI Lit Sandbox active. Waiting for RENDER_A2UI...
        </p>
        ${this.renderErrorOverlay()}
      `;
    }
    return html`<main>
      <a2ui-surface .surface=${this.surface}><span slot="loading"></span></a2ui-surface>
      ${this.renderErrorOverlay()}
    </main>`;
  }
};
__decorateClass([
  state()
], A2uiSandboxRoot.prototype, "surface", 2);
__decorateClass([
  state()
], A2uiSandboxRoot.prototype, "debouncedError", 2);
function bootstrapLitSandbox(catalogs, options) {
  const elementTagName = options?.elementTagName || "app-root";
  let targetClass = customElements.get(elementTagName) || A2uiSandboxRoot;
  const populateProps = (clazz) => {
    clazz.catalogs = catalogs;
    clazz.catalogJson = options?.catalogJson;
    clazz.markdownRenderer = options?.markdownRenderer;
    clazz.getComponentUsages = options?.getComponentUsages;
    clazz.onThemeChange = options?.onThemeChange;
  };
  if (!customElements.get(elementTagName)) {
    populateProps(targetClass);
    try {
      customElements.define(elementTagName, targetClass);
    } catch (err) {
      targetClass = class extends A2uiSandboxRoot {
      };
      populateProps(targetClass);
      customElements.define(elementTagName, targetClass);
    }
  } else {
    populateProps(targetClass);
  }
  return targetClass;
}
export {
  A2uiSandboxRoot,
  bootstrapLitSandbox
};
