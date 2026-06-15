import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300 mt-auto">
      <div className="container mx-auto px-4">
        <div className="py-3 text-center">
          <p>Copyright &copy; {currentYear} ProShop</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;