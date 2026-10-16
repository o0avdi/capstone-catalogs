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
import { SurfaceModel, Catalog, ComponentApi } from '@a2ui/web_core/v0_9';
import { ThemePreference, ComponentUsages } from '../index.js';
export interface UseA2uiSandboxResult<C extends ComponentApi = ComponentApi> {
    /** The reactive dynamic surface drawing model representing the active canvas. */
    surface: SurfaceModel<C> | undefined;
    /** Whether the active surface currently has a 'root' component defined. */
    hasRoot: boolean;
    /** The parsing / processing error encountered validating layouts. */
    error: Error | null;
}
export interface ReactSandboxOptions {
    /** Optional preloaded catalog JSON data, provided directly in memory. */
    catalogJson?: unknown;
    /** Optional callback to retrieve component usage samples. */
    getComponentUsages?: () => Promise<ComponentUsages>;
    /** Optional callback when theme changes. */
    onThemeChange?: (theme: ThemePreference) => void;
}
/**
 * A dynamic React hook that orchestrates the inter-frame PreviewBridge connection.
 * Automatically registers state observers, binds catalog processors, maps surface lifecycle
 * events reactively, and dispatches dynamic unmount cleanups during hook unmount to prevent memory leaks.
 *
 * @param catalogs The array of component catalogs matching A2UI specifications.
 * @param options Optional configuration payloads.
 * @return A reactive state object containing the active surface drawing model.
 */
export declare function useA2uiSandbox<C extends ComponentApi = ComponentApi>(catalogs: Catalog<C>[], options?: ReactSandboxOptions): UseA2uiSandboxResult<C>;
