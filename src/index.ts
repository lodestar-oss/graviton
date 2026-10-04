import type { PackageJson } from "type-fest";

import { parse } from "@bomb.sh/args";
import { log, outro, select, text } from "@clack/prompts";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { x } from "tinyexec";
import { validate } from "typia";

import {
  COMING_SOON_MESSAGE,
  CURRENT_DIR_PATH,
  EXIT_CODE,
  ORG,
  WORKING_DIRECTORY_OPTION,
} from "@/constants";
import { unwrap } from "@/lib/clack/unwrap";

const argv = process.argv.slice(2);
const args = parse(argv, {
  string: [WORKING_DIRECTORY_OPTION.LONG],
  alias: { [WORKING_DIRECTORY_OPTION.SHORT]: WORKING_DIRECTORY_OPTION.LONG },
  default: { [WORKING_DIRECTORY_OPTION.LONG]: CURRENT_DIR_PATH },
});

const initialCwd = args.cwd === CURRENT_DIR_PATH ? process.cwd() : args.cwd;
log.step(`Working directory: ${initialCwd}`);

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
  const createRepoResult = await x(
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
    { timeout: 90_000, nodeOptions: { cwd: initialCwd } },
  );
  if (createRepoResult.exitCode !== 0) {
    log.error(createRepoResult.stderr);
    process.exit(EXIT_CODE.FAILURE.GENERIC);
  }
  log.success(`Created ${repoName} successfully!`);

  const repoPath = join(initialCwd, repoName);

  // Change the template's package name into this repo's package name
  const packageJsonPath = join(repoPath, "package.json");
  const packageJsonText = await readFile(packageJsonPath, {
    encoding: "utf-8",
  });
  const packageJson = JSON.parse(packageJsonText);
  const result = validate<PackageJson>(packageJson);
  if (!result.success) {
    log.warn("Failed to validate the content of package.json file.");
    for (const error of result.errors) {
      log.warn(
        `${error.path}: expected ${error.expected}, got ${JSON.stringify(error.value)}`,
      );
    }
    log.warn("Skip changing the package's name.");
  } else {
    const newPackageJson = { ...result.data, name: packageName };
    await writeFile(packageJsonPath, JSON.stringify(newPackageJson, null, 2));
  }

  // Run pnpm install
  log.step(`Installing dependencies for ${packageName}...`);
  const installResult = await x("pnpm", ["install"], {
    timeout: 60_000,
    nodeOptions: { cwd: repoPath },
  });
  if (installResult.exitCode !== 0) {
    log.warn("Failed to install dependencies.");
    log.warn(installResult.stderr);
    log.warn("Skip this step.");
  } else {
    log.success("Installed successfully!");
  }

  // Commit changes and push
  const addResult = await x("git", ["add", "-A"]);
  if (addResult.exitCode === 0 && addResult.stdout.trim().length === 0) {
    log.info("No changes to commit.");
  } else if (addResult.exitCode !== 0) {
    log.warn("Failed to add changes.");
    log.warn(addResult.stderr);
    log.warn("Skip adding package name change.");
  } else {
    const commitResult = await x("git", [
      "commit",
      "-m",
      `chore: complete setup.`,
    ]);
    if (commitResult.exitCode !== 0) {
      log.warn("Failed to commit changes.");
      log.warn(commitResult.stderr);
      log.warn("Skip commiting package name change.");
    } else {
      const pushResult = await x("git", ["push"]);
      if (pushResult.exitCode !== 0) {
        log.warn("Failed to push changes.");
        log.warn(pushResult.stderr);
        log.warn("Skip pushing package name change.");
      } else {
        log.success("Setup done. Pushed changes to remote.");
      }
    }
  }

  // Operation complete
  outro(`Created ${packageName} at ${repoPath}.`);
}
