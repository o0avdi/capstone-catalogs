import {Component,inject} from '@angular/core';
import {CatalogComponent,A2uiRendererService} from '@a2ui/angular/v0_9';
import {DataContext} from '@a2ui/web_core/v0_9';
import {MatCheckboxModule,MatCheckboxChange} from '@angular/material/checkbox';
import {CheckboxAdapterApi} from '../contracts';

@Component({selector:'export-material-checkbox',standalone:true,imports:[MatCheckboxModule],template:`
<mat-checkbox [checked]="props().checked.value()" [disabled]="props().disabled.value()" (change)="change($event)">{{props().label.value()}}</mat-checkbox>`})
export class CheckboxAdapter extends CatalogComponent<typeof CheckboxAdapterApi> {
 private renderer=inject(A2uiRendererService);
 change(event:MatCheckboxChange){
  if(this.props().disabled.value())return;
  const surface=this.renderer.surfaceGroup.getSurface(this.surfaceId());
  if(!surface)throw new Error('Checkbox surface is missing');
  const action=new DataContext(surface,this.dataContextPath()).resolveAction(this.props().action.value());
  // Map Storybook onCheckedChange(checked) to an A2UI event. The host owns data updates.
  if(!action||typeof action!=='object'||!('event' in action))throw new Error('Checkbox needs an event action');
  // Keep the control on the authoritative model value until the host applies the event.
  event.source.checked=this.props().checked.value();
  void surface.dispatchAction({event:{...action.event,context:{...action.event.context,checked:event.checked}}},this.componentId());
 }
}
