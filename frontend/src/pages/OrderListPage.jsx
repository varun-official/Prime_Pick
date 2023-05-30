import React, { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Button, Table, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { loadFromLocalStorage } from "../store/UserSlice";
import { setAdminOrderList } from "../store/OrderSlice";

const OrderListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const order = useSelector((state) => state.order);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/orders/all/", config);
      dispatch(setAdminOrderList(data));
      setLoading(false);
    };
    if (user.isAdmin) {
      fetchData();
    } else {
      navigate("/");
    }
  }, []);

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

  return (
    <div>
      <Row className="align-items-centre">
        <Col>
          <h1>Orders</h1>
        </Col>
      </Row>
      {loading ? (
        <Loader />
      ) : (
        <Table striped responsive hover bordered className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {order.adminOrderList.map((item) => (
              <tr key={item._id}>
                <td>{item._id}</td>
                <td>{item.user.email}</td>
                <td>{item.createdAt.substring(0, 10)}</td>
                <td>${item.totalPrice}</td>
                <td>
                  {item.isPaid ? (
                    item.isDelivered ? (
                      <i
                        className="fas fa-check"
                        style={{ color: "green" }}
                      ></i>
                    ) : (
                      item.paidAt.substring(0, 10)
                    )
                  ) : (
                    <i className="fas fa-xmark" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  {item.isDelivered ? (
                    <i className="fas fa-check" style={{ color: "green" }}></i>
                  ) : (
                    <i className="fas fa-xmark" style={{ color: "red" }}></i>
                  )}
                </td>

                <td>
                  <LinkContainer to={`/order/${item._id}`}>
                    <Button variant="light" className="btn-sm">
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default OrderListPage;
