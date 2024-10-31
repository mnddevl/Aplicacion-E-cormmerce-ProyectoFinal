import React, { useState, useEffect, useContext } from 'react';
import '../../styles/carritoCompra.css';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

const CarritoCompra = () => {
    const [loading, setLoading] = useState(true);
    const [productos, setProductos] = useState([]);
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);

    useEffect(() => {
        const fetchCartItems = async () => {
            await actions.get_productos(); 
            setProductos([...store.carrito]); 
            setLoading(false);
        };
        fetchCartItems();
    }, [actions]); // Ejecuta solo una vez al cargar el componente

    useEffect(() => {
        setProductos([...store.carrito]); 
    }, [store.carrito]);

    const handleQuantityChange = (id, quantity) => {
        actions.updateItemQuantity(id, quantity);
    };

    const calculateTotal = () => {
        return productos.reduce((total, item) => total + item.precio * item.quantity, 0).toFixed(2);
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
                                <div className="carrito-item" key={item.producto_id}>
                                    <div className="item-details">
                                        <h3>{item.nombre}</h3>
                                        <p>{item.descripcion}</p>
                                        <p>{item.region}</p>
                                    </div>
                                    <div className="item-controls">
                                        <button onClick={() => handleQuantityChange(item.producto_id, item.quantity - 1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => handleQuantityChange(item.producto_id, item.quantity + 1)}>+</button>
                                    </div>
                                    <div className="item-price">
                                        <p>{(item.precio * item.quantity).toFixed(2)}€</p>
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
                                    <div className="summary-item" key={item.producto_id}>
                                        <p>{item.quantity}x {item.nombre}</p>
                                        <p>{(item.precio * item.quantity).toFixed(2)}€</p>
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
                        <button className="pagar-btn" disabled={productos.length === 0}>Realizar pedido</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CarritoCompra;
