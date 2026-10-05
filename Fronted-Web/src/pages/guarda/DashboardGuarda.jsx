import NavbarGuarda from "../../components/NavbarGuarda";
import { Outlet } from "react-router-dom";
import "../../styles/guarda/DashboardGuarda.css";

export default function DashboardGuarda() {
  return (
    <>
      <NavbarGuarda />

      <div className="guarda-container">
        <main className="guarda-content">
          <Outlet />
        </main>
      </div>
    </>
  );
}