// --- 1. GESTIÓN DE AUTENTICACIÓN Y LOCALSTORAGE ---
const seccionAuth = document.getElementById("seccion-auth");
const seccionPanel = document.getElementById("seccion-panel");
const formLoginContainer = document.getElementById("form-login-container");
const formRegistroContainer = document.getElementById("form-registro-container");
const formRecuperarContainer = document.getElementById("form-recuperar-container");
const mensajeAuth = document.getElementById("mensaje-auth");

const formLogin = document.getElementById("form-login");
const formRegistro = document.getElementById("form-registro");
const formRecuperar = document.getElementById("form-recuperar");
const btnLogout = document.getElementById("btn-logout");
const usuarioActivoSpan = document.getElementById("usuario-activo");
const btnSubmitLogin = document.getElementById("btn-submit-login");

function verificarSesion() {
    const usuarioLogueado = localStorage.getItem("usuarioLogueado");
    if (usuarioLogueado) {
        seccionAuth.classList.add("oculto");
        seccionPanel.classList.remove("oculto");
        usuarioActivoSpan.textContent = "Operador: " + usuarioLogueado;
        cargarDatosGuardados();
    } else {
        seccionAuth.classList.remove("oculto");
        seccionPanel.classList.add("oculto");
        verificarBloqueoLogin();
    }
}

function mostrarVistaAuth(vista) {
    formLoginContainer.classList.add("oculto");
    formRegistroContainer.classList.add("oculto");
    formRecuperarContainer.classList.add("oculto");
    mensajeAuth.textContent = "";

    if (vista === "login") formLoginContainer.classList.remove("oculto");
    else if (vista === "registro") formRegistroContainer.classList.remove("oculto");
    else if (vista === "recuperar") formRecuperarContainer.classList.remove("oculto");
}

// Validación de 4 intentos fallidos en Login
function verificarBloqueoLogin() {
    let intentos = parseInt(localStorage.getItem("intentosFallidosLogin")) || debeDesbloquearTiempo();
    if (intentos >= 4) {
        btnSubmitLogin.disabled = true;
        btnSubmitLogin.style.backgroundColor = "#95a5a6";
        mensajeAuth.textContent = "⚠️ Sistema bloqueado temporalmente por 4 intentos fallidos.";
    } else {
        btnSubmitLogin.disabled = false;
        btnSubmitLogin.style.backgroundColor = "";
    }
}

function debeDesbloquearTiempo() {
    return parseInt(localStorage.getItem("intentosFallidosLogin")) || 0;
}

formRegistro.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = document.getElementById("reg-user").value.trim();
    const pass = document.getElementById("reg-pass").value.trim();

    // REGLA: Mínimo 8 caracteres
    if (pass.length < 8) {
        mensajeAuth.textContent = "Error: La contraseña debe tener al menos 8 caracteres.";
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuariosTeleferico")) || [];
    if (usuarios.some(u => u.user === user)) {
        mensajeAuth.textContent = "Error: El usuario ya existe.";
        return;
    }

    usuarios.push({ user, pass });
    localStorage.setItem("usuariosTeleferico", JSON.stringify(usuarios));
    alert("Cuenta creada con éxito. Inicie sesión.");
    formRegistro.reset();
    mostrarVistaAuth("login");
});

formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    let intentos = parseInt(localStorage.getItem("intentosFallidosLogin")) || 0;

    if (intentos >= 4) {
        mensajeAuth.textContent = "Acceso denegado: Demasiados intentos fallidos.";
        return;
    }

    const user = document.getElementById("login-user").value.trim();
    const pass = document.getElementById("login-pass").value.trim();
    let usuarios = JSON.parse(localStorage.getItem("usuariosTeleferico")) || [];
    const encontrado = usuarios.find(u => u.user === user && u.pass === pass);

    if (encontrado || (user === "admin" && pass === "1234")) {
        localStorage.setItem("intentosFallidosLogin", "0"); // Reiniciar contador en éxito
        localStorage.setItem("usuarioLogueado", user);
        formLogin.reset();
        verificarSesion();
    } else {
        intentos++;
        localStorage.setItem("intentosFallidosLogin", intentos);
        const restantes = 4 - intentos;
        if (intentos >= 4) {
            mensajeAuth.textContent = "⚠️ Límite alcanzado. Sistema bloqueado por 4 intentos incorrectos.";
            btnSubmitLogin.disabled = true;
            btnSubmitLogin.style.backgroundColor = "#95a5a6";
        } else {
            mensajeAuth.textContent = `Error: Usuario o contraseña incorrectos. Te quedan ${restantes} intentos.`;
        }
    }
});

formRecuperar.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = document.getElementById("rec-user").value.trim();
    const nuevaPass = document.getElementById("rec-nueva-pass").value.trim();

    // REGLA: Mínimo 8 caracteres en recuperación
    if (nuevaPass.length < 8) {
        mensajeAuth.textContent = "Error: La nueva contraseña debe tener al menos 8 caracteres.";
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuariosTeleferico")) || [];
    const index = usuarios.findIndex(u => u.user === user);

    if (index !== -1) {
        usuarios[index].pass = nuevaPass;
        localStorage.setItem("usuariosTeleferico", JSON.stringify(usuarios));
        alert("Contraseña restablecida con éxito.");
        formRecuperar.reset();
        mostrarVistaAuth("login");
    } else {
        mensajeAuth.textContent = "Error: El usuario no existe.";
    }
});

btnLogout.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogueado");
    verificarSesion();
});

function cargarDatosGuardados() {
    mostrarHistorialDetencion();
    mostrarMantenimiento();
    mostrarHistorialViento();
    mostrarSensores();
}


// --- 2. MÓDULO 1: DETENCIÓN DE EMERGENCIA ---
const formDetencion = document.getElementById("form-detencion");
const resultadoDetencion = document.getElementById("resultado-detencion");
const listaHistorialDetencion = document.getElementById("lista-historial-detencion");

function mostrarHistorialDetencion() {
    listaHistorialDetencion.innerHTML = "";
    let historial = JSON.parse(localStorage.getItem("historialDetencion")) || [];
    historial.forEach(item => {
        const fila = document.createElement("tr");
        fila.innerHTML = `<td>${item.vel} km/h</td><td>${item.tiempo}s</td><td>${item.dist}m</td><td>${item.estado}</td>`;
        listaHistorialDetencion.appendChild(fila);
    });
}

formDetencion.addEventListener("submit", (e) => {
    e.preventDefault();
    const velocidad = parseFloat(document.getElementById("velocidad").value);
    const tiempo = parseFloat(document.getElementById("tiempo").value);

    if (isNaN(velocidad) || isNaN(tiempo) || velocidad <= 0 || tiempo <= 0) {
        resultadoDetencion.className = "caja-resultado alerta-roja";
        resultadoDetencion.textContent = "Error: Ingrese valores numéricos mayores a cero.";
        return;
    }

    const distancia = (velocidad / 3.6) * tiempo;
    let estadoTexto = distancia > 50 ? "ALERTA: Supera los 50m" : "Normal";
    
    resultadoDetencion.className = distancia > 50 ? "caja-resultado alerta-roja" : "caja-resultado alerta-verde";
    resultadoDetencion.textContent = `Distancia recorrida: ${distancia.toFixed(2)} m. ${estadoTexto}`;

    let historial = JSON.parse(localStorage.getItem("historialDetencion")) || [];
    historial.unshift({ vel: velocidad, tiempo: tiempo, dist: distancia.toFixed(2), estado: estadoTexto });
    localStorage.setItem("historialDetencion", JSON.stringify(historial));
    mostrarHistorialDetencion();
});


// --- 3. MÓDULO 2: CONTROL DE MANTENIMIENTO ---
const formMantenimiento = document.getElementById("form-mantenimiento");
const tablaMantenimiento = document.getElementById("tabla-mantenimiento");
const mensajeMantenimiento = document.getElementById("mensaje-mantenimiento");

function mostrarMantenimiento() {
    tablaMantenimiento.innerHTML = "";
    let lista = JSON.parse(localStorage.getItem("listaMantenimiento")) || [];
    lista.forEach((item, index) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${item.componente}</td>
            <td>${item.horas} hrs</td>
            <td>${item.estado}</td>
            <td><button class='btn-eliminar' onclick='eliminarMantenimiento(${index})'>Eliminar</button></td>
        `;
        tablaMantenimiento.appendChild(fila);
    });
}

formMantenimiento.addEventListener("submit", (e) => {
    e.preventDefault();
    const componente = document.getElementById("componente").value.trim();
    const horas = Number(document.getElementById("horas").value);
    const estado = document.getElementById("estado").value;

    if (componente === "" || isNaN(horas) || horas < 0) {
        mensajeMantenimiento.textContent = "Error: Complete los campos correctamente.";
        return;
    }

    let lista = JSON.parse(localStorage.getItem("listaMantenimiento")) || [];
    lista.push({ componente, horas, estado });
    localStorage.setItem("listaMantenimiento", JSON.stringify(lista));
    formMantenimiento.reset();
    mensajeMantenimiento.textContent = "Registro agregado con éxito.";
    mostrarMantenimiento();
});

window.eliminarMantenimiento = function(indice) {
    let lista = JSON.parse(localStorage.getItem("listaMantenimiento")) || [];
    lista.splice(indice, 1);
    localStorage.setItem("listaMantenimiento", JSON.stringify(lista));
    mostrarMantenimiento();
};


// --- 4. MÓDULO 3: VIENTO Y OSCILACIÓN ---
const formViento = document.getElementById("form-viento");
const resultadoViento = document.getElementById("resultado-viento");
const tablaViento = document.getElementById("tabla-viento");

function mostrarHistorialViento() {
    tablaViento.innerHTML = "";
    let lista = JSON.parse(localStorage.getItem("listaVientos")) || [];
    lista.forEach((item, index) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>#${index + 1}</td>
            <td>${item.promedio} km/h</td>
            <td>${item.maximo} km/h</td>
            <td>${item.clasificacion}</td>
            <td><button class='btn-eliminar' onclick='eliminarViento(${index})'>Eliminar</button></td>
        `;
        tablaViento.appendChild(fila);
    });
}

formViento.addEventListener("submit", (e) => {
    e.preventDefault();
    const mediciones = [
        parseFloat(document.getElementById("viento1").value),
        parseFloat(document.getElementById("viento2").value),
        parseFloat(document.getElementById("viento3").value),
        parseFloat(document.getElementById("viento4").value),
        parseFloat(document.getElementById("viento5").value)
    ];

    let suma = 0;
    let maximo = mediciones[0];
    for (let i = 0; i < mediciones.length; i++) {
        if (isNaN(mediciones[i]) || mediciones[i] < 0) {
            resultadoViento.className = "caja-resultado alerta-roja";
            resultadoViento.textContent = "Error: Ingrese valores válidos de viento.";
            return;
        }
        suma += mediciones[i];
        if (mediciones[i] > maximo) maximo = mediciones[i];
    }

    const promedio = suma / mediciones.length;
    let clasificacion = promedio < 25 ? "Viento Leve (Estable)" : promedio <= 45 ? "Viento Moderado (Precaución)" : "Viento Fuerte (Alerta)";
    let claseAlerta = promedio < 25 ? "alerta-verde" : promedio <= 45 ? "alerta-info" : "alerta-roja";

    resultadoViento.className = "caja-resultado " + claseAlerta;
    resultadoViento.textContent = `Promedio: ${promedio.toFixed(2)} km/h | Máximo: ${maximo} km/h | ${clasificacion}`;

    let lista = JSON.parse(localStorage.getItem("listaVientos")) || [];
    lista.push({ promedio: promedio.toFixed(2), maximo, clasificacion });
    localStorage.setItem("listaVientos", JSON.stringify(lista));
    mostrarHistorialViento();
});

window.eliminarViento = function(indice) {
    let lista = JSON.parse(localStorage.getItem("listaVientos")) || [];
    lista.splice(indice, 1);
    localStorage.setItem("listaVientos", JSON.stringify(lista));
    mostrarHistorialViento();
};


// --- 5. MÓDULO 4: MONITOREO DE SENSORES ---
const formSensores = document.getElementById("form-sensores");
const errorSensor = document.getElementById("error-sensor");
const tablaSensores = document.getElementById("tabla-sensores");

function mostrarSensores() {
    tablaSensores.innerHTML = "";
    let lista = JSON.parse(localStorage.getItem("listaSensores")) || [];
    lista.forEach((sensor, index) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${sensor.codigo}</td>
            <td>${sensor.tipo}</td>
            <td>${sensor.lectura}</td>
            <td><button class='btn-eliminar' onclick='eliminarSensor(${index})'>Eliminar</button></td>
        `;
        tablaSensores.appendChild(fila);
    });
}

formSensores.addEventListener("submit", (e) => {
    e.preventDefault();
    const codigo = document.getElementById("codigo-sensor").value.trim();
    const tipo = document.getElementById("tipo-sensor").value;
    const lecturaTexto = document.getElementById("lectura-sensor").value.trim();
    const patronCodigo = /^SEN-\d{3}$/;

    if (codigo === "" || lecturaTexto === "") {
        errorSensor.textContent = "Error: Todos los campos son obligatorios.";
        return;
    }
    if (!patronCodigo.test(codigo)) {
        errorSensor.textContent = "Error: El código debe tener el formato exacto SEN-001.";
        return;
    }
    const lecturaNumero = parseFloat(lecturaTexto);
    if (isNaN(lecturaNumero)) {
        errorSensor.textContent = "Error: La lectura debe ser un valor numérico.";
        return;
    }

    errorSensor.textContent = "";
    let lista = JSON.parse(localStorage.getItem("listaSensores")) || [];
    lista.push({ codigo, tipo, lectura: lecturaNumero });
    localStorage.setItem("listaSensores", JSON.stringify(lista));
    formSensores.reset();
    mostrarSensores();
});

window.eliminarSensor = function(index) {
    let lista = JSON.parse(localStorage.getItem("listaSensores")) || [];
    lista.splice(index, 1);
    localStorage.setItem("listaSensores", JSON.stringify(lista));
    mostrarSensores();
};

// Inicializar control de sesión al cargar
verificarSesion();