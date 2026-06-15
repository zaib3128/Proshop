import React from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const Product = ({ product }) => {
  return (
    // Replaces Card with a div and Tailwind classes
    <div className="border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
      <Link to={`/product/${product._id}`}>
        {/* Replaces Card.Img with a standard img tag */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      </Link>

      {/* Replaces Card.Body with a div and padding */}
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          {/* Replaces Card.Title with a styled div */}
          <div className="font-bold text-lg truncate" title={product.name}>
            {product.name}
          </div>
        </Link>

        {/* Replaces Card.Text with a div and margin */}
        <div className="my-2">
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
            // Pass the Tailwind color class directly
            color="text-yellow-500"
          />
        </div>

        {/* Replaces Card.Text with an h3 for semantic pricing */}
        <h3 className="text-xl font-semibold">${product.price}</h3>
      </div>
    </div>
  );
};

export default Product;