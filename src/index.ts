import { log, outro, select, text } from "@clack/prompts";
import { x } from "tinyexec";

import { COMING_SOON_MESSAGE, EXIT_CODE, ORG } from "@/constants";
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

  const org = unwrap(
    await select({
      message: "Who owns this project?",
      options: [
        { value: ORG.PERSONAL, label: "Me" },
        {
          value: ORG.LITTLE_NEBULAE,
          label: "Little Nebulae",
          hint: "for libraries",
        },
        { value: ORG.LODESTAR_OSS, label: "Lodestar OSS", hint: "for apps" },
      ],
      initialValue: projectKind === "LIB" ? "little-nebulae" : "lodestar-oss",
    }),
  );

  const repoName = unwrap(
    await text({
      message: "What is the repository's name?",
    }),
  );

  const packageName = unwrap(
    await text({
      message: "What is the package's name?",
      initialValue: org === ORG.PERSONAL ? repoName : `@${org}/${repoName}`,
    }),
  );

  // Create the repo on GitHub then clone it down locally
  const template =
    projectKind === "LIB" ? "little-nebulae/little-nebula" : "RyanLurn/base-4";
  log.step(`Creating ${repoName} from ${template} template...`);
  const { exitCode, stderr } = await x(
    "gh",
    [
      "repo",
      "create",
      org === ORG.PERSONAL ? repoName : `${org}/${repoName}`,
      "--public",
      "--clone",
      "--template",
      template,
    ],
    { timeout: 60_000, nodeOptions: { cwd: initialCwd } },
  );
  if (exitCode !== 0) {
    log.error(stderr);
    process.exit(EXIT_CODE.FAILURE.GENERIC);
  }
  log.success(`Created ${repoName} successfully!`);
}
