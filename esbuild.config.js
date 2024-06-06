const esbuild = require('esbuild');
const path = require('path');
const cssModulesPlugin = require('esbuild-css-modules-plugin');

const workerFiles = [
  'editor.worker.js',
  'json.worker.js',
  'css.worker.js',
  'html.worker.js',
  'ts.worker.js'
];


workerFiles.forEach(worker => {
  esbuild.build({
    entryPoints: [`node_modules/monaco-editor/esm/vs/editor/editor.worker.js`],
    outfile: `dist/${worker.replace('js', 'bundle.js')}`,
    format: 'iife',
    bundle: true
  }).catch(() => process.exit(1));
});

// Build the main script
esbuild.build({
  entryPoints: ['monaco.js'], // Your main entry point
  bundle: true,
  outdir: 'dist',
  format: 'esm',
  loader: {
    '.css': 'css',
    '.ttf': 'file',
  },
  plugins: [
    cssModulesPlugin(),
    {
      name: 'monaco-editor-plugin',
      setup(build) {
        build.onResolve({ filter: /^monaco-editor$/ }, args => {
          return { path: path.resolve(__dirname, 'node_modules/monaco-editor/esm/vs/editor/editor.main.js') };
        });

        build.onResolve({ filter: /^monaco-editor\/esm\/vs\/(.*)$/ }, args => {
          return { path: path.resolve(__dirname, 'node_modules/monaco-editor/esm/vs', args.path.replace(/^monaco-editor\/esm\/vs\//, '')) };
        });

        build.onLoad({ filter: /monaco-editor\/esm\/vs\/(.*)$/ }, async args => {
          const fs = require('fs');
          const content = fs.readFileSync(args.path, 'utf8');
          return {
            contents: content,
            loader: 'js'
          };
        });
      }
    }
  ]
}).catch(() => process.exit(1));