import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaUserCircle, FaBox, FaUsers } from 'react-icons/fa';
import { Menu, Transition } from '@headlessui/react';
import SearchBox from './SearchBox';
import { logout } from '../actions/userActions';
import logo from '../assets/logo.png';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="bg-gray-800 text-white shadow-lg">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo and Brand Name */}
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition">
          <img src={logo} alt="ProShop Logo" className="h-10 w-auto" />
          <span className="text-xl font-bold">ProShop</span>
        </Link>

        {/* Search Box */}
        <div className="hidden sm:block w-full max-w-md mx-4">
          <SearchBox />
        </div>

        {/* Navigation Links & User Menu */}
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative flex items-center hover:text-gray-300 transition">
            <FaShoppingCart className="mr-1" />
            <span>Cart</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {cartItems.reduce((acc, item) => acc + item.qty, 0)}
              </span>
            )}
          </Link>

          {userInfo ? (
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center hover:text-gray-300 transition">
                <FaUserCircle className="mr-1" />
                {userInfo.name}
              </Menu.Button>
              <Transition
                as={React.Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white text-gray-900 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link to="/profile" className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100`}>
                          <FaUser className="mr-3" /> Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button onClick={logoutHandler} className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100`}>
                          <FaSignOutAlt className="mr-3" /> Logout
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : (
            <Link to="/login" className="flex items-center hover:text-gray-300 transition">
              <FaUser className="mr-1" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Admin Menu */}
          {userInfo && userInfo.isAdmin && (
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center font-semibold hover:text-gray-300 transition">
                Admin Menu
              </Menu.Button>
              <Transition
                as={React.Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white text-gray-900 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link to="/admin/userlist" className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100`}>
                          <FaUsers className="mr-3" /> Users
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link to="/admin/productlist" className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100`}>
                          <FaBox className="mr-3" /> Products
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link to="/admin/orderlist" className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100`}>
                          <FaShoppingCart className="mr-3" /> Orders
                        </Link>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;