import ttsc from "@ttsc/unplugin/rolldown";
import { defineConfig } from "tsdown";

export default defineConfig({
  // Lint options
  publint: true,
  // Plugin option
  plugins: [ttsc()],
  checks: {
    bundlerTimings: false,
  },
});
