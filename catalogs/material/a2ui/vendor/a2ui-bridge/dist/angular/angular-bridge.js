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

// src/angular/angular-bridge.ts
import {
  Injectable,
  inject,
  signal,
  makeEnvironmentProviders
} from "@angular/core";
import {
  A2uiRendererService,
  A2UI_RENDERER_CONFIG,
  provideMarkdownRenderer
} from "@a2ui/angular/v0_9";
import {
  a2uiBridge
} from "../index.js";
var A2uiSandboxConnection = class {
  /**
   * Initializes a new instance of the sandbox connection, automatically establishing
   * the message transport pipeline.
   *
   * Subscribes to the global preview bridge singleton, mapping dynamic renderer callbacks
   * (onSurfaceReady and onSurfaceCleared) directly to local reactive state signals.
   */
  constructor(catalogJson, getComponentUsages, onThemeChange) {
    /**
     * The active surface canvas identifier mounted by the host container. Bind
     * this value to the HTML template.
     */
    this.surfaceId = signal("");
    /** The parsing / processing error encountered validating layouts. */
    this.error = signal(null);
    /** Resolves the central rendering service provider from the injector context. */
    this.rendererService = inject(A2uiRendererService);
    /** Injected dynamic renderer configuration options block. */
    this.rendererConfig = inject(A2UI_RENDERER_CONFIG);
    /** The dynamic teardown handle for the active framework renderer connection subscription. */
    this.rendererConnection = null;
    const processor = {
      processMessages: (payload) => this.rendererService.processMessages(payload)
    };
    this.rendererConnection = a2uiBridge.attachRenderer(processor, {
      surfaceGroup: this.rendererService.surfaceGroup,
      onCatalogResolved: (catalogId) => {
        const catalogs = this.rendererConfig.catalogs;
        if (catalogs) {
          for (const catalog of catalogs) {
            if (catalog) {
              catalog.id = catalogId;
            }
          }
        }
      },
      onSurfaceReady: (surfaceId) => {
        this.surfaceId.set(surfaceId);
      },
      onSurfaceCleared: () => {
        this.surfaceId.set("");
      },
      onError: (err) => {
        this.error.set(err);
      },
      catalogJson,
      getComponentUsages,
      onThemeChange
    });
  }
  /**
   * Performs cleanups during sandbox destruction.
   * Disposes active bridge connections and releases event listener subscriptions
   * to prevent memory leaks and observer bloat in high-frequency test runs.
   */
  ngOnDestroy() {
    this.rendererConnection?.unsubscribe();
    this.rendererConnection = null;
  }
};
A2uiSandboxConnection = __decorateClass([
  Injectable()
], A2uiSandboxConnection);
function provideA2uiSandbox(catalogsClasses, options) {
  const providers = [
    A2uiRendererService,
    {
      provide: A2uiSandboxConnection,
      useFactory: () => new A2uiSandboxConnection(
        options?.catalogJson,
        options?.getComponentUsages,
        options?.onThemeChange
      )
    },
    ...catalogsClasses,
    provideMarkdownRenderer(options?.markdownRendererFn),
    {
      provide: A2UI_RENDERER_CONFIG,
      useFactory: () => {
        const resolvedCatalogs = catalogsClasses.map((cls) => inject(cls));
        return {
          catalogs: resolvedCatalogs,
          actionHandler: (action) => {
            a2uiBridge.sendAction(action);
          }
        };
      }
    }
  ];
  return makeEnvironmentProviders(providers);
}
export {
  A2uiSandboxConnection,
  provideA2uiSandbox
};
