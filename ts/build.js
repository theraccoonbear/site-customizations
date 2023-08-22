const { build } = require("esbuild");
const { dependencies, peerDependencies } = require('./package.json');

const sharedConfig = {
  entryPoints: ["src/mykronos.com.ts", "src/mykronos.com-bookmarklet.ts"],
  bundle: true,
  minify: false,
  format: "",
  // only needed if you have dependencies
  external: Object.keys(dependencies || {}).concat(Object.keys(peerDependencies || {})),
};

build({
  ...sharedConfig,
  platform: 'browser',
  format: 'cjs',
  outdir: "dist",
  // outfile: "dist/mykronos.com.js",
});
