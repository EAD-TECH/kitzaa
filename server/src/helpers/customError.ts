"use strict"

class CustomError extends Error {

    name = 'CustomError'
    statusCode: number;

    constructor(message: string, statusCode = 500) {
        super(message)
        this.statusCode = statusCode
    }
}

export default CustomError;
