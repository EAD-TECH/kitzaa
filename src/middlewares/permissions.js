"use strict"

import CustomError from "../helpers/customError.js"


export const isOrganizer = (req, res, next) => {
    console.log('Organizer', req.user)
    if (req.user?.role !== 'organizer') {
        throw new CustomError('You must be an organizer to create paid events.', 403)
    }

    next()

}

export const isAdmin = (req, res, next) => {
    console.log('admin', req.user)
    if (req.user?.role !== 'admin') {
        throw new CustomError('AuthorizationError: You must be an Admin to access this resource.', 403)
    }
    next()
}
