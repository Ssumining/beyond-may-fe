import { authHandlers } from "./authHandlers";
import { courseHandlers } from "./courseHandlers";
import { preferenceHandlers } from "./preferenceHandlers";

export const handlers = [
  ...preferenceHandlers,
  ...courseHandlers,
  ...authHandlers,
];
