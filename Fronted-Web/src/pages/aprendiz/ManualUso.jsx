import "../../Styles/ManualUso.css";

export default function ManualUso() {
  return (
    <div className="manual-container">

      <div className="manual-header">
        <h2> Manual de Uso</h2>

        <p>
          Bienvenido al sistema <strong>SENA Parking</strong>.
          Aquí encontrarás una guía sencilla para utilizar correctamente la plataforma.
        </p>
      </div>

      <div className="manual-card">

        <h3>¿Qué puedes hacer en el sistema?</h3>

        <p>
          El sistema SENA Parking fue desarrollado para facilitar el registro
          y control de los vehículos de los aprendices. Desde aquí podrás
          realizar tus solicitudes y consultar toda la información relacionada
          con tu carnet de ingreso.
        </p>

        <ul>
          <li>
            🚗 <strong>Registrar la solicitud de tu carnet.</strong>
            <br />
            <span>
              Completa el formulario con la información de tu vehículo y adjunta
              los documentos solicitados para iniciar el proceso de aprobación.
            </span>
          </li>

          <li>
            📄 <strong>Consultar el estado de la solicitud.</strong>
            <br />
            <span>
              Revisa en cualquier momento si tu solicitud está pendiente,
              aprobada, rechazada o si tu carnet ya fue generado.
            </span>
          </li>

          <li>
            🪪 <strong>Visualizar e imprimir tu carnet.</strong>
            <br />
            <span>
              Una vez aprobado, podrás visualizar tu carnet digital con tus
              datos, fotografías y código QR, además de imprimirlo cuando lo
              necesites.
            </span>
          </li>

          <li>
            🔄 <strong>Solicitar actualización de datos.</strong>
            <br />
            <span>
              Si cambias de vehículo o necesitas modificar tu información
              personal, puedes enviar una solicitud de actualización al
              administrador.
            </span>
          </li>

          <li>
            💬 <strong>Contactar al administrador mediante soporte técnico.</strong>
            <br />
            <span>
              Si tienes inconvenientes con el sistema o necesitas ayuda, envía
              una solicitud de soporte para recibir una respuesta del
              administrador.
            </span>
          </li>
        </ul>

      </div>

      <div className="manual-card">

        <h3>Recomendaciones</h3>

        <ul>

          <li>
            ✅ <strong>Verifica la información ingresada.</strong>
            <br />
            <span>
              Antes de enviar cualquier solicitud, revisa que todos los datos
              sean correctos para evitar retrasos en el proceso.
            </span>
          </li>

          <li>
            📷 <strong>Utiliza fotografías claras.</strong>
            <br />
            <span>
              Procura que las imágenes del aprendiz y del vehículo sean nítidas
              y permitan identificar correctamente la información.
            </span>
          </li>

          <li>
            📱 <strong>Mantén tus datos actualizados.</strong>
            <br />
            <span>
              Tener tu información al día facilita la comunicación y la
              administración de tu carnet.
            </span>
          </li>

          <li>
            🔒 <strong>Protege tu cuenta.</strong>
            <br />
            <span>
              No compartas tu contraseña con otras personas y cambia tus datos
              si consideras que tu cuenta puede estar en riesgo.
            </span>
          </li>

          <li>
            🚪 <strong>Cierra sesión al finalizar.</strong>
            <br />
            <span>
              Especialmente si utilizas un computador compartido, recuerda
              cerrar sesión para proteger tu información.
            </span>
          </li>

        </ul>

      </div>

      <div className="manual-tip">

        <h4>💡 Consejo</h4>

        <p>
          Si presentas algún inconveniente durante el uso del sistema, utiliza
          la opción <strong>Soporte Técnico</strong>. Describe claramente el
          problema que estás presentando para que el administrador pueda darte
          una solución lo más pronto posible.
        </p>

      </div>

    </div>
  );
}