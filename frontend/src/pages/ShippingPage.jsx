import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Message from "../components/Message";
import {
  addShippingAddress,
  loadShippingFromLocalStorage,
} from "../store/CartSlice";

import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutStep from "./CheckoutStep";

const ShippingPage = () => {
  const cart = useSelector((state) => state.cart);
  const { shipping } = cart;
  const navigate = useNavigate();

  const [address, setAddress] = useState(shipping.address);
  const [city, setCity] = useState(shipping.city);
  const [pincode, setPincode] = useState(shipping.pincode);
  const [state, setState] = useState(shipping.state);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadShippingFromLocalStorage());
  }, []);

  const handelSubmit = async (e) => {
    e.preventDefault();

    const shippingDeities = {
      address,
      city,
      pincode,
      state,
    };
    dispatch(addShippingAddress(shippingDeities));
    navigate("/payment");
  };

  return (
    <FormContainer>
      <CheckoutStep step1 step2 />
      <Form onSubmit={handelSubmit}>
        <Form.Group controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter your shipping address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="city">
          <Form.Label>City</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter your city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="pincode">
          <Form.Label>Pincode</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter your pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="state">
          <Form.Label>State</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter your state"
            value={state}
            onChange={(e) => setState(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingPage;
