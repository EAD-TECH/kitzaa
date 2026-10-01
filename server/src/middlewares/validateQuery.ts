
import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

export const validateQuery = <T>(schema: ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      res.status(400).json({
        success: false,
        errors: result.error.issues,
      });
      return;
    }

    // Express 5'te req.query salt-okunur bir getter (setter yok), uzerine yazilamaz.
    // Dogrulanmis/donusturulmus veriyi ayri bir property'de tasiyoruz.
    // req.body = result.data'sı hâlâ çalışıyor çünkü body'de böyle bir kısıtlama yok — sadece query ve params Express 5'te read-only getter'a çevrildi.
    req.validatedQuery = result.data;
    next();
  };
};