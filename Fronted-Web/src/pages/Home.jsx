import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#087f23",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px 20px",
        boxSizing: "border-box",
      }}
    >
      {/* TARJETA PRINCIPAL */}
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "#ffffff",
          borderRadius: "25px",
          padding: "45px 40px",
          boxSizing: "border-box",
          textAlign: "center",
          boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
        }}
      >
        {/* LOGO */}
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: "#e8f5e9",
            margin: "0 auto 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "50px",
            border: "4px solid #ffffff",
            boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
          }}
        >
          🚲
        </div>

        {/* TITULO */}
        <h1
          style={{
            margin: "0 0 8px",
            color: "#087f23",
            fontSize: "34px",
            fontWeight: "800",
            letterSpacing: "1px",
          }}
        >
          SENA PARKING
        </h1>

        <h2
          style={{
            margin: "0 0 18px",
            color: "#3f4f43",
            fontSize: "17px",
            fontWeight: "600",
          }}
        >
          Control inteligente de parqueadero
        </h2>

        {/* DESCRIPCIÓN */}
        <p
          style={{
            margin: "0 auto 30px",
            maxWidth: "390px",
            color: "#64748b",
            fontSize: "15px",
            lineHeight: "23px",
          }}
        >
          Gestiona de manera fácil y segura el ingreso y salida
          de bicicletas y motocicletas en el SENA.
        </p>

        {/* BOTÓN LOGIN */}
        <button
          onClick={() => navigate("/login")}
          style={{
            width: "100%",
            height: "55px",
            marginBottom: "13px",
            borderRadius: "13px",
            border: "none",
            background: "#087f23",
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Iniciar sesión
        </button>

        {/* BOTÓN REGISTRO */}
        <button
          onClick={() => navigate("/register")}
          style={{
            width: "100%",
            height: "55px",
            borderRadius: "13px",
            border: "2px solid #087f23",
            background: "#ffffff",
            color: "#087f23",
            fontSize: "16px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Registrarse
        </button>

        {/* INFORMACIÓN */}
        <div
          style={{
            marginTop: "28px",
            padding: "16px",
            borderRadius: "14px",
            background: "#f0fdf4",
            border: "1px solid #d1fae5",
          }}
        >
          <div
            style={{
              color: "#087f23",
              fontSize: "14px",
              fontWeight: "800",
              marginBottom: "5px",
            }}
          >
            🚗 Parqueadero seguro
          </div>

          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: "12px",
              lineHeight: "18px",
            }}
          >
            Una solución digital para facilitar el control
            y la seguridad del parqueadero.
          </p>
        </div>
      </div>

      {/* PIE */}
      <div
        style={{
          marginTop: "20px",
          textAlign: "center",
          color: "#ffffff",
          fontSize: "13px",
        }}
      >
        <strong>SENA Parking</strong>

        <div
          style={{
            color: "#c9f5d1",
            fontSize: "11px",
            marginTop: "4px",
          }}
        >
          Complejo Sur • 2026
        </div>
      </div>
    </div>
  );
}