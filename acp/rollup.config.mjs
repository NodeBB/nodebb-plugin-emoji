import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import virtual from '@rollup/plugin-virtual';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/admin.ts',
  external: ['translator', 'jquery', 'api', 'emoji', 'alerts'],
  output: {
    sourcemap: !production,
    format: 'amd',
    file: '../build/acp/admin.js',
  },
  plugins: [
    virtual({
      ajaxify: 'export default ajaxify',
      app: 'export default app',
      config: 'export default config',
      utils: 'export default utils',
    }),
    svelte({
      preprocess: sveltePreprocess({ sourceMap: !production }),
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: 'admin.css' }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ['svelte'],
    }),
    commonjs(),
    typescript({
      sourceMap: !production,
      inlineSources: !production,
    }),

    // Watch the `src` directory and refresh the
    // browser on changes when not in production
    !production && livereload(),
  ],
  watch: {
    clearScreen: false,
  },
};
