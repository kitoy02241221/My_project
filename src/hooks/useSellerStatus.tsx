import { useState } from "react"


export const useSellerStatus = () => {
    const [roleStatus, setRoleStatus] = useState(false)
    const [error, setError] = useState("")
    const [roleChosen, setRoleChosen] = useState(false)

    const checkStatus = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/user/role-check", {
                method: "GET",
                credentials: "include"
            })
            const { success, roleChosen, role } = await response.json()

            if(success === true && roleChosen === false) {
                setRoleChosen(true)
            } else {
                setRoleChosen(false)
            }

            if(roleChosen === true && role === 'seller') {
                setRoleStatus(true)
            } else  {
                setRoleStatus(false)
            }
            
        } catch (error) {
            return error
        }
    }

    return {
        roleStatus,
        error,
        checkStatus,
        roleChosen
    }
}