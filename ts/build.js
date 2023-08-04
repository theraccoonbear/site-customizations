const { build } = require("esbuild");
const { dependencies, peerDependencies } = require('./package.json');

const sharedConfig = {
  entryPoints: ["src/mykronos.com.ts"],
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
  outfile: "dist/mykronos.com.js",
});
