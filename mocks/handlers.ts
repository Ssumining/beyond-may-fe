import { authHandlers } from "./authHandlers";
import { courseHandlers } from "./courseHandlers";
import { placeHandlers } from "./placeHandlers";
import { preferenceHandlers } from "./preferenceHandlers";
import { participantHandlers } from "./participantHandlers";

export const handlers = [
  ...preferenceHandlers,
  ...courseHandlers,
  ...authHandlers,
  ...placeHandlers,
  ...participantHandlers,
];
