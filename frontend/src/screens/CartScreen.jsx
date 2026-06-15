import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../actions/cartActions';

const CartScreen = () => {
  const { id: productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // The logic to get quantity from URL search params remains the same.
  const qty = new URLSearchParams(location.search).get('qty') || 1;

  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, Number(qty)));
    }
  }, [dispatch, productId, qty]);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    // Navigate to login, then redirect to shipping. This logic is unchanged.
    navigate('/login?redirect=/shipping');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Main content: Cart Items */}
      <div className="md:col-span-2">
        <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty.{' '}
            <Link to="/" className="text-blue-600 hover:underline">
              Go Back
            </Link>
          </Message>
        ) : (
          <ul className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <li key={item.product} className="py-4 flex items-center space-x-4">
                <div className="flex-shrink-0 w-24 h-24">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-md" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product}`} className="text-lg font-medium text-gray-900 truncate hover:underline">
                    {item.name}
                  </Link>
                  <p className="text-md text-gray-500">${item.price}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={item.qty}
                    onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))}
                    className="p-2 border border-gray-300 rounded-md"
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeFromCartHandler(item.product)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <i className="fas fa-trash fa-lg"></i>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Sidebar: Subtotal and Checkout */}
      <div className="md:col-span-1">
        <div className="border rounded-lg shadow p-4">
          <ul className="divide-y divide-gray-200">
            <li className="py-2">
              <h2 className="text-2xl font-semibold">
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
              </h2>
              <p className="text-xl font-bold mt-2">
                $
                {cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}
              </p>
            </li>
            <li className="py-2">
              <button
                type="button"
                className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900 disabled:bg-gray-400"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;