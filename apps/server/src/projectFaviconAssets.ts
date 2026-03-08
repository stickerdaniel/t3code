import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.join(CURRENT_DIR, "assets");

function readSvgAsset(fileName: string): string {
  return fs.readFileSync(path.join(ASSETS_DIR, fileName), "utf8");
}

export const DEFAULT_PROJECT_FAVICON_SVG = readSvgAsset("project-favicon-default.svg");
export const SVELTE_PROJECT_FAVICON_SVG = readSvgAsset("project-favicon-svelte.svg");
