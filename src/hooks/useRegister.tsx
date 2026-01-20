import { useState } from "react"
import { useAppSelector } from "./useAppSelector"
import { setAuth } from "../store/slices/auth.slice"
import { useDispatch } from "react-redux"


export const useRegister = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const authType = useAppSelector(state => state.authType)

    const dispatch = useDispatch()

    const register = async (login: string, password: string) => {
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
                    body: JSON.stringify({ login, password })
                })
                
                console.log("Response status:", response.status)
                const result = await response.json()
                console.log("Response data:", result)



                if (response.ok && result.success) {
                    
                    const autoAuth = await fetch("http://localhost:5000/api/auth/login", {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ login, password })
                    })

                    
                    const resultAutoAuth = await autoAuth.json()

                    
                    if(resultAutoAuth.success === true) {
                        dispatch(setAuth())
                        console.log('autoAuth true')
                    }
                    if(resultAutoAuth.success === false) {
                        console.log("autoAuth false")
                    }
                    
                    console.log("Регистрация успешна!")
                    return { success: true, data: result.user }
                    
                } else {
                    setError(result.error || 'Ошибка регистрации')
                    return { success: false, error: result.error }
                }
            } 
            

            if( authType === false) {
                const response = await fetch("http://localhost:5000/api/auth/login", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ login, password })
                })

                console.log("Response status:", response.status)
                const result = await response.json()
                console.log("Response data:", result)
            }
            
        }
        
        
        catch (err) {
            console.error("Ошибка сети:", err)
            const errorMessage = 'Ошибка сети: ' + err
            return { success: false, error: errorMessage }
        }
        
        
        finally {
            setLoading(false)
        }
    }

    return {
        error,
        loading,
        register
    }
}