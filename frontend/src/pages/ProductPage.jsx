import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Card,
  Form,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import Rating from "../components/Rating";
import { useDispatch, useSelector } from "react-redux";
import { loadProductDeities } from "../store/ProductSlice";
import { addToCart } from "../store/CartSlice";
import axios from "axios";
import Loader from "../components/Loader";
import Message from "../components/Message";

const ProductPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const products = useSelector((state) => state.products);
  const user = useSelector((state) => state.user);
  const { productDeities } = products;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const cardHandler = async () => {
    const product = {
      _id: productDeities._id,
      name: productDeities.name,
      qty: Number(qty),
      price: productDeities.price,
      image: productDeities.image,
      countInStock: productDeities.countInStock,
    };
    dispatch(addToCart(product));
    navigate(`/cart/${id}?qty=${qty}`);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };

    const reviewData = {
      rating: rating,
      comment: comment,
    };

    try {
      const { data, status } = await axios.post(
        `/api/products/${id}/review/create/`,
        reviewData,
        config
      );
      if (status == 200) {
        dispatch(loadProductDeities(data));
      }
      setComment("");
      setRating(0);
    } catch (error) {
      setErrorMessage(error.response.data.details);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const { data } = await axios.get(`/api/products/${id}/`);
      dispatch(loadProductDeities(data));
      setIsLoading(false);
    };
    fetchData();
  }, [dispatch, id]);

  if (isLoading) return <Loader />;

  return (
    <div>
      <Link to="/" className="btn btn-light my-3">
        <i class="fa-solid fa-arrow-left"></i> Go Back
      </Link>
      <Row>
        <Col md={6}>
          <Image
            src={productDeities.image}
            alt={productDeities.name}
            fluid
          ></Image>
        </Col>

        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{productDeities.name}</h3>
            </ListGroup.Item>

            <ListGroup.Item>
              <Rating
                value={productDeities.rating}
                reviews={`${productDeities.numReviews} reviews`}
                color={"#f8e825"}
              />
            </ListGroup.Item>

            <ListGroup.Item>Price: ${productDeities.price}</ListGroup.Item>

            <ListGroup.Item>
              Description: {productDeities.description}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <strong>${productDeities.price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    {productDeities.countInStock > 0
                      ? "In Stock"
                      : "Out of Stock"}
                  </Col>
                </Row>
              </ListGroup.Item>

              {productDeities.countInStock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Qty:</Col>
                    <Col xs="auto" className="my-1">
                      <Form.Select
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                      >
                        {[...Array(productDeities.countInStock).keys()].map(
                          (index) => (
                            <option key={index} value={index + 1}>
                              {index + 1}
                            </option>
                          )
                        )}
                      </Form.Select>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Row>
                  <Col>
                    <Button
                      className="btn-block"
                      disabled={productDeities.countInStock <= 0}
                      type="button"
                      onClick={cardHandler}
                    >
                      Add to Cart
                    </Button>
                  </Col>
                  {/* <Col>
                            <Button className='btn-block ' disabled={productDeities.countInStock<=0} type='button' onClick={cardHandler} >Buy Now</Button>
                            </Col> */}
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
      <Row className="my-4">
        <Col md={6}>
          <h4>Reviews({productDeities.reviews.length})</h4>
          {productDeities.reviews.length === 0 && (
            <Message variant="info">No Reviews</Message>
          )}
          <ListGroup variant="flush">
            {productDeities.reviews.map((review) => (
              <ListGroup.Item key={review._id}>
                <strong>{review.name}</strong>
                <Rating value={review.rating} color="#f8e825" />
                <p>{review.createdAt.substring(0, 10)}</p>
                <p>{review.comment}</p>
              </ListGroup.Item>
            ))}

            <ListGroup.Item>
              <h4>Write a review</h4>
              {errorMessage && (
                <Message variant="danger">{errorMessage}</Message>
              )}
              {user.isLoggedIn ? (
                <Form onSubmit={submitHandler}>
                  <Form.Group controlId="rating">
                    <Form.Label>Rating</Form.Label>
                    <Form.Control
                      as="select"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    >
                      <option value="0">Select...</option>
                      <option value="1">1 - poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId="comment">
                    <Form.Label>Review</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="3"
                      value={comment}
                      placeholder="Write a review"
                      onChange={(e) => setComment(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                  <Button type="submit" variant="primary">
                    Submit
                  </Button>
                </Form>
              ) : (
                <Message variant="info">
                  Please <Link to="/login">login</Link> to write a review
                </Message>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </div>
  );
};

export default ProductPage;
