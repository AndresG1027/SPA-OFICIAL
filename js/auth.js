/* ═══════════════════════════════════════════════════════════════════════════
   🐾 PET SPA BOUTIQUE - Sistema de Autenticación Premium
   Características: Validaciones, Bloqueo de cuenta, Toast, SVG icons
   ═══════════════════════════════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════════════════════════════════
// 👁️ ICONOS SVG PARA EL OJO (Ver/Ocultar contraseña)
// ═══════════════════════════════════════════════════════════════════════════

const SVG_OJO_CERRADO = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
</svg>`;

const SVG_OJO_ABIERTO = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
</svg>`;

// ═══════════════════════════════════════════════════════════════════════════
// 🔔 SISTEMA DE NOTIFICACIONES TOAST
// ═══════════════════════════════════════════════════════════════════════════

const Toast = {
    container: null,

    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    },

    show(message, type = 'info', duration = 4000) {
        this.init();
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: '🐾'
        };

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span style="font-size: 18px;">${icons[type]}</span>
            <span>${message}</span>
        `;

        this.container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    success(msg) { this.show(msg, 'success'); },
    error(msg) { this.show(msg, 'error'); },
    warning(msg) { this.show(msg, 'warning'); },
    info(msg) { this.show(msg, 'info'); }
};

// ═══════════════════════════════════════════════════════════════════════════
// ✅ VALIDADORES CON EXPRESIONES REGULARES
// ═══════════════════════════════════════════════════════════════════════════

const Validar = {
    // Solo letras y espacios (incluye acentos español)
    nombre: {
        regex: /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]{2,50}$/,
        mensaje: 'Solo letras y espacios (2-50 caracteres)'
    },

    // Email estándar
    correo: {
        regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        mensaje: 'Ingresa un correo válido'
    },

    // Teléfono 7-12 dígitos
    celular: {
        regex: /^[0-9]{7,12}$/,
        mensaje: 'Entre 7 y 12 dígitos'
    },

    // Password fuerte
    clave: {
        regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/,
        mensaje: 'Mayúscula, minúscula, número y símbolo (mín. 6)'
    },

    // Función para validar
    verificar(tipo, valor) {
        const v = this[tipo];
        if (!v) return { valido: true };
        return {
            valido: v.regex.test(valor),
            mensaje: v.mensaje
        };
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// 👁️ FUNCIÓN MOSTRAR/OCULTAR CONTRASEÑA
// ═══════════════════════════════════════════════════════════════════════════

function mostrarOcultarPass(idInput) {
    const input = document.getElementById(idInput);
    if (!input) return;

    const wrapper = input.parentElement;
    const iconoSpan = wrapper.querySelector('.icono-ojo');

    if (input.type === 'password') {
        input.type = 'text';
        iconoSpan.innerHTML = SVG_OJO_ABIERTO;
    } else {
        input.type = 'password';
        iconoSpan.innerHTML = SVG_OJO_CERRADO;
    }
}

// Alias para compatibilidad
function togglePassword(idInput) {
    mostrarOcultarPass(idInput);
}

// ═══════════════════════════════════════════════════════════════════════════
// 💾 FUNCIONES DE ALMACENAMIENTO
// ═══════════════════════════════════════════════════════════════════════════

const Storage = {
    guardar(key, value) {
        localStorage.setItem('petspa_' + key, value);
    },

    obtener(key, defaultValue = null) {
        return localStorage.getItem('petspa_' + key) || defaultValue;
    },

    // Compatibilidad con formato antiguo
    guardarUsuario(datos) {
        // Formato nuevo
        this.guardar('nombre', datos.nombre);
        this.guardar('correo', datos.correo);
        this.guardar('celular', datos.celular);
        this.guardar('clave', datos.clave);
        this.guardar('intentos', '0');
        this.guardar('bloqueado', 'no');

        // Formato antiguo (compatibilidad)
        localStorage.setItem('usr_nombre', datos.nombre);
        localStorage.setItem('usr_correo', datos.correo);
        localStorage.setItem('usr_celular', datos.celular);
        localStorage.setItem('usr_clave', datos.clave);
        localStorage.setItem('usr_intentos', '0');
        localStorage.setItem('usr_bloqueado', 'no');
    },

    obtenerUsuario() {
        return {
            nombre: this.obtener('nombre') || localStorage.getItem('usr_nombre'),
            correo: this.obtener('correo') || localStorage.getItem('usr_correo'),
            celular: this.obtener('celular') || localStorage.getItem('usr_celular'),
            clave: this.obtener('clave') || localStorage.getItem('usr_clave'),
            intentos: parseInt(this.obtener('intentos') || localStorage.getItem('usr_intentos') || '0'),
            bloqueado: (this.obtener('bloqueado') || localStorage.getItem('usr_bloqueado')) === 'si'
        };
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// 🎨 FUNCIONES DE UI
// ═══════════════════════════════════════════════════════════════════════════

function mostrarMensaje(idElemento, texto, tipo) {
    const el = document.getElementById(idElemento);
    if (!el) return;

    el.textContent = texto;
    el.className = 'mensaje ' + tipo;
    el.style.display = 'block';
}

function mostrarAviso(idElemento, texto, color) {
    const tipo = color === '#238636' || color === 'green' ? 'exito' : 'error';
    mostrarMensaje(idElemento, texto, tipo);
}

function animarError(idInput) {
    const input = document.getElementById(idInput);
    if (!input) return;

    input.style.animation = 'shake 0.5s ease';
    input.style.borderColor = '#D4736A';

    setTimeout(() => {
        input.style.animation = '';
        input.style.borderColor = '';
    }, 500);
}

// ═══════════════════════════════════════════════════════════════════════════
// 📝 REGISTRO DE USUARIO
// ═══════════════════════════════════════════════════════════════════════════

function registrarUsuario(e) {
    e.preventDefault();

    const nombre = document.getElementById('reg-nombre').value.trim();
    const correo = document.getElementById('reg-correo').value.trim();
    const celular = document.getElementById('reg-celular').value.trim();
    const clave = document.getElementById('reg-pass').value;

    // Validar nombre
    const vNombre = Validar.verificar('nombre', nombre);
    if (!vNombre.valido) {
        Toast.error(vNombre.mensaje);
        animarError('reg-nombre');
        return;
    }

    // Validar correo
    const vCorreo = Validar.verificar('correo', correo);
    if (!vCorreo.valido) {
        Toast.error(vCorreo.mensaje);
        animarError('reg-correo');
        return;
    }

    // Validar celular
    const vCelular = Validar.verificar('celular', celular);
    if (!vCelular.valido) {
        Toast.error(vCelular.mensaje);
        animarError('reg-celular');
        return;
    }

    // Validar clave
    const vClave = Validar.verificar('clave', clave);
    if (!vClave.valido) {
        Toast.error(vClave.mensaje);
        animarError('reg-pass');
        return;
    }

    // Guardar usuario
    Storage.guardarUsuario({ nombre, correo, celular, clave });

    Toast.success('¡Cuenta creada exitosamente!');
    mostrarMensaje('msg-reg', '✓ Cuenta creada. Redirigiendo...', 'exito');

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// ═══════════════════════════════════════════════════════════════════════════
// 🔐 INICIO DE SESIÓN
// ═══════════════════════════════════════════════════════════════════════════

function iniciarSesion(e) {
    e.preventDefault();

    const correo = document.getElementById('log-correo').value.trim();
    const clave = document.getElementById('log-pass').value;
    const usuario = Storage.obtenerUsuario();

    // Verificar si existe usuario registrado
    if (!usuario.correo) {
        Toast.warning('No tienes cuenta registrada');
        mostrarMensaje('msg-log', '⚠️ Usuario no encontrado. ¡Regístrate primero!', 'error');
        return;
    }

    // Verificar si el correo coincide con el registrado
    if (correo !== usuario.correo) {
        Toast.warning('Este correo no está registrado');
        mostrarMensaje('msg-log', '⚠️ Usuario inexistente. ¿Deseas registrarte?', 'error');
        return;
    }

    // Verificar bloqueo
    if (usuario.bloqueado) {
        Toast.error('Cuenta bloqueada por seguridad');
        mostrarMensaje('msg-log', '🔒 Cuenta bloqueada. Recupera tu contraseña.', 'error');
        document.getElementById('enlace-recuperar').style.display = 'block';
        return;
    }

    // Verificar clave
    if (clave === usuario.clave) {
        // Login exitoso
        Storage.guardar('intentos', '0');
        localStorage.setItem('usr_intentos', '0');
        
        // Guardar sesión activa
        Storage.guardar('sesion_activa', 'si');
        localStorage.setItem('petspa_sesion', 'activa');

        Toast.success(`¡Bienvenido, ${usuario.nombre}!`);
        mostrarMensaje('msg-log', '✓ Acceso concedido', 'exito');

        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);

    } else {
        // Clave incorrecta
        let intentos = usuario.intentos + 1;
        Storage.guardar('intentos', intentos.toString());
        localStorage.setItem('usr_intentos', intentos.toString());

        if (intentos >= 3) {
            Storage.guardar('bloqueado', 'si');
            localStorage.setItem('usr_bloqueado', 'si');

            Toast.error('Cuenta bloqueada por seguridad');
            mostrarMensaje('msg-log', '🔒 Bloqueado por 3 intentos fallidos', 'error');
            document.getElementById('enlace-recuperar').style.display = 'block';

        } else {
            const restantes = 3 - intentos;
            Toast.warning(`Contraseña incorrecta. ${restantes} intento(s) restante(s)`);
            mostrarMensaje('msg-log', `Intento ${intentos} de 3`, 'warning');
            animarError('log-pass');
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🔓 RECUPERACIÓN DE CONTRASEÑA
// ═══════════════════════════════════════════════════════════════════════════

function recuperarClave(e) {
    e.preventDefault();

    const correo = document.getElementById('rec-correo').value.trim();
    const nuevaClave = document.getElementById('rec-pass').value;
    const usuario = Storage.obtenerUsuario();

    // Verificar correo
    if (correo !== usuario.correo) {
        Toast.error('El correo no coincide');
        animarError('rec-correo');
        return;
    }

    // Validar nueva clave
    const vClave = Validar.verificar('clave', nuevaClave);
    if (!vClave.valido) {
        Toast.error(vClave.mensaje);
        animarError('rec-pass');
        return;
    }

    // Actualizar clave y desbloquear
    Storage.guardar('clave', nuevaClave);
    Storage.guardar('bloqueado', 'no');
    Storage.guardar('intentos', '0');

    localStorage.setItem('usr_clave', nuevaClave);
    localStorage.setItem('usr_bloqueado', 'no');
    localStorage.setItem('usr_intentos', '0');

    Toast.success('¡Contraseña actualizada!');
    mostrarMensaje('msg-rec', '✓ Contraseña actualizada. Redirigiendo...', 'exito');

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// ═══════════════════════════════════════════════════════════════════════════
// 🚀 INICIALIZACIÓN
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    console.log('🐾 Pet Spa Boutique - Auth System Loaded');

    // Agregar efectos focus a los inputs
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('focus', () => {
            input.closest('.grupo-input')?.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            input.closest('.grupo-input')?.classList.remove('focused');
        });
    });
});
