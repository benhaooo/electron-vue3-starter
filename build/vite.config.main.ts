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
        'node:path',
        'node:fs',
        'node:fs/promises',
        'node:process',
        'node:os',
        'node:crypto',
        'node:buffer',
        'node:stream',
        'node:util',
        'node:url',
        'node:string_decoder',
        'node:events',
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
