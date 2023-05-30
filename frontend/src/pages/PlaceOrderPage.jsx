import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Message from "../components/Message";
import { useDispatch, useSelector } from "react-redux";
import CheckoutStep from "./CheckoutStep";
import { emptyCart } from "../store/CartSlice";
import { addOrders, loadOrderDetails } from "../store/OrderSlice";

const PlaceOrderPage = () => {
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!cart.paymentMethod) {
    navigate("/payment");
  }

  const itemPrice = Number(
    cart.items
      .reduce((acc, item) => acc + Number(item.price) * Number(item.qty), 0)
      .toFixed(2)
  );
  const shippingPrice = (itemPrice > 100 ? 0 : 10).toFixed(2);
  const taxPrice = (0.12 * Number(itemPrice)).toFixed(2);
  const totalPrice = (
    Number(shippingPrice) +
    Number(taxPrice) +
    Number(itemPrice)
  ).toFixed(2);

  const handelPlaceOrder = async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };
    const requestData = {
      shipping: cart.shipping,
      orderItems: cart.items,
      paymentMethod: cart.paymentMethod,
      taxPrice: taxPrice,
      shippingPrice: shippingPrice,
      totalPrice: totalPrice,
    };

    const { data } = await axios.post(`/api/orders/add/`, requestData, config);
    dispatch(addOrders(data));
    dispatch(loadOrderDetails(data));
    dispatch(emptyCart());
    navigate(`/order/${data._id}`);
  };

  return (
    <div>
      <CheckoutStep step1 step2 step3 step4 />

      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Shipping: </strong>
                {cart.shipping.address}, {cart.shipping.city},{"  "}
                {cart.shipping.pincode},{"  "}
                {cart.shipping.state}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {cart.paymentMethod}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.items.length === 0 ? (
                <Message variant="info">Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.items.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>

                        <Col>
                          <Link to={`/product/${item._id}`}>{item.name}</Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = $
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Item:</Col>
                  <Col>${itemPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cart.items.length == 0}
                  onClick={handelPlaceOrder}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PlaceOrderPage;
