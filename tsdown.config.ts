import ttsc from "@ttsc/unplugin/rolldown";
import { defineConfig } from "tsdown";

export default defineConfig({
  // Build options
  entry: ["./src/index.ts"],
  platform: "node",
  exports: true,
  // Lint options
  publint: true,
  // Plugin option
  plugins: [ttsc()],
  checks: {
    bundlerTimings: false,
  },
});
