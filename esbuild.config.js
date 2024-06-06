const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["./index.ts"],
    bundle: true,
    sourcemap: true,
    outfile: "./out/index.js",
    loader: {
      ".ttf": "file",
      ".css": "css",
    },
  })
  .catch(() => process.exit(1));
