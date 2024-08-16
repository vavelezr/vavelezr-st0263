const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

let archivos = {}; // Diccionario donde las llaves son los nombres de archivos y los valores son las URLs de los nodos
let supernodos = ['localhost:3010']; // Lista de otros supernodos en la red

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

// Sincronización entre supernodos
app.post('/sync', (req, res) => {
    const { archivos: archivosNuevos, url } = req.body;
    archivosNuevos.forEach(archivo => {
        archivos[archivo] = url;
    });
    console.log(`Archivos sincronizados desde ${url}:`, archivosNuevos);
    res.status(200).send('Sincronización completa.');
});

// Buscar archivo en el supernodo
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
            // No enviamos respuesta aquí; continuamos con el siguiente supernodo
        }
    }

    // Si ningún supernodo lo tiene
    res.status(404).send('Archivo no encontrado.');
});

app.listen(3020, () => {
    console.log('Supernodo escuchando en el puerto 3020');
});