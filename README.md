# info de la materia: ST0263 - Topicos Especiales en Telematica
#
# Estudiante(s): 
Vanessa Alexandra Velez Restrepo - vavelezr@eafit.edu.co
Luis Miguel Giraldo Gonzalez - lmgiraldo4@eafit.edu.co
#
# Profesor: Alvaro Enrique Ospina Sanjuan - aeospinas@eafit.edu.co
#
# Arquitectura P2P y Comunicación entre procesos mediante API REST, RPC y MOM
#
# 1. Descripción de la actividad
#
Este proyecto implementa un sistema P2P (Peer-to-Peer) donde cada nodo o peer actúa como un microservicio capaz de compartir archivos en una red distribuida y descentralizada. El sistema está diseñado utilizando una red P2P estructurada, donde los peers pueden conectarse entre sí y registrar, buscar, subir y descargar archivos simulados. Se utilizan tecnologías como gRPC, REST para la comunicación entre procesos y la gestión de los microservicios.

## 1.1. Que aspectos cumplió o desarrolló de la actividad propuesta por el profesor (requerimientos funcionales y no funcionales)
### Requerimientos Funcionales
1. **Red P2P Estructurada**:
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

2. **(ACTUALIZAAR!!!!)Despliegue en AWS**:
   - 


## 1.2. Que aspectos NO cumplió o desarrolló de la actividad propuesta por el profesor (requerimientos funcionales y no funcionales)



# 2. información general de diseño de alto nivel, arquitectura, patrones, mejores prácticas utilizadas.
El proyecto está diseñado con una arquitectura distribuida basada en una red P2P (Peer-to-Peer) estructurada. Cada nodo en la red puede actuar como servidor y cliente, interactuando entre sí para compartir y sincronizar archivos de manera descentralizada. La red se apoya en superpeers, que tienen la responsabilidad de gestionar y sincronizar la información de archivos entre los nodos conectados. Estos superpeers están implementados utilizando **Express.js** para manejar solicitudes HTTP, lo que incluye operaciones de registro, sincronización y búsqueda de archivos. Esta arquitectura permite mantener la consistencia en la red al propagar la información a los otros superpeers

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


## como se compila y ejecuta.
## detalles del desarrollo.
## detalles técnicos
## descripción y como se configura los parámetros del proyecto (ej: ip, puertos, conexión a bases de datos, variables de ambiente, parámetros, etc)
## opcional - detalles de la organización del código por carpetas o descripción de algún archivo. (ESTRUCTURA DE DIRECTORIOS Y ARCHIVOS IMPORTANTE DEL PROYECTO, comando 'tree' de linux)
## 
## opcionalmente - si quiere mostrar resultados o pantallazos 

# 4. Descripción del ambiente de EJECUCIÓN (en producción) lenguaje de programación, librerias, paquetes, etc, con sus numeros de versiones.

# IP o nombres de dominio en nube o en la máquina servidor.

## descripción y como se configura los parámetros del proyecto (ej: ip, puertos, conexión a bases de datos, variables de ambiente, parámetros, etc)

## como se lanza el servidor.

## una mini guia de como un usuario utilizaría el software o la aplicación

## opcionalmente - si quiere mostrar resultados o pantallazos 

# 5. otra información que considere relevante para esta actividad.

# referencias:
<debemos siempre reconocer los créditos de partes del código que reutilizaremos, así como referencias a youtube, o referencias bibliográficas utilizadas para desarrollar el proyecto o la actividad>
## sitio1-url 
## sitio2-url
## url de donde tomo info para desarrollar este proyecto
