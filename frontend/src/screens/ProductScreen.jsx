import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants';

const ProductScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [successReview, setSuccessReview] = useState(false);
  const [errorReview, setErrorReview] = useState('');

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // This logic remains the same as it's not tied to the UI library
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, successReview]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.post(`/api/products/${id}/reviews`, { rating, comment }, config);
      setSuccessReview(true);
      setRating(0);
      setComment('');
    } catch (error) {
      setErrorReview(error.response?.data?.message || error.message);
    }
  };

  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`);
  };

  return (
    <>
      <Link className="bg-gray-200 hover:bg-gray-300 text-black font-semibold py-2 px-4 rounded inline-block my-3" to="/">
        Go Back
      </Link>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          {/* Main Product Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Column 1: Image */}
            <div className="md:col-span-1 lg:col-span-1">
              <img src={product.image} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-lg" />
            </div>

            {/* Column 2: Product Info */}
            <div className="md:col-span-1 lg:col-span-1">
              <ul className="divide-y divide-gray-200">
                <li className="py-3">
                  <h3 className="text-2xl font-bold">{product.name}</h3>
                </li>
                <li className="py-3">
                  <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                </li>
                <li className="py-3 font-semibold">Price: ${product.price}</li>
                <li className="py-3">Description: {product.description}</li>
              </ul>
            </div>

            {/* Column 3: Add to Cart Card */}
            <div className="md:col-span-2 lg:col-span-1">
              <div className="border rounded-lg shadow">
                <ul className="divide-y divide-gray-200">
                  <li className="p-3 flex justify-between items-center">
                    <span>Price:</span>
                    <span className="font-bold">${product.price}</span>
                  </li>
                  <li className="p-3 flex justify-between items-center">
                    <span>Status:</span>
                    <span>{product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</span>
                  </li>
                  {product.countInStock > 0 && (
                    <li className="p-3 flex justify-between items-center">
                      <label htmlFor="qty-select">Qty:</label>
                      <select
                        id="qty-select"
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                        className="p-2 border border-gray-300 rounded-md"
                      >
                        {[...Array(product.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>{x + 1}</option>
                        ))}
                      </select>
                    </li>
                  )}
                  <li className="p-3">
                    <button
                      onClick={addToCartHandler}
                      className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900 disabled:bg-gray-400"
                      type="button"
                      disabled={product.countInStock === 0}
                    >
                      Add To Cart
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Reviews</h2>
              {product.reviews?.length === 0 && <Message>No Reviews</Message>}
              <ul className="divide-y divide-gray-200">
                {product.reviews?.map((review) => (
                  <li key={review._id} className="py-4">
                    <strong className="font-semibold">{review.name}</strong>
                    <Rating value={review.rating} />
                    <p className="text-gray-500 text-sm">{review.createdAt?.substring(0, 10)}</p>
                    <p className="mt-2">{review.comment}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Write a Customer Review</h2>
              {successReview && <Message variant="success">Review submitted successfully</Message>}
              {errorReview && <Message variant="danger">{errorReview}</Message>}
              {userInfo ? (
                <form onSubmit={submitHandler}>
                  <div className="my-2">
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
                    <select
                      id="rating"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select...</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>
                  </div>
                  <div className="my-2">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment</label>
                    <textarea
                      id="comment"
                      rows="3"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="my-2 w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900 disabled:bg-gray-400"
                  >
                    Submit
                  </button>
                </form>
              ) : (
                <Message>
                  Please <Link to="/login" className="text-blue-600 hover:underline">sign in</Link> to write a review.
                </Message>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductScreen;