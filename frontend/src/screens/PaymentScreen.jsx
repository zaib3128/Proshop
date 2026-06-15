import {React, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import { savePaymentMethod } from '../actions/cartActions';

const PaymentScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State for payment method and form fields
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');

  // Redirect if shipping address is not set
  useEffect(() => {
    if (!shippingAddress || !shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  // Validate card details
  const validateCardDetails = () => {
    if (!cardName.trim()) {
      setError('Cardholder name is required');
      return false;
    }
    if (!cardNumber.trim() || cardNumber.length < 13) {
      setError('Valid card number is required (minimum 13 digits)');
      return false;
    }
    if (!expiry.trim() || !/^\d{2}\/\d{2}$/.test(expiry)) {
      setError('Expiry date must be in MM/YY format');
      return false;
    }
    if (!cvv.trim() || cvv.length < 3) {
      setError('Valid CVV is required (minimum 3 digits)');
      return false;
    }
    return true;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setError('');

    // Validate based on payment method
    if (paymentMethod === 'Stripe' && !validateCardDetails()) {
      return;
    }

    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  const handleExpiryInput = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setExpiry(value);
  };

  const handleCVVInput = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCvv(value);
  };

  const handleCardNumberInput = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setCardNumber(value);
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1 className="text-3xl font-bold my-4">Payment Method</h1>
      
      {error && <Message variant="danger">{error}</Message>}

      <form onSubmit={submitHandler}>
        <fieldset>
          <legend className="text-lg font-medium text-gray-900 mb-4">Select Payment Method</legend>
          <div className="space-y-4">
            {/* PayPal Option */}
            <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50" onClick={() => setPaymentMethod('PayPal')}>
              <div className="flex items-center">
                <input
                  id="PayPal"
                  name="paymentMethod"
                  type="radio"
                  value="PayPal"
                  checked={paymentMethod === 'PayPal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <label htmlFor="PayPal" className="ml-3 block text-sm font-medium text-gray-700">
                  PayPal or Credit Card
                </label>
              </div>
              <p className="ml-7 text-xs text-gray-500 mt-1">Fast and secure payment with PayPal</p>
            </div>

            {/* Stripe Option */}
            <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50" onClick={() => setPaymentMethod('Stripe')}>
              <div className="flex items-center">
                <input
                  id="Stripe"
                  name="paymentMethod"
                  type="radio"
                  value="Stripe"
                  checked={paymentMethod === 'Stripe'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <label htmlFor="Stripe" className="ml-3 block text-sm font-medium text-gray-700">
                  Credit Card (Stripe)
                </label>
              </div>
              <p className="ml-7 text-xs text-gray-500 mt-1">Direct credit card payment via Stripe</p>
            </div>
          </div>
        </fieldset>

        {/* Stripe Card Details Form */}
        {paymentMethod === 'Stripe' && (
          <div className="mt-6 p-4 border border-indigo-200 bg-indigo-50 rounded-lg">
            <h3 className="text-md font-semibold text-gray-900 mb-4">Card Details</h3>

            <div className="mb-4">
              <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                id="cardName"
                placeholder="John Doe"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={handleCardNumberInput}
                maxLength="19"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Enter your 13-16 digit card number</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  id="expiry"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={handleExpiryInput}
                  maxLength="5"
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  id="cvv"
                  placeholder="123"
                  value={cvv}
                  onChange={handleCVVInput}
                  maxLength="4"
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <p className="text-xs text-gray-600 bg-white p-2 rounded border border-gray-200">
              ℹ️ Your card details are securely processed by Stripe and not stored on our servers.
            </p>
          </div>
        )}

        {/* PayPal Info */}
        {paymentMethod === 'PayPal' && (
          <div className="mt-6 p-4 border border-blue-200 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              You will be redirected to PayPal to complete your payment. Your payment information is secure and never shared with us.
            </p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900 mt-6 font-medium transition"
        >
          Continue to Review Order
        </button>
      </form>
    </FormContainer>
  );
};

export default PaymentScreen;


// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import FormContainer from '../components/FormContainer';
// import CheckoutSteps from '../components/CheckoutSteps';
// import { savePaymentMethod } from '../actions/cartActions';

// const PaymentScreen = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const cart = useSelector((state) => state.cart);
//   const { shippingAddress } = cart;

//   const [paymentMethod, setPaymentMethod] = useState('CashOnDelivery');

//   // Redirect if shipping not done
//   useEffect(() => {
//     if (!shippingAddress || !shippingAddress.address) {
//       navigate('/shipping');
//     }
//   }, [shippingAddress, navigate]);

//   const submitHandler = (e) => {
//     e.preventDefault();
//     dispatch(savePaymentMethod(paymentMethod));
//     navigate('/placeorder');
//   };

//   return (
//     <FormContainer>
//       <CheckoutSteps step1 step2 step3 />

//       <h1 className="text-3xl font-bold my-4">Payment Method</h1>

//       <form onSubmit={submitHandler}>
//         <div className="border rounded-lg p-4">
//           <div className="flex items-center">
//             <input
//               type="radio"
//               id="cod"
//               name="paymentMethod"
//               value="CashOnDelivery"
//               checked={paymentMethod === 'CashOnDelivery'}
//               onChange={(e) => setPaymentMethod(e.target.value)}
//               className="h-4 w-4"
//             />
//             <label htmlFor="cod" className="ml-3 font-medium">
//               Cash on Delivery (Dummy Payment)
//             </label>
//           </div>

//           <p className="text-sm text-gray-600 mt-2">
//             This is a dummy payment method for demo / university project purposes.
//             No real payment will be processed.
//           </p>
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-gray-800 text-white py-2 px-4 rounded mt-6 hover:bg-gray-900"
//         >
//           Continue to Place Order
//         </button>
//       </form>
//     </FormContainer>
//   );
// };

// export default PaymentScreen;
