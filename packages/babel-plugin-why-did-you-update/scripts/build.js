const esbuild = require('esbuild');

esbuild.build({
    entryPoints: [
        './src/index.ts'
    ],
    bundle: true,
    format: 'cjs',
    platform: 'node',
    sourcemap: true,
    outdir: './dist',
    external: [
        '@babel/plugin-syntax-typescript'
    ]
})