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
/**
 * Dimensions payload transmitted across the Preview Bridge boundary on surface resize events.
 *
 * NOTE: Declared as a `declare interface` so `tsickle` generates compiler externs
 * definitions for JSCompiler (Closure Compiler), preventing property renaming across frame boundaries.
 */
export declare interface SurfaceDimensions {
    height: number;
    width: number;
}
export type SurfaceResizeCallback = (dimensions: SurfaceDimensions) => void;
/**
 * Observes DOM element reflows and window viewport changes within the preview iframe,
 * caching dimensions to deduplicate redundant resize notifications sent to the host.
 */
export declare class SurfaceResizeObserver {
    private readonly onResize;
    private domResizeObserver?;
    private windowViewportResizeListener?;
    private domContentLoadedListener?;
    private lastKnownHeight;
    private lastKnownWidth;
    constructor(onResize: SurfaceResizeCallback);
    /**
     * Initializes window resize listeners and DOM element observers.
     */
    private init;
    private setupDomElementObservers;
    /**
     * Measures current scroll and offset dimensions of document body/documentElement,
     * dispatching a callback only if dimensions have changed since last measurement (or if forced).
     */
    measureAndDispatch(force?: boolean): void;
    /**
     * Cleans up observers, window listeners, and resets cached dimensions.
     */
    destroy(): void;
}
