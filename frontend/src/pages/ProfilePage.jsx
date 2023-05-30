import React, { useState, useEffect } from "react";
import { Link, redirect } from "react-router-dom";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Message from "../components/Message";
import Loader from "../components/Loader";

import { useDispatch, useSelector } from "react-redux";
import { setUser, setError } from "../store/UserSlice";
import { loadOrders } from "../store/OrderSlice";

const ProfilePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user);
  const order = useSelector((state) => state.order);
  const { orders } = order;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/orders/myorders/`, config);
      dispatch(loadOrders(data));
    };

    if (!user.isLoggedIn) {
      navigate("/login");
    } else {
      setLoading(true);
      setEmail(user.email);
      setName(user.name);
      fetchData();
      setLoading(false);
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password != confirmPassword) {
      setMessage("Password is not matching");
      return;
    } else {
      const userSignUpData = {
        name: name,
        email: email,
        password: password,
      };
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      try {
        const { data } = await axios.put(
          "api/users/profile/update/",
          userSignUpData,
          config
        );
        setMessage("");
        dispatch(setUser(data));
      } catch (error) {
        dispatch(setError(error.response.data.detail));
      }
    }
  };
  return (
    <Row>
      <Col md={3}>
        <h2>User Profiles</h2>
        {message && <Message variant="danger">{message}</Message>}
        {user.isError && (
          <Message variant="danger">{user.errorMessage}</Message>
        )}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="email">
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Confirm password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary" className="my-3">
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>User Orders</h2>
        {loading ? (
          <Loader />
        ) : (
          <Table striped responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Delivered</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {orders.map((item) => (
                <tr>
                  <td>{item._id}</td>
                  <td>{item.createdAt.substring(0, 10)}</td>
                  <td>${item.totalPrice}</td>
                  <td>
                    {item.isPaid ? (
                      item.paidAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${item._id}`}>
                      <Button className="btn-sm"> Details</Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default ProfilePage;
