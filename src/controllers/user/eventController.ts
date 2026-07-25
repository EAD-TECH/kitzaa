import type { Request, Response } from "express";

const notImplemented = async (_req: Request, res: Response) => {
  res.status(501).json({
    error: true,
    message: "Not implemented yet",
  });
};

const eventController = {
  list: notImplemented,
  read: notImplemented,
  create: notImplemented,
  update: notImplemented,
  deletee: notImplemented,
  join: notImplemented,
  leave: notImplemented,
  like: notImplemented,
  myEvents: notImplemented,
  myParticipations: notImplemented,
};

export default eventController;
