const { build } = require("esbuild");
const { dependencies, peerDependencies } = require('./package.json');

const sharedConfig = {
  // entryPoints: ["src/mykronos.com.ts", "src/mykronos.com-bookmarklet.ts"],
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
  entryPoints: ['src/mykronos.com.ts', 'src/sharepoint.com.ts']
});

build({
  ...sharedConfig,
  platform: 'browser',
  format: 'cjs',
  outdir: "dist",
  minify: true,
  entryPoints: ['src/mykronos.com-bookmarklet.ts']
});

