import { useState } from "react";

import "./App.css";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ShippingPage from "./pages/ShippingPage";
import PaymentPage from "./pages/PaymentPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import OrderPage from "./pages/OrderPage";
import UserListPage from "./pages/UserListPage";
import UserEditPage from "./pages/UserEditPage";
import ProductListPage from "./pages/ProductListPage";
import ProductEditPage from "./pages/ProductEditPage";
import OrderListPage from "./pages/OrderListPage";

import { Container } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route path="/" Component={HomePage} exact />
            <Route path="/login" Component={LoginPage} />
            <Route path="/register" Component={RegisterPage} />
            <Route path="/profile" Component={ProfilePage} />
            <Route path="/shipping" Component={ShippingPage} />
            <Route path="/payment" Component={PaymentPage} />
            <Route path="/placeorder" Component={PlaceOrderPage} />
            <Route path="/admin/users" Component={UserListPage} />
            <Route path="/admin/products" Component={ProductListPage} />
            <Route path="/admin/orders" Component={OrderListPage} />
            <Route path="/admin/user/:userId/edit" Component={UserEditPage} />
            <Route
              path="/admin/product/:productId/edit"
              Component={ProductEditPage}
            />
            <Route path="/order/:orderId" Component={OrderPage} />
            <Route path="/product/:id" Component={ProductPage} />
            <Route path="/cart/:id?" Component={CartPage} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default App;
