const grpc = require('@grpc/grpc-js');
const cargarProtos = require('@grpc/proto-loader');
const configurador = require('dotenv');
const axios = require('axios');

configurador.config();
const PATH_PROTO = process.env.PATH_PROTO;
const HOST = process.env.HOST;
const supernodos = process.env.SUPER_NODES.split(',');

const definicionEsquema = cargarProtos.loadSync(
    PATH_PROTO,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
const esquemaServicio = grpc.loadPackageDefinition(definicionEsquema).fileservice;

let listaDeArchivos = [];

// Registrar los archivos disponibles en el servidor de directorio
function registrarArchivos() {
    const url = `localhost:5051`;
    console.log('Intentando registrar los siguientes archivos:', listaDeArchivos);
    
    supernodos.forEach((supernodo) => {
        axios.post(`http://${supernodo}/register`, {
            archivos: listaDeArchivos,
            url
        }).then(() => {
            console.log(`Archivos registrados en el supernodo: ${supernodo}`);
        }).catch(err => {
            console.error(`Error al registrar archivos en ${supernodo}:`, err.message);
        });
    });
}

function anadirArchivo(solicitud, respuesta) {
    let archivosNuevos = solicitud.request.archivos;
    archivosNuevos.forEach(archivo => {
        if (!listaDeArchivos.includes(archivo)) {
            listaDeArchivos.push(archivo);
        }
    });
    console.log("Archivos actualmente en listaDeArchivos:", listaDeArchivos);
    registrarArchivos();
    respuesta(null, {});
}

function buscarArchivo(solicitud, respuesta) {
    console.log("Solicitud de búsqueda recibida:", solicitud.request.nombre);
    console.log("Lista actual de archivos en el peer:", listaDeArchivos);

    let posicionArchivo = listaDeArchivos.indexOf(solicitud.request.nombre);
    if (posicionArchivo !== -1) {
        let archivoEncontrado = listaDeArchivos[posicionArchivo];
        console.log("Archivo encontrado en el peer:", archivoEncontrado);
        respuesta(null, { nombre: archivoEncontrado, enlace: 'www.DESCARGA.com' });
    } else {
        console.log("Archivo NO encontrado en el peer.");
        respuesta(null, { nombre: null });
    }
}

function subirArchivo(solicitud, respuesta) {
    const nombreArchivo = solicitud.request.nombre || "archivo no definido";
    console.log(`Simulando subida de archivo: ${nombreArchivo}`);
    respuesta(null, { mensaje: 'Subida de archivo simulada correctamente' });
}

function descargarArchivo(solicitud, respuesta) {
    const nombreArchivo = solicitud.request.nombre || "archivo no definido";
    console.log(`Simulando descarga de archivo: ${nombreArchivo}`);
    respuesta(null, { mensaje: 'Descarga de archivo simulada correctamente' });
}

// Función para descubrir otros nodos regulares a través de un superpeer
async function descubrirNodos() {
    try {
        const response = await axios.get(`http://${supernodos[0]}/descubrir`); // Contacta el primer superpeer para obtener la lista de nodos
        return response.data.nodos || [];
    } catch (error) {
        console.error(`Error al descubrir otros nodos: ${error.message}`);
        return [];
    }
}




async function main() {
    const nodosConocidos = await descubrirNodos();
    
    if (nodosConocidos.length > 0) {
        console.log('Nodos conocidos:', nodosConocidos);
        // Aquí puedes implementar lógica adicional para conectarte a estos nodos directamente
    } else {
        console.log('No se descubrieron nodos adicionales.');
    }
    const servidorRPC = new grpc.Server();
    servidorRPC.addService(esquemaServicio.FileService.service, {
        anadirArchivo,
        buscarArchivo,
        subirArchivo,
        descargarArchivo
    });

    servidorRPC.bindAsync(HOST, grpc.ServerCredentials.createInsecure(), (error, puerto) => {
        if (error != null) {
            return console.error(error);
        }
        console.log(`Servidor RPC escuchando en el puerto ${puerto}`);

        registrarArchivos();
    });
}

main();