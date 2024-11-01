import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json" assert { type: "json" };
import { minify } from 'rollup-plugin-esbuild-minify'

export default {
  input: "src/index.ts",
  plugins: [typescript({ sourceMap: false }), minify()],
  output: [
    { format: "cjs", file: pkg.main, exports: "auto" },
    { format: "esm", file: pkg.module },
  ],
};
