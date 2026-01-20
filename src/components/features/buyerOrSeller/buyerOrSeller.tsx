import { useEffect } from "react"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { useDispatch } from "react-redux";
import { hide } from "../../../store/slices/buyerOrSeller.slice";
import { useSellerStatus } from "../../../hooks/useSellerStatus";



function BuyerOrSeller() {
    const dispatch = useDispatch()


    const isHide = useAppSelector(state => state.buyerOrSeller)


    const sellorBuyStyle = {
        display: isHide ? "block" : "none"
    }


    const buyer = async () => {
        await fetch ("http://localhost:5000/api/buyer_or_seller", {
            method: "POST",
            credentials: "include", 
            headers: {
                "Content-Type" : "application/json",
            },
            body: JSON.stringify({isCreator: true})
        })

        dispatch(hide())
    }


    const seller = async () => {
        await fetch ("http://localhost:5000/api/buyer_or_seller", {
            method: "POST",
            credentials: "include", 
            headers: {
                "Content-Type" : "application/json",
            },
            body: JSON.stringify({isCreator: false})
        })

        dispatch(hide())
    }

    return(
        <div style={sellorBuyStyle}>
            <h1>вы хотите продавать или покупать?</h1>

            <button onClick={buyer}>продавать</button>
            <button onClick={seller}>покупать</button>
        </div>
    )
}


export default BuyerOrSeller