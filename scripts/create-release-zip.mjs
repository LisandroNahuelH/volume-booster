/**
 * Zip dist/ → release/volume-booster-<version>.zip and keep only the 2 newest release zips.
 */
import { createWriteStream, existsSync, mkdirSync, readdirSync, readFileSync, statSync, unlinkSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { cwd } from "node:process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const archiver = (() => {
  try {
    return require("archiver");
  } catch {
    return null;
  }
})();

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = join(root, "dist");
const releaseDir = join(root, "release");

function readVersion() {
  const manifestPath = join(distDir, "manifest.json");
  const packagePath = join(root, "package.json");
  if (existsSync(manifestPath)) {
    return JSON.parse(readFileSync(manifestPath, "utf8")).version;
  }
  return JSON.parse(readFileSync(packagePath, "utf8")).version;
}

function pruneReleaseZips(keep = 2) {
  const zips = readdirSync(releaseDir)
    .filter((n) => /^volume-booster-.*\.zip$/i.test(n))
    .map((name) => {
      const path = join(releaseDir, name);
      return { name, path, mtime: statSync(path).mtimeMs };
    })
    .sort((a, b) => b.mtime - a.mtime);

  for (const old of zips.slice(keep)) {
    unlinkSync(old.path);
    console.log(`Removed old release zip: ${old.name}`);
  }
}

async function zipWithArchiver(sourceDir, outPath) {
  const archive = archiver("zip", { zlib: { level: 9 } });
  const output = createWriteStream(outPath);
  const done = new Promise((resolvePromise, reject) => {
    output.on("close", resolvePromise);
    archive.on("error", reject);
  });
  archive.pipe(output);
  archive.directory(sourceDir, false);
  await archive.finalize();
  await done;
}

async function zipWithPowershell(sourceDir, outPath) {
  const { spawnSync } = await import("node:child_process");
  // Compress-Archive needs contents, not nested dist folder
  const ps = `
    if (Test-Path -LiteralPath '${outPath.replace(/'/g, "''")}') { Remove-Item -LiteralPath '${outPath.replace(/'/g, "''")}' -Force }
    Compress-Archive -Path (Join-Path '${sourceDir.replace(/'/g, "''")}' '*') -DestinationPath '${outPath.replace(/'/g, "''")}' -Force
  `;
  const r = spawnSync("powershell", ["-NoProfile", "-Command", ps], { encoding: "utf8" });
  if (r.status !== 0) {
    throw new Error(r.stderr || r.stdout || "Compress-Archive failed");
  }
}

async function main() {
  if (!existsSync(distDir)) {
    throw new Error(`Missing dist/. Run build first. cwd=${cwd()}`);
  }
  mkdirSync(releaseDir, { recursive: true });
  const version = readVersion();
  if (!version) {
    throw new Error("Could not read extension version");
  }
  const outName = `volume-booster-${version}.zip`;
  const outPath = join(releaseDir, outName);
  if (existsSync(outPath)) {
    unlinkSync(outPath);
  }

  if (archiver) {
    await zipWithArchiver(distDir, outPath);
  } else {
    await zipWithPowershell(distDir, outPath);
  }

  pruneReleaseZips(2);
  console.log(`Created ${outPath}`);
  console.log(`Version ${version}`);
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
