import { useAppSelector } from "../../../../hooks/useAppSelector";
import { useSearch } from "../../../../hooks/useSearch";
import Product from "../product/product";
import { SearchProduct } from "../product/searchProduct";

function Catalog() {
    const { productData } = useSearch();
    const isSearch = useAppSelector((state) => state.search.isSearch);
    const searchLoading = useAppSelector((state) => state.search.searchLoading);

    return (
        <div>
            {isSearch ? (
                <SearchProduct productData={productData} searchLoading={searchLoading} />
            ) : (
                <Product />
            )}
        </div>
    );
}

export default Catalog;
