import React from 'react';  
import { CheckoutForm } from '../component/checkout_stripe';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';


const Payment = () => {
    // clave publicable
    const stripePromise = loadStripe('pk_test_51QAvoQK7BJC5w4F5ErPgkfXPjVLb7LbIoOdwEWZSxZwqOdmOFzR56XethKWr6AgKhPXwG50jt66Ef69NzWZLoURX00e2fFECMU');

    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
}

export default Payment;
