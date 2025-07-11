import React from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';

const Breadcrumbs = ({ items }) => {
  return (
    <nav className="flex items-center text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && (
              <FaChevronRight className="w-3 h-3 text-gray-400 mx-1" />
            )}
            {item.link ? (
              <Link
                to={item.link}
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-sm font-medium text-gray-500">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
