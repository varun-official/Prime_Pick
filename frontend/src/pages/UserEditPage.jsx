import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Message from "../components/Message";

import { useDispatch, useSelector } from "react-redux";
import { setAdminEditUser } from "../store/UserSlice";
import FormContainer from "../components/FormContainer";

const UserEditPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState("");

  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/users/${userId}`, config);
      dispatch(setAdminEditUser(data));
      setName(data.name);
      setEmail(data.email);
      setIsAdmin(data.isAdmin);
    };
    fetchData();
  }, []);

  const updateHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };

    const userData = {
      name: name,
      email: email,
      isAdmin: isAdmin,
    };

    const { data } = await axios.put(
      `/api/users/update/${userId}/`,
      userData,
      config
    );

    navigate(-1);
  };

  return (
    <FormContainer>
      <Button onClick={() => navigate(-1)} className="btn btn-light my-3">
        <i class="fa-solid fa-arrow-left"></i> Go Back
      </Button>
      <h1>Edit USer</h1>
      {message && <Message variant="danger">{message}</Message>}
      {user.isError && <Message variant="danger">{user.errorMessage}</Message>}
      <Form onSubmit={updateHandler}>
        <Form.Group controlId="email">
          <Form.Label>Name</Form.Label>
          <Form.Control
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

        <Form.Group controlId="isAdmin">
          <Form.Check
            type="checkbox"
            label="Is Admin"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          ></Form.Check>
        </Form.Group>

        <Button type="submit" variant="primary" className="my-3">
          Update
        </Button>
      </Form>
    </FormContainer>
  );
};

export default UserEditPage;
