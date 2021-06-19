import React, { useEffect, useState } from 'react';
import { useUpsertMutation, useGetProductQuery } from '../../generated/graphql'
import { Redirect, useParams } from "react-router-dom";

const EditProduct = (props) => {

  const [productForm, setProductForm] = useState({
    id: '',
    title: '',
    description: ''
  })

  const [redirectToReferrer, setRedirectToReferrer] = useState(false)
  const [upsertMutation, { upsertData, upsertLoading, upsertError }] = useUpsertMutation()

  let { id } = useParams();
  const { loading, error, data } = useGetProductQuery({
    variables: { id: id },
  });

  useEffect(() => {
    if (data) {
      setProductForm({
        id: data.get.hypi.id,
        title: data.get.title,
        description: data.get.description
      })
    }
  }, [data]);

  if (loading) return <p>loading...</p>;
  if (error) return <p>{error}</p>;

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
            hypi: {
              id: productForm.id
            },
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
    <div>
      <form onSubmit={submitProductHandler}>
        <input type="hidden" id="id" name="id" value={id} />
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            className="form-control"
            type="text"
            id="title"
            name="title"
            defaultValue={data.get.title}
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
            defaultValue={data.get.description}
            onChange={(event) => inputChangedHandler(event, 'description')}
            placeholder="Description.." />
        </div>
        <br />
        <button className="btn btn-success" > Submit</button>

      </form>
    </div>
  )
}

export default EditProduct;