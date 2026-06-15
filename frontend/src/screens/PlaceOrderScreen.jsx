import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder } from '../actions/orderActions';
import { clearCart } from '../actions/cartActions';

const PlaceOrderScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);

  // Utility to round to 2 decimal places
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  // --- Price Calculations ---
  // Note: Modifying state directly like this is an anti-pattern.
  // It's better to calculate these values on the fly or use a selector.
  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 10);
  cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)));
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2);

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;

  useEffect(() => {
    if (success && order?._id) {
      // Clear the cart when order is successfully created
      dispatch(clearCart());
      navigate(`/order/${order._id}`);
    }
  }, [navigate, success, order, dispatch]);

  const placeOrderHandler = () => {
    dispatch(createOrder({
      orderItems: cart.cartItems,
      shippingAddress: cart.shippingAddress,
      paymentMethod: cart.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    }));
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Main Content: Shipping, Payment, Items */}
        <div className="lg:col-span-2">
          <ul className="divide-y divide-gray-200">
            <li className="py-4">
              <h2 className="text-2xl font-semibold mb-2">Shipping</h2>
              <p>
                <strong>Address: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
                {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
              </p>
            </li>
            <li className="py-4">
              <h2 className="text-2xl font-semibold mb-2">Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {cart.paymentMethod}
              </p>
            </li>
            <li className="py-4">
              <h2 className="text-2xl font-semibold mb-2">Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {cart.cartItems.map((item, index) => (
                    <li key={index} className="py-2 flex items-center space-x-4">
                      <div className="flex-shrink-0 w-16 h-16">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.product}`} className="font-medium text-gray-800 hover:underline">
                          {item.name}
                        </Link>
                      </div>
                      <div className="text-right">
                        {item.qty} x ${item.price} = ${addDecimals(item.qty * item.price)}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </div>

        {/* Sidebar: Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg shadow p-4">
            <h2 className="text-2xl font-semibold text-center mb-4">Order Summary</h2>
            <ul className="divide-y divide-gray-200">
              <li className="py-2 flex justify-between"><span>Items</span><span>${cart.itemsPrice}</span></li>
              <li className="py-2 flex justify-between"><span>Shipping</span><span>${cart.shippingPrice}</span></li>
              <li className="py-2 flex justify-between"><span>Tax</span><span>${cart.taxPrice}</span></li>
              <li className="py-2 flex justify-between font-bold text-lg"><span>Total</span><span>${cart.totalPrice}</span></li>
              
              {error && <li className="py-2"><Message variant="danger">{error}</Message></li>}

              <li className="pt-4">
                <button
                  type="button"
                  className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900 disabled:bg-gray-400"
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderScreen;