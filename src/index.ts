import { outro, select, text } from "@clack/prompts";

import { COMING_SOON_MESSAGE, PACKAGE_SCOPE } from "@/constants";
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

  const repoName = unwrap(
    await text({
      message: "What is the repository's name?",
    }),
  );

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
