import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../hooks/useAuth";

const Settings = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout
      title="Settings"
      subtitle="Manage your account and preferences"
    >
      <div className="max-w-xl rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Account
        </h2>
        <dl className="mt-4 space-y-4">
          <div>
            <dt className="text-sm text-zinc-500">Name</dt>
            <dd className="mt-1 font-medium text-zinc-900">{user?.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-zinc-500">Email</dt>
            <dd className="mt-1 font-medium text-zinc-900">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-zinc-500">Plan</dt>
            <dd className="mt-1 font-medium capitalize text-zinc-900">
              {user?.subscriptionPlan}
              {user?.subscriptionInterval && (
                <span className="text-zinc-500">
                  {" "}
                  ({user.subscriptionInterval})
                </span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-zinc-500">Subscription status</dt>
            <dd className="mt-1 font-medium capitalize text-zinc-900">
              {user?.subscriptionStatus || "inactive"}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-zinc-500">Role</dt>
            <dd className="mt-1 font-medium capitalize text-zinc-900">
              {user?.role}
            </dd>
          </div>
        </dl>
        <Link
          to="/billing"
          className="mt-6 inline-flex rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Manage billing
        </Link>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
