import { builtinModules } from 'node:module'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  mode: 'production',
  build: {
    lib: {
      entry: resolve(__dirname, '../src/main/main.ts'),
      formats: ['cjs'],
      fileName: () => 'main.cjs',
    },
    outDir: resolve(__dirname, '../dist/main'),
    emptyOutDir: true,
    rollupOptions: {
      external: [
        'electron',
        ...builtinModules.flatMap(p => [p, `node:${p}`]),
      ],
    },
    minify: false,
  },
  resolve: {
    alias: {
      '@main': resolve(__dirname, '../src/main'),
    },
  },
})
