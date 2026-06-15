import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from './Loader';
import Message from './Message';
import { listTopProducts } from '../actions/productActions';

const ProductCarousel = () => {
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);

  const productTopRated = useSelector((state) => state.productTopRated);
  const { loading, error, products } = productTopRated;

  useEffect(() => {
    dispatch(listTopProducts());
  }, [dispatch]);

  // Effect for the auto-play functionality
  useEffect(() => {
    if (products && products.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(interval); // Cleanup on component unmount
    }
  }, [products]);

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;

  return (
    <div className="relative w-full max-w-4xl mx-auto my-4 overflow-hidden rounded-lg shadow-lg">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {/* ✅ FIX: Check if products is an array before mapping */}
        {Array.isArray(products) && products.map((product) => (
          <div key={product._id} className="relative w-full flex-shrink-0">
            <Link to={`/product/${product._id}`}>
              <img
                src={
                  product.image
                    ? product.image.startsWith('/')
                      ? product.image
                      : `/${product.image}`
                    : '/placeholder.jpg'
                }

                alt={product.name}
                className="w-full h-96 object-cover"
              />

              <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center">
                <h2 className="text-black text-3xl font-bold text-center">
                  {product.name} (${product.price})
                </h2>
              </div>

            </Link>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {/* ✅ FIX: Check if products is an array before mapping */}
        {Array.isArray(products) && products.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${currentIndex === index ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;