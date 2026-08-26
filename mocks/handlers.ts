import { courseHandlers } from "./courseHandlers";
import { placeHandlers } from "./placeHandlers";
import { preferenceHandlers } from "./preferenceHandlers";

export const handlers = [
  ...preferenceHandlers,
  ...courseHandlers,
  ...placeHandlers,
];
