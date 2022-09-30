fetch("productos.csv")
    .then(function (res) {
        return res.text();
    })
    .then(function (data) {
        cargaArray(data);
    });

let arrayProductos = [];

function cargaArray(data) {
    let filas = data.split(/\r?\n|\r/);
    for (let i = 0; i < filas.length; i++) {
        let celdasFila = filas[i].split(";");

        const PRODUCTO = construccionObjetoProducto(celdasFila);

        // console.log("PRODUCTO: ", PRODUCTO);

        arrayProductos[i] = PRODUCTO;

        //console.log(`arrayProductos[${i}]: ${arrayProductos[i]}`);
    }
    // console.log(arrayProductos);
    muestraProductos();
}

function construccionObjetoProducto(celdasFila) {
    const PRODUCTO = {
        rubro: "",
        producto: "",
        precio: 0,
    };

    PRODUCTO.rubro = celdasFila[0];
    PRODUCTO.producto = celdasFila[1];
    PRODUCTO.precio = celdasFila[2];

    return PRODUCTO;
}

function muestraProductos() {
    console.log(arrayProductos);
    let template = ``,
        Subtotal = 0,
        Total = 0,
        rubroLeyenda;
    for (let r = 0; r < arrayProductos.length; r++) {
        console.log(arrayProductos[r].rubro);
        switch (arrayProductos[r].rubro) {
            case "1":
                rubroLeyenda = "Carnes";
                break;
            case "2":
                rubroLeyenda = "Lácteos";
                break;
            case "3":
                rubroLeyenda = "Almacén";
                break;
            case "4":
                rubroLeyenda = "Enlatados";
                break;
            default:
                rubroLeyenda = "Sin rubro";
                break;
        }
        template += `<li>`;
        template += `<input readonly tabindex="-1" class="rubro" value="${rubroLeyenda}">`;
        template += `<input readonly tabindex="-1" class="producto" value="${arrayProductos[r].producto}">`;
        template += `<input readonly tabindex="-1" type="number" class="precio" value=${arrayProductos[r].precio}>`;

        template += `<input class="cantidad" id="c${r}" autocomplete="off" onchange="calcula(c${r},${r})">`;
        template += `<input readonly tabindex="-1" class="total" id="t${r}" value=0.00>`;
        template += `</li>`;
    }
    document.querySelector(".productos").innerHTML = template;

    document.querySelector("#c0").focus();
}

function calcula(elemento, r) {
    console.log(elemento);
    console.log(
        "Entré en calcula, con cantidad: ",
        elemento.value,
        ", fila r: ",
        r
    );
    //ASIGNO CANTIDAD DEL ITEM A VARIABLE CANTIDAD
    let cantidad = Number(elemento.value);
    console.log("cantidad: ", cantidad);
    //CARGO EL TOTAL EXISTENTE EN LA INTERFAZ EN VARIABLE TOTAL
    let importeItem = document.querySelector(`#t${r}`);
    importeItem = Number(importeItem.value);
    //CARGO EN VARIABLE SUBTOT EL SUBTOTAL DE TODA LA LISTA DE PRODUCTOS DE LA INTERFAZ
    let subtot = Number(document.querySelector("#subtot").value);
    console.log("subtot: ", subtot);
    //LE RESTO AL SUBTOT EL IMPORTE DEL ITEM QUE FIGURABA EN LA INTERFAZ
    subtot -= importeItem;
    console.log("subtot despues de restar: ", subtot, "type: ", typeof subtot);
    //EVALÚO SI AL PRODUCTO LE CORRESPONDE DESCUENTO
    let descuentoRubro = 0;
    if (arrayProductos[r].rubro === "1") {
        descuentoRubro = 0.25;
    } else if (arrayProductos[r].rubro === "2") {
        descuentoRubro = 0.5;
    } else if (arrayProductos[r].rubro === "4") {
        descuentoRubro = 0.7;
    }
    //ESTABLEZCO EL IMPORTE DE DESCUENTO, CORRESPONDA O NO
    let importeDescuento = (importeItem * descuentoRubro).toFixed(2);
    //TOMO EL VALOR DEL TOTAL DE DESCUENTOS DE LA INTERFAZ Y LE DESUCENTO EL IMPORTE CALCULADO
    let descuentos = Number(document.querySelector("#desc").value);
    descuentos -= importeDescuento;
    document.querySelector("#desc").value = descuentos;

    //OBTENGO EL NUEVO IMPORTE BASADO EN LA CANTIDAD RECIBIDA
    importeItem = (cantidad * arrayProductos[r].precio).toFixed(2);
    //ACTUALIZO EL SUBTOT CON EL NUEVO IMPORTE
    subtot += Number(importeItem);
    subtot = subtot.toFixed(2);
    console.log("subtot despues de sumar: ", subtot, "type: ", typeof subtot);
    //MUESTRO EL SUBTOT EN LA INTERFAZ
    document.querySelector("#subtot").value = subtot;
    //MUESTRO EL IMPORTE DEL ITEM EN LA LINEA DEL PRODUCTO
    document.querySelector(`#t${r}`).value = importeItem;

    //ESTABLEZCO EL DESCUENTO DEL NUEVO IMPORTE Y LO SUMO A DESCUENTOS
    importeDescuento = (importeItem * descuentoRubro).toFixed(2);
    descuentos += Number(importeDescuento);
    descuentos = descuentos.toFixed(2);
    document.querySelector("#desc").value = descuentos;

    //COMPUTO EL TOTAL
    let total = subtot - descuentos;
    document.querySelector("#tot").value = total.toFixed(2);
}


//FUNCIÓN PARA PASAR DE INPUTS CON ENTER
document.addEventListener("keypress", function (evt) {
    // Si el evento NO es una tecla Enter
    if (evt.key !== "Enter") {
        return;
    }
    //Tomo el elemento completo, donce hice enter
    let element = evt.target;
    // AQUI logica para encontrar el siguiente
    var next = element.id;
    console.log(next);
    //Tomo del nombre del id desde el segundo caracter con substring para sumarle uno
    let valor = next.substring(1);
    valor++;
    //si me paso de ids lo vuelvo a cero, para ir al primero
    if (valor >= arrayProductos.length) valor = 0;
    next = `#c${valor}`;
    console.log(next);
    //hago foco
    document.querySelector(`${next}`).focus();
});
