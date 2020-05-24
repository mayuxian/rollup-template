import getPlugin from './get-plugin';
import { name } from '../package.json';

const entry = 'es/index.js';
const moduleName = name.replace(/-(\w)/g, ($, $1) => $1.toUpperCase());
export default [{
  input: entry,
  output: {
    name: moduleName,
    file: 'lib/index.js',
    format: 'umd', //iife 游览器
    exports: 'named',
    sourcemap: false
  },
  plugins: [
    getPlugin('progress', {
      clear: true
    }),
    getPlugin('replace'),
    getPlugin('eslint'),
    getPlugin('alias'),
    getPlugin('postcss', {
      extract: 'lib/style.css',
      minify: false
    }),
    getPlugin('json'),
    getPlugin('resolve'),
    getPlugin('babel'),
    getPlugin('commonjs'),
    getPlugin('filesize')
  ].filter(p => p)
}, {
  input: entry,
  output: {
    name: moduleName,
    file: 'lib/index.min.js',
    format: 'umd',
    exports: 'named',
    sourcemap: false
  },
  plugins: [
    getPlugin('progress', {
      clear: true
    }),
    getPlugin('replace'),
    getPlugin('eslint'),
    getPlugin('alias'),
    getPlugin('postcss', {
      extract: 'lib/style.min.css',
      minify: true
    }),
    getPlugin('json'),
    getPlugin('resolve'),
    getPlugin('commonjs'),
    getPlugin('babel'),
    getPlugin('uglify', {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log']
      }
    }),
    getPlugin('filesize')
  ].filter(p => p)
}];