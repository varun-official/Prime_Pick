import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Card,
  Form,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {
  addToCart,
  removeFromCart,
  loadProductsFromLocalStorage,
} from "../store/CartSlice";

const CartPage = () => {
  const cart = useSelector((state) => state.cart);
  const { items } = cart;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(loadProductsFromLocalStorage());
  }, []);

  const handelQtyChange = async (e, id) => {
    let product = items.find((item) => item._id == id);
    if (product) {
      const qtyChangeProduct = {
        _id: id,
        name: product.name,
        qty: Number(e.target.value),
        price: product.price,
        image: product.image,
        countInStock: product.countInStock,
      };
      dispatch(addToCart(qtyChangeProduct));
    }
  };

  const removeFromCartHandler = async (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = async () => {
    navigate(`/shipping`);
  };

  return (
    <Row>
      <Col md={8}>
        <h1>SHOPPING CART</h1>
        {items.length === 0 ? (
          <Message variant="info">
            Your cart is empty <Link to="/">Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {items.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={3}>
                    <Form.Select
                      value={item.qty}
                      onChange={(e) => {
                        handelQtyChange(e, item._id);
                      }}
                    >
                      {[...Array(item.countInStock).keys()].map((index) => (
                        <option key={index} value={index + 1}>
                          {index + 1}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={1}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>
                Subtotal ({items.reduce((acc, item) => acc + item.qty, 0)})
                items
              </h2>
              $
              {items
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}
            </ListGroup.Item>
          </ListGroup>
          <ListGroup.Item>
            <Button
              type="button"
              className="btn-block"
              disabled={items.length === 0}
              onClick={checkoutHandler}
            >
              Proceed To Checkout
            </Button>
          </ListGroup.Item>
        </Card>
      </Col>
    </Row>
  );
};

export default CartPage;
