import babel from "rollup-plugin-babel"
import cleanup from "rollup-plugin-cleanup"
import nodeResolve from 'rollup-plugin-node-resolve'
import { uglify } from "rollup-plugin-uglify"
import css from "rollup-plugin-css-porter"
import commonjs from 'rollup-plugin-commonjs'


export default [
  {
    input: "src/uspsAddressAutocomplete.js",
    output: {
      file: 'dist/uspsAddressAutocomplete.js',
      name: "uspsAddressAutocomplete",
      format: "umd"
    },
    plugins: [
      nodeResolve({
        jsNext : true
      }),
      commonjs({
          include: 'node_modules/**',
      }),
      babel({
        exclude: "node_modules/**",
        presets: ["@babel/preset-env"],
        plugins: ["@babel/proposal-class-properties"]
      }),
      uglify(),
      css({
        raw: 'src/uspsAddressAutocomplete.css',
        minified: 'dist/uspsAddressAutocomplete.css.min.css',
      })
    ]
  },
  {
    input: "src/uspsAddressAutocomplete.js",
    output: {
      file: 'dist/uspsAddressAutocomplete.js',
      name: "uspsAddressAutocomplete",
      format: "umd"
    },
    plugins: [
      nodeResolve({
        jsNext : true
      }),
      commonjs({
        include: 'node_modules/**',
      }),
      babel({
        exclude: "node_modules/**",
        presets: ["@babel/preset-env"],
        plugins: ["@babel/proposal-class-properties"]
      }),
      uglify(),
      css({
        raw: 'src/uspsAddressAutocomplete.css',
        minified: 'dist/uspsAddressAutocomplete.css.min.css',
      }),
      cleanup()
    ]
  }
];
