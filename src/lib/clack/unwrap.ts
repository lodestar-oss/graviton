import type { CANCEL_SYMBOL } from "@clack/prompts";

import { cancel, isCancel } from "@clack/prompts";

import { EXIT_CODE, OPERATION_CANCELED_MESSAGE } from "@/constants";

export function unwrap<T>(value: T | typeof CANCEL_SYMBOL): T {
  if (isCancel(value)) {
    cancel(OPERATION_CANCELED_MESSAGE);
    process.exit(EXIT_CODE.FAILURE.INTERRUPTED);
  }
  return value;
}
