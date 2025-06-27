import React, { useState, useMemo } from 'react';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { SearchIcon, StarIcon, CheckCircleIcon, XCircleIcon, TrashIcon, EyeIcon } from '@heroicons/react/solid';

const mockReviews = [
  {
    id: 1,
    product: { name: 'Classic Leather Watch', image: 'https://via.placeholder.com/80' },
    customer: { name: 'Alice Johnson', avatar: 'https://via.placeholder.com/40' },
    rating: 5,
    review: 'Absolutely stunning watch! The quality is amazing for the price. Highly recommended.',
    date: '2023-10-26',
    status: 'Approved',
  },
  {
    id: 2,
    product: { name: 'Wireless Bluetooth Earbuds', image: 'https://via.placeholder.com/80' },
    customer: { name: 'Bob Williams', avatar: 'https://via.placeholder.com/40' },
    rating: 2,
    review: 'The connection is very unstable and drops frequently. Sound quality is mediocre at best. Disappointed.',
    date: '2023-10-25',
    status: 'Pending',
  },
  {
    id: 3,
    product: { name: 'Organic Green Tea', image: 'https://via.placeholder.com/80' },
    customer: { name: 'Charlie Brown', avatar: 'https://via.placeholder.com/40' },
    rating: 4,
    review: 'Great taste and very refreshing. The packaging could be better, but the tea itself is excellent.',
    date: '2023-10-24',
    status: 'Approved',
  },
  {
    id: 4,
    product: { name: 'Running Shoes', image: 'https://via.placeholder.com/80' },
    customer: { name: 'Diana Miller', avatar: 'https://via.placeholder.com/40' },
    rating: 1,
    review: 'Fell apart after just one week of use. Terrible quality.',
    date: '2023-10-23',
    status: 'Rejected',
  },
];

const ReviewManagement = () => {
  const [reviews, setReviews] = useState(mockReviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [selectedReviews, setSelectedReviews] = useState([]);

  const filteredReviews = useMemo(() => {
    return reviews
      .filter(review => 
        statusFilter === 'All' || review.status === statusFilter
      )
      .filter(review => 
        ratingFilter === 'All' || review.rating === parseInt(ratingFilter)
      )
      .filter(review =>
        review.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.review.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [reviews, searchTerm, statusFilter, ratingFilter]);

  const handleSelectReview = (id) => {
    setSelectedReviews(prev => 
      prev.includes(id) ? prev.filter(reviewId => reviewId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedReviews(filteredReviews.map(r => r.id));
    } else {
      setSelectedReviews([]);
    }
  };

  const handleBulkAction = (action) => {
    if (selectedReviews.length === 0) return;
    // Implement bulk action logic here
    console.log(`Performing ${action} on reviews:`, selectedReviews);
    setSelectedReviews([]);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <>
      <PageMeta title="Review Management | Admin Dashboard" description="Moderate customer reviews" />
      <PageBreadcrumb pageTitle="Review Management" />
      
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:w-1/3">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-4">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="form-select">
              <option value="All">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className="form-select">
              <option value="All">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
            <div>
                <select onChange={(e) => handleBulkAction(e.target.value)} disabled={selectedReviews.length === 0} className="form-select">
                    <option>Bulk Actions</option>
                    <option value="approve">Approve Selected</option>
                    <option value="reject">Reject Selected</option>
                    <option value="delete">Delete Selected</option>
                </select>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">{selectedReviews.length} selected</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="p-4">
                  <input type="checkbox" className="form-checkbox" onChange={handleSelectAll} checked={selectedReviews.length > 0 && selectedReviews.length === filteredReviews.length} />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Product</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Customer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Rating</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Review</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
              {filteredReviews.map((review) => (
                <tr key={review.id} className={`${selectedReviews.includes(review.id) ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}>
                  <td className="p-4">
                    <input type="checkbox" className="form-checkbox" checked={selectedReviews.includes(review.id)} onChange={() => handleSelectReview(review.id)} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-md object-cover" src={review.product.image} alt={review.product.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{review.product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full" src={review.customer.avatar} alt={review.customer.name} />
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{review.customer.name}</div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">{review.review}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{review.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(review.status)}`}>{review.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    {review.status === 'Pending' && <button className="text-green-600 hover:text-green-900"><CheckCircleIcon className="h-5 w-5" /></button>}
                    {review.status === 'Pending' && <button className="text-red-600 hover:text-red-900"><XCircleIcon className="h-5 w-5" /></button>}
                    <button className="text-gray-500 hover:text-blue-600"><EyeIcon className="h-5 w-5" /></button>
                    <button className="text-red-600 hover:text-red-900"><TrashIcon className="h-5 w-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ReviewManagement;
