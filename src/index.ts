import { select } from "@clack/prompts";

import { COMING_SOON_MESSAGE, CURRENT_DIR_PATH } from "@/constants";
import { unwrap } from "@/lib/clack/unwrap";

const action = unwrap(
  await select({
    message: "What would you like to do?",
    options: [
      { value: "GEN", label: "Generate code" },
      {
        value: "COMMIT",
        label: "Commit work",
        disabled: true,
        hint: COMING_SOON_MESSAGE,
      },
    ],
  }),
);

if (action === "GEN") {
  const projectKind = unwrap(
    await select({
      message: "What would you like to generate?",
      options: [
        { value: "LIB", label: "Library" },
        {
          value: "APP",
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
