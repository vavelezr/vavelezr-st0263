const grpc = require('@grpc/grpc-js');
const cargarProtos = require('@grpc/proto-loader');
const configurador = require('dotenv');
const axios = require('axios');

configurador.config();
const PATH_PROTO = process.env.PATH_PROTO;
const REMOTE_HOST = process.env.REMOTE_HOST;

// Carga el archivo .proto que define los datos y servicios utilizados por gRPC
const definicionEsquema = cargarProtos.loadSync(
    PATH_PROTO,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }
);
const esquemaServicio = grpc.loadPackageDefinition(definicionEsquema).fileservice; // Se convierte en objeto para manejar solicitudes

// Lista de supernodos para búsqueda inicial
const supernodos = process.env.SUPER_NODES.split(',');

// Función para buscar un archivo en los supernodos
async function buscarEnSupernodo(nombreArchivo) {
    for (const supernodo of supernodos) {
        try {
            const response = await axios.get(`http://${supernodo}/buscar`, {
                params: { nombre: nombreArchivo }
            });
            if (response.data.url) {
                return response.data.url; // Devuelve la URL del nodo que tiene el archivo
            }
        } catch (error) {
            console.error(`Error buscando en supernodo ${supernodo}:`, error.message);
        }
    }
    return null;
}

// Función para agregar archivos desde el cliente
function agregarArchivosCliente(listaArchivos) {
    const cliente = new esquemaServicio.FileService(REMOTE_HOST, grpc.credentials.createInsecure()); // Crear cliente gRPC
    cliente.anadirArchivo({ archivos: listaArchivos }, (error, respuesta) => {
        if (error) {
            return console.error(`Error al añadir archivos: ${error.message}`);
        }
        console.log('Archivos añadidos exitosamente:', listaArchivos);
    });
}

// Función para buscar y descargar un archivo directamente desde otro nodo
async function buscarYDescargarArchivo(nombreArchivo) {
    const urlPeer = await buscarEnSupernodo(nombreArchivo);
    if (!urlPeer) {
        console.log('Archivo no encontrado en ningún supernodo.');
        return;
    }

    console.log(`Archivo encontrado en el peer: ${urlPeer}`);
    const cliente = new esquemaServicio.FileService(urlPeer, grpc.credentials.createInsecure());
    cliente.descargarArchivo({ nombre: nombreArchivo }, (error, respuesta) => {
        if (error) {
            return console.error(`Error al descargar archivo desde el peer: ${error.message}`);
        }
        console.log(`Archivo descargado desde el peer: ${respuesta.mensaje}`);
    });
}

// Función para subir un archivo desde el cliente
function subirArchivoCliente(nombreArchivo) {
    const cliente = new esquemaServicio.FileService(REMOTE_HOST, grpc.credentials.createInsecure());
    cliente.subirArchivo({ nombre: nombreArchivo }, (error, respuesta) => {
        if (error) {
            return console.error(`Error al subir archivo: ${error.message}`);
        }
        console.log(respuesta.mensaje);
    });
}

// Función para descargar un archivo desde el cliente
function descargarArchivoCliente(nombreArchivo) {
    const cliente = new esquemaServicio.FileService(REMOTE_HOST, grpc.credentials.createInsecure());
    cliente.descargarArchivo({ nombre: nombreArchivo }, (error, respuesta) => {
        if (error) {
            return console.error(`Error al descargar archivo: ${error.message}`);
        }
        console.log(respuesta.mensaje);
    });
}

// Ejemplo de uso de las funciones
function main() {
    // Añade los archivos que quieres registrar
    const archivosParaAgregar = ['archivo1.txt', 'archivo2.txt'];
    agregarArchivosCliente(archivosParaAgregar);

    // Luego busca uno de esos archivos
    const archivoABuscar = 'archivo1.txt';
    buscarYDescargarArchivo(archivoABuscar);

    subirArchivoCliente('archivo3.txt'); // Simular subida de un archivo
    descargarArchivoCliente('archivo1.txt'); // Simular descarga de un archivo
}

main();
