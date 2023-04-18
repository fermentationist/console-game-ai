import itemLoader from "./game/utils/rollup-plugin-item-loader";
import deleteSrc from "./game/utils/rollup-plugin-delete-src";
import terser from "@rollup/plugin-terser";

export default {
  input: "dist/game/index.js",
	context: "window",
	plugins: [itemLoader, deleteSrc("dist/game"), terser()],
  output: {
    dir: "dist/game",
    format: "iife", // immediately-invoked function expression — suitable for <script> tags, will prevent variables from leaking into the global scope (unless done so explicitly)
    sourcemap: true,
  },
};
