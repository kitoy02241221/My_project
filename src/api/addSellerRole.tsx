import { useDispatch } from "react-redux"
import { hide } from "../store/slices/homePage/buyerOrSeller.slice"

function Seller() {
    const dispatch = useDispatch()

    const result = async () => {
        await fetch ("http://localhost:5000/api/user/choose-role", {
            method: "POST",
            credentials: "include", 
            headers: {
                "Content-Type" : "application/json",
            },
            body: JSON.stringify({isSeller: "seller"})
        })
    }

    result()

    dispatch(hide())

    return result
}


export default Seller