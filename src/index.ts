import { select } from "@clack/prompts";

import { COMING_SOON_MESSAGE, CURRENT_DIR_PATH } from "@/constants";
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

if (action === "gen") {
  const projectKind = unwrap(
    await select({
      message: "What would you like to generate?",
      options: [
        { value: "library", label: "Library" },
        {
          value: "app",
          label: "App",
          disabled: true,
          hint: COMING_SOON_MESSAGE,
        },
      ],
    }),
  );

  const dirPathKind = unwrap(
    await select({
      message: `Where should the ${projectKind} be generated?`,
      options: [
        {
          value: "CURRENT",
          label: "The current directory",
          hint: CURRENT_DIR_PATH,
        },
        {
          value: "NEW_CHILD",
          label: "A new child directory",
        },
      ],
    }),
  );
}
