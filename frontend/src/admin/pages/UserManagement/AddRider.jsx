import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import RiderForm from "../../components/UserManagement/RiderForm";

export default function AddRider() {
  return (
    <>
      <PageMeta
        title="Add New Rider | Admin Dashboard"
        description="Add new rider to the system"
      />
      <PageBreadcrumb pageTitle="Add New Rider" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Add New Rider
        </h3>
        <RiderForm />
      </div>
    </>
  );
}
