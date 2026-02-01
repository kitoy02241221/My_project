import { useAppSelector } from "../../../../hooks/useAppSelector"
import { useDispatch } from "react-redux";
import { hide } from "../../../../store/slices/homePage/buyerOrSeller.slice";



function BuyerOrSeller() {
    const dispatch = useDispatch()

    const isHide = useAppSelector(state => state.buyerOrSeller)

    const sellorBuyStyle = {
        display: isHide ? "block" : "none"
    }

    const buyer = async () => {
        await fetch ("http://localhost:5000/api/user/choose-role", {
            method: "POST",
            credentials: "include", 
            headers: {
                "Content-Type" : "application/json",
            },
            body: JSON.stringify({isSeller: "buyer"})
        })
        dispatch(hide())
    }

    const seller = async () => {
        await fetch ("http://localhost:5000/api/user/choose-role", {
            method: "POST",
            credentials: "include", 
            headers: {
                "Content-Type" : "application/json",
            },
            body: JSON.stringify({isSeller: "seller"})
        })
        dispatch(hide())
    }

    return(
        <div style={sellorBuyStyle}>
            <h1>вы хотите продавать или покупать?</h1>
            <button onClick={seller}>продавать</button>
            <button onClick={buyer}>покупать</button>
        </div>
    )
}

export default BuyerOrSeller