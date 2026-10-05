const CentroFormacion = require("../models/CentroFormacion");

// Crear centro
const crearCentro = async (req, res) => {
  try {
    const { nombre, ciudad, direccion } = req.body;

    if (!nombre || !ciudad || !direccion) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios"
      });
    }

    const existe = await CentroFormacion.findOne({
      where: { nombre }
    });

    if (existe) {
      return res.status(409).json({
        message: "Ese centro de formación ya existe"
      });
    }

    const centro = await CentroFormacion.create({
      nombre,
      ciudad,
      direccion
    });

    return res.status(201).json(centro);

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error al crear el centro"
    });
  }
};

// Listar centros
const listarCentros = async (req, res) => {
  try {
    const centros = await CentroFormacion.findAll({
      order: [["nombre", "ASC"]]
    });

    return res.json(centros);

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error al listar centros"
    });
  }
};

// Obtener centro por id
const obtenerCentro = async (req, res) => {
  try {
    const centro = await CentroFormacion.findByPk(req.params.id);

    if (!centro) {
      return res.status(404).json({
        message: "Centro no encontrado"
      });
    }

    return res.json(centro);

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error al obtener el centro"
    });
  }
};

// Actualizar centro
const actualizarCentro = async (req, res) => {
  try {
    const centro = await CentroFormacion.findByPk(req.params.id);

    if (!centro) {
      return res.status(404).json({
        message: "Centro no encontrado"
      });
    }

    await centro.update(req.body);

    return res.json({
      message: "Centro actualizado correctamente",
      centro
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error al actualizar el centro"
    });
  }
};

// Eliminar centro
const eliminarCentro = async (req, res) => {
  try {
    const centro = await CentroFormacion.findByPk(req.params.id);

    if (!centro) {
      return res.status(404).json({
        message: "Centro no encontrado"
      });
    }

    await centro.destroy();

    return res.json({
      message: "Centro eliminado correctamente"
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error al eliminar el centro"
    });
  }
};

module.exports = {
  crearCentro,
  listarCentros,
  obtenerCentro,
  actualizarCentro,
  eliminarCentro
};