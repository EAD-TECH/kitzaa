
import type { EventStatus } from '../types/event.types.js';
import CustomError from './customError.js';

const ALLOWED_TRANSITIONS: Record<EventStatus, EventStatus[]> = {
  // 'cancelled' hier auch für 'pending' erlaubt — ein User muss sein eigenes, noch
  // nicht geprüftes Event zurückziehen können, nicht nur ein bereits genehmigtes.
  pending: ['approved', 'rejected', 'cancelled'],
  approved: ['completed', 'cancelled'],
  rejected: [],
  cancelled: [],
  completed: [],
};

export const canTransitionTo = (
  currentStatus: EventStatus,
  newStatus: EventStatus
): boolean => {
  return ALLOWED_TRANSITIONS[currentStatus].includes(newStatus);
};

export const assertValidTransition = (  // gecisin gecerli oldugunu dogrula.
  currentStatus: EventStatus,
  newStatus: EventStatus
): void => {
  if (!canTransitionTo(currentStatus, newStatus)) {
    throw new CustomError(
      `Invalid status transition: cannot go from "${currentStatus}" to "${newStatus}"`,
      400
    );
  }
};