import { Component, inject } from '@angular/core';
import { CatalogComponent, A2uiRendererService } from '@a2ui/angular/v0_9';
import { DataContext } from '@a2ui/web_core/v0_9';
import { MatButtonModule } from '@angular/material/button';
import { ButtonAdapterApi } from '../contracts';

@Component({
  selector: 'export-material-button',
  standalone: true,
  imports: [MatButtonModule],
  styleUrl: './button.scss',
  template: ` <button
    type="button"
    [matButton]="props().appearance.value()"
    [disabled]="props().disabled.value()"
    (click)="click()"
  >
    {{ props().label.value() }}
  </button>`,
})
export class ButtonAdapter extends CatalogComponent<typeof ButtonAdapterApi> {
  private renderer = inject(A2uiRendererService);
  click() {
    if (this.props().disabled.value()) return;
    const surface = this.renderer.surfaceGroup.getSurface(this.surfaceId());
    if (!surface) throw new Error('Button surface is missing');
    const action = new DataContext(surface, this.dataContextPath()).resolveAction(
      this.props().action.value(),
    );
    void surface.dispatchAction(action, this.componentId());
  }
}
