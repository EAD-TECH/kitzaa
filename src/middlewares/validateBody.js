
export const validateBody = (schema) => {
    return (req, res, next) => {

        const result = schema.safeParse(req.body);

        console.log('schema result', result)

        if (!result.success) {
            return res.status(400).json({
                success: false,
                errors: result.error.issues,
            });
        }

        req.body = result.data

        next()
    }
}