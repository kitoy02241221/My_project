import NavBar from "../components/layout/navBar"
import BuyerOrSeller from "../components/features/buyOrSell/buyerOrSeller/buyerOrSeller"
import { useSellerStatus } from "../hooks/useSellerStatus"
import Catalog from "../components/features/catalog/catalog/catalog"

function HomePage() {

    const {roleChosen, checkStatus} = useSellerStatus()

    checkStatus()

    return (
        <>
            <NavBar />
            {roleChosen && <BuyerOrSeller/>}
            <Catalog/>
        </>
    )
}
export default HomePage