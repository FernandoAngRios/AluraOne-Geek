let productosData = [];

function mostrarProductos() {
    const listaProductos = document.getElementById('lista-productos');
    if (!listaProductos) {
        console.error('Elemento lista-productos no encontrado en el DOM.');
        return;
    }

    listaProductos.innerHTML = '';

    productosData.forEach(producto => {
        const nuevoProducto = document.createElement('li');

        nuevoProducto.innerHTML = `
            <div class="productos__campo">
                <img class="producto__img" src="${producto.url}" alt="imagen de productos">
                <h2 class="producto__nombre">${producto.name}</h2>
                <div class="producto__precioIcon">
                    <p class="producto__precio">$ ${producto.precio}</p>
                    <img class="icon" src="/img/icon.png" alt="" data-id="${producto.id}">
                </div>
            </div>
        `;

        listaProductos.appendChild(nuevoProducto);

        const iconoEliminar = nuevoProducto.querySelector('.icon');
        iconoEliminar.addEventListener('click', function() {
            const idProducto = parseInt(iconoEliminar.getAttribute('data-id'));
            eliminarProducto(idProducto);
        });
    });
}

async function cargarProductos() {
    try {
        const response = await fetch('db.json');
        if (!response.ok) {
            throw new Error('No se pudo cargar la base de datos de productos.');
        }
        productosData = await response.json();
        mostrarProductos();
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

document.addEventListener('DOMContentLoaded', cargarProductos);

const formulario = document.getElementById('formulario');
formulario.addEventListener('submit', async function(event) {
    event.preventDefault();

    const nombre = document.getElementById('name-Productos').value;
    const precio = document.getElementById('precio-Productos').value;
    const urlImagen = document.getElementById('url-Productos').value;

    if (!formulario.checkValidity()) {
        mostrarErrores();
        return;
    }

    const nuevoProducto = {
        id: productosData.length + 1,
        name: nombre,
        precio: `${precio}`,
        url: urlImagen
    };

    productosData.push(nuevoProducto);
    mostrarProductos();
    formulario.reset();
});

function mostrarErrores() {
    const campos = ['name-Productos', 'precio-Productos', 'url-Productos'];

    campos.forEach(campo => {
        const input = document.getElementById(campo);
        const error = input.nextElementSibling;

        if (!input.validity.valid) {
            tiposError.forEach(tipo => {
                if (input.validity[tipo]) {
                    error.textContent = mensajes[campo][tipo];
                }
            });
        } else {
            error.textContent = '';
        }
    });
}

function eliminarProducto(id) {
    productosData = productosData.filter(producto => producto.id !== id);
    mostrarProductos();
}
