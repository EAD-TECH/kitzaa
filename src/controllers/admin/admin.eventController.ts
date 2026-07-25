import type { Request, Response } from "express";

const notImplemented = async (_req: Request, res: Response) => {
  res.status(501).json({
    error: true,
    message: "Not implemented yet",
  });
};

const adminEventController = {
  list: notImplemented,
  stats: notImplemented,
  read: notImplemented,
  approve: notImplemented,
  reject: notImplemented,
  cancel: notImplemented,
  deletee: notImplemented,
};

export default adminEventController;
