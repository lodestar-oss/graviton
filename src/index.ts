import { outro, select, text } from "@clack/prompts";
import { mkdir } from "node:fs/promises";
import { basename, join } from "node:path";

import {
  COMING_SOON_MESSAGE,
  CURRENT_DIR_PATH,
  PACKAGE_SCOPE,
} from "@/constants";
import { unwrap } from "@/lib/clack/unwrap";

const initialCwd = process.cwd();

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

  let repoName = basename(initialCwd);
  if (dirPathKind === "NEW_CHILD") {
    repoName = unwrap(
      await text({
        message: "What is the repository's name?",
      }),
    );
    await mkdir(join(initialCwd, repoName));
  }

  const packageScope = unwrap(
    await select({
      message: "What is the package's scope?",
      options: [
        { value: PACKAGE_SCOPE.NONE, label: "None" },
        {
          value: PACKAGE_SCOPE.LITTLE_NEBULAE,
          label: PACKAGE_SCOPE.LITTLE_NEBULAE,
        },
        {
          value: PACKAGE_SCOPE.LODESTAR_OSS,
          label: PACKAGE_SCOPE.LODESTAR_OSS,
        },
      ],
    }),
  );

  const packageName = unwrap(
    await text({
      message: "What is the package's name?",
      initialValue:
        packageScope === PACKAGE_SCOPE.NONE
          ? repoName
          : `${packageScope}/${repoName}`,
    }),
  );

  outro(`Generated package: ${packageName}`);
}
