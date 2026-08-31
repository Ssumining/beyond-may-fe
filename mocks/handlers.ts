import { authHandlers } from "./authHandlers";
import { courseHandlers } from "./courseHandlers";
import { explorationHandlers } from "./explorationHandlers";
import { placeHandlers } from "./placeHandlers";
import { preferenceHandlers } from "./preferenceHandlers";
import { visitHandlers } from "./visitHandlers";
import { participantHandlers } from "./participantHandlers";

export const handlers = [
  ...preferenceHandlers,
  ...courseHandlers,
  ...visitHandlers,
  ...authHandlers,
  ...explorationHandlers,
  ...placeHandlers,
  ...participantHandlers,
];
