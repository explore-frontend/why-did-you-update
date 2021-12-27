/* eslint-disable @typescript-eslint/no-var-requires */
const esbuild = require("esbuild");

esbuild.build({
  entryPoints: ["./src/loader.ts"],
  bundle: true,
  format: "iife",
  platform: "browser",
  sourcemap: true,
  outdir: "./out",
});
