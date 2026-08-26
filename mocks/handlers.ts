import { courseHandlers } from "./courseHandlers";
import { placeHandlers } from "./placeHandlers";
import { preferenceHandlers } from "./preferenceHandlers";
import { visitHandlers } from "./visitHandlers";

export const handlers = [
  ...preferenceHandlers,
  ...courseHandlers,
  ...visitHandlers,
  ...placeHandlers,
];
