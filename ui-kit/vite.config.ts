import fs from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

/**
 * The reference package (reference/src) is real React Native code: images come in as
 * require('…png') and Metro picks @2x/@3x. Here each require becomes an imported URL of the
 * @2x file (sharp on a 2× screen), wrapped as { uri } — what react-native-web's Image expects.
 */
function rnRequirePng(): Plugin {
  return {
    name: 'rn-require-png',
    enforce: 'pre',
    transform(code, id) {
      if (!/\/(reference|rn-decor)\/src\//.test(id) || !code.includes('require(')) return
      const imports: string[] = []
      const out = code.replace(/require\((['"])(.+?\.png)\1\)/g, (_m, _q, p: string) => {
        const abs = path.resolve(path.dirname(id), p)
        const two = abs.replace(/\.png$/, '@2x.png')
        const name = `__png${imports.length}`
        imports.push(`import ${name} from ${JSON.stringify(fs.existsSync(two) ? two : abs)};`)
        return `({ uri: ${name} })`
      })
      return { code: imports.join('\n') + '\n' + out, map: null }
    },
  }
}

const webFirst = ['.web.tsx', '.web.ts', '.web.mjs', '.web.js', '.tsx', '.ts', '.mjs', '.js', '.jsx', '.json']

export default defineConfig({
  plugins: [rnRequirePng(), react()],
  resolve: {
    alias: [
      { find: /^react-native$/, replacement: path.resolve('src/shims/react-native.ts') },
      { find: '@react-native/assets-registry/registry', replacement: path.resolve('src/shims/assets-registry.ts') },
    ],
    extensions: webFirst,
    // reference/ → ../rn-decor: resolve its imports from ui-kit/node_modules.
    preserveSymlinks: true,
  },
  define: { __DEV__: 'false' },
  optimizeDeps: {
    include: ['react-native-web', 'react-native-svg', 'react-native-safe-area-context'],
    rolldownOptions: { resolve: { extensions: webFirst, alias: { 'react-native': path.resolve('src/shims/react-native.ts') } } },
  },
  build: {
    // react-native-web + all mockup art in one gallery bundle; size is fine for a local mockup.
    chunkSizeWarningLimit: 2000,
    rollupOptions: { input: { main: path.resolve('index.html'), reference: path.resolve('reference.html') } },
  },
})
