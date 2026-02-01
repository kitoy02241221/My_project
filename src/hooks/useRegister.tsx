import { useState } from "react"
import { useAppSelector } from "./useAppSelector"
import { setAuth } from "../store/slices/homePage/auth.slice"
import { useDispatch } from "react-redux"


export const useRegister = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    
    const authType = useAppSelector(state => state.authType)

    const dispatch = useDispatch()

    const register = async (login: string, password: string, name: string, surname: string) => {
        setLoading(true)
        setError(null)
        
        try {
            if(authType === true) {   
                    const response = await fetch("http://localhost:5000/api/auth/register", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ login, password, name, surname })
                })
                const result = await response.json()

                if (response.ok && result.success) {
                    fetch("http://localhost:5000/api/auth/login", {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ login, password, name, surname })
                    })
                    dispatch(setAuth())
                    return { success: true, data: result.user }
                } else {
                    setError(result.error || 'Ошибка регистрации')
                    return { success: false, error: result.error }
                }

            } else {
                const logined = await fetch("http://localhost:5000/api/auth/login", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ login, password, name, surname })
                })

                const isLogined = await logined.json()
                if(isLogined.success === true) {
                    dispatch(setAuth())
                }
            }

        } catch (err) {
            const errorMessage = 'Ошибка сети: ' + err
            return { success: false, error: errorMessage }
        } finally {
            setLoading(false)
        }
    }

    return {
        error,
        loading,
        register
    }
}