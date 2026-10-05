import "../../Styles/ManualUso.css";

export default function ManualPlataforma() {
  return (
    <div className="manual-container">

      <div className="manual-header">
        <h2>📘 Manual de Uso</h2>

        <p>
          Bienvenido al sistema <strong>SENA Parking</strong>.
          Esta guía te ayudará a conocer las funciones disponibles para el
          personal de vigilancia y la forma correcta de utilizarlas.
        </p>
      </div>

      <div className="manual-card">

        <h3>¿Qué puedes hacer en el sistema?</h3>

        <p>
          Como guarda de seguridad, tu función principal es controlar el acceso
          de los aprendices al Centro de Formación mediante la validación de los
          carnets y el registro de entradas y salidas de los vehículos.
        </p>

        <ul>

          <li>
            📷 <strong>Escanear código QR.</strong><br />
            <span>
              Utiliza el lector QR para verificar la autenticidad del carnet del
              aprendiz y consultar su información antes de permitir el ingreso o
              la salida.
            </span>
          </li>

          <li>
            🚪 <strong>Registrar entradas y salidas.</strong><br />
            <span>
              Cada vez que un aprendiz ingrese o salga del Centro de Formación,
              el sistema registrará automáticamente el movimiento realizado.
            </span>
          </li>

          <li>
            👤 <strong>Consultar información del aprendiz.</strong><br />
            <span>
              Al escanear el carnet podrás visualizar los datos personales del
              aprendiz y la información del vehículo registrado.
            </span>
          </li>

          <li>
            🚗 <strong>Verificar los datos del vehículo.</strong><br />
            <span>
              Comprueba que la placa o serial, la marca, el color y las
              fotografías coincidan con el vehículo que ingresa o sale del
              Centro de Formación.
            </span>
          </li>

          <li>
            📋 <strong>Consultar el historial de movimientos.</strong><br />
            <span>
              Puedes revisar los registros de ingreso y salida para llevar un
              control de los vehículos autorizados.
            </span>
          </li>

        </ul>

      </div>

      <div className="manual-card">

        <h3>Recomendaciones</h3>

        <ul>

          <li>
            ✅ <strong>Verifica siempre el carnet.</strong><br />
            <span>
              Antes de permitir el ingreso o la salida, confirma que el carnet
              pertenezca al aprendiz y que se encuentre activo.
            </span>
          </li>

          <li>
            📸 <strong>Compara las fotografías.</strong><br />
            <span>
              Revisa que las imágenes del aprendiz y del vehículo coincidan con
              las personas y vehículos presentes.
            </span>
          </li>

          <li>
            📱 <strong>Escanea correctamente el código QR.</strong><br />
            <span>
              Asegúrate de que el código QR sea leído completamente para evitar
              registros incorrectos.
            </span>
          </li>

          <li>
            🚫 <strong>No permitas ingresos sin validación.</strong><br />
            <span>
              Todo ingreso o salida debe realizarse utilizando el carnet
              generado por el sistema.
            </span>
          </li>

          <li>
            🚪 <strong>Cierra sesión al finalizar tu turno.</strong><br />
            <span>
              Esto ayuda a proteger la información del sistema y evita accesos
              no autorizados.
            </span>
          </li>

        </ul>

      </div>

      <div className="manual-tip">

        <h4>💡 Consejo</h4>

        <p>
          Si el sistema presenta algún inconveniente al escanear un carnet o no
          muestra la información del aprendiz, informa inmediatamente al
          administrador para verificar el estado del registro antes de permitir
          el acceso.
        </p>

      </div>

    </div>
  );
}   