import { Injectable, inject } from '@angular/core';
import { A2uiRendererService } from '@a2ui/angular/v0_9';
import { A2uiMessage, A2uiMessageSchema } from '@a2ui/web_core/v0_9';
import { ExportCatalog, resolvedSchemas } from './adapters';

type Instance = { id: string; component: string; [key: string]: unknown };
type StagedSurface = { data: unknown; components: Map<string, Instance> };
function segments(pointer: string): string[] {
  return pointer
    .replace(/^\//, '')
    .split('/')
    .filter(Boolean)
    .map((s) => s.replace(/~1/g, '/').replace(/~0/g, '~'));
}
function read(data: unknown, pointer: string): unknown {
  let value = data;
  for (const key of segments(pointer))
    value =
      value !== null && typeof value === 'object'
        ? (value as Record<string, unknown>)[key]
        : undefined;
  return value;
}
function update(data: unknown, pointer: string, value: unknown): unknown {
  if (pointer === '/' || pointer === '') return structuredClone(value);
  const result = structuredClone(data ?? {});
  if (result === null || typeof result !== 'object')
    throw new Error('Data model path requires an object root');
  const keys = segments(pointer);
  let cursor = result as Record<string, unknown>;
  for (const key of keys.slice(0, -1)) {
    if (['__proto__', 'prototype', 'constructor'].includes(key))
      throw new Error('Unsupported data-model path segment');
    if (cursor[key] === undefined) cursor[key] = {};
    if (cursor[key] === null || typeof cursor[key] !== 'object')
      throw new Error('Data model parent is not an object');
    cursor = cursor[key] as Record<string, unknown>;
  }
  const last = keys.at(-1)!;
  if (['__proto__', 'prototype', 'constructor'].includes(last))
    throw new Error('Unsupported data-model path segment');
  cursor[last] = structuredClone(value);
  return result;
}
/** Upstream does not validate props. Stage the batch and validate literals and
 * resolved bindings before processing it, so bad messages cannot mutate state. */
@Injectable()
export class ValidatingRenderer extends A2uiRendererService {
  private readonly catalog = inject(ExportCatalog);
  override processMessages(messages: A2uiMessage[]): void {
    const staged = new Map<string, StagedSurface>();
    for (const [id, surface] of this.surfaceGroup.surfacesMap) {
      staged.set(id, {
        data: structuredClone(surface.dataModel.get('/')),
        components: new Map(
          [...surface.componentsModel.entries].map(([key, c]) => [
            key,
            { id: key, component: c.type, ...c.properties },
          ]),
        ),
      });
    }
    for (const message of messages) {
      A2uiMessageSchema.parse(message);
      if ('createSurface' in message) {
        if (message.createSurface.catalogId !== this.catalog.id)
          throw new Error('Unsupported catalog ' + message.createSurface.catalogId);
        if (message.createSurface.theme !== undefined)
          throw new Error(
            'Custom theme messages are unsupported; the exported Material theme is fixed',
          );
        staged.set(message.createSurface.surfaceId, { data: {}, components: new Map() });
      } else if ('deleteSurface' in message) staged.delete(message.deleteSurface.surfaceId);
      else if ('updateDataModel' in message) {
        const updateMessage = message.updateDataModel;
        const surface = staged.get(updateMessage.surfaceId);
        if (!surface) throw new Error('Unknown surface ' + updateMessage.surfaceId);
        surface.data = update(surface.data, updateMessage.path ?? '/', updateMessage.value);
      } else if ('updateComponents' in message) {
        const surface = staged.get(message.updateComponents.surfaceId);
        if (!surface) throw new Error('Unknown surface ' + message.updateComponents.surfaceId);
        for (const instance of message.updateComponents.components) {
          const { id, component, ...props } = instance;
          if (typeof id !== 'string' || !id) throw new Error('Component requires a nonempty id');
          const api = this.catalog.components.get(component);
          if (!api) throw new Error('Unsupported component ' + component);
          const result = api.schema.safeParse(props);
          if (!result.success) throw new Error(component + ': ' + result.error.message);
          surface.components.set(id, { id, component, ...props });
        }
      }
    }
    for (const surface of staged.values())
      for (const { id, component, ...props } of surface.components.values()) {
        const resolved = Object.fromEntries(
          Object.entries(props).map(([key, value]) => [
            key,
            value !== null && typeof value === 'object' && 'path' in value
              ? read(surface.data, (value as { path: string }).path)
              : value,
          ]),
        );
        const result = resolvedSchemas[component].safeParse(resolved);
        if (!result.success)
          throw new Error(component + ' resolved bindings: ' + result.error.message);
      }
    super.processMessages(messages);
  }
}
