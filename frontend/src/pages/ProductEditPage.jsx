import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Message from "../components/Message";

import { useDispatch, useSelector } from "react-redux";
import { setAdminEditUser } from "../store/UserSlice";
import FormContainer from "../components/FormContainer";
import { setEditProduct, resetEditProduct } from "../store/ProductSlice";
import Loader from "../components/Loader";

const ProductEditPage = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(false);
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const user = useSelector((state) => state.user);
  const product = useSelector((state) => state.products);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { productId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/products/${productId}/`, config);
      dispatch(setEditProduct(data));
    };
    if (!product.editProduct.name) {
      fetchData();
    } else {
      setName(product.editProduct.name);
      setPrice(product.editProduct.price);
      setImage(product.editProduct.image);
      setBrand(product.editProduct.brand);
      setCategory(product.editProduct.category);
      setCountInStock(product.editProduct.countInStock);
      setDescription(product.editProduct.description);
    }
  }, [product, productId, dispatch]);

  const updateHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };

    const productData = {
      name: name,
      price: price,
      image: image,
      brand: brand,
      countInStock: countInStock,
      category: category,
      description: description,
    };

    const { data } = await axios.put(
      `/api/products/update/${productId}/`,
      productData,
      config
    );

    navigate(-1);
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();

    formData.append("image", file);
    formData.append("product_id", productId);
    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/products/upload/`,
        formData,
        config
      );
      setUploading(false);
      setImage(data);
    } catch (error) {
      setUploading(false);
    }
  };

  const goBackHandler = () => {
    dispatch(resetEditProduct());
    navigate(-1);
  };

  return (
    <FormContainer>
      <Button onClick={() => goBackHandler()} className="btn btn-light my-3">
        <i class="fa-solid fa-arrow-left"></i> Go Back
      </Button>
      <h1>Edit Product</h1>
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

        <Form.Group controlId="price">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter product price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="image">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          ></Form.Control>
          <Form.Control
            type="file"
            id="image-file"
            Label="choose File"
            custom
            onChange={uploadImage}
          ></Form.Control>
          {uploading && <Loader />}
        </Form.Group>

        <Form.Group controlId="brand">
          <Form.Label>Brand</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="countInStock">
          <Form.Label>CountInStock</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter product stock"
            value={countInStock}
            onChange={(e) => setCountInStock(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary" className="my-3">
          Update
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ProductEditPage;
