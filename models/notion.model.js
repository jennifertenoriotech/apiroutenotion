import mongoose from 'mongoose';

const notionSchema = new mongoose.Schema(
  {
    tituloPagina: {
      type: String,
      required: [true, 'El titulo de la pagina es obligatorio'],
      trim: true
    },
    espacioTrabajo: {
      type: String,
      required: [true, 'El espacio de trabajo es obligatorio'],
      trim: true
    },
    tipoContenido: {
      type: String,
      required: [true, 'El tipo de contenido es obligatorio'],
      enum: ['Nota', 'Tarea', 'Documento', 'Base de datos', 'Plantilla', 'Proyecto'],
      default: 'Nota'
    },
    categoria: {
      type: String,
      required: [true, 'La categoria es obligatoria'],
      trim: true
    },
    estado: {
      type: String,
      required: [true, 'El estado es obligatorio'],
      enum: ['Borrador', 'En progreso', 'Publicado', 'Archivado'],
      default: 'Borrador'
    },
    fechaCreacion: {
      type: Date,
      required: [true, 'La fecha de creacion es obligatoria']
    },
    responsable: {
      type: String,
      required: [true, 'El responsable es obligatorio'],
      trim: true
    },
    descripcion: {
      type: String,
      required: [true, 'La descripcion es obligatoria'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Notion = mongoose.model('Notion', notionSchema);

export default Notion;
