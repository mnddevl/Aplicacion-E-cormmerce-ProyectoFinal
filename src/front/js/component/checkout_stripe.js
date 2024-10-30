import React, {useState, useEffect, useContext} from "react";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {Context} from '../store/appContext';

export const CheckoutForm = () => {
    const { store, actions } = useContext(Context);
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState('');
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');

    const carritoTotal = store.carrito.reduce((total, item) => total + item.price * item.quantity, 0);


    useEffect(() => {

        //Crea un nuevo pago en el backend
        fetch(process.env.BACKEND_URL + '/api/crear-pago', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: carritoTotal * 100, currency: 'eur' }) 
        })
          .then((res) => res.json())
          .then((data) => setClientSecret(data.clientSecret)); 
      }, [carritoTotal]);


    const handleSubmit = async (event) => {
      event.preventDefault();
  
      if (!stripe || !elements) {
        return;
      }
  
      setLoading(true);

      let result;

      if (paymentMethod === 'card') {
        result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            },
        });
      } else if (paymentMethod === 'sepa_debit') {
        result = await stripe.confirmSepaDebitPayment(clientSecret, {
            payment_method: {
                sepa_debit: elements.getElement(IbanElement),
            },
            payment_method_data: {
                billing_details: { name: 'Nombre del cliente' }, 
            },
        });
      } else if (paymentMethod === 'google_pay') {
        const paymentRequest = stripe.paymentRequest({
            country: 'FR', 
            currency: 'eur',
            total: {
                label: 'Total',
                amount: carritoTotal * 100,
            },
            requestPayerName: true,
            requestPayerEmail: true,
        });

        result = await paymentRequest.show();
      }

    setLoading(false);

    const { error, paymentIntent } = result;

    if (error) {
        console.log('[error]', error);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('El pago se ha realizado con éxito');
    } else {
        console.log('Hubo un error al procesar el pago');
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