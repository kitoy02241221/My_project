import { useState } from "react";


export const useProduct = () => {

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const getProduct = async (img: string, name: string, description: string, price: number) => {
        try {
        setLoading(true)

            const response = await fetch("http://localhost:5000/api/products/create", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify({image_base64: img, name, description, price})
                })

                const result = await response.json()
                if(result.success === true) {
                    return true
                } else {
                    return false
                }
        } catch(error: any) {
        setLoading(false)
        setError("ошибка сети")
        console.log(error)
        } finally {
            setLoading(false)
            setError("")
        }
    }

    

    
    return {
        error,
        loading,
        getProduct,
    }
}