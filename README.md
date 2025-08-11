# BarXP 🍺🎮

Una aplicación de gamificación para el consumo responsable de bebidas alcohólicas.

## 🎯 Concepto

BarXP convierte el consumo de bebidas en una experiencia gamificada y responsable, donde los usuarios pueden:
- Ganar niveles y logros
- Competir con amigos
- Mantener un consumo responsable
- Descubrir nuevas bebidas

## 🎮 Elementos de Gamificación

### Sistema de Niveles
- **Principiante**: 0-10 bebidas diferentes
- **Aficionado**: 11-25 bebidas diferentes
- **Conocedor**: 26-50 bebidas diferentes
- **Experto**: 51-100 bebidas diferentes
- **Maestro Cervecero**: 100+ bebidas diferentes

### Logros/Badges
- 🍺 "Primera cerveza"
- 🍷 "Conocedor de vinos"
- 🌟 "Noche épica"
- 💪 "Sobreviviente del fin de semana"
- 🌍 "Explorador mundial" (bebidas de diferentes países)
- 🎯 "Precisión perfecta" (mantener límites por una semana)

### Estadísticas Divertidas
- Gráficos de consumo semanal/mensual
- Bebida favorita del mes
- Día más "productivo"
- Racha de días responsables

### Modo Grupo
- Competir con amigos en salidas
- Ver quién prueba más variedades
- Desafíos grupales
- Leaderboards amistosos

## 🛡️ Características Responsables

- **Límites diarios sugeridos** con alertas graciosas
- **Recordatorios de hidratación**: "¿Ya tomaste agua, campeón?"
- **Calculadora de tiempo para estar sobrio**
- **Botón de emergencia**: Llamar taxi/Uber integrado
- **Tips de seguridad** disfrazados de "consejos pro"
- **Modo pausa**: Descanso automático después de límites

## 🎯 Características Principales

- **Catálogo de bebidas** con fotos y descripciones
- **Timer de consumo** inteligente
- **Modo "salida con amigos"** vs **"relax en casa"**
- **Historias/anécdotas** divertidas
- **Recomendaciones de maridajes**
- **Calculadora de "nivel de diversión"**

## 🚀 Stack Tecnológico

- **Frontend**: React + TypeScript + Tailwind CSS + PWA
- **Backend**: Node.js + Express + TypeScript
- **Base de datos**: MongoDB
- **Autenticación**: Google OAuth 2.0
- **Calendario**: Google Calendar API
- **Deployment**: Vercel (Frontend) + Railway (Backend)

## 📱 Características de la App (PWA Móvil)

- **PWA completa** (Progressive Web App)
- **Instalable** en dispositivos móviles
- **Autenticación con Google** obligatoria
- **Notificaciones push** para eventos y recordatorios
- **Modo offline** para funciones básicas
- **Interfaz móvil nativa** optimizada

## 🔐 Sistema de Autenticación

- **Registro e inicio de sesión con Google** (obligatorio)
- **Perfil de usuario** sincronizado con Google
- **Gestión de sesiones** segura
- **Integración con Google Calendar**

## 👥 Sistema de Grupos

- **Crear grupos** para competir con amigos
- **Invitar amigos** por email o código
- **Leaderboards grupales** en tiempo real
- **Desafíos grupales** semanales/mensuales
- **Chat grupal** básico para coordinación

## ⭐ Sistema de Leveleo Detallado

### Niveles y Experiencia
- **Nivel inicial**: 1
- **Nivel máximo**: 999
- **Puntos para nivel 2**: 500 XP
- **Fórmula de progresión**: Cada nivel requiere 1.75x más puntos que el anterior

### Ejemplos de Progresión
- **Nivel 1 → 2**: 500 XP
- **Nivel 2 → 3**: 875 XP (total: 1,375 XP)
- **Nivel 3 → 4**: 1,531 XP (total: 2,906 XP)
- **Nivel 4 → 5**: 2,679 XP (total: 5,585 XP)

### Sistema de Puntos por Bebida
- **Cerveza ligera** (3-4% alcohol): 10-15 XP
- **Cerveza regular** (4-6% alcohol): 15-25 XP
- **Cerveza fuerte/artesanal** (6-8% alcohol): 25-35 XP
- **Vino tinto/blanco** (11-13% alcohol): 30-40 XP
- **Licores suaves** (15-25% alcohol): 40-60 XP
- **Licores fuertes** (25-40% alcohol): 60-80 XP
- **Licores premium/complejos** (40%+ alcohol): 80-100 XP

### Multiplicadores de XP
- **Primera vez probando**: +50% XP
- **Bebida rara/exótica**: +25% XP
- **En evento grupal**: +20% XP
- **Maridaje perfecto**: +15% XP

## 📅 Sistema de Eventos

- **Agendar salidas** con amigos del grupo
- **Integración con Google Calendar** automática
- **Recordatorios** antes del evento
- **Check-in grupal** durante el evento
- **Resumen post-evento** con estadísticas

## 🎯 Funcionalidades Específicas PWA

- **Instalación desde navegador** (Add to Home Screen)
- **Splash screen** personalizada
- **Iconos adaptativos** para diferentes dispositivos
- **Funcionamiento offline** para consultar historial
- **Sincronización automática** al recuperar conexión
- **Notificaciones push** nativas

---

*Recuerda: BarXP promueve el consumo responsable y la diversión segura. Siempre bebe con moderación.* 🍻