// src/react/react-bridge.ts
import { useState, useEffect } from "react";
import {
  MessageProcessor
} from "@a2ui/web_core/v0_9";
import { a2uiBridge } from "../index.js";
function useA2uiSandbox(catalogs, options) {
  const [surface, setSurface] = useState(void 0);
  const [hasRoot, setHasRoot] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const processor = new MessageProcessor(catalogs, (action) => {
      a2uiBridge.sendAction(action);
    });
    const connection = a2uiBridge.attachRenderer(processor, {
      surfaceGroup: processor.model,
      catalogJson: options?.catalogJson,
      getComponentUsages: options?.getComponentUsages,
      onThemeChange: options?.onThemeChange,
      onCatalogResolved: (catalogId) => {
        for (const catalog of catalogs) {
          if (catalog) {
            catalog.id = catalogId;
          }
        }
      },
      onSurfaceReady: (surfaceId) => {
        const nextSurface = processor.model.getSurface(surfaceId);
        setSurface(nextSurface);
        setHasRoot(Boolean(nextSurface?.componentsModel.get("root")));
      },
      onSurfaceCleared: () => {
        setSurface(void 0);
        setHasRoot(false);
      },
      onError: setError
    });
    return () => {
      connection.unsubscribe();
    };
  }, []);
  useEffect(() => {
    if (!surface) {
      setHasRoot(false);
      return;
    }
    setHasRoot(Boolean(surface.componentsModel.get("root")));
    const createdSub = surface.componentsModel.onCreated.subscribe((comp) => {
      if (comp.id === "root") {
        setHasRoot(true);
      }
    });
    const deletedSub = surface.componentsModel.onDeleted.subscribe((id) => {
      if (id === "root") {
        setHasRoot(false);
      }
    });
    return () => {
      createdSub.unsubscribe();
      deletedSub.unsubscribe();
    };
  }, [surface]);
  return { surface, hasRoot, error };
}
export {
  useA2uiSandbox
};
