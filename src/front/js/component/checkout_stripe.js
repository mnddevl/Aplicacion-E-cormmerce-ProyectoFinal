import React, { useState, useEffect, useContext } from "react";
import { CardElement, useStripe, useElements, IbanElement, PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import { Context } from '../store/appContext';
import { useNavigate } from "react-router-dom"; 
import swal from "sweetalert";
import "../../styles/checkout_stripe.css";

export const CheckoutForm = () => {
    const { store } = useContext(Context);
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState('');
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const carritoTotal = (store.carrito.reduce((total, item) => total + item.producto.precio * item.cantidad, 0)).toFixed(2);
    const navigate = useNavigate(); 
    
    // Imrpime el clientSecret en la consola
    useEffect(() => {
        console.log("Client Secret:", clientSecret);
    }, [clientSecret]);

    useEffect(() => {
        // Crea un nuevo pago en el backend
        const createPayment = async () => {
            try {
                const response = await fetch(process.env.BACKEND_URL + '/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: carritoTotal * 100, currency: 'eur' })
                });
                if (!response.ok) throw new Error('Error al crear el pago');
                
                const data = await response.json();
                if (data.clientSecret) {
                    setClientSecret(data.clientSecret);
                    console.log("Payment Intent created with clientSecret:", data.clientSecret);
                } else {
                    console.error("El clientSecret no se ha recibido");
                }
            } catch (error) {
                console.error("Error fetching clientSecret:", error);
            }
        };
        createPayment();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements || !clientSecret) {
            console.error("Stripe.js has not loaded, or clientSecret is missing");
            return;
        }

        setLoading(true);

        let result;

        try {
            if (paymentMethod === 'card') {
                console.log("Confirming card payment...");
                result = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: elements.getElement(CardElement),
                    },
                });
            } else if (paymentMethod === 'sepa_debit') {
                console.log("Confirming SEPA Debit payment...");
                result = await stripe.confirmSepaDebitPayment(clientSecret, {
                    payment_method: {
                        sepa_debit: elements.getElement(IbanElement),
                    },
                    payment_method_data: {
                        billing_details: { name: 'Nombre del cliente' }, 
                    },
                });
            }

            if (result.error) {
                console.error("Payment Error:", result.error);
            } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
                swal({
                    title: "Pagado",
                    text: "¡El pago se ha realizado con éxito!",
                    icon: "success",
                    button: {
                        text: "Cerrar",
                        className: "my-blue-button",
                        className: "custom-alert"
                    }
                })
                .then(() => {
                    navigate('/');
                });
            } else {
                console.log("Hubo un error al procesar el pago");
            }
        } catch (error) {
            console.error("Error processing payment:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h3>Seleccionar modo de pago</h3>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="card">Tarjeta de credito/debito</option>
                <option value="sepa_debit">Transferencia SEPA</option>
                <option value="google_pay">Google Pay</option>
            </select>

            <form onSubmit={handleSubmit}>
                {paymentMethod === 'card' && <CardElement />}
                {paymentMethod === 'sepa_debit' && <IbanElement />}
                {paymentMethod === 'google_pay' && (
                    <PaymentRequestButtonElement />
                )}
                
                <button type="submit" disabled={!stripe || loading}>
                    Pagar {carritoTotal} EUR
                </button>
            </form>
        </div>
    );
};
