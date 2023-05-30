import React, { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Button, Table, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { loadFromLocalStorage, setUserList } from "../store/UserSlice";
import { loadProducts, setEditProduct } from "../store/ProductSlice";
import Paginate from "../components/Paginate";
const ProductListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const keyword = location.search;

  const user = useSelector((state) => state.user);
  const products = useSelector((state) => state.products);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data } = await axios.get(`/api/products${keyword}`);
      dispatch(loadProducts(data));
      setLoading(false);
    };
    if (user.isAdmin) {
      fetchProduct();
      dispatch(loadFromLocalStorage());
    } else {
      navigate("/");
    }
  }, [dispatch, keyword]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure to delete this product")) {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.delete(`/api/products/delete/${id}`, config);
      const { data } = await axios.get("/api/products/");
      dispatch(loadProducts(data));
    }
  };

  const createProductHandler = async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios.post(`/api/products/create/`, {}, config);
    dispatch(setEditProduct(data));
    navigate(`/admin/product/${data._id}/edit`);
  };
  if (loading) return <Loader />;
  return (
    <div>
      <Row className="align-items-centre">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"></i> Create Product
          </Button>
        </Col>
      </Row>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Table striped responsive hover bordered className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
              </tr>
            </thead>
            <tbody>
              {products.allProducts.products.map((item) => (
                <tr key={item._id}>
                  <td>{item._id}</td>
                  <td>{item.name}</td>
                  <td>${item.price}</td>
                  <td>{item.category}</td>
                  <td>{item.brand}</td>

                  <td>
                    <LinkContainer to={`/admin/product/${item._id}/edit`}>
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(item._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate
            pages={products.allProducts.pages}
            page={products.allProducts.page}
            isAdmin={true}
          />
        </>
      )}
    </div>
  );
};

export default ProductListPage;
