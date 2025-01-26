# shared-calendar

Un calendario compartido para coordinar fechas disponibles entre varios usuarios. Este proyecto está construido con Vue 3, TypeScript y utiliza Tailwind CSS para el diseño. También se integra con una API para gestionar eventos y disponibilidades.

## Características

- Crear y gestionar eventos.
- Proponer y eliminar rangos de fechas disponibles.
- Ver fechas comunes disponibles entre varios participantes.
- Notificaciones de éxito y error mediante `vue-toastification`.

## Tecnologías Utilizadas

- **Vue 3**: Framework de JavaScript para construir interfaces de usuario.
- **TypeScript**: Un superconjunto de JavaScript que añade tipos estáticos.
- **Tailwind CSS**: Un framework CSS para un diseño rápido y eficiente.
- **Vue Router**: Para la navegación entre componentes.
- **Axios**: Para realizar peticiones HTTP a la API.
- **Day.js**: Para manipulación de fechas.
- **UUID**: Para generar identificadores únicos.
- **Vue Toastification**: Para mostrar notificaciones.

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/allydevper/shared-calendar.git
   cd shared-calendar
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno en un archivo `.env` basado en el archivo `.env.example`.

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Uso

- Accede a la aplicación en `http://localhost:3000`.
- Crea un nuevo evento desde la página de inicio.
- Añade rangos de fechas disponibles y visualiza las fechas comunes con otros participantes.

## Contribución

Si deseas contribuir a este proyecto, por favor sigue los siguientes pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -am 'Añadir nueva funcionalidad'`).
4. Sube tus cambios a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.
