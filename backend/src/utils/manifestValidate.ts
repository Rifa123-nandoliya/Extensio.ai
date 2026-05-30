export interface ManifestValidationResult {
  valid: boolean;
  errors: string[];
}

export const validateManifestV3 = (content: string): ManifestValidationResult => {
  const errors: string[] = [];

  let manifest: Record<string, unknown>;
  try {
    manifest = JSON.parse(content);
  } catch {
    return { valid: false, errors: ["manifest.json is not valid JSON"] };
  }

  if (manifest.manifest_version !== 3) {
    errors.push('manifest.json must set "manifest_version": 3');
  }

  if (!manifest.name || typeof manifest.name !== "string") {
    errors.push('manifest.json must include a string "name"');
  }

  if (!manifest.version || typeof manifest.version !== "string") {
    errors.push('manifest.json must include a string "version"');
  }

  const hasPopup =
    manifest.action &&
    typeof manifest.action === "object" &&
    (manifest.action as Record<string, unknown>).default_popup;

  const hasServiceWorker =
    manifest.background &&
    typeof manifest.background === "object" &&
    (manifest.background as Record<string, unknown>).service_worker;

  const hasContentScripts =
    Array.isArray(manifest.content_scripts) &&
    manifest.content_scripts.length > 0;

  if (!hasPopup && !hasServiceWorker && !hasContentScripts) {
    errors.push(
      "manifest.json should define at least one of: action.default_popup, background.service_worker, or content_scripts"
    );
  }

  if (
    manifest.background &&
    typeof manifest.background === "object" &&
    (manifest.background as Record<string, unknown>).scripts
  ) {
    errors.push(
      "Manifest V3 must not use background.scripts — use background.service_worker"
    );
  }

  return { valid: errors.length === 0, errors };
};

export const collectReferencedFiles = (manifestContent: string): string[] => {
  const refs: string[] = [];
  try {
    const manifest = JSON.parse(manifestContent) as Record<string, unknown>;

    const action = manifest.action as Record<string, unknown> | undefined;
    if (action?.default_popup && typeof action.default_popup === "string") {
      refs.push(action.default_popup);
    }

    const background = manifest.background as Record<string, unknown> | undefined;
    if (
      background?.service_worker &&
      typeof background.service_worker === "string"
    ) {
      refs.push(background.service_worker);
    }

    const scripts = manifest.content_scripts as Array<Record<string, unknown>> | undefined;
    if (Array.isArray(scripts)) {
      for (const entry of scripts) {
        if (Array.isArray(entry.js)) {
          refs.push(...(entry.js as string[]));
        }
        if (Array.isArray(entry.css)) {
          refs.push(...(entry.css as string[]));
        }
      }
    }
  } catch {
    // manifest parse errors handled elsewhere
  }

  return refs;
};
