const API_URL = '/api/notion';

const notionForm = document.querySelector('#notionForm');
const paginaIdInput = document.getElementById('paginaId');
const tituloPaginaInput = document.getElementById('tituloPagina');
const espacioTrabajoInput = document.getElementById('espacioTrabajo');
const tipoContenidoInput = document.getElementById('tipoContenido');
const categoriaInput = document.getElementById('categoria');
const estadoInput = document.getElementById('estado');
const fechaCreacionInput = document.getElementById('fechaCreacion');
const responsableInput = document.getElementById('responsable');
const descripcionInput = document.getElementById('descripcion');
const paginasBody = document.getElementById('paginasBody');
const alerta = document.getElementById('alerta');
const estadoCarga = document.getElementById('estadoCarga');
const contadorPaginas = document.getElementById('contadorPaginas');
const estadoApi = document.getElementById('estadoApi');
const formTitulo = document.getElementById('formTitulo');
const modoFormulario = document.getElementById('modoFormulario');
const submitBtn = document.getElementById('submitBtn');
const cancelarEdicionBtn = document.getElementById('cancelarEdicion');
const recargarPaginasBtn = document.getElementById('recargarPaginas');

let paginas = [];

const escaparHTML = (valor) =>
  String(valor ?? '').replace(/[&<>"']/g, (caracter) => {
    const entidades = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };

    return entidades[caracter];
  });

const obtenerDatosFormulario = () => ({
  tituloPagina: tituloPaginaInput.value.trim(),
  espacioTrabajo: espacioTrabajoInput.value.trim(),
  tipoContenido: tipoContenidoInput.value,
  categoria: categoriaInput.value.trim(),
  estado: estadoInput.value,
  fechaCreacion: fechaCreacionInput.value,
  responsable: responsableInput.value.trim(),
  descripcion: descripcionInput.value.trim()
});

const formatearFecha = (fecha) => {
  if (!fecha) {
    return 'Sin fecha';
  }

  const fechaLocal = new Date(fecha);

  if (Number.isNaN(fechaLocal.getTime())) {
    return 'Sin fecha';
  }

  return fechaLocal.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
};

const convertirFechaParaInput = (fecha) => {
  if (!fecha) {
    return '';
  }

  const fechaLocal = new Date(fecha);

  if (Number.isNaN(fechaLocal.getTime())) {
    return '';
  }

  return fechaLocal.toISOString().slice(0, 10);
};

const claseEstado = (estado) => {
  const clases = {
    Borrador: 'estado-borrador',
    'En progreso': 'estado-en-progreso',
    Publicado: 'estado-publicado',
    Archivado: 'estado-archivado'
  };

  return clases[estado] || 'estado-borrador';
};

const mostrarMensaje = (mensaje, tipo = 'success') => {
  alerta.className = `alert alert-${tipo}`;
  alerta.textContent = mensaje;

  window.setTimeout(() => {
    alerta.className = 'alert d-none';
    alerta.textContent = '';
  }, 4200);
};

const mostrarEstadoCarga = (mensaje) => {
  estadoCarga.textContent = mensaje;
};

const limpiarFormulario = () => {
  notionForm.reset();
  paginaIdInput.value = '';
  tipoContenidoInput.value = 'Nota';
  estadoInput.value = 'Borrador';
  formTitulo.textContent = 'Guardar pagina';
  modoFormulario.textContent = 'Crear';
  submitBtn.textContent = 'Guardar pagina';
  cancelarEdicionBtn.classList.add('d-none');
};

const renderizarPaginas = (listaPaginas) => {
  contadorPaginas.textContent = String(listaPaginas.length);

  if (listaPaginas.length === 0) {
    paginasBody.innerHTML = `
      <tr>
        <td class="empty-row" colspan="6">No hay paginas registradas todavia.</td>
      </tr>
    `;
    return;
  }

  paginasBody.innerHTML = listaPaginas
    .map((pagina) => {
      const titulo = escaparHTML(pagina.tituloPagina || 'Pagina sin titulo');
      const descripcion = escaparHTML(pagina.descripcion || 'Sin descripcion');
      const espacioTrabajo = escaparHTML(pagina.espacioTrabajo || 'Sin espacio');
      const tipoContenido = escaparHTML(pagina.tipoContenido || 'Nota');
      const estado = escaparHTML(pagina.estado || 'Borrador');
      const paginaId = escaparHTML(pagina._id);
      const fecha = formatearFecha(pagina.fechaCreacion);

      return `
        <tr>
          <td class="page-title-cell" data-label="Pagina">
            <strong>${titulo}</strong>
            <span>${descripcion}</span>
          </td>
          <td data-label="Workspace">${espacioTrabajo}</td>
          <td data-label="Tipo">${tipoContenido}</td>
          <td data-label="Estado">
            <span class="estado-badge ${claseEstado(estado)}">${estado}</span>
          </td>
          <td data-label="Fecha">${fecha}</td>
          <td data-label="Acciones">
            <div class="action-group">
              <button class="btn btn-outline-dark btn-sm" type="button" data-action="editar" data-id="${paginaId}">Editar</button>
              <button class="btn btn-outline-danger btn-sm" type="button" data-action="eliminar" data-id="${paginaId}">Eliminar</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');
};

const obtenerPaginas = async () => {
  mostrarEstadoCarga('Cargando paginas...');
  estadoApi.textContent = 'Cargando';

  try {
    const respuesta = await fetch(API_URL);
    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(resultado.message || 'No se pudieron obtener las paginas');
    }

    paginas = resultado.data || [];
    renderizarPaginas(paginas);
    mostrarEstadoCarga('Lista actualizada');
    estadoApi.textContent = 'Activo';
  } catch (error) {
    paginas = [];
    renderizarPaginas(paginas);
    mostrarEstadoCarga('No se pudo conectar con la API');
    estadoApi.textContent = 'Error';
    mostrarMensaje(error.message, 'danger');
  }
};

const crearPagina = async (datosPagina) => {
  const respuesta = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datosPagina)
  });
  const resultado = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(resultado.errors?.join(', ') || resultado.message || 'No se pudo crear la pagina');
  }

  return resultado.data;
};

const actualizarPagina = async (id, datosPagina) => {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datosPagina)
  });
  const resultado = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(resultado.errors?.join(', ') || resultado.message || 'No se pudo actualizar la pagina');
  }

  return resultado.data;
};

const cargarPaginaParaEditar = async (id) => {
  mostrarEstadoCarga('Cargando pagina seleccionada...');

  try {
    const respuesta = await fetch(`${API_URL}/${id}`);
    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(resultado.message || 'No se pudo cargar la pagina');
    }

    const pagina = resultado.data;
    paginaIdInput.value = pagina._id;
    tituloPaginaInput.value = pagina.tituloPagina || '';
    espacioTrabajoInput.value = pagina.espacioTrabajo || '';
    tipoContenidoInput.value = pagina.tipoContenido || 'Nota';
    categoriaInput.value = pagina.categoria || '';
    estadoInput.value = pagina.estado || 'Borrador';
    fechaCreacionInput.value = convertirFechaParaInput(pagina.fechaCreacion);
    responsableInput.value = pagina.responsable || '';
    descripcionInput.value = pagina.descripcion || '';
    formTitulo.textContent = 'Editar pagina';
    modoFormulario.textContent = 'Editar';
    submitBtn.textContent = 'Actualizar pagina';
    cancelarEdicionBtn.classList.remove('d-none');
    mostrarEstadoCarga('Pagina lista para editar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    mostrarMensaje(error.message, 'danger');
    mostrarEstadoCarga('No se pudo cargar la pagina');
  }
};

const eliminarPagina = async (id) => {
  const confirmado = window.confirm('Confirma que deseas eliminar esta pagina de Notion');

  if (!confirmado) {
    return;
  }

  mostrarEstadoCarga('Eliminando pagina...');

  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(resultado.message || 'No se pudo eliminar la pagina');
    }

    mostrarMensaje('Pagina eliminada correctamente');
    limpiarFormulario();
    await obtenerPaginas();
  } catch (error) {
    mostrarMensaje(error.message, 'danger');
    mostrarEstadoCarga('No se pudo eliminar la pagina');
  }
};

notionForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  submitBtn.disabled = true;
  mostrarEstadoCarga('Guardando pagina...');

  try {
    const datosPagina = obtenerDatosFormulario();
    const paginaId = paginaIdInput.value;

    if (paginaId) {
      await actualizarPagina(paginaId, datosPagina);
      mostrarMensaje('Pagina actualizada correctamente');
    } else {
      await crearPagina(datosPagina);
      mostrarMensaje('Pagina creada correctamente');
    }

    limpiarFormulario();
    await obtenerPaginas();
  } catch (error) {
    mostrarMensaje(error.message, 'danger');
    mostrarEstadoCarga('No se pudo guardar la pagina');
  } finally {
    submitBtn.disabled = false;
  }
});

paginasBody.addEventListener('click', async (event) => {
  const boton = event.target.closest('button[data-action]');

  if (!boton) {
    return;
  }

  const { action, id } = boton.dataset;

  if (action === 'editar') {
    await cargarPaginaParaEditar(id);
  }

  if (action === 'eliminar') {
    await eliminarPagina(id);
  }
});

cancelarEdicionBtn.addEventListener('click', () => {
  limpiarFormulario();
  mostrarEstadoCarga('Edicion cancelada');
});

recargarPaginasBtn.addEventListener('click', async () => {
  await obtenerPaginas();
});

document.addEventListener('DOMContentLoaded', async () => {
  limpiarFormulario();
  await obtenerPaginas();
});
