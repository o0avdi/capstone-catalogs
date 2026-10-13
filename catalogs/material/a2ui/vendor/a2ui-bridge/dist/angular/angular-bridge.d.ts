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
import { OnDestroy, Type, EnvironmentProviders } from '@angular/core';
import { Catalog, ComponentApi } from '@a2ui/web_core/v0_9';
import { ThemePreference, type ComponentUsages } from '../index.js';
export interface AngularSandboxOptions {
    /** Optional custom markdown rendering delegate callback hook */
    markdownRendererFn?: (markdown: string) => Promise<string>;
    /** Optional preloaded catalog JSON data, provided directly in memory. */
    catalogJson?: unknown;
    /** Optional callback to retrieve component usage samples. */
    getComponentUsages?: () => Promise<ComponentUsages>;
    /** Optional callback when theme changes. */
    onThemeChange?: (theme: ThemePreference) => void;
}
/**
 * Orchestrates mapping surface mount/unmount lifecycles, connection handshakes,
 * and reactive state tracking between the host dashboard shell and the local
 * sandbox view elements.
 */
export declare class A2uiSandboxConnection implements OnDestroy {
    /**
     * The active surface canvas identifier mounted by the host container. Bind
     * this value to the HTML template.
     */
    readonly surfaceId: import("@angular/core").WritableSignal<string>;
    /** The parsing / processing error encountered validating layouts. */
    readonly error: import("@angular/core").WritableSignal<Error | null>;
    /** Resolves the central rendering service provider from the injector context. */
    private readonly rendererService;
    /** Injected dynamic renderer configuration options block. */
    private readonly rendererConfig;
    /** The dynamic teardown handle for the active framework renderer connection subscription. */
    private rendererConnection;
    /**
     * Initializes a new instance of the sandbox connection, automatically establishing
     * the message transport pipeline.
     *
     * Subscribes to the global preview bridge singleton, mapping dynamic renderer callbacks
     * (onSurfaceReady and onSurfaceCleared) directly to local reactive state signals.
     */
    constructor(catalogJson?: unknown, getComponentUsages?: () => Promise<ComponentUsages>, onThemeChange?: (theme: ThemePreference) => void);
    /**
     * Performs cleanups during sandbox destruction.
     * Disposes active bridge connections and releases event listener subscriptions
     * to prevent memory leaks and observer bloat in high-frequency test runs.
     */
    ngOnDestroy(): void;
}
/**
 * Provides a unified array of Angular dependency injection providers configured for the A2UI sandbox.
 *
 * Exposes a standardized registration block that includes catalog component classes, the central
 * rendering service, and the sandbox connection state to keep catalog bootstrap clean and modular.
 *
 * @param catalogsClasses The array of catalog component provider classes (e.g. BasicCatalog) to register and manage.
 * @param options Optional configuration adapter block holding local catalogJson and markdownRendererFn hook delegates.
 * @return Angular EnvironmentProviders ready for modern standalone bootstrapping application scopes.
 */
export declare function provideA2uiSandbox(catalogsClasses: Array<Type<Catalog<ComponentApi>>>, options?: AngularSandboxOptions): EnvironmentProviders;
