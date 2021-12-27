// eslint-disable-next-line @typescript-eslint/no-var-requires
const esbuild = require('esbuild');

esbuild.build({
    entryPoints: [
        './src/index.ts'
    ],
    bundle: true,
    format: 'cjs',
    platform: 'browser',
    sourcemap: true,
    outdir: './dist',
})