import HomePage from "./pages/homePage";
import { Route, Routes } from "react-router-dom";
import { CartPage } from "./pages/cartPage";
import { ProfilePage } from "./pages/profilePage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/cart" element={<CartPage />} />
        </Routes>
    );
}

export default App;
