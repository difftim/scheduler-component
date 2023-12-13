const esbuild = require('esbuild');
const path = require('path');

const entrys = ['Calendar.tsx', 'no-overlap.ts', 'overlap.ts'];

const options = {
  platform: 'node',
  target: 'esnext',
  sourcemap: false,
  minify: true,
  format: 'cjs',
  logLevel: 'info',
  tsconfig: path.join(__dirname, '../tsconfig.cjs.json'),
};

entrys.forEach(file => {
  esbuild.build({
    ...options,
    entryPoints: [path.join(__dirname, `../src/${file}`)],
    outfile: path.join(__dirname, `../src/${file.split('.')[0]}.js`),
  });
});
