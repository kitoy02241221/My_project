import NavBar from "../components/layout/navBar"
import AuthModal from "../components/features/authModal/authModal"
import BuyerOrSeller from "../components/features/buyerOrSeller/buyerOrSeller"
import { useAppSelector } from "../hooks/useAppSelector"
import { useSellerStatus } from "../hooks/useSellerStatus"
import { useEffect } from "react"

function HomePage() {

    const isAuth = useAppSelector(state => state.auth)
    const {creator, checkStatus} = useSellerStatus()
    


    useEffect(() => {
        checkStatus()
        console.log(creator)
    }, [isAuth])

    return (
        <>
            <NavBar />
            <AuthModal/>
            {creator && <BuyerOrSeller/>}
        </>
    )
}
export default HomePage