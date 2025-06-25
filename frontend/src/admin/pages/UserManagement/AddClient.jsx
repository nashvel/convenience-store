import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ClientForm from "../../components/UserManagement/ClientForm";

export default function AddClient() {
  return (
    <>
      <PageMeta
        title="Add New Client | Admin Dashboard"
        description="Add new client to the system"
      />
      <PageBreadcrumb pageTitle="Add New Client" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Add New Client
        </h3>
        <ClientForm />
      </div>
    </>
  );
}
