import React from 'react';
import { useProductsQuery, useDeleteMutation } from '../../generated/graphql'

import { Link } from "react-router-dom";

const ProductsList = (props) => {
  const { loading, error, data } = useProductsQuery({
    variables: { arcql: '*' },
  });
  const [deleteMutation] = useDeleteMutation()

  if (loading) return <p>loading...</p>;
  if (error) return <p>{error}</p>;

  const handleRemove = (event, id) => {
    console.log(id)
    deleteMutation({
      variables: {
        arcql: "hypi.id = '" + id + "'"
      }
    })
  }

  const productsOutput = data.find.edges.length === 0 ?
    <div>
      <p>No products found</p>
    </div>
    : data.find.edges.map((product, index) => {
      return (
        <div key={product.node.hypi.id}>
          <li key={index} >
            {product.node.title}
          </li>
          <button type="button" className={"btn"} onClick={(event) => handleRemove(event, product.node.hypi.id)}>
            Remove
          </button>
          <Link
            to={"/products/" + product.node.hypi.id}
            className="badge badge-warning"
          >
            <button type="button" className={"btn"}>
              Edit
            </button>
          </Link>
        </div>
      )
    })


  return (
    <div>
      <Link
        to={"/add/"}
        className="badge badge-warning"
      >
        <button className="btn btn-success"> New Product</button>
      </Link>
      <div className="col-md-6">
        <hr />
        <h4>Tutorials List</h4>
        <ul className="list-group">
          {productsOutput}
        </ul>
      </div>
    </div>
  )
};
export default ProductsList;