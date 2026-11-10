import mongoose from 'mongoose';
import Notion from '../models/notion.model.js';

const camposObligatorios = [
  'tituloPagina',
  'espacioTrabajo',
  'tipoContenido',
  'categoria',
  'estado',
  'fechaCreacion',
  'responsable',
  'descripcion'
];

const obtenerCamposFaltantes = (body) =>
  camposObligatorios.filter((campo) => {
    const valor = body[campo];
    return valor === undefined || valor === null || String(valor).trim() === '';
  });

const manejarErrorValidacion = (error, res, accion) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Error de validacion',
      errors: Object.values(error.errors).map((err) => err.message)
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Datos invalidos para la pagina de Notion'
    });
  }

  return res.status(500).json({
    success: false,
    message: `Error interno al ${accion} la pagina de Notion`
  });
};

const listarNotion = async (req, res) => {
  try {
    const paginas = await Notion.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: paginas.length,
      data: paginas
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error interno al listar las paginas de Notion'
    });
  }
};

const obtenerNotionPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID invalido'
      });
    }

    const pagina = await Notion.findById(id);

    if (!pagina) {
      return res.status(404).json({
        success: false,
        message: 'Pagina de Notion no encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      data: pagina
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error interno al obtener la pagina de Notion'
    });
  }
};

const crearNotion = async (req, res) => {
  try {
    const camposFaltantes = obtenerCamposFaltantes(req.body);

    if (camposFaltantes.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios',
        errors: camposFaltantes.map((campo) => `${campo} es obligatorio`)
      });
    }

    const nuevaPagina = new Notion(req.body);
    const paginaGuardada = await nuevaPagina.save();

    return res.status(201).json({
      success: true,
      message: 'Pagina de Notion creada correctamente',
      data: paginaGuardada
    });
  } catch (error) {
    return manejarErrorValidacion(error, res, 'crear');
  }
};

const actualizarNotion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID invalido'
      });
    }

    const camposFaltantes = obtenerCamposFaltantes(req.body);

    if (camposFaltantes.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios',
        errors: camposFaltantes.map((campo) => `${campo} es obligatorio`)
      });
    }

    const paginaActualizada = await Notion.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!paginaActualizada) {
      return res.status(404).json({
        success: false,
        message: 'Pagina de Notion no encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Pagina de Notion actualizada correctamente',
      data: paginaActualizada
    });
  } catch (error) {
    return manejarErrorValidacion(error, res, 'actualizar');
  }
};

const eliminarNotion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID invalido'
      });
    }

    const paginaEliminada = await Notion.findByIdAndDelete(id);

    if (!paginaEliminada) {
      return res.status(404).json({
        success: false,
        message: 'Pagina de Notion no encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Pagina de Notion eliminada correctamente',
      data: paginaEliminada
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error interno al eliminar la pagina de Notion'
    });
  }
};

export {
  listarNotion,
  obtenerNotionPorId,
  crearNotion,
  actualizarNotion,
  eliminarNotion
};
