let clientes = [];
let creditos = [];

let tasaInteres = 15;
let clienteSeleccionado = null;
let cuotaCalculada = 0;
let montoCalculado = 0;
let plazoCalculado = 0;
let creditoAprobado = false;

// NAVEGACIÓN ENTRE SECCIONES
function ocultarSecciones() {
    let secciones = document.querySelectorAll("section");
    for(let i = 0; i < secciones.length; i++) {
        secciones[i].classList.remove("activa");
    }
}

function mostrarSeccion(id) {
    ocultarSecciones();
    document.getElementById(id).classList.add("activa");
}

// CONFIGURAR TASA
function guardarTasa() {
    let tasaIngresada = recuperarFloat("tasaInteres");
    
    if (tasaIngresada >= 10 && tasaIngresada <= 20) {
        tasaInteres = tasaIngresada;
        mostrarTexto("mensajeTasa", "Tasa configurada correctamente: " + tasaInteres + "%");
    } else {
        mostrarTexto("mensajeTasa", "La tasa debe estar entre 10% y 20%");
    }
}

// ADMINISTRACIÓN DE CLIENTES
function guardarCliente() {
    // Obtener datos del formulario y convertirlos usando utilitarios
    let cedula = recuperaraTexto("txtCedula");
    let nombre = recuperaraTexto("txtNombre");
    let apellido = recuperaraTexto("txtApellido");
    let ingresos = recuperarFloat("txtIngresos");
    let egresos = recuperarFloat("txtEgresos");

    // Lógica para Actualizar o Crear
    let clienteExistente = buscarCliente(cedula);

    if (clienteExistente == null) {
        // Crear nuevo objeto y agregarlo al arreglo
        let nuevoCliente = {
            cedula: cedula,
            nombre: nombre,
            apellido: apellido,
            ingresos: ingresos,
            egresos: egresos
        };
        clientes.push(nuevoCliente);
    } else {
        // Actualizar cliente
        clienteExistente.nombre = nombre;
        clienteExistente.apellido = apellido;
        clienteExistente.ingresos = ingresos;
        clienteExistente.egresos = egresos;
    }

    // Repintar la tabla y limpiar
    pintarClientes();
    limpiar();
}

function pintarClientes() {
    let tbody = document.getElementById("tablaClientes");
    let filas = "";
    
    // Recorrer el arreglo
    for (let i = 0; i < clientes.length; i++) {
        let c = clientes[i];
        
        // Uso de strings anidados tal cual como en el ejemplo proporcionado
        filas += "<tr>";
        filas += "<td>" + c.cedula + "</td>";
        filas += "<td>" + c.nombre + "</td>";
        filas += "<td>" + c.apellido + "</td>";
        filas += "<td>" + c.ingresos + "</td>";
        filas += "<td>" + c.egresos + "</td>";
        filas += "<td><button onclick=\"seleccionarCliente('" + c.cedula + "')\">Actualizar</button></td>";
        filas += "</tr>";
    }
    
    tbody.innerHTML = filas;
}

function buscarCliente(cedula) {
    for (let i = 0; i < clientes.length; i++) {
        if (clientes[i].cedula === cedula) {
            return clientes[i]; // Retorna el cliente si existe
        }
    }
    return null; // Retorna null si no existe
}

function seleccionarCliente(cedula) {
    // Buscar y guardar en la variable global
    clienteSeleccionado = buscarCliente(cedula);
    
    if (clienteSeleccionado != null) {
        // Mostrar datos en los inputs para actualizar
        mostrarTextoEnCaja("txtCedula", clienteSeleccionado.cedula);
        mostrarTextoEnCaja("txtNombre", clienteSeleccionado.nombre);
        mostrarTextoEnCaja("txtApellido", clienteSeleccionado.apellido);
        mostrarTextoEnCaja("txtIngresos", clienteSeleccionado.ingresos);
        mostrarTextoEnCaja("txtEgresos", clienteSeleccionado.egresos);
    }
}

function limpiar() {
    mostrarTextoEnCaja("txtCedula", "");
    mostrarTextoEnCaja("txtNombre", "");
    mostrarTextoEnCaja("txtApellido", "");
    mostrarTextoEnCaja("txtIngresos", "");
    mostrarTextoEnCaja("txtEgresos", "");
    clienteSeleccionado = null;
}

// SOLICITAR CRÉDITO
function buscarClienteCredito() {
    // Tomar el valor ingresado en el campo de cédula
    let cedula = recuperaraTexto("buscarCedulaCredito");
    
    // Buscar al cliente
    clienteSeleccionado = buscarCliente(cedula);

    let divDatos = document.getElementById("datosClienteCredito");

    // Mostrar datos si existe
    if (clienteSeleccionado != null) {
        divDatos.innerHTML = 
            "<h3>Datos del Cliente</h3>" +
            "<p><strong>Cédula:</strong> " + clienteSeleccionado.cedula + "</p>" +
            "<p><strong>Nombre:</strong> " + clienteSeleccionado.nombre + "</p>" +
            "<p><strong>Apellido:</strong> " + clienteSeleccionado.apellido + "</p>" +
            "<p><strong>Ingresos:</strong> " + clienteSeleccionado.ingresos + "</p>" +
            "<p><strong>Egresos:</strong> " + clienteSeleccionado.egresos + "</p>";
    } else {
        divDatos.innerHTML = "Cliente no encontrado.";
    }
}

function calcularCredito() {
    if (clienteSeleccionado == null) {
        alert("Primero debe buscar y seleccionar un cliente.");
        return;
    }

    // Recuperar valores del formulario
    montoCalculado = recuperarFloat("montoCredito");
    plazoCalculado = recuperarInt("plazoCredito");

    let capacidadPago = clienteSeleccionado.ingresos - clienteSeleccionado.egresos;

    // Cálculo del Total a Pagar y Cuota Mensual
    let interesTotal = montoCalculado * (tasaInteres / 100) * (plazoCalculado / 12);
    let totalAPagar = montoCalculado + interesTotal;
    cuotaCalculada = totalAPagar / plazoCalculado;

    let divResultado = document.getElementById("resultadoCredito");
    let estadoCredito = "";

    // Validar si la cuota supera la capacidad de pago
    if (cuotaCalculada <= capacidadPago) {
        estadoCredito = "APROBADO";
        creditoAprobado = true;
        document.getElementById("btnSolicitarCredito").disabled = false;
        // Aplicar estilos según el resultado
        divResultado.className = "aprobado"; 
    } else {
        estadoCredito = "RECHAZADO";
        creditoAprobado = false;
        document.getElementById("btnSolicitarCredito").disabled = true;
        // Aplicar estilos según el resultado
        divResultado.className = "rechazado";
    }

    // Mostrar el resultado del crédito
    divResultado.innerHTML = 
        "Capacidad de pago: " + capacidadPago.toFixed(2) + "<br>" +
        "Total a pagar: " + totalAPagar.toFixed(2) + "<br>" +
        "Cuota mensual: " + cuotaCalculada.toFixed(2) + "<br>" +
        "RESULTADO: " + estadoCredito;
}