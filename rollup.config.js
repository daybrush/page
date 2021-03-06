import typescript from 'rollup-plugin-typescript';
import PrototypeMinify from "rollup-plugin-prototype-minify";
import replace from "rollup-plugin-replace";
import { uglify } from "rollup-plugin-uglify";
import resolve from "rollup-plugin-node-resolve";


const pkg = require("./package.json");
const banner = require("./config/banner");

const transpiler = typescript({
  "module": "es2015",
  "target": "es5",
  "lib": ["es2015", "dom"],
  "exclude": "node_modules/**",
  "sourceMap": true,
});
const resolvePlugin = resolve();
const uglifyCode = uglify({
  sourcemap: true,
  output: {
    comments: function (node, comment) {
      var text = comment.value;
      var type = comment.type;
      if (type === "comment2") {
        // multiline comment
        return /@name\:\spage/.test(text);
      }
    },
  },
});
const plugins = [
  transpiler,
  replace({
    "#__VERSION__#": pkg.version,
    "/** @class */": "/*#__PURE__*/",
    delimiters: ["", ""],
  }),
  PrototypeMinify({ sourcemap: true })
];


const output = {
  banner,
  format: "es",
  freeze: false,
  exports: "named",
  interop: false,
  sourcemap: true,
};

export default [
  {
    input: 'src/index.ts',
    plugins,
    output: {
      ...output,
      file: `./dist/page.esm.js`,
    },
  }, {
    input: 'src/index.umd.ts',
    plugins: [...plugins, ],
    external: ["@egjs/component"],
    output: {
      ...output,
      globals: {
        "@egjs/component": "eg.Component",
      },
      format: "umd",
      name: "Page",
      exports: "default",
      file: `./dist/page.main.js`,
    },
  }, {
    input: 'src/index.umd.ts',
    plugins: [...plugins, resolvePlugin, ],
    output: {
      ...output,
      format: "umd",
      name: "Page",
      exports: "default",
      file: `./dist/page.js`,
    },
  }, {
    input: 'src/index.umd.ts',
    plugins: [...plugins, resolvePlugin, uglifyCode],
    output: {
      ...output,
      format: "umd",
      name: "Page",
      exports: "default",
      file: `./dist/page.min.js`,
    },
  }
];