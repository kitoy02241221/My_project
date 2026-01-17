import NavBar from "../components/layout/navBar"
import AuthModal from "../components/features/authModal/authModal"
import BuyerOrSeller from "../components/features/buyerOrSeller/buyerOrSeller"

function HomePage() {
    return (
        <>
            <NavBar />
            <AuthModal/>
            <BuyerOrSeller/>
        </>
    )
}
export default HomePage