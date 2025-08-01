# Sistema de Gestión para Ferretería
## Arquitectura MVC - Java Backend + React Frontend

### Estructura del Proyecto:
\`\`\`
ferreteria-system/
├── backend/                    # Java Spring Boot
│   ├── src/main/java/com/ferreteria/
│   │   ├── controller/         # Controladores REST
│   │   ├── service/           # Lógica de negocio
│   │   ├── model/             # Modelos/DTOs
│   │   ├── repository/        # Repositorios mock
│   │   └── config/            # Configuraciones
│   └── pom.xml
├── frontend/                   # React Application
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   ├── pages/            # Páginas por módulo
│   │   ├── services/         # Servicios API
│   │   ├── utils/            # Utilidades
│   │   └── styles/           # Estilos CSS
│   └── package.json
└── README.md
\`\`\`

### Módulos Implementados:
- ✅ Gestión de Productos (CRUD completo)
- ✅ Gestión de Ventas
- ✅ Gestión de Clientes
- ✅ Sistema de Usuarios
- ✅ Reportes básicos
- ✅ Alertas de stock

### Tecnologías:
- Backend: Java 17, Spring Boot 3.x, Maven
- Frontend: React 18, React Router, Axios
- Estilos: Tailwind CSS
- Datos: Mock en memoria (sin base de datos)
