# 🌐 Simulador de Tráfico de Red

Un simulador interactivo de redes que permite visualizar cómo los paquetes viajan a través de routers y hosts según tablas de ruteo configurables.

![Network Simulator Demo](https://img.shields.io/badge/React-18.2.0-blue) ![Vite](https://img.shields.io/badge/Vite-4.3.9-purple) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Características

- 🔵 **Routers** y 🟢 **Hosts** arrastrables
- 📋 **Tablas de ruteo configurables** por cada nodo
- 📦 **Visualización en tiempo real** del tráfico de paquetes
- 📊 **Estadísticas** de paquetes enviados, entregados y perdidos
- 🎨 **Interfaz intuitiva** con diseño moderno
- ⚡ **Simulación dinámica** de enrutamiento

## 🚀 Demo en Vivo

👉 [Ver Demo](https://traficored.netlify.app)

## 🎮 Cómo Usar

1. **Añadir Nodos**: Crea routers (azul) o hosts (verde) con los botones del panel
2. **Organizar Topología**: Arrastra los nodos para posicionarlos
3. **Configurar Rutas**: 
   - Haz clic en un nodo para seleccionarlo
   - Define su tabla de ruteo indicando el siguiente salto para cada destino
4. **Enviar Paquetes**: 
   - Selecciona origen y destino
   - Observa cómo el paquete viaja según las reglas configuradas
5. **Monitorear**: Revisa las estadísticas de tráfico

### 🎨 Código de Colores

- 🔵 **Azul**: Routers
- 🟢 **Verde**: Hosts
- 🟠 **Naranja**: Paquete en tránsito
- 🟢 **Verde claro**: Paquete entregado
- 🔴 **Rojo**: Paquete perdido (sin ruta válida)

## 🛠️ Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/TU-USUARIO/network-simulator.git
cd network-simulator

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

## 📦 Tecnologías

- **React** 18.2.0 - Framework UI
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Estilos
- **Lucide React** - Iconos
- **SVG** - Visualización de la red

## 🏗️ Estructura del Proyecto

```
network-simulator/
├── src/
│   ├── App.jsx          # Componente principal del simulador
│   └── main.jsx         # Punto de entrada
├── index.html           # HTML base
├── vite.config.js       # Configuración de Vite
├── package.json         # Dependencias
└── README.md           # Este archivo
```

## 🎯 Conceptos de Redes Implementados

- **Enrutamiento estático**: Tablas de ruteo configurables manualmente
- **Forwarding de paquetes**: Simulación de cómo un router decide el siguiente salto
- **Topología de red**: Representación visual de nodos y enlaces
- **Pérdida de paquetes**: Cuando no existe ruta hacia el destino

## 🔮 Roadmap / Ideas Futuras

- [ ] Algoritmo de enrutamiento dinámico (Dijkstra, Bellman-Ford)
- [ ] Métricas de latencia y ancho de banda en los enlaces
- [ ] Cola de paquetes en routers
- [ ] Diferentes protocolos de ruteo (RIP, OSPF)
- [ ] Exportar/importar topologías
- [ ] Modo oscuro/claro
- [ ] Animaciones más suaves
- [ ] Logs de eventos de red

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar el simulador:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Bella Moreno Eugenio** - [GitHub](https://github.com/CGH4153)

---

⭐ Si te gustó el proyecto, ¡dale una estrella en GitHub!

## 📸 Screenshots

### Vista Principal
*Captura de la interfaz principal mostrando routers y hosts conectados*

### Configuración de Ruteo
*Panel de control para configurar tablas de ruteo*

### Paquetes en Tránsito
*Visualización de paquetes viajando por la red*

---

**Hecho con ❤️ y React**
