require('esbuild').build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  outfile: 'dist/index.js',
  target: ['node22'],
}).catch(() => process.exit(1));
