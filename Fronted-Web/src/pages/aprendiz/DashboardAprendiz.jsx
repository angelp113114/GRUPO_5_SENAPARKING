import { Outlet } from "react-router-dom";
import "../../styles/aprendiz/dashboardAprendiz.css";
import NavbarAprendiz from "../../components/NavbarAprendiz";

export default function DashboardAprendiz() {
  return (
    <div className="aprendiz-page">

      <NavbarAprendiz />

      <div className="fondo">

        <div className="panel-central">

          <Outlet />

        </div>

      </div>

    </div>
  );
}