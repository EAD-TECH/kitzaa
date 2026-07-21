"use strict"

import type { Request, Response, NextFunction } from "express";
import CustomError from "../helpers/customError.js"


export const isOrganizer = (req: Request, res: Response, next: NextFunction) => {
    console.log('Organizer', req.user)
    if (req.user?.role !== 'organizer') {
        throw new CustomError('You must be an organizer to create paid events.', 403)
    }

    next()

}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    console.log('admin', req.user)
    if (req.user?.role !== 'admin') {
        throw new CustomError('AuthorizationError: You must be an Admin to access this resource.', 403)
    }
    next()
}
