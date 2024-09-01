# Info de la materia: ST0263 - Topicos Especiales en Telematica
#
# Estudiante(s): Vanessa Alexandra Velez Restrepo - vavelezr@eafit.edu.co  <br>  Luis Miguel Giraldo Gonzalez - lmgiraldo4@eafit.edu.co
#
# Profesor: Alvaro Enrique Ospina Sanjuan - aeospinas@eafit.edu.co
#
# Arquitectura P2P no estructurada y Comunicación entre procesos mediante API REST, RPC y MOM
![Supernodo 3010 (1)](https://github.com/user-attachments/assets/272f4894-37e9-458d-a5dd-752bdf9d6540)

# 1. Descripción de la actividad

Este proyecto implementa un sistema P2P (Peer-to-Peer) donde cada nodo o peer actúa como un microservicio capaz de compartir archivos en una red distribuida y descentralizada. El sistema está diseñado utilizando una red P2P no estructurada, donde los peers pueden conectarse entre sí y registrar, buscar, subir y descargar archivos simulados. Se utilizan tecnologías como gRPC, REST para la comunicación entre procesos y la gestión de los microservicios.

## 1.1. Que aspectos cumplió o desarrolló de la actividad propuesta por el profesor (requerimientos funcionales y no funcionales)
### Requerimientos Funcionales
1. **Red P2P no estructurada**:
   - Implementamos una red P2P basada en superpeers y nodos regulares. Los superpeers se encargan de registrar y sincronizar la información de los archivos en la red, mientras que los nodos regulares interactúan con estos superpeers para registrar y buscar archivos.
   
2. **Microservicios**:
   - Cada nodo en la red actúa como un microservicio, con capacidades tanto de servidor (para responder a solicitudes de otros nodos) como de cliente (para realizar solicitudes a otros nodos).
     
3. **Comunicación RPC**:
   - Utilizamos gRPC para implementar la comunicación RPC entre los nodos. Esto permite que los nodos interactúen de manera eficiente al realizar operaciones de búsqueda, registro, subida y descarga de archivos simulados.

4. **Simulación de Transferencia de Archivos**:
   - Implementamos servicios DUMMY para la simulación de la carga y descarga de archivos, cumpliendo con el requerimiento de no realizar una transferencia real, pero permitiendo simular estas operaciones en la red.

5. **Configuración Dinámica**:
   - Cada peer lee su configuración desde un archivo `.env`, que define parámetros como la IP y puerto, el directorio de archivos, y los superpeers conocidos en la red.

### Requerimientos No Funcionales
1. **Concurrencia**:
   - Los microservicios soportan concurrencia, permitiendo que múltiples procesos remotos se comuniquen con un nodo de manera simultánea.

2. **Disponibilidad**:
   - Desplegar los nodos en múltiples zonas de disponibilidad para evitar puntos únicos de fallo y mejorar la resiliencia del sistema.
     
3. **Rendimiento**:
   - El sistema debe manejar múltiples solicitudes simultáneas sin un impacto significativo en el rendimiento.
     
4.**Seguridad**:
   -Garantizar que los datos no sean alterados durante la transmisión entre nodos.   

5.**Mantenibilidad**
   -La configuración de los nodos debe ser fácilmente ajustable y manejable.

6.**Costos**
   -El sistema debe ser diseñado para minimizar el uso de recursos y costos operativos, especialmente en entornos en la nube

## 1.2. Que aspectos NO cumplió o desarrolló de la actividad propuesta por el profesor (requerimientos funcionales y no funcionales)
   -Se priorizó la efectividad y rapidez en la transmisión de mensajes en la red, por lo que no se implementó MOM. Esta decisión se tomó para evitar la latencia adicional que introduce MOM al almacenar los mensajes en una cola antes de enviarlos, asegurando así que las comunicaciones entre nodos sean directas y en tiempo real.


# 2. Información general de diseño de alto nivel, arquitectura, patrones, mejores prácticas utilizadas.
El proyecto está diseñado con una arquitectura distribuida basada en una red P2P (Peer-to-Peer) no estructurada. Cada nodo en la red puede actuar como servidor y cliente, interactuando entre sí para compartir y sincronizar archivos de manera descentralizada. La red se apoya en superpeers, que tienen la responsabilidad de gestionar y sincronizar la información de archivos entre los nodos conectados. Estos superpeers están implementados utilizando **Express.js** para manejar solicitudes HTTP através de API rest, lo que incluye operaciones de registro, sincronización y búsqueda de archivos. Esta arquitectura permite mantener la consistencia en la red al propagar la información a los otros superpeers

Los nodos regulares utilizan **gRPC** para la comunicación RPC, lo que les permite registrar archivos en los superpeers, buscar archivos en la red y simular la transferencia de archivos. gRPC facilita una comunicación eficiente entre los componentes de la red, soportando múltiples tipos de datos y llamadas simultáneas. Además, los nodos actúan tanto como servidores, respondiendo a solicitudes RPC de otros nodos, como clientes, iniciando estas solicitudes.

El diseño modular del sistema permite una clara separación de responsabilidades entre los diferentes componentes. Los supernodos y los nodos regulares tienen funciones definidas en archivos y servicios separados, lo que facilita el mantenimiento y la escalabilidad del sistema. Las configuraciones críticas del sistema, como IP, puertos y rutas de archivos, se manejan a través de variables de entorno almacenadas en archivos `.env`. Este enfoque no solo asegura una mayor flexibilidad en la configuración del sistema, sino que también evita la inclusión de valores sensibles directamente en el código fuente.

# 3. Descripción del ambiente de desarrollo y técnico: lenguaje de programación, librerias, paquetes, etc, con sus numeros de versiones.

El proyecto está desarrollado utilizando **Node.js**
- **Node.js**: v18.16.0
- **npm**: v9.5.1 (Administrador de paquetes para instalar dependencias)

Las principales librerías y paquetes utilizados en el proyecto son:

- **gRPC** (`@grpc/grpc-js`): v1.8.13
- **Protobuf Loader** (`@grpc/proto-loader`): v0.6.11
- **Express.js** (`express`): v4.18.2 (Utilizado para implementar los supernodos)
- **dotenv** (`dotenv`): v16.0.3 (Para la gestión de variables de entorno)
- **Axios** (`axios`): v1.4.0 (Cliente HTTP para la comunicación entre nodos y supernodos)

## Detalles del desarrollo y tecnicos.

El desarrollo del proyecto se centró en crear un sistema distribuido que permita la compartición de archivos a través de una red P2P. El enfoque principal fue asegurar que cada nodo pueda actuar tanto como servidor como cliente, utilizando superpeers para gestionar la información centralizada de archivos. Las funciones clave como registrar, buscar, subir y descargar archivos fueron implementadas utilizando gRPC y Express.js para garantizar la eficiencia y la escalabilidad del sistema.

## Descripción y como se configura los parámetros del proyecto (ej: ip, puertos, conexión a bases de datos, variables de ambiente, parámetros, etc)
PATH_PROTO=./protos/file.proto      # Ruta al archivo .proto utilizado por gRPC<br>
REMOTE_HOST=54.225.93.41:5051         # Dirección y puerto del nodo remoto al que se conecta el cliente<br>
HOST=0.0.0.0:5051                  # IP y puerto en los que el servidor escucha<br>
SUPER_NODES=50.16.112.214:3010,34.234.178.153:3020<br>


## 

# 4. Descripción del ambiente de EJECUCIÓN (en producción) lenguaje de programación, librerias, paquetes, etc, con sus numeros de versiones.

# IP o nombres de dominio en nube o en la máquina servidor.
Supernodo con puerto 3010: 50.16.112.214<br>
Supernodo con puerto 3020: 34.234.178.153<br>
Server gRPC con puerto 5051: 54.225.93.41<br>
Server Cliente-Server con puerto 80: 3.95.142.226<br>

## Descripción y como se configura los parámetros del proyecto (ej: ip, puertos, conexión a bases de datos, variables de ambiente, parámetros, etc)
Los parametros del proyecto se configuraron con 4 instancias las cuales están detalladas en el literal anterior. 

## Como se lanza el servidor.
Para lanzar los servidores en cada instancia mediante docker seguimos los siguientes comandos<br>
sudo apt-get update <br>
sudo apt-get install -y docker-ce docker-ce-cli containerd.io <br>
git clone "enlace de este repositorio"<br>
cd vavelezr-st0263<br>
Creamos el .env , Dockerfile , docker-compose.yml (Ya con sus IP correspondientes)<br>
sudo docker image build -t nombreimagen .<br>
sudo docker container run -d --name nombre-contenedor -p numPuerto:numPuerto nombre-imagen<br>
sudo docker-compose up<br>

Debe estar mostrando una imagen como la siguiente (para los puertos 3010-3020)<br>
![Captura de pantalla 2024-08-31 163402](https://github.com/user-attachments/assets/dbac3bad-8005-4784-a983-02893f4699ff)


## Una mini guia de como un usuario utilizaría el software o la aplicación
1. Inicializamos las 4 instancias mediante Ec2 en AWS<br>
2. Nos paramos en las 4 instancias en la carpeta madre del proyecto "vavelezr-st0263"<br>
3. Corremos el siguiente comando "sudo docker compose up" donde el contenedor creado en esa instancia arranca con su servicio, por favor arrancarlo en el siguiente orden.<br>
   -Supernodo 3010<br>
   -Supernodo 3020<br>
   -Servidor gRPC 5051<br>
   -Cliente-Server con puerto 80<br>
      
5. Para detener la instancia solo basta con ejecutar control+c<br>

## Pantallazos (Opcionales)
![Captura de pantalla 2024-08-31 162043](https://github.com/user-attachments/assets/4b8999df-5d51-4f11-9e88-eb456624e49c)
![Captura de pantalla 2024-08-31 162505](https://github.com/user-attachments/assets/aee9b908-4c0a-4015-8ae7-38b34228ab94)
![Captura de pantalla 2024-08-30 212824](https://github.com/user-attachments/assets/a14a9026-c6bf-4cec-8b54-5c9f233cc1fc)
![Captura de pantalla 2024-08-31 164003](https://github.com/user-attachments/assets/948c8768-aed8-486e-b469-12656b2d5493)


# Referencias:

## [Superpeers ](https://www.fiorano.com/assets/pdf/whitepaper/superpeer.pdf)
## [Superpeers](https://www.geeksforgeeks.org/super-nodes-in-peer-to-peer-networks/)
## [P2P no estructurada](https://link.springer.com/referenceworkentry/10.1007/978-1-4614-6439-3_7035)


