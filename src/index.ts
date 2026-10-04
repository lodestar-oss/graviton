import { select } from "@clack/prompts";

import { COMING_SOON_MESSAGE } from "@/constants";
import { unwrap } from "@/lib/clack/unwrap";

const action = unwrap(
  await select({
    message: "What would you like to do?",
    options: [
      { value: "gen", label: "Generate code" },
      {
        value: "commit",
        label: "Commit work",
        disabled: true,
        hint: COMING_SOON_MESSAGE,
      },
    ],
  }),
);
