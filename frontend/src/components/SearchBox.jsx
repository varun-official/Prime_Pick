import React, { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SearchBox = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const submitHandler = () => {
    if (keyword) {
      navigate(`/?keyword=${keyword}&page=1`);
    }
  };

  return (
    <div style={{ display: "flex", gap: "0.3rem", marginRight: "2rem" }}>
      <Form.Control
        type="text"
        onChange={(e) => setKeyword(e.target.value)}
        className="mr-sm-2 ml-sm-5"
      ></Form.Control>

      <Button
        type="button"
        disabled={keyword.length == 0}
        variant="outline-success"
        className="p-2"
        onClick={submitHandler}
      >
        <i className="fas fa-search"></i>
      </Button>
    </div>
  );
};

export default SearchBox;
