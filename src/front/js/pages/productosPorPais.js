import React, { useEffect, useContext, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Context } from '../store/appContext';  
import '../../styles/productosPorPais.css'; 

function ProductosPorPais() {
  const { country } = useParams();
  const { peso } = useParams(); // no se si esta bien
  const [productos, setProductos] = useState([])
    const obtenerProductos = async ()=> {
        try {
            const response = await fetch (`${process.env.BACKEND_URL}/api/productoPorPais/${country}`)
            const data = await response.json()
            setProductos(data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        obtenerProductos()
    },[])

  return (
    <div>
      <h1>Cafés de {country}</h1>
      <div className="product-container">
        {productos.length === 0 ? (
          <p>No se encontraron productos para este país.</p>
        ) : (
          productos.map((producto) => (
            <div key={producto.producto_id} className="product-card">
              <img src={producto.imagen_url} alt={producto.nombre} className="product-image" />
             <Link to={`/producto/${producto.id}`} className="product-nombre"> {producto.nombre} </Link>
              <p className="product-peso">{peso}</p>
              <p className="product-price">€{producto.precio}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductosPorPais;
