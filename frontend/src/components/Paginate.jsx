import React from 'react';
import { Link } from 'react-router-dom';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  if (pages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="flex justify-center my-4">
      <ul className="inline-flex items-center -space-x-px">
        {[...Array(pages).keys()].map((x) => {
          const pageNum = x + 1;
          const isActive = pageNum === Number(page);

          // Construct the correct path based on context (admin, search, or default)
          const path = !isAdmin
            ? keyword
              ? `/search/${keyword}/page/${pageNum}`
              : `/page/${pageNum}`
            : `/admin/productlist/${pageNum}`;

          // Define classes for active and default states
          const baseClasses = "px-4 py-2 border text-sm font-medium";
          const activeClasses = "z-10 bg-indigo-50 border-indigo-500 text-indigo-600";
          const defaultClasses = "bg-white border-gray-300 text-gray-500 hover:bg-gray-50";

          return (
            <li key={pageNum}>
              <Link
                to={path}
                className={`${baseClasses} ${isActive ? activeClasses : defaultClasses}`}
              >
                {pageNum}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Paginate;