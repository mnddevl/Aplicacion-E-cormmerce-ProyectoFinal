import React, { useState, useEffect, useContext } from 'react';
import '../../styles/carritoCompra.css';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

const CarritoCompra = () => {
    const [loading, setLoading] = useState(true);
    const [productos, setProductos] = useState([]);
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);


    // useEffect(() => {
    //     // Create PaymentIntent as soon as the page loads
    //     fetch('https://potential-fiesta-q57vjgxrwqwh4j66-3001.app.github.dev/api/create-payment', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       //la cantidad ha pagar esta puesta fija, pero puede recibir un objeto desde el contexto
    //       body: JSON.stringify({ amount: 1000, currency: 'usd' }) // Amount in cents
    //     })
    //       .then((res) => res.json())
    //       .then((data) => setClientSecret(data.clientSecret));
    //   }, []);

    useEffect(() => {
        const fetchCartItems = async () => {
            await actions.get_carrito(); 
            setProductos([...store.carrito]); 
            setLoading(false);
        };
        fetchCartItems();
    }, []); 

    useEffect(() => {
        setProductos([...store.carrito]); 
    }, [store.carrito]);

    const handleQuantityChange = (id, quantity) => {
        actions.updateItemQuantity(id, quantity);
    };

    const calculateTotal = () => {
        return productos.reduce((total, item) => total + item.producto.precio * item.cantidad, 0).toFixed(2);
    };

    return (
        <div className="carritoCompra">
            {loading ? (
                <div>Cargando carrito de compras...</div>
            ) : (
                <>
                    <div className="carrito-items">
                        {productos.length === 0 ? (
                            <div className="empty-cart">
                                <h2>Tu carrito está vacío</h2>
                                <p>Parece que no has agregado productos aún</p>
                                <Link to="/pesosProductos" className="add-more">+ Agregar más productos</Link>
                            </div>
                        ) : (
                            productos.map(item => (
                                <div className="carrito-item" key={item.producto.id}>
                                    <div className="item-details">
                                        <h3>{item.producto.nombre}</h3>
                                        <p>{item.producto.descripcion}</p>
                                        <p>{item.producto.region}</p>
                                    </div>
                                    <div className="item-controls">
                                        <button onClick={() => handleQuantityChange(item.producto.id, item.quantity - 1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => handleQuantityChange(item.producto.id, item.quantity + 1)}>+</button>
                                    </div>
                                    <div className="item-price">
                                        <p>{(item.producto.precio * item.cantidad).toFixed(2)}€</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="order-summary">
                        <h2>Resumen del pedido</h2>
                        {productos.length === 0 ? (
                            <div className="empty-summary">
                                <p>No hay productos en tu carrito</p>
                            </div>
                        ) : (
                            <>
                                {productos.map(item => (
                                    <div className="summary-item" key={item.producto.id}>
                                        <p>{item.cantidad}x {item.producto.nombre}</p>
                                        <p>{(item.producto.precio * item.cantidad).toFixed(2)}€</p>
                                    </div>
                                ))}
                                <div className="summary-total">
                                    <p>Subtotal</p>
                                    <p>{calculateTotal()}€</p>
                                </div>
                                <div className="summary-total">
                                    <p>Total</p>
                                    <p>{calculateTotal()}€</p>
                                </div>
                            </>
                        )}
                        <div className="terms">
                            <input type="checkbox" id="terms" />
                            <label htmlFor="terms">He leído y acepto los <a href="/terminosCondiciones">términos y condiciones</a> de uso.</label>
                        </div>
                        <button onClick={() => navigate("/checkoutSession" )} className="pagar-btn" >Realizar pedido</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CarritoCompra;
