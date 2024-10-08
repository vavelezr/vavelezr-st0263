const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

let archivos = {}; // Diccionario donde las llaves son los nombres de archivos y los valores son las URLs de los nodos
let supernodos = ['localhost:3010']; // Lista de otros supernodos en la red
let ultimoHashSync = '';

// Función para calcular un hash simple de un objeto
function calcularHash(obj) {
    return JSON.stringify(obj);
}

// Registrar archivos en el supernodo
app.post('/register', (req, res) => {
    const { archivos: archivosNuevos, url } = req.body;
    archivosNuevos.forEach(archivo => {
        archivos[archivo] = url;
    });

    console.log("Archivos registrados: ", archivos);

    // Sincronizar con otros supernodos
    supernodos.forEach(supernodo => {
        if (supernodo !== req.hostname + ':' + req.socket.localPort) {
            axios.post(`http://${supernodo}/sync`, { archivos: archivosNuevos, url })
                .catch(err => console.error(`Error sincronizando con supernodo ${supernodo}:`, err.message));
        }
    });

    res.status(200).send('Archivos registrados en el supernodo.');
});

// Sincronización entre supernodos - propaga esta información a otros superpeers en la red
app.post('/sync', (req, res) => {
    const { archivos: archivosNuevos, url } = req.body;
    const nuevoHashSync = calcularHash(archivosNuevos);

    if (nuevoHashSync === ultimoHashSync) {
        console.log('Sin cambios desde la última sincronización, no se necesita propagación.');
        return res.status(200).send('Sincronización completa, sin cambios.');
    }

    archivosNuevos.forEach(archivo => {
        archivos[archivo] = url;
    });
    ultimoHashSync = nuevoHashSync;

    console.log(`Archivos sincronizados desde ${url}:`, archivosNuevos);

    // Propagar la sincronización a otros supernodos, si no son el origen
    supernodos.forEach(supernodo => {
        if (supernodo !== req.hostname + ':' + req.socket.localPort && supernodo !== url) {
            axios.post(`http://${supernodo}/sync`, { archivos: archivosNuevos, url })
                .catch(err => console.error(`Error propagando sincronización a supernodo ${supernodo}:`, err.message));
        }
    });

    res.status(200).send('Sincronización completa.');
});

// Buscar archivo en el supernodo - Extendido
app.get('/buscar', async (req, res) => {
    const { nombre } = req.query;

    if (archivos[nombre]) {
        return res.status(200).send({ url: archivos[nombre] });
    }

    // Si el archivo no está aquí, buscar en otros supernodos
    for (let supernodo of supernodos) {
        try {
            const response = await axios.get(`http://${supernodo}/buscar`, { params: { nombre } });
            if (response.data.url) {
                return res.status(200).send(response.data);
            }
        } catch (err) {
            console.error(`Error buscando en supernodo ${supernodo}:`, err.message);
        }
    }

    res.status(404).send('Archivo no encontrado.');
});

// Simula la subida de archivos al nodo
app.post('/upload', (req, res) => {
    const { nombre, url } = req.body;
    archivos[nombre] = url;
    console.log(`Archivo subido: ${nombre} en la URL: ${url}`);
    res.status(200).send(`Archivo ${nombre} subido exitosamente.`);
});

// Simula la descarga de archivos desde el nodo
app.get('/download', (req, res) => {
    const { nombre } = req.query;
    
    if (archivos[nombre]) {
        console.log(`Archivo descargado: ${nombre} desde la URL: ${archivos[nombre]}`);
        res.status(200).send(`Descarga simulada del archivo ${nombre} desde la URL: ${archivos[nombre]}`);
    } else {
        res.status(404).send('Archivo no encontrado.');
    }
});

app.listen(3010, () => {
    console.log('Supernodo escuchando en el puerto 3010');
});
