import getPlugin from './get-plugin';
import { name } from '../package.json';

//https://segmentfault.com/a/1190000010628352
// 你也可以使用babel-preset-es2015-rollup这个包（搭配babel-core），它集成了babel-preset-es2015，babel-plugin-transform-es2015-modules-commonjs和babel-plugin-external-helpers三个模块，使用起来更加方便，只要将.babelrc文件修改成{ "presets": ["es2015-rollup"] }就可以使用了。

const entry = 'es/invoking-proxy.js';
// const moduleName = name.replace(/-(\w)/g, ($, $1) => $1.toUpperCase());
const moduleName = 'invokingProxy2';
export default [{
  input: entry,
  output: {
    name: moduleName,
    file: 'lib/invoking-proxy.js',
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
    file: 'lib/invoking-proxy.min.js',
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