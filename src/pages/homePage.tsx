import { NavBar } from "../components/layout/navBar";
import BuyerOrSeller from "../components/features/buyOrSell/buyerOrSeller/buyerOrSeller";
import Catalog from "../components/features/catalog/catalog/catalog";
import { useSearch } from "../hooks/useSearch";
import { useEffect } from "react";

function HomePage() {
    const { search } = useSearch();

    useEffect(() => {
        search("asdasd");
    }, []);
    return (
        <>
            <NavBar />
            <BuyerOrSeller />
            <Catalog />
        </>
    );
}
export default HomePage;
