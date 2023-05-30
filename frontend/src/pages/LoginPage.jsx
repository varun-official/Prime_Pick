import React, { useState, useEffect } from "react";
import { Link, redirect } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";

import { useDispatch, useSelector } from "react-redux";
import { setUser, setError, loadFromLocalStorage } from "../store/UserSlice";
import FormContainer from "../components/FormContainer";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadFromLocalStorage());
  }, []);

  useEffect(() => {
    if (user.isLoggedIn) {
      navigate("/");
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const userLoginData = {
      username: email,
      password: password,
    };
    try {
      const { data } = await axios.post("api/users/login/", userLoginData);
      dispatch(setUser(data));
      console.log(data);
    } catch (error) {
      dispatch(setError(error.response.data.detail));
    }
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>
      {user.isError && <Message variant="danger">{user.errorMessage}</Message>}
      <Form onSubmit={submitHandler}>
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
            type="text"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary" className="my-3">
          Sign In
        </Button>
      </Form>
      <Row className="py-3">
        <Col>
          New Customer? <Link to={"/register"}>Register</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginPage;
