import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { listProducts } from '../actions/productActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Product from '../components/Product';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import logo from '../assets/logo.png';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { keyword, pageNumber = 1 } = useParams();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  return (
    <>
      {!keyword ? (
        <>
          {/* Logo and Brand Section */}
          <div className="mb-8 flex items-center space-x-4">
            <img src={logo} alt="ProShop Logo" className="h-16 w-auto" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900">ProShop</h1>
              <p className="text-gray-600">Your Premier Online Electronics Store</p>
            </div>
          </div>
          
          <ProductCarousel />
        </>
      ) : (
        <Link to="/" className="bg-gray-200 hover:bg-gray-300 text-black font-semibold py-2 px-4 rounded inline-block mb-4">
          Go Back
        </Link>
      )}

      <h1 className="text-3xl font-bold mb-4 mt-8">Latest Products</h1>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {/* ✅ FIX: Check if products is an array before mapping */}
            {Array.isArray(products) && products.map((product) => (
              <div key={product._id}>
                <Product product={product} />
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Paginate
              pages={pages}
              page={page}
              keyword={keyword ? keyword : ''}
            />
          </div>
        </>
      )}
    </>
  );
};

export default HomeScreen;