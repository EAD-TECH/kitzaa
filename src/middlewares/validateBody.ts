
import { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import { ZodError } from "zod";

export const validateBody = <T>(schema: ZodSchema<T>) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ): void => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            res.status(400).json({
                success: false,
                errors: result.error.issues  // daha okunabilir hata mesajları
            });
            return;
        }

        req.body = result.data;  
        next();
    };
};