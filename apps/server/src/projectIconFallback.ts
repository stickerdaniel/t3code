import fs from "node:fs/promises";
import path from "node:path";

export type ProjectIconFallbackKind = "svelte";

const SVELTE_MARKER_FILES = [
  "svelte.config.js",
  "svelte.config.ts",
  "svelte.config.mjs",
  "svelte.config.cjs",
] as const;
const SVELTE_PACKAGE_MARKERS = ["svelte", "@sveltejs/kit"] as const;

interface PackageJsonLike {
  dependencies?: Record<string, unknown>;
  devDependencies?: Record<string, unknown>;
  peerDependencies?: Record<string, unknown>;
}

async function isFile(filePath: string): Promise<boolean> {
  try {
    return (await fs.stat(filePath)).isFile();
  } catch {
    return false;
  }
}

async function isDirectory(directoryPath: string): Promise<boolean> {
  try {
    return (await fs.stat(directoryPath)).isDirectory();
  } catch {
    return false;
  }
}

function hasPackageMarker(dependencies: unknown): boolean {
  if (!dependencies || typeof dependencies !== "object") {
    return false;
  }

  return SVELTE_PACKAGE_MARKERS.some((packageName) =>
    Object.prototype.hasOwnProperty.call(dependencies, packageName),
  );
}

async function hasSveltePackageMarker(projectCwd: string): Promise<boolean> {
  const packageJsonPath = path.join(projectCwd, "package.json");

  let packageJson: PackageJsonLike;
  try {
    packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf8")) as PackageJsonLike;
  } catch {
    return false;
  }

  return (
    hasPackageMarker(packageJson.dependencies) ||
    hasPackageMarker(packageJson.devDependencies) ||
    hasPackageMarker(packageJson.peerDependencies)
  );
}

export async function detectProjectIconFallback(
  projectCwd: string,
): Promise<ProjectIconFallbackKind | null> {
  for (const markerFile of SVELTE_MARKER_FILES) {
    if (await isFile(path.join(projectCwd, markerFile))) {
      return "svelte";
    }
  }

  if (await isDirectory(path.join(projectCwd, ".svelte-kit"))) {
    return "svelte";
  }

  if (await isFile(path.join(projectCwd, "src", "app.html"))) {
    return "svelte";
  }

  if (await hasSveltePackageMarker(projectCwd)) {
    return "svelte";
  }

  return null;
}
