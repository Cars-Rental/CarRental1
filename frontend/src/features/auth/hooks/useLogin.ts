import { useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "@/store/hooks";

import { login } from "../api";
import { loginSuccess } from "../store";

export function useLogin() {
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: login,

        onSuccess: (data) => {
            dispatch(loginSuccess(data.user));
        }
    })
}