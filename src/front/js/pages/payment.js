import React from 'react';  
import { CheckoutForm } from '../component/checkout_stripe';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';


const Payment = () => {
    const stripePromise = loadStripe('pk_test_51Q2r2N06zQfFcColEwQAGRGmrthMsSDaUQgC4BcQZdtEzbrSynbhfAusQ0rMHOho84AFPzhm7CGPuhScZcYHlm9v00Js2mc1QL');

    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
}

export default Payment;
