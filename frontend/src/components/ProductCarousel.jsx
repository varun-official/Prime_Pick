import React, { useEffect, useState } from "react";
import { Carousel, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";
import { useDispatch, useSelector } from "react-redux";
import { loadTopProducts } from "../store/ProductSlice";

const ProductCarousel = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data } = await axios.get(`/api/products/top/`);
      console.log(data);
      dispatch(loadTopProducts(data));
      setLoading(false);
    };
    fetchProduct();
  }, [dispatch]);
  return loading ? (
    <Loader />
  ) : (
    <Carousel pause="hover" className="bg-dark">
      {products.topProducts.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Image src={product.image} alt={product.name} fluid />
            <Carousel.Caption className="carousel.caption">
              <h4>
                {product.name} (${product.price})
              </h4>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
