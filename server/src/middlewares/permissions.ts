"use strict"

import type { Request, Response, NextFunction } from "express";
import type { Model, Types } from "mongoose";
import { isValidObjectId } from "mongoose";
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

export const isOrganizerOrAdmin = (req: Request, res: Response, next: NextFunction) => {
    console.log('OrganizerOrAdmin', req.user)
    if (req.user?.role !== 'organizer' && req.user?.role !== 'admin') {
        throw new CustomError('AuthorizationError: You must be an Organizer or Admin to access this resource.', 403)
    }
    next()
}

// Kaynagin sahibi ya da admin ise devam eder; kaynagi req.resource'a koyar
// (controller'da tekrar sorgu atmaya gerek kalmaz).
export const isOwnerOrAdmin = <T extends { createdBy: Types.ObjectId }>(
    model: Model<T>,
    ownerField: keyof T = 'createdBy'
) => {
    return async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        if (!isValidObjectId(req.params.id)) {
            throw new CustomError('Invalid resource id.', 400)
        }

        const doc = await model.findById(req.params.id)

        if (!doc) {
            throw new CustomError('Resource not found', 404)
        }

        // Mongoose'un ObjectId tipine özel .equals() metodu, iki ID'yi içerik bazlı karşılaştırır.toString() === .toString() sorununu, Mongoose'un kendi sunduğu hazır çözümüyle yapıyor.
        const ownerId = doc[ownerField] as Types.ObjectId | undefined
        const isOwner = !!ownerId && ownerId.equals(req.user._id)

        if (!isOwner && req.user?.role !== 'admin') {
            throw new CustomError('You do not have permission to perform this action.', 403)
        }

        req.resource = doc
        next()
    }
}
