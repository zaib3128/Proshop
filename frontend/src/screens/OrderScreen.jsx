import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { PayPalButtons } from '@paypal/react-paypal-js';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions';
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // Fetch order details
  useEffect(() => {
    if (!order || order._id !== orderId || successPay || successDeliver) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, order, orderId, successPay, successDeliver]);

  // Format numbers
  const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);

  // Price calculations
  const itemsPrice = order?.orderItems
    ? addDecimals(order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0))
    : '0.00';

  const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10);
  const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)));
  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);

  // Handle image path
  const getImagePath = (image) => {
    if (!image) return '/images/placeholder.png';
    if (image.startsWith('http')) return image;
    return image.startsWith('/') ? image : `/images/${image}`;
  };

  // PayPal Handlers
  const createOrderHandler = (data, actions) => {
    return actions.order.create({
      purchase_units: [{ amount: { value: totalPrice } }],
    });
  };

  const successPaymentHandler = (data, actions) => {
    return actions.order.capture().then((details) => {
      dispatch(payOrder(orderId, details));
    });
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (!order) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 break-all">Order {order._id}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* === LEFT SECTION === */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Info */}
          <div className="p-4 border rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-2">Shipping</h2>
            <p><strong>Name:</strong> {order.user?.name}</p>
            <p>
              <strong>Email:</strong>{' '}
              <a
                href={`mailto:${order.user?.email}`}
                className="text-blue-600 hover:underline"
              >
                {order.user?.email}
              </a>
            </p>
            <p className="mt-1">
              <strong>Address:</strong>{' '}
              {order.shippingAddress?.address}, {order.shippingAddress?.city},{' '}
              {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
            </p>
            <div className="mt-2">
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt?.substring(0, 10)}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="p-4 border rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-2">Payment Method</h2>
            <p>
              <strong>Method:</strong> {order.paymentMethod}
            </p>
            <div className="mt-2">
              {order.isPaid ? (
                <Message variant="success">
                  Paid on {order.paidAt?.substring(0, 10)}
                </Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="p-4 border rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-2">Order Items</h2>
            {order.orderItems?.length === 0 ? (
              <Message>Order is empty</Message>
            ) : (
              <ul className="divide-y divide-gray-200">
                {order.orderItems.map((item, index) => (
                  <li
                    key={index}
                    className="py-3 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={getImagePath(item.image)}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                      <Link
                        to={`/product/${item.product}`}
                        className="text-gray-800 font-medium hover:underline"
                      >
                        {item.name}
                      </Link>
                    </div>
                    <div className="text-right text-gray-700">
                      {item.qty} x ${addDecimals(item.price)} = $
                      {addDecimals(item.qty * item.price)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* === RIGHT SECTION === */}
        <div className="lg:col-span-1">
          <div className="p-4 border rounded-lg shadow-lg bg-white">
            <h2 className="text-2xl font-semibold text-center mb-4">
              Order Summary
            </h2>
            <ul className="divide-y divide-gray-200">
              <li className="py-2 flex justify-between">
                <span>Items</span>
                <span>${itemsPrice}</span>
              </li>
              <li className="py-2 flex justify-between">
                <span>Shipping</span>
                <span>${shippingPrice}</span>
              </li>
              <li className="py-2 flex justify-between">
                <span>Tax</span>
                <span>${taxPrice}</span>
              </li>
              <li className="py-2 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${totalPrice}</span>
              </li>

              {/* PayPal */}
              {!order.isPaid && (
                <li className="pt-4">
                  {loadingPay && <Loader />}
                  {!loadingPay && (
                    <PayPalButtons
                      createOrder={createOrderHandler}
                      onApprove={successPaymentHandler}
                    />
                  )}
                </li>
              )}

              {/* Admin Deliver Button */}
              {loadingDeliver && <Loader />}
              {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <li className="pt-4">
                  <button
                    onClick={deliverHandler}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                  >
                    Mark As Delivered
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;


// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link, useParams } from 'react-router-dom';
// import Message from '../components/Message';
// import Loader from '../components/Loader';
// import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions';
// import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants';

// const OrderScreen = () => {
//   const { id: orderId } = useParams();
//   const dispatch = useDispatch();

//   const orderDetails = useSelector((state) => state.orderDetails);
//   const { order, loading, error } = orderDetails;

//   const orderPay = useSelector((state) => state.orderPay);
//   const { loading: loadingPay, success: successPay } = orderPay;

//   const orderDeliver = useSelector((state) => state.orderDeliver);
//   const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

//   const userLogin = useSelector((state) => state.userLogin);
//   const { userInfo } = userLogin;

//   useEffect(() => {
//     if (!order || order._id !== orderId || successPay || successDeliver) {
//       dispatch({ type: ORDER_PAY_RESET });
//       dispatch({ type: ORDER_DELIVER_RESET });
//       dispatch(getOrderDetails(orderId));
//     }
//   }, [dispatch, order, orderId, successPay, successDeliver]);

//   const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);

//   const itemsPrice = order?.orderItems
//     ? addDecimals(
//         order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
//       )
//     : '0.00';

//   const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10);
//   const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)));
//   const totalPrice = (
//     Number(itemsPrice) +
//     Number(shippingPrice) +
//     Number(taxPrice)
//   ).toFixed(2);

//   const getImagePath = (image) => {
//     if (!image) return '/images/placeholder.png';
//     if (image.startsWith('http')) return image;
//     return image.startsWith('/') ? image : `/images/${image}`;
//   };

//   // ✅ Dummy Payment Handler
//   const dummyPayHandler = () => {
//     const dummyPaymentResult = {
//       id: 'DUMMY_PAYMENT_ID',
//       status: 'COMPLETED',
//       update_time: new Date().toISOString(),
//       email_address: userInfo.email,
//     };

//     dispatch(payOrder(orderId, dummyPaymentResult));
//   };

//   const deliverHandler = () => {
//     dispatch(deliverOrder(order));
//   };

//   if (loading) return <Loader />;
//   if (error) return <Message variant="danger">{error}</Message>;
//   if (!order) return <Loader />;

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <h1 className="text-3xl font-bold mb-6 break-all">
//         Order {order._id}
//       </h1>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* LEFT */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Shipping */}
//           <div className="p-4 border rounded">
//             <h2 className="text-2xl font-semibold mb-2">Shipping</h2>
//             <p><strong>Name:</strong> {order.user?.name}</p>
//             <p><strong>Email:</strong> {order.user?.email}</p>
//             <p>
//               <strong>Address:</strong>{' '}
//               {order.shippingAddress.address},{' '}
//               {order.shippingAddress.city},{' '}
//               {order.shippingAddress.postalCode},{' '}
//               {order.shippingAddress.country}
//             </p>

//             {order.isDelivered ? (
//               <Message variant="success">
//                 Delivered on {order.deliveredAt.substring(0, 10)}
//               </Message>
//             ) : (
//               <Message variant="danger">Not Delivered</Message>
//             )}
//           </div>

//           {/* Payment */}
//           <div className="p-4 border rounded">
//             <h2 className="text-2xl font-semibold mb-2">Payment</h2>
//             <p><strong>Method:</strong> {order.paymentMethod}</p>

//             {order.isPaid ? (
//               <Message variant="success">
//                 Paid on {order.paidAt.substring(0, 10)}
//               </Message>
//             ) : (
//               <Message variant="danger">Not Paid</Message>
//             )}
//           </div>

//           {/* Items */}
//           <div className="p-4 border rounded">
//             <h2 className="text-2xl font-semibold mb-2">Order Items</h2>

//             {order.orderItems.length === 0 ? (
//               <Message>Order is empty</Message>
//             ) : (
//               <ul>
//                 {order.orderItems.map((item, index) => (
//                   <li key={index} className="flex justify-between py-2">
//                     <div className="flex items-center gap-3">
//                       <img
//                         src={getImagePath(item.image)}
//                         alt={item.name}
//                         className="w-14 h-14 object-cover"
//                       />
//                       <Link to={`/product/${item.product}`}>
//                         {item.name}
//                       </Link>
//                     </div>
//                     <div>
//                       {item.qty} x ${item.price} = $
//                       {addDecimals(item.qty * item.price)}
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>

//         {/* RIGHT */}
//         <div className="p-4 border rounded">
//           <h2 className="text-2xl font-semibold mb-4 text-center">
//             Order Summary
//           </h2>

//           <ul>
//             <li className="flex justify-between py-1">
//               <span>Items</span>
//               <span>${itemsPrice}</span>
//             </li>
//             <li className="flex justify-between py-1">
//               <span>Shipping</span>
//               <span>${shippingPrice}</span>
//             </li>
//             <li className="flex justify-between py-1">
//               <span>Tax</span>
//               <span>${taxPrice}</span>
//             </li>
//             <li className="flex justify-between py-2 font-bold">
//               <span>Total</span>
//               <span>${totalPrice}</span>
//             </li>

//             {/* ✅ Dummy Pay Button */}
//             {!order.isPaid && (
//               <li className="pt-4">
//                 {loadingPay && <Loader />}
//                 <button
//                   onClick={dummyPayHandler}
//                   className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//                 >
//                   Mark As Paid (Dummy)
//                 </button>
//               </li>
//             )}

//             {/* Admin Deliver */}
//             {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
//               <li className="pt-4">
//                 {loadingDeliver && <Loader />}
//                 <button
//                   onClick={deliverHandler}
//                   className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
//                 >
//                   Mark As Delivered
//                 </button>
//               </li>
//             )}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderScreen;
