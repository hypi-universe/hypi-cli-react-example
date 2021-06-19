import './App.css';
import React from "react";
import { Switch, Route, Link } from "react-router-dom";

import ProductList from  './components/Product/ProductList'
import AddProduct from  './components/Product/AddProduct'
import EditProduct from  './components/Product/EditProduct'

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/products" className="navbar-brand">
          Home
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/products"} className="nav-link">
            Products
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/add"} className="nav-link">
              Add
            </Link>
          </li>
        </div>
      </nav>

      <div className="container mt-3">
        <Switch>
          <Route exact path={["/", "/products"]} component={ProductList} />
          <Route exact path="/add" component={AddProduct} />
          <Route path="/products/:id" component={EditProduct} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
