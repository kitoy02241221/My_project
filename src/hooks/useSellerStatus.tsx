
import { useState } from "react"


export const useSellerStatus = () => {

    const [error, setError] = useState("")
    const [creator, setCreator] = useState(false)


    const checkStatus = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/user/status", {
                    method: "GET",
                    credentials: "include",
                })

                const result = await response.json()
                if(result.success === true) {
                    if(result.isCreator === false) {
                        setCreator(false)
                    } if(result.isCreator === true) {
                        setCreator(false)
                    } if(result.isCreator === null) {
                        setCreator(true)
                    }
                    return creator
                } if(result.success === false) {
                    setError("ошибка при получении статуса пользователя")
                }

                } catch(error) {
                    setError("ошибка при отправке запроса на получение статуса пользователя")
                } finally {
                    setError("")
                }
        }

    


    return{
        checkStatus,
        setError,
        error,
        setCreator,
        creator
    }
}