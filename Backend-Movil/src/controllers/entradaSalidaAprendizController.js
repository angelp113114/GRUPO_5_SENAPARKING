const EntradaSalidaAprendiz = require("../models/EntradaSalidaAprendiz");
const User = require("../models/User");
const Vehiculo = require("../models/Vehiculo");


// CREAR ENTRADA
const createRegistro = async (req, res) => {
  try {
    const { id_aprendiz, id_codigo_gr } = req.body;

    if (!id_aprendiz || !id_codigo_gr) {
      return res.status(400).json({
        message: "id_aprendiz e id_codigo_gr son obligatorios",
      });
    }

    const nuevo = await EntradaSalidaAprendiz.create({
      hora_entrada: new Date(),
      hora_salida: null,
      id_aprendiz,
      id_codigo_gr,
    });

    return res.status(201).json({
      message: "Entrada registrada",
      data: nuevo,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creando registro",
      error,
    });
  }
};

// LISTAR
const getRegistros = async (req, res) => {
  try {
    const data = await EntradaSalidaAprendiz.findAll({
      order: [["hora_entrada", "DESC"]],
      include: [
        {
          model: User,
          as: "aprendiz",
          attributes: ["nombres", "apellidos"],
          include: [
            {
              model: Vehiculo,
              as: "vehiculos",
              attributes: ["tipo", "placa", "serial"],
            },
          ],
        },
      ],
    });
data.forEach((r) => {
  console.log(r.fecha);
});
    const registros = data.map((r) => ({
      id: r.id,
      fecha: r.fecha,
      aprendiz: r.aprendiz
        ? `${r.aprendiz.nombres} ${r.aprendiz.apellidos}`
        : "Sin aprendiz",

      vehiculo: r.aprendiz?.vehiculos?.[0]?.tipo || "-",

      placaSerial:
        r.aprendiz?.vehiculos?.[0]?.placa ||
        r.aprendiz?.vehiculos?.[0]?.serial ||
        "-",

      hora_entrada: r.hora_entrada,
      hora_salida: r.hora_salida,
      estado: r.estado,
    }));

    res.json({
      data: registros,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// REPORTE DIARIO / SEMANAL / MENSUAL
const generarReporte = async (req, res) => {
  try {
    const periodo = String(req.query.periodo || "diario").toLowerCase();
    if (!["diario", "semanal", "mensual"].includes(periodo)) {
      return res.status(400).json({ message: "Periodo no válido" });
    }

    const ahora = new Date();
    const inicio = new Date(ahora);
    if (periodo === "diario") inicio.setHours(0, 0, 0, 0);
    if (periodo === "semanal") {
      const day = inicio.getDay() || 7;
      inicio.setDate(inicio.getDate() - day + 1);
      inicio.setHours(0, 0, 0, 0);
    }
    if (periodo === "mensual") {
      inicio.setDate(1);
      inicio.setHours(0, 0, 0, 0);
    }

    const data = await EntradaSalidaAprendiz.findAll({
      where: { hora_entrada: { [require("sequelize").Op.gte]: inicio } },
      order: [["hora_entrada", "DESC"]],
      include: [{ model: User, as: "aprendiz", attributes: ["nombres", "apellidos"], include: [{ model: Vehiculo, as: "vehiculos", attributes: ["tipo", "placa", "serial"] }] }]
    });

    const registros = data.map(r => ({
      id: r.id, fecha: r.fecha,
      aprendiz: r.aprendiz ? `${r.aprendiz.nombres} ${r.aprendiz.apellidos}` : "Sin aprendiz",
      vehiculo: r.aprendiz?.vehiculos?.[0]?.tipo || "-",
      placaSerial: r.aprendiz?.vehiculos?.[0]?.placa || r.aprendiz?.vehiculos?.[0]?.serial || "-",
      hora_entrada: r.hora_entrada, hora_salida: r.hora_salida, estado: r.estado
    }));

    return res.json({ periodo, desde: inicio, hasta: ahora, total: registros.length, entradas: registros.filter(r => r.hora_entrada).length, salidas: registros.filter(r => r.hora_salida).length, data: registros });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// ACTUALIZAR (SALIDA O EDICIÓN)
const updateRegistro = async (req, res) => {
  try {
    const item = await EntradaSalidaAprendiz.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "No encontrado" });
    }

    await item.update(req.body);

    return res.json({
      message: "Actualizado correctamente",
      data: item,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error actualizando",
      error,
    });
  }
};

// ELIMINAR
const deleteRegistro = async (req, res) => {
  try {
    const item = await EntradaSalidaAprendiz.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "No encontrado" });
    }

    await item.destroy();

    return res.json({
      message: "Eliminado correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error eliminando",
      error,
    });
  }
};

module.exports = {
  createRegistro,
  getRegistros,
  generarReporte,
  updateRegistro,
  deleteRegistro,
};