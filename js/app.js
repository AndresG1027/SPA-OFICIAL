// Dashboard logic for Spa de Mascotas
// GPT-5.1-Codex-Max (Preview)

(function () {
  const state = {
    clientes: [
      {
        id: 'cli-1',
        nombre: 'Ana Herrera',
        correo: 'ana@mail.com',
        telefono: '+591 60000001',
        preferencias: 'Prefiere sábados por la mañana.',
        mascotas: [
          {
            nombre: 'Luna',
            tipo: 'perro',
            raza: 'Shih Tzu',
            vacunas: 'Completa',
            alergias: 'Ninguna',
            notas: 'Piel sensible, usar shampoo hipoalergénico.'
          },
          {
            nombre: 'Simba',
            tipo: 'gato',
            raza: 'Persa',
            vacunas: 'Refuerzo pendiente',
            alergias: 'Polen',
            notas: 'Necesita transportadora cerrada.'
          }
        ]
      },
      {
        id: 'cli-2',
        nombre: 'Carlos Méndez',
        correo: 'carlos@mail.com',
        telefono: '+591 60000002',
        preferencias: 'Confirma por WhatsApp.',
        mascotas: [
          {
            nombre: 'Rocky',
            tipo: 'perro',
            raza: 'Labrador',
            vacunas: 'Completa',
            alergias: 'Pollo',
            notas: 'Mimos antes del baño.'
          }
        ]
      },
      {
        id: 'cli-3',
        nombre: 'María Salas',
        correo: 'maria@mail.com',
        telefono: '+591 60000003',
        preferencias: 'Envío de factura digital.',
        mascotas: [
          {
            nombre: 'Coco',
            tipo: 'perro',
            raza: 'Caniche',
            vacunas: 'Completa',
            alergias: 'Granos',
            notas: 'Corte teddy.'
          }
        ]
      }
    ],
    servicios: [
      { id: 'srv-1', nombre: 'Baño + Corte', duracion: 60, precio: 25, categoria: 'grooming' },
      { id: 'srv-2', nombre: 'Baño medicado', duracion: 50, precio: 22, categoria: 'grooming' },
      { id: 'srv-3', nombre: 'Deslanado', duracion: 70, precio: 30, categoria: 'grooming' },
      { id: 'srv-4', nombre: 'Guardería día', duracion: 480, precio: 18, categoria: 'guarderia' }
    ],
    groomers: [
      { id: 'gr-1', nombre: 'Karen', especialidad: 'Pequeños', capacidad: 6 },
      { id: 'gr-2', nombre: 'Leo', especialidad: 'Doble capa', capacidad: 5 },
      { id: 'gr-3', nombre: 'Majo', especialidad: 'Gatos', capacidad: 4 }
    ],
    productos: [
      { id: 'prd-1', nombre: 'Shampoo hipoalergénico', categoria: 'Higiene', precio: 12, stock: 8, minimo: 5 },
      { id: 'prd-2', nombre: 'Perfume vainilla', categoria: 'Higiene', precio: 10, stock: 4, minimo: 6 },
      { id: 'prd-3', nombre: 'Snack dental', categoria: 'Snacks', precio: 6, stock: 15, minimo: 10 },
      { id: 'prd-4', nombre: 'Correa reflectiva', categoria: 'Accesorios', precio: 14, stock: 3, minimo: 4 },
      { id: 'prd-5', nombre: 'Arena aglomerante', categoria: 'Gatos', precio: 11, stock: 12, minimo: 8 }
    ],
    notificaciones: [
      { tipo: 'Recordatorio cita', momento: '24h antes', canal: 'WhatsApp' },
      { tipo: 'Seguimiento grooming', momento: '6h después', canal: 'Correo' },
      { tipo: 'Recompra snack', momento: '30 días', canal: 'SMS' }
    ],
    facturas: [
      { fecha: '2024-06-01', cliente: 'Ana Herrera', concepto: 'Baño + Corte', monto: 25, metodo: 'qr' },
      { fecha: '2024-06-01', cliente: 'Carlos Méndez', concepto: 'Shampoo hipoalergénico', monto: 12, metodo: 'efectivo' }
    ],
    citas: [
      {
        id: 'ct-1',
        clienteId: 'cli-1',
        mascota: 'Luna',
        servicioId: 'srv-1',
        groomerId: 'gr-1',
        fecha: hoy(),
        hora: '10:00',
        estado: 'pendiente',
        notas: 'Corte higiénico'
      },
      {
        id: 'ct-2',
        clienteId: 'cli-2',
        mascota: 'Rocky',
        servicioId: 'srv-3',
        groomerId: 'gr-2',
        fecha: hoy(),
        hora: '11:00',
        estado: 'en-progreso',
        notas: 'Deslanado parcial'
      },
      {
        id: 'ct-3',
        clienteId: 'cli-3',
        mascota: 'Coco',
        servicioId: 'srv-2',
        groomerId: 'gr-3',
        fecha: sumarDias(hoy(), 1),
        hora: '15:00',
        estado: 'confirmado',
        notas: 'Baño medicado'
      }
    ],
    carrito: []
  };

  const DOM = {};

  // UTILIDADES
  function qs(id) {
    return document.getElementById(id);
  }

  function hoy() {
    return new Date().toISOString().split('T')[0];
  }

  function sumarDias(fechaISO, dias) {
    const d = new Date(fechaISO);
    d.setDate(d.getDate() + dias);
    return d.toISOString().split('T')[0];
  }

  function formatoMoneda(valor) {
    return `$${valor.toFixed(2)}`;
  }

  function toast(mensaje, tipo = 'info') {
    const cont = qs('toastContainer');
    if (!cont) return;
    const div = document.createElement('div');
    div.className = `toast toast-${tipo}`;
    div.textContent = mensaje;
    cont.appendChild(div);
    setTimeout(() => div.classList.add('visible'), 20);
    setTimeout(() => {
      div.classList.remove('visible');
      setTimeout(() => div.remove(), 300);
    }, 3200);
  }

  // NAVBAR Y TABS
  function setupTabs() {
    const tabs = document.querySelectorAll('.tab-link');
    const panels = document.querySelectorAll('.tab-panel');
    tabs.forEach((btn) => {
      btn.addEventListener('click', () => {
        const objetivo = btn.dataset.tab;
        tabs.forEach((t) => t.classList.remove('activo'));
        panels.forEach((p) => p.classList.remove('activo'));
        btn.classList.add('activo');
        const panel = qs(`tab-${objetivo}`);
        if (panel) panel.classList.add('activo');
        cerrarMenuMobile();
      });
    });

    document.querySelectorAll('[data-tab-target]').forEach((link) => {
      link.addEventListener('click', () => {
        const objetivo = link.dataset.tabTarget;
        const objetivoBtn = document.querySelector(`.tab-link[data-tab="${objetivo}"]`);
        if (objetivoBtn) objetivoBtn.click();
      });
    });
  }

  function setupNavbarToggle() {
    const nav = document.querySelector('.navbar');
    const toggle = qs('btnToggleMenu');
    if (!nav || !toggle) return;
    toggle.addEventListener('click', () => {
      const abierto = nav.classList.toggle('menu-abierto');
      toggle.setAttribute('aria-expanded', abierto);
    });
  }

  function cerrarMenuMobile() {
    const nav = document.querySelector('.navbar');
    const toggle = qs('btnToggleMenu');
    if (nav && nav.classList.contains('menu-abierto')) {
      nav.classList.remove('menu-abierto');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }
  }

  // SELECTS Y FORMULARIOS
  function poblarSelect(element, opciones, valueKey, labelKey) {
    if (!element) return;
    element.innerHTML = '';
    opciones.forEach((op) => {
      const option = document.createElement('option');
      option.value = op[valueKey];
      option.textContent = op[labelKey];
      element.appendChild(option);
    });
  }

  function poblarCombos() {
    poblarSelect(qs('agendaCliente'), state.clientes, 'id', 'nombre');
    poblarSelect(qs('bloqueoGroomer'), state.groomers, 'id', 'nombre');
    poblarSelect(qs('agendaGroomer'), state.groomers, 'id', 'nombre');
    poblarSelect(qs('filtroAgendaGroomer'), [{ id: 'todos', nombre: 'Todos' }, ...state.groomers], 'id', 'nombre');
    poblarSelect(qs('filtroGroomingEstado'), [
      { id: 'pendiente', nombre: 'Pendientes' },
      { id: 'en-progreso', nombre: 'En progreso' },
      { id: 'completado', nombre: 'Completados' },
      { id: 'todos', nombre: 'Todos' }
    ], 'id', 'nombre');
    poblarSelect(qs('agendaServicio'), state.servicios, 'id', 'nombre');
    poblarSelect(qs('filtroCategoria'), [{ id: 'todos', nombre: 'Todas las categorías' }, ...categoriasProductos()], 'id', 'nombre');
    poblarSelect(qs('reporteGroomer'), [{ id: 'todos', nombre: 'Todos los groomers' }, ...state.groomers], 'id', 'nombre');
  }

  function categoriasProductos() {
    const set = new Set(state.productos.map((p) => p.categoria));
    return Array.from(set).map((c) => ({ id: c, nombre: c }));
  }

  function actualizarMascotasCliente(clienteId) {
    const select = qs('agendaMascota');
    if (!select) return;
    const cliente = state.clientes.find((c) => c.id === clienteId);
    select.innerHTML = '';
    (cliente?.mascotas || []).forEach((m) => {
      const opt = document.createElement('option');
      opt.value = m.nombre;
      opt.textContent = `${m.nombre} (${m.tipo})`;
      select.appendChild(opt);
    });
  }

  function renderSlots(containerId, hiddenInputId, fecha = hoy()) {
    const cont = qs(containerId);
    const hidden = qs(hiddenInputId);
    if (!cont || !hidden) return;
    cont.innerHTML = '';
    const horarios = ['09:00', '09:30', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];
    horarios.forEach((hora) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'slot';
      btn.textContent = hora;
      btn.addEventListener('click', () => {
        cont.querySelectorAll('.slot').forEach((s) => s.classList.remove('activo'));
        btn.classList.add('activo');
        hidden.value = `${fecha} ${hora}`;
      });
      cont.appendChild(btn);
    });
  }

  function escucharFormularios() {
    const agendaCliente = qs('agendaCliente');
    if (agendaCliente) {
      agendaCliente.addEventListener('change', (e) => actualizarMascotasCliente(e.target.value));
      actualizarMascotasCliente(agendaCliente.value || state.clientes[0]?.id);
    }

    renderSlots('agendaSlots', 'agendaSlot');
    renderSlots('reprogramarSlots', 'reprogramarSlot');

    const formAgenda = qs('formAgendar');
    if (formAgenda) {
      formAgenda.addEventListener('submit', (e) => {
        e.preventDefault();
        const cita = {
          id: `ct-${Date.now()}`,
          clienteId: qs('agendaCliente').value,
          mascota: qs('agendaMascota').value,
          servicioId: qs('agendaServicio').value,
          groomerId: qs('agendaGroomer').value,
          fecha: qs('agendaFecha').value || hoy(),
          hora: (qs('agendaSlot').value.split(' ')[1]) || '09:00',
          estado: 'confirmado',
          notas: qs('agendaNotas').value
        };
        if (!cita.fecha) {
          toast('Selecciona una fecha.', 'error');
          return;
        }
        state.citas.push(cita);
        mostrarMensaje(qs('agendaMensaje'), 'Cita agendada con éxito');
        formAgenda.reset();
        renderAll();
      });
    }

    const formReprogramar = qs('formReprogramar');
    if (formReprogramar) {
      formReprogramar.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = qs('reprogramarCitaId').value;
        const cita = state.citas.find((c) => c.id === id);
        if (cita) {
          const slotValue = qs('reprogramarSlot').value;
          const [fecha, hora] = slotValue.split(' ');
          cita.fecha = fecha || cita.fecha;
          cita.hora = hora || cita.hora;
          toast('Cita reprogramada', 'success');
          cerrarModal('modalReprogramar');
          renderAll();
        }
      });
    }

    const formFactura = qs('formFactura');
    if (formFactura) {
      formFactura.addEventListener('submit', (e) => {
        e.preventDefault();
        const registro = {
          fecha: hoy(),
          cliente: qs('facturaCliente').value,
          concepto: qs('facturaConcepto').value,
          monto: Number(qs('facturaMonto').value || 0),
          metodo: qs('facturaMetodo').value
        };
        state.facturas.unshift(registro);
        toast('Factura registrada', 'success');
        cerrarModal('modalFactura');
        formFactura.reset();
        renderFacturas();
      });
    }

    const formGrooming = qs('formGrooming');
    if (formGrooming) {
      formGrooming.addEventListener('submit', (e) => {
        e.preventDefault();
        const citaId = qs('groomingCitaId').value;
        const cita = state.citas.find((c) => c.id === citaId);
        if (cita) {
          cita.estado = 'completado';
          toast('Servicio cerrado', 'success');
          cerrarModal('modalGrooming');
          renderAll();
        }
      });
    }
  }

  function mostrarMensaje(elemento, texto) {
    if (!elemento) return;
    elemento.textContent = texto;
    elemento.style.display = 'block';
    setTimeout(() => (elemento.style.display = 'none'), 2500);
  }

  // RENDERS
  function renderAgenda() {
    const cont = qs('agendaCalendario');
    const listaMini = qs('listaMiniAgenda');
    if (cont) cont.innerHTML = '';
    if (listaMini) listaMini.innerHTML = '';

    const fechaFiltro = qs('filtroAgendaFecha')?.value || hoy();
    const groomerFiltro = qs('filtroAgendaGroomer')?.value || 'todos';

    const citasFiltradas = state.citas.filter((c) => {
      const matchFecha = !fechaFiltro || c.fecha === fechaFiltro;
      const matchGroomer = groomerFiltro === 'todos' || c.groomerId === groomerFiltro;
      return matchFecha && matchGroomer;
    });

    citasFiltradas
      .sort((a, b) => a.hora.localeCompare(b.hora))
      .forEach((cita) => {
        const card = document.createElement('div');
        card.className = 'agenda-card';
        const cliente = state.clientes.find((cli) => cli.id === cita.clienteId);
        const servicio = state.servicios.find((s) => s.id === cita.servicioId);
        const groomer = state.groomers.find((g) => g.id === cita.groomerId);
        card.innerHTML = `
          <div class="agenda-hora">${cita.hora}</div>
          <div class="agenda-info">
            <strong>${cita.mascota}</strong> • ${servicio?.nombre || ''}<br>
            Cliente: ${cliente?.nombre || ''}
            <div class="agenda-tags">
              <span class="tag">${groomer?.nombre || ''}</span>
              <span class="tag estado-${cita.estado}">${cita.estado}</span>
            </div>
          </div>
          <div class="agenda-acciones">
            <button class="btn-secundario" data-reprogramar="${cita.id}">Reprogramar</button>
            <button class="btn-ghost" data-cerrar="${cita.id}">Cerrar</button>
          </div>
        `;
        cont?.appendChild(card);
      });

    (listaMini ? state.citas.slice().sort((a, b) => `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`)).slice(0, 5) : [])
      .forEach((cita) => {
        const li = document.createElement('li');
        const cliente = state.clientes.find((cli) => cli.id === cita.clienteId);
        li.textContent = `${cita.hora} - ${cita.mascota} (${cliente?.nombre || ''})`;
        listaMini?.appendChild(li);
      });

    cont?.querySelectorAll('[data-reprogramar]').forEach((btn) => {
      btn.addEventListener('click', () => abrirReprogramar(btn.dataset.reprogramar));
    });
    cont?.querySelectorAll('[data-cerrar]').forEach((btn) => {
      btn.addEventListener('click', () => abrirGrooming(btn.dataset.cerrar));
    });
  }

  function renderOcupacionSemanal() {
    const cont = qs('ocupacionSemanal');
    const select = qs('filtroSemana');
    if (!cont || !select) return;
    select.innerHTML = '';
    ['Semana 1', 'Semana 2', 'Semana 3'].forEach((s) => {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      select.appendChild(opt);
    });

    cont.innerHTML = '';
    const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    dias.forEach((d) => {
      const div = document.createElement('div');
      const ocup = Math.min(100, 40 + Math.random() * 60);
      div.className = 'ocupacion-card';
      div.innerHTML = `
        <span>${d}</span>
        <div class="barra-progreso"><div style="width:${ocup}%"></div></div>
        <small>${ocup.toFixed(0)}% ocupado</small>
      `;
      cont.appendChild(div);
    });
  }

  function renderGrooming() {
    const cuerpo = qs('tablaGrooming');
    const historial = qs('historialGrooming');
    if (cuerpo) cuerpo.innerHTML = '';
    if (historial) historial.innerHTML = '';
    const filtro = qs('filtroGroomingEstado')?.value || 'pendiente';

    const citas = state.citas.filter((c) => filtro === 'todos' || c.estado === filtro);
    citas.forEach((cita) => {
      const tr = document.createElement('tr');
      const cliente = state.clientes.find((cli) => cli.id === cita.clienteId);
      const servicio = state.servicios.find((s) => s.id === cita.servicioId);
      const groomer = state.groomers.find((g) => g.id === cita.groomerId);
      tr.innerHTML = `
        <td>${cita.hora}</td>
        <td>${cita.mascota}</td>
        <td>${servicio?.nombre || ''}</td>
        <td>${groomer?.nombre || ''}</td>
        <td><span class="tag estado-${cita.estado}">${cita.estado}</span></td>
        <td><button class="btn-secundario" data-cerrar="${cita.id}">Ficha</button></td>
      `;
      cuerpo?.appendChild(tr);
    });

    state.citas
      .filter((c) => c.estado === 'completado')
      .slice(-4)
      .forEach((cita) => {
        const card = document.createElement('div');
        const servicio = state.servicios.find((s) => s.id === cita.servicioId);
        card.className = 'historial-card';
        card.innerHTML = `
          <strong>${cita.mascota}</strong>
          <span>${servicio?.nombre || ''}</span>
          <small>${cita.fecha} ${cita.hora}</small>
        `;
        historial?.appendChild(card);
      });

    cuerpo?.querySelectorAll('[data-cerrar]').forEach((btn) => {
      btn.addEventListener('click', () => abrirGrooming(btn.dataset.cerrar));
    });
  }

  function renderCatalogo() {
    const grid = qs('catalogoProductos');
    if (!grid) return;
    grid.innerHTML = '';
    const filtroCategoria = qs('filtroCategoria')?.value || 'todos';
    const filtroStock = qs('filtroDisponibilidad')?.value || 'todos';

    state.productos
      .filter((p) => filtroCategoria === 'todos' || p.categoria === filtroCategoria)
      .filter((p) => filtroStock === 'todos' || (filtroStock === 'stock' ? p.stock > 0 : p.stock <= 0))
      .forEach((prod) => {
        const card = document.createElement('article');
        card.className = 'producto-card';
        const stockLabel = prod.stock > 0 ? `${prod.stock} disponibles` : 'Agotado';
        card.innerHTML = `
          <div class="producto-header">
            <span class="tag">${prod.categoria}</span>
            <span class="stock ${prod.stock > prod.minimo ? 'ok' : 'alerta'}">${stockLabel}</span>
          </div>
          <h4>${prod.nombre}</h4>
          <p class="precio">${formatoMoneda(prod.precio)}</p>
          <button class="btn-principal" data-add-carrito="${prod.id}" ${prod.stock <= 0 ? 'disabled' : ''}>Agregar</button>
        `;
        grid.appendChild(card);
      });

    grid.querySelectorAll('[data-add-carrito]').forEach((btn) => {
      btn.addEventListener('click', () => agregarAlCarrito(btn.dataset.addCarrito));
    });
  }

  function renderInventario() {
    const tbody = qs('tablaInventario');
    if (!tbody) return;
    tbody.innerHTML = '';
    state.productos.forEach((prod) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${prod.nombre}</td>
        <td>${prod.categoria}</td>
        <td>${prod.stock}</td>
        <td>${prod.minimo}</td>
        <td>${prod.stock <= prod.minimo ? '<span class="tag alerta">Reabastecer</span>' : ''}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderClientes() {
    const cont = qs('tablaClientes');
    const selectMascota = qs('filtroTipoMascota');
    const busqueda = qs('busquedaCliente');
    if (!cont) return;
    cont.innerHTML = '';

    const filtroTipo = selectMascota?.value || 'todos';
    const termino = (busqueda?.value || '').toLowerCase();

    state.clientes.forEach((cli) => {
      const mascotas = cli.mascotas.filter((m) => filtroTipo === 'todos' || m.tipo === filtroTipo);
      const coincideTexto = cli.nombre.toLowerCase().includes(termino) || mascotas.some((m) => m.nombre.toLowerCase().includes(termino));
      if (!coincideTexto) return;
      const card = document.createElement('div');
      card.className = 'cliente-card';
      card.innerHTML = `
        <div class="cliente-header">
          <strong>${cli.nombre}</strong>
          <span>${cli.telefono}</span>
        </div>
        <p>${cli.preferencias}</p>
        <div class="mascotas-chip">${mascotas.map((m) => `<span class="tag">${m.nombre} (${m.tipo})</span>`).join('')}</div>
      `;
      cont.appendChild(card);
    });
  }

  function renderReportes() {
    const resumen = qs('reportesResumen');
    const citasDia = qs('reporteCitasDia');
    const topServicios = qs('reporteTopServicios');
    const topProductos = qs('reporteTopProductos');
    if (resumen) resumen.innerHTML = '';
    if (citasDia) citasDia.innerHTML = '';
    if (topServicios) topServicios.innerHTML = '';
    if (topProductos) topProductos.innerHTML = '';

    const totalCitas = state.citas.length;
    const completadas = state.citas.filter((c) => c.estado === 'completado').length;
    const ticketProm = state.servicios.reduce((acc, s) => acc + s.precio, 0) / state.servicios.length;

    const cards = [
      { titulo: 'Total citas', valor: totalCitas },
      { titulo: 'Completadas', valor: completadas },
      { titulo: 'Ticket promedio', valor: formatoMoneda(ticketProm || 0) }
    ];
    cards.forEach((c) => {
      const div = document.createElement('div');
      div.className = 'resumen-card';
      div.innerHTML = `<h4>${c.titulo}</h4><p>${c.valor}</p>`;
      resumen?.appendChild(div);
    });

    const porDia = agruparPor(state.citas, 'fecha');
    Object.entries(porDia).forEach(([fecha, lista]) => {
      const fila = document.createElement('div');
      fila.className = 'fila-mini';
      fila.innerHTML = `<span>${fecha}</span><strong>${lista.length}</strong>`;
      citasDia?.appendChild(fila);
    });

    const porServicio = agruparPor(state.citas, 'servicioId');
    Object.entries(porServicio)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 5)
      .forEach(([id, lista]) => {
        const srv = state.servicios.find((s) => s.id === id);
        const li = document.createElement('div');
        li.className = 'ranking-item';
        li.textContent = `${srv?.nombre || id} (${lista.length})`;
        topServicios?.appendChild(li);
      });

    state.productos
      .slice()
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 5)
      .forEach((p) => {
        const li = document.createElement('div');
        li.className = 'ranking-item';
        li.textContent = `${p.nombre} (${p.stock} en stock)`;
        topProductos?.appendChild(li);
      });
  }

  function agruparPor(arr, clave) {
    return arr.reduce((acc, item) => {
      const key = item[clave];
      acc[key] = acc[key] || [];
      acc[key].push(item);
      return acc;
    }, {});
  }

  function renderNotificaciones() {
    const tbody = qs('tablaNotificacionesConfig');
    if (!tbody) return;
    tbody.innerHTML = '';
    state.notificaciones.forEach((n) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${n.tipo}</td><td>${n.momento}</td><td>${n.canal}</td><td></td>`;
      tbody.appendChild(tr);
    });
  }

  function renderFacturas() {
    const tbody = qs('tablaFacturas');
    if (!tbody) return;
    tbody.innerHTML = '';
    state.facturas.forEach((f) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${f.fecha}</td><td>${f.cliente}</td><td>${f.concepto}</td><td>${formatoMoneda(f.monto)}</td><td>${f.metodo}</td>`;
      tbody.appendChild(tr);
    });
  }

  function renderGroomers() {
    const cont = qs('listaGroomers');
    if (!cont) return;
    cont.innerHTML = '';
    state.groomers.forEach((g) => {
      const div = document.createElement('div');
      div.className = 'groomer-card';
      div.innerHTML = `
        <strong>${g.nombre}</strong>
        <p>Especialidad: ${g.especialidad}</p>
        <small>Capacidad: ${g.capacidad} citas/día</small>
      `;
      cont.appendChild(div);
    });
  }

  function renderKPIs() {
    const hoyFecha = hoy();
    const citasHoy = state.citas.filter((c) => c.fecha === hoyFecha);
    const kpiCitas = qs('kpiCitasHoy');
    const kpiTrend = qs('kpiCitasTrend');
    const kpiOcupacion = qs('kpiOcupacion');
    const barraOcupacion = qs('barraOcupacion');
    const kpiTicket = qs('kpiTicket');
    const kpiAlertas = qs('kpiAlertas');

    if (kpiCitas) kpiCitas.textContent = citasHoy.length;
    if (kpiTrend) kpiTrend.textContent = citasHoy.length > 3 ? 'Alta demanda' : 'Día tranquilo';
    const ocup = Math.min(100, (citasHoy.length / 6) * 100);
    if (kpiOcupacion) kpiOcupacion.textContent = `${ocup.toFixed(0)}%`;
    if (barraOcupacion) barraOcupacion.style.width = `${ocup}%`;
    const ticketProm = state.servicios.reduce((acc, s) => acc + s.precio, 0) / state.servicios.length;
    if (kpiTicket) kpiTicket.textContent = formatoMoneda(ticketProm || 0);
    const alertas = state.productos.filter((p) => p.stock <= p.minimo).length;
    if (kpiAlertas) kpiAlertas.textContent = alertas;
  }

  // CARRITO
  function agregarAlCarrito(productoId) {
    const producto = state.productos.find((p) => p.id === productoId);
    if (!producto) return;
    const item = state.carrito.find((i) => i.id === productoId);
    if (item) item.cantidad += 1; else state.carrito.push({ ...producto, cantidad: 1 });
    actualizarCarrito();
    toast(`${producto.nombre} agregado`, 'success');
  }

  function actualizarCarrito() {
    const cont = qs('carritoItems');
    const totalSpan = qs('carritoTotal');
    const contador = qs('carritoContador');
    if (!cont || !totalSpan || !contador) return;

    cont.innerHTML = '';
    if (state.carrito.length === 0) {
      cont.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
    } else {
      state.carrito.forEach((item, idx) => {
        const row = document.createElement('div');
        row.className = 'carrito-item';
        row.innerHTML = `
          <div>
            <strong>${item.nombre}</strong>
            <small>${item.categoria}</small>
          </div>
          <div class="carrito-actions">
            <span>${formatoMoneda(item.precio * item.cantidad)}</span>
            <button class="btn-ghost" data-remove="${idx}">✕</button>
          </div>
        `;
        cont.appendChild(row);
      });
      cont.querySelectorAll('[data-remove]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const index = Number(btn.dataset.remove);
          state.carrito.splice(index, 1);
          actualizarCarrito();
        });
      });
    }

    const total = state.carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
    totalSpan.textContent = formatoMoneda(total);
    contador.textContent = state.carrito.reduce((acc, i) => acc + i.cantidad, 0);
  }

  function toggleCarrito() {
    const cont = qs('carritoContenido');
    cont?.classList.toggle('activo');
  }

  function enviarWhatsApp() {
    if (state.carrito.length === 0) {
      toast('Tu carrito está vacío', 'error');
      return;
    }
    const mensaje = state.carrito
      .map((i) => `${i.nombre} x${i.cantidad} - ${formatoMoneda(i.precio * i.cantidad)}`)
      .join('\n');
    const total = state.carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
    const texto = encodeURIComponent(`Hola, quiero ordenar:\n${mensaje}\nTotal: ${formatoMoneda(total)}`);
    window.open(`https://wa.me/59170000000?text=${texto}`, '_blank');
  }

  // MODALES
  function abrirModal(id) {
    const modal = qs(id);
    if (!modal) return;
    modal.classList.add('visible');
    document.body.classList.add('modal-abierto');
  }

  function cerrarModal(id) {
    const modal = qs(id);
    if (!modal) return;
    modal.classList.remove('visible');
    document.body.classList.remove('modal-abierto');
  }

  function abrirGrooming(citaId) {
    const cita = state.citas.find((c) => c.id === citaId);
    if (!cita) return;
    qs('groomingCitaId').value = cita.id;
    abrirModal('modalGrooming');
  }

  function abrirReprogramar(citaId) {
    const cita = state.citas.find((c) => c.id === citaId);
    if (!cita) return;
    qs('reprogramarCitaId').value = cita.id;
    renderSlots('reprogramarSlots', 'reprogramarSlot', cita.fecha);
    abrirModal('modalReprogramar');
  }

  function setupModales() {
    document.querySelectorAll('[data-modal-close]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        if (modal?.id) cerrarModal(modal.id);
      });
    });
  }

  // HOOKS DE UI
  function setupListeners() {
    qs('filtroAgendaFecha')?.addEventListener('change', renderAgenda);
    qs('filtroAgendaGroomer')?.addEventListener('change', renderAgenda);
    qs('filtroGroomingEstado')?.addEventListener('change', renderGrooming);
    qs('filtroCategoria')?.addEventListener('change', () => {
      renderCatalogo();
      renderInventario();
    });
    qs('filtroDisponibilidad')?.addEventListener('change', renderCatalogo);
    qs('busquedaCliente')?.addEventListener('input', renderClientes);
    qs('filtroTipoMascota')?.addEventListener('change', renderClientes);
    qs('btnToggleCarrito')?.addEventListener('click', toggleCarrito);
    qs('btnEnviarWhatsApp')?.addEventListener('click', enviarWhatsApp);
    qs('btnGenerarFactura')?.addEventListener('click', () => abrirModal('modalFactura'));
    qs('btnNuevoProducto')?.addEventListener('click', () => toast('Función en desarrollo'));
    qs('btnReabastecer')?.addEventListener('click', () => toast('Registrar compra no implementado aún'));
    qs('btnAbrirGaleria')?.addEventListener('click', () => toast('Galería no implementada aún'));
    qs('btnExportarHistorial')?.addEventListener('click', () => toast('Exportación CSV pronto disponible'));
    qs('btnCerrarSesion')?.addEventListener('click', () => toast('Sesión cerrada (demo)'));
    setupTabs();
    setupNavbarToggle();
  }

  function renderAll() {
    renderKPIs();
    renderAgenda();
    renderOcupacionSemanal();
    renderGrooming();
    renderCatalogo();
    renderInventario();
    renderClientes();
    renderReportes();
    renderNotificaciones();
    renderFacturas();
    renderGroomers();
    actualizarCarrito();
  }

  function init() {
    DOM.nombreUsuario = qs('nombreUsuario');
    if (DOM.nombreUsuario) DOM.nombreUsuario.textContent = 'Recepción Spa';
    poblarCombos();
    escucharFormularios();
    setupModales();
    setupListeners();
    renderAll();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
