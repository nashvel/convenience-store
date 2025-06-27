import React from 'react';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import MonthlySalesChart from '../../components/ecommerce/MonthlySalesChart';
import { 
  CashIcon, 
  ShoppingCartIcon, 
  UsersIcon, 
  ChartBarIcon, 
  ArrowSmUpIcon, 
  ArrowSmDownIcon 
} from '@heroicons/react/outline';

const kpiData = [
  {
    title: 'Total Sales',
    value: '$245,890',
    change: '+12.5%',
    changeType: 'increase',
    icon: CashIcon,
    iconBgColor: 'bg-blue-100 dark:bg-blue-900',
    iconColor: 'text-blue-600 dark:text-blue-300',
  },
  {
    title: 'Total Orders',
    value: '12,345',
    change: '+8.2%',
    changeType: 'increase',
    icon: ShoppingCartIcon,
    iconBgColor: 'bg-green-100 dark:bg-green-900',
    iconColor: 'text-green-600 dark:text-green-300',
  },
  {
    title: 'New Customers',
    value: '1,234',
    change: '-2.1%',
    changeType: 'decrease',
    icon: UsersIcon,
    iconBgColor: 'bg-yellow-100 dark:bg-yellow-900',
    iconColor: 'text-yellow-600 dark:text-yellow-300',
  },
  {
    title: 'Conversion Rate',
    value: '4.56%',
    change: '+0.5%',
    changeType: 'increase',
    icon: ChartBarIcon,
    iconBgColor: 'bg-indigo-100 dark:bg-indigo-900',
    iconColor: 'text-indigo-600 dark:text-indigo-300',
  },
];

const bestSellers = [
  { id: 1, name: 'Apple iPhone 14 Pro', image: 'https://via.placeholder.com/80', sales: '1,234 units' },
  { id: 2, name: 'Nike Air Max 270', image: 'https://via.placeholder.com/80', sales: '987 units' },
  { id: 3, name: 'Sony WH-1000XM5 Headphones', image: 'https://via.placeholder.com/80', sales: '765 units' },
];

const recentOrders = [
  { id: '#12345', customer: 'John Doe', date: '2023-10-27', amount: '$999.00', status: 'Delivered' },
  { id: '#12344', customer: 'Jane Smith', date: '2023-10-27', amount: '$150.00', status: 'Shipped' },
  { id: '#12343', customer: 'Bob Johnson', date: '2023-10-26', amount: '$399.00', status: 'Processing' },
];

const getStatusClass = (status) => {
  switch (status) {
    case 'Delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'Shipped': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'Processing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const SalesOverview = () => {
  return (
    <>
      <PageMeta
        title="Sales Overview | Admin Dashboard"
        description="View system-wide sales analytics"
      />
      <PageBreadcrumb pageTitle="Sales Overview" />

      <div className="p-4 sm:p-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {kpiData.map((kpi, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 flex items-center">
              <div className={`p-3 rounded-full ${kpi.iconBgColor}`}>
                <kpi.icon className={`h-6 w-6 ${kpi.iconColor}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">{kpi.title}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{kpi.value}</p>
                <div className={`flex items-center text-sm ${kpi.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
                  {kpi.changeType === 'increase' ? <ArrowSmUpIcon className="h-4 w-4"/> : <ArrowSmDownIcon className="h-4 w-4"/>}
                  <span>{kpi.change} vs last month</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Sales Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Monthly Sales</h3>
            <MonthlySalesChart />
          </div>

          {/* Best Sellers */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Best Sellers</h3>
            <ul className="space-y-4">
              {bestSellers.map(product => (
                <li key={product.id} className="flex items-center">
                  <img src={product.image} alt={product.name} className="h-12 w-12 rounded-lg" />
                  <div className="ml-4">
                    <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{product.sales}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800">
                {recentOrders.map(order => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{order.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesOverview;
