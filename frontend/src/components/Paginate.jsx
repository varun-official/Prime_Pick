import React, { useState, useEffect } from "react";
import { Button, Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
const Paginate = ({ pages, page, keyword = "", isAdmin = false }) => {
  if (keyword) {
    keyword = keyword.split("?keyword=")[1].split("&")[0];
  }
  const [activeItem, setActiveItem] = useState(false);
  useEffect(() => {
    setActiveItem(page);
  }, [page]);
  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((x) => (
          <LinkContainer
            key={x + 1}
            to={
              !isAdmin
                ? {
                    pathname: "/",
                    search: `?keyword=${keyword}&page=${x + 1}`,
                  }
                : {
                    pathname: "/admin/products",
                    search: `?keyword=${keyword}&page=${x + 1}`,
                  }
            }
          >
            <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;
