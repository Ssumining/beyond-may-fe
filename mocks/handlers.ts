import { courseHandlers } from "./courseHandlers";
import { preferenceHandlers } from "./preferenceHandlers";
import { visitHandlers } from "./visitHandlers";

export const handlers = [
  ...preferenceHandlers,
  ...courseHandlers,
  ...visitHandlers,
];
