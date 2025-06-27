import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

const BestSellers = () => {
  return (
    <>
      <PageMeta
        title="Best Sellers | Admin Dashboard"
        description="Identify top-performing products across all stores"
      />
      <PageBreadcrumb pageTitle="Best Sellers" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Best-Selling Products
        </h3>
        <p>This page will list the best-selling products across the entire platform, with filters for category and time period.</p>
      </div>
    </>
  );
};

export default BestSellers;
