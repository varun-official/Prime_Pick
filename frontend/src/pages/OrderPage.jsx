import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { loadOrderDetails } from "../store/OrderSlice";
import { loadFromLocalStorage } from "../store/UserSlice";

const OrderPage = () => {
  const { orderId } = useParams();
  const order = useSelector((state) => state.order);
  const { orderDetails } = order;
  const user = useSelector((state) => state.user);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/orders/${orderId}`, config);
      dispatch(loadOrderDetails(data));
      setLoading(false);
    };
    dispatch(loadFromLocalStorage());
    fetchData();
  }, []);

  const handelPayOrder = async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios.put(`/api/orders/${orderId}/pay/`, {}, config);
    dispatch(loadOrderDetails(data));
  };

  const handelDeliverOrder = async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios.put(
      `/api/orders/${orderId}/deliver/`,
      {},
      config
    );
    dispatch(loadOrderDetails(data));
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Button onClick={() => navigate(-1)} className="btn btn-light my-3">
            <i class="fa-solid fa-arrow-left"></i> Go Back
          </Button>
          <h1>Order: </h1>
          <Row>
            <Col md={8}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Shipping</h2>
                  <p>
                    <strong>Name:</strong> {orderDetails.user.name}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    <a href={`mailto:${orderDetails.user.email}`}>
                      {orderDetails.user.email}
                    </a>
                  </p>
                  <p>
                    <strong>Shipping: </strong>
                    {orderDetails.shippingAddress.address},{" "}
                    {orderDetails.shippingAddress.city},{"  "}
                    {orderDetails.shippingAddress.pincode},{"  "}
                    {orderDetails.shippingAddress.country}
                  </p>
                  <p>Order status:</p>
                  {orderDetails.isDelivered ? (
                    <Message variant="success">
                      Order delivered on {orderDetails.deliveredAt}
                    </Message>
                  ) : (
                    <Message variant="warning">Not delivered</Message>
                  )}
                </ListGroup.Item>

                <ListGroup.Item>
                  <h2>Payment Method</h2>
                  <p>
                    <strong>Method: </strong>
                    {orderDetails.paymentMethod}
                  </p>
                  {orderDetails.isPaid ? (
                    <Message variant="success">
                      Paid at {orderDetails.paidAt}
                    </Message>
                  ) : (
                    <Message variant="warning">Not Paid</Message>
                  )}
                </ListGroup.Item>

                <ListGroup.Item>
                  <h2>Order Items</h2>
                  {orderDetails.orderitems.length === 0 ? (
                    <Message variant="info">Order is empty</Message>
                  ) : (
                    <ListGroup variant="flush">
                      {orderDetails.orderitems.map((item, index) => (
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
                              <Link to={`/product/${item._id}`}>
                                {item.name}
                              </Link>
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
                      <Col>
                        $
                        {orderDetails.orderitems
                          .reduce(
                            (acc, item) =>
                              acc + Number(item.price) * Number(item.qty),
                            0
                          )
                          .toFixed(2)}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping:</Col>
                      <Col>${orderDetails.shippingPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Tax:</Col>
                      <Col>${orderDetails.taxPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Total:</Col>
                      <Col>${orderDetails.totalPrice}</Col>
                    </Row>
                  </ListGroup.Item>

                  {!orderDetails.isPaid && (
                    <ListGroup.Item>
                      <Button
                        type="button"
                        className="btn-block"
                        variant="primary"
                        onClick={handelPayOrder}
                      >
                        Pay Order
                      </Button>
                    </ListGroup.Item>
                  )}
                </ListGroup>

                {
                  user && user.isAdmin && orderDetails.isPaid && !orderDetails.isDelivered &&
                  <ListGroup.Item>
                    <Button
                    type="button"
                    className="btn btn-block"
                    onClick={handelDeliverOrder}
                    >
                      Mark as Deliver
                    </Button>
                  </ListGroup.Item>
                }
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default OrderPage;
