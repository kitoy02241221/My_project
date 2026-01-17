import { useAppSelector } from "../../../hook/useAppSelector"


function BuyerOrSeller() {
    const isAuth = useAppSelector(state => state.auth)

    const sellorBuyStyle = {
        display: isAuth ? "block" : "none"
    }

    return(
        <div style={sellorBuyStyle}>
            <h1>вы хотите продавать или покупать?</h1>

            <button>продавать</button>
            <button>покупать</button>
        </div>
    )
}


export default BuyerOrSeller