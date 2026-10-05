import "./App.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import OlvideContraseña from "./pages/OlvideContraseña";
import VerificarCodigo from "./pages/VerificarCodigo";
import CambiarContraseña from "./pages/CambiarContraseña";
import Register from "./pages/Register";

import ProtectedRoute from "./components/ProtectedRoute";

import DashboardAdmin from "./pages/administrador/DashboardAdmin";
import InicioAdmin from "./pages/administrador/InicioAdmin";
import VerPeticiones from "./pages/administrador/VerPeticiones";
import Bloqueos from "./pages/administrador/Bloqueos";
import DatosUsuarios from "./pages/administrador/DatosUsuarios";
import ReportesRecibidos from "./pages/administrador/ReportesRecibidos";
import TipoDocumentosCrud from "./pages/administrador/TipoDocumentosCrud";
import VehiculosCrud from "./pages/administrador/VehiculosCrud";
import ConfigGrCrud from "./pages/administrador/CentroFormacionCrud";
import SolicitudesActualizacionAdmin from "./pages/administrador/SolicitudesActualizacionAdmin";
import SoporteAdmin from "./pages/administrador/SoporteAdmin";

import DashboardGuarda from "./pages/guarda/DashboardGuarda";
import InicioGuarda from "./pages/guarda/InicioGuarda";
import EscanearQR from "./pages/guarda/EscanearQR";
import ManualPlataforma from "./pages/guarda/ManualPlataforma";
import IngresoSalida from "./pages/guarda/IngresoSalida";
import EntradaSalidaCrud from "./pages/guarda/EntradaSalidaCrud";

import DashboardAprendiz from "./pages/aprendiz/DashboardAprendiz";
import InicioAprendiz from "./pages/aprendiz/InicioAprendiz";
import VisualizarCarnet from "./pages/aprendiz/VisualizarCarnet";
import ActualizarDatos from "./pages/aprendiz/ActualizarDatos";
import PeticionCarnet from "./pages/aprendiz/PeticionCarnet";
import MisVehiculos from "./pages/aprendiz/MisVehiculos";
import ManualUso from "./pages/aprendiz/ManualUso";
import SoporteTecnico from "./pages/aprendiz/SoporteTecnico";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ================= INICIO ================= */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* ================= LOGIN ================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/olvide-contraseña"
          element={<OlvideContraseña />}
        />

        <Route
          path="/verificar-codigo"
          element={<VerificarCodigo />}
        />

        <Route
          path="/cambiar-contraseña"
          element={<CambiarContraseña />}
        />

        {/* ================= ADMIN ================= */}

        <Route
          path="/dashboard-admin"
          element={
            <ProtectedRoute rol="administrador">
              <DashboardAdmin />
            </ProtectedRoute>
          }
        >

          <Route
            index
            element={<InicioAdmin />}
          />

          <Route
            path="ver-peticiones"
            element={<VerPeticiones />}
          />

          <Route
            path="bloqueos"
            element={<Bloqueos />}
          />

          <Route
            path="datos-usuarios"
            element={<DatosUsuarios />}
          />

          <Route
            path="reportes"
            element={<ReportesRecibidos />}
          />

          <Route
            path="tipo-documentos"
            element={<TipoDocumentosCrud />}
          />

          <Route
            path="vehiculos"
            element={<VehiculosCrud />}
          />

          <Route
            path="centros-formacion"
            element={<ConfigGrCrud />}
          />

          <Route
            path="entrada-salida"
            element={<EntradaSalidaCrud />}
          />

          <Route
            path="solicitudes-actualizacion"
            element={
              <SolicitudesActualizacionAdmin />
            }
          />

          <Route
            path="soporte"
            element={<SoporteAdmin />}
          />

        </Route>

        {/* ================= GUARDA ================= */}

        <Route
          path="/dashboard-guarda"
          element={
            <ProtectedRoute rol="guarda">
              <DashboardGuarda />
            </ProtectedRoute>
          }
        >

          <Route
            index
            element={<InicioGuarda />}
          />

          <Route
            path="escanear-qr"
            element={<EscanearQR />}
          />

          <Route
            path="manual"
            element={<ManualPlataforma />}
          />

          <Route
            path="ingreso-salida"
            element={<IngresoSalida />}
          />

          <Route
            path="entrada-salida"
            element={<EntradaSalidaCrud />}
          />

        </Route>

        {/* ================= APRENDIZ ================= */}

        <Route
          path="/dashboard-aprendiz"
          element={
            <ProtectedRoute rol="aprendiz">
              <DashboardAprendiz />
            </ProtectedRoute>
          }
        >

          <Route
            index
            element={<InicioAprendiz />}
          />

          <Route
            path="visualizar-carnet"
            element={<VisualizarCarnet />}
          />

          {/* NUEVA SECCIÓN MIS VEHÍCULOS */}

          <Route
            path="mis-vehiculos"
            element={<MisVehiculos />}
          />

          <Route
            path="actualizar-datos"
            element={<ActualizarDatos />}
          />

          <Route
            path="peticion-carnet"
            element={<PeticionCarnet />}
          />

          <Route
            path="manual"
            element={<ManualUso />}
          />

          <Route
            path="soporte"
            element={<SoporteTecnico />}
          />

        </Route>

        {/* ================= NO ENCONTRADA ================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}