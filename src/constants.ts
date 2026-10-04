export const WORKING_DIRECTORY_OPTION = {
  LONG: "cwd",
  SHORT: "C",
} as const;

export const COMING_SOON_MESSAGE = "Coming soon...";
export const OPERATION_CANCELED_MESSAGE = "Operation canceled.";

export const EXIT_CODE = {
  SUCCESS: 0,
  FAILURE: {
    GENERIC: 1,
    INTERRUPTED: 130,
  },
} as const;

export const CURRENT_DIR_PATH = ".";

export const ORG = {
  PERSONAL: "",
  LITTLE_NEBULAE: "little-nebulae",
  LODESTAR_OSS: "lodestar-oss",
} as const;
