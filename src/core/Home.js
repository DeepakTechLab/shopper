import React, { useState, useEffect } from "react";
import { getallproducts } from "../admin/helper/adminhelper";
import Base from "./Base";
import Card from "./Card";

const Home = () => {
  const [products, setProducts] = useState([]);

  const getAllProducts = () => {
    getallproducts().then((data) => {
      if (data.error) {
        window.alert("Something worng");
      } else {
        setProducts(data);
      }
    });
  };
  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Base title="Fly Buy , shopping" className="text-white mt-4">
      <div className="row row-cols-auto">
        {products.map((product, index) => {
          return (
            <div className="col c-cart p-2 m-1 text-dark" key={index}>
              <Card product={product} />
            </div>
          );
        })}
      </div>
    </Base>
  );
};

export default Home;
