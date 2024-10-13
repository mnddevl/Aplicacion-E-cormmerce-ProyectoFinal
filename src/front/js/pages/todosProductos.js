import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import '../../styles/todosProductos.css';

const TodosProductos = () => {
  const { store } = useContext(Context);

  return (
    <div className="product-container">
      {store.cafe.map((cafe) => (
        <div className="product-card" key={cafe.producto_id}>
          <img src={cafe.imagen_url} alt={cafe.nombre} className="product-image" />
          <Link to={`/producto/${cafe.producto_id}`} className="product-name">
            {cafe.nombre}
          </Link>
          <p className="product-origin">Origen: {cafe.region}</p>
          <p className="product-price">Precio: €{cafe.precio.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
};

export default TodosProductos;
