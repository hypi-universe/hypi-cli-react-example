import React, { useState } from 'react';
// import { useQuery } from '@apollo/client';
// import { PRODUCTS_QUERY } from '../../apollo/queries/products.js'
import { useProductsQuery, useUpsertMutation } from '../../generated/graphql'

const ProductsList = (props) => {
  const [newProduct, setNewProduct] = useState(false)
  const [productForm, setProductForm] = useState({
    title: '',
    description: ''
  })

  const { loading, error, data } = useProductsQuery({
    variables: { arcql: '*' },
  });
  
  const [upsertMutation, { upsertData, upsertLoading, upsertError }] = useUpsertMutation()

  const onNewProductHandler = (event) => {
    event.preventDefault()
    setNewProduct(true)
  }

  const inputChangedHandler = (event) => {
    setProductForm({
      ...productForm, [event.target.name]: event.target.value
    })
  }
  const submitProductHandler = (event) => {
    console.log('submit')
    event.preventDefault()
    //call the mutation to send data

    upsertMutation({
      variables: {
        values: {
          Product: {
            title: productForm.title,
            description: productForm.description
          }
        }
      }
    })
  }

  if (loading) return <p>loading...</p>;
  if (error) return <p>{error}</p>;

  if (upsertLoading) return <p>loading...</p>;
  if (upsertError) return <p>{error}</p>;
  if (upsertData) return <p>{upsertData}</p>;

  let noProductsOutput = null
  if (data.find.edges.length === 0) {
    noProductsOutput = (
      <div>
        <p>No products found</p>
      </div>
    )
  }
  let addProductOutput = null;
  if (newProduct) {
    addProductOutput = (
      <form onSubmit={submitProductHandler}>
        <label htmlFor="title">Title</label>
        <input
          className="Input"
          type="text"
          id="title"
          name="title"
          value={productForm.title}
          onChange={(event) => inputChangedHandler(event, 'title')}
          placeholder="Title.." />

        <label htmlFor="description">Description</label>
        <input
          className="Input"
          type="text"
          id="description"
          name="description"
          value={productForm.description}
          onChange={inputChangedHandler}
          placeholder="Description.." />

        <button className="Button" > Submit</button>

      </form>
    )
  } else {
    addProductOutput = (
      <button className="Button" onClick={onNewProductHandler}> New Product</button>
    )
  }

  const productsOutput = data.find.edges.map(product => {
    return (
      <div>
        <h1>{product.node.title}</h1>
        <p>{product.node.description}</p>
      </div>
    )
  })

  //   <p>
  //   Products List
  // </p>
  return (
    <div>
      {noProductsOutput}
      {productsOutput}
      {addProductOutput}
    </div>
  )
};
export default ProductsList;