import NavbarAdmin from "../../components/NavbarAdmin";
import { Outlet } from "react-router-dom";

import "../../Styles/administrador/dashboardAdmin.css";

export default function DashboardAdmin() {
  return (
    <div className="dashboard-admin">
      <NavbarAdmin />

      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
}