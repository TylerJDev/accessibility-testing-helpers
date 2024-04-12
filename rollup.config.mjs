import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

const config = {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js'
  },
  plugins: [nodeResolve(), commonjs(), typescript({
    exclude: ['node_modules/*', 'src/examples/*', 'src/__tests__/*']
  })],
}

export default config;