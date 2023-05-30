import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import axios from "axios";
import Product from "../components/Product";
import { useDispatch, useSelector } from "react-redux";
import { loadProducts } from "../store/ProductSlice";
import { loadFromLocalStorage } from "../store/UserSlice";

import Loader from "../components/Loader";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const products = useSelector((state) => state.products);
  const { allProducts } = products;

  const navigate = useNavigate();
  const location = useLocation();
  const keyword = location.search;

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  if (!user.isLoggedIn) {
    navigate("/login");
  }

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      const { data } = await axios.get(`/api/products${keyword}`);
      dispatch(loadProducts(data));
      setIsLoading(false);
    };
    dispatch(loadFromLocalStorage());
    fetchProduct();
  }, [dispatch, keyword]);
  return (
    <div>
      {!keyword && <ProductCarousel />}
      <h1>Latest Products</h1>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Row>
            {allProducts.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            page={allProducts?.page}
            pages={allProducts?.pages}
            keyword={keyword}
          />
        </>
      )}
    </div>
  );
};

export default HomePage;
