import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  mode: 'production',
  build: {
    lib: {
      entry: resolve(__dirname, '../src/preload/preload.ts'),
      formats: ['cjs'],
      fileName: () => 'preload.cjs',
    },
    outDir: resolve(__dirname, '../dist/preload'),
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
      '@preload': resolve(__dirname, '../src/preload'),
    },
  },
})
