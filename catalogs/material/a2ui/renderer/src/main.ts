import { Component, inject, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { A2uiRendererService, SurfaceComponent } from '@a2ui/angular/v0_9';
import { A2uiSandboxConnection, provideA2uiSandbox } from 'a2ui-bridge/angular';
import { ExportCatalog } from './adapters';
import { ValidatingRenderer } from './validating-renderer';
import catalog from '../public/catalog.json';
import fixtures from '../public/fixtures.json';
import usages from '../public/usages.json';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SurfaceComponent],
  template: ` <main>
    @if (standalone) {
      <h1>Storybook ? A2UI portable export</h1>
      <nav>
        <button (click)="load('metricLiteral')">Literal metric</button
        ><button (click)="load('metricBound')">Bound metric</button
        ><button (click)="update()">Update revenue</button>
        @if (hasButton) {
          <button (click)="load('button')">Enabled button</button
          ><button (click)="load('buttonDisabled')">Disabled button</button>
        }
      </nav>
    }
    @if (sandbox.surfaceId()) {
      <a2ui-v09-surface [surfaceId]="sandbox.surfaceId()" />
    }
    @if (standalone && hasButton) {
      <section>
        <h2>Dispatched actions</h2>
        <pre id="actions">{{ actions() }}</pre>
      </section>
    }
    @if (sandbox.error()) {
      <pre role="alert">{{ sandbox.error()?.message }}</pre>
    }
  </main>`,
})
class App {
  readonly sandbox = inject(A2uiSandboxConnection);
  readonly renderer = inject(A2uiRendererService);
  readonly standalone = window.parent === window;
  readonly hasButton = 'MaterialButton' in catalog.components;
  readonly actions = signal('');
  constructor() {
    this.renderer.surfaceGroup.onAction.subscribe((action) =>
      this.actions.update((v) => v + JSON.stringify(action) + '\n'),
    );
    if (this.standalone) setTimeout(() => this.load('metricLiteral'), 100);
  }
  load(name: string) {
    window.postMessage(
      { type: 'RENDER_A2UI', payload: (fixtures as Record<string, unknown>)[name] },
      window.location.origin,
    );
  }
  update() {
    window.postMessage(
      {
        type: 'DATA_MODEL_CHANGE',
        payload: { updateDataModel: { surfaceId: 'demo', path: '/revenue', value: 1750000 } },
      },
      window.location.origin,
    );
  }
}
bootstrapApplication(App, {
  providers: [
    provideA2uiSandbox([ExportCatalog], {
      catalogJson: catalog,
      getComponentUsages: async () => usages,
    }),
    { provide: A2uiRendererService, useClass: ValidatingRenderer },
  ],
}).catch(console.error);
