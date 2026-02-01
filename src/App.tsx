import HomePage from './pages/homePage';
import { Route, Routes } from 'react-router-dom';
import MyProfile from './components/features/profile/myProfile';
import Cart from './components/features/cart/cart';

function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/profile' element={<MyProfile/>}/>
      <Route path='/cart' element={<Cart/>}/>
    </Routes>
  );
}

export default App;
