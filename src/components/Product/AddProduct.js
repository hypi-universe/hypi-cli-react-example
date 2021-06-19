import React, { useState } from 'react';
import { useUpsertMutation } from '../../generated/graphql'
import { Redirect } from "react-router-dom";

const AddProduct = (props) => {

  const [productForm, setProductForm] = useState({
    title: '',
    description: ''
  })
  const [redirectToReferrer, setRedirectToReferrer] = useState(false)

  const [upsertMutation, { upsertData, upsertLoading, upsertError }] = useUpsertMutation()

  const inputChangedHandler = (event) => {
    setProductForm({
      ...productForm, [event.target.name]: event.target.value
    })
  }
  const submitProductHandler = (event) => {
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
    setRedirectToReferrer(true)
  }

  if (upsertLoading) return <p>loading...</p>;
  if (upsertError) return <p>{upsertError}</p>;
  if (upsertData) return <p>{upsertData}</p>;

  if (redirectToReferrer) {
    return <Redirect to="/products" />

  }
  return (
    <form onSubmit={submitProductHandler}>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          className="form-control"
          type="text"
          id="title"
          name="title"
          value={productForm.title}
          onChange={(event) => inputChangedHandler(event, 'title')}
          placeholder="Title.." />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input
          className="form-control"
          type="text"
          id="description"
          name="description"
          value={productForm.description}
          onChange={inputChangedHandler}
          placeholder="Description.." />
      </div>
      <br/>
      <button className="btn btn-success" > Submit</button>

    </form>
  )
}

export default AddProduct;