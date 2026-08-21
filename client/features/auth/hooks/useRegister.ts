
import { useMutation } from "@tanstack/react-query"
import type { RegisterPayload } from "../validations/register.schema"
import { register } from "../AuthApi"


export const useRegister = () => {

    return useMutation({
        mutationFn: (data: RegisterPayload) => register(data),
    })

}