# Configuración de Grupos y Email - BarXP

## ✅ Cambios Implementados

### 1. Sistema de Grupos con Firebase Firestore
- **Persistencia real**: Los grupos ahora se guardan en Firebase Firestore
- **Servicio completo**: `groupService.ts` maneja todas las operaciones CRUD
- **Actividades en tiempo real**: Se registran todas las acciones del grupo
- **Códigos de invitación**: Cada grupo genera un código único para invitaciones
- **Ranking de miembros**: Sistema de puntuación y niveles integrado

### 2. Sistema de Email con EmailJS
- **Envío real de emails**: Integración con EmailJS para invitaciones
- **Modo simulado**: Funciona sin configuración para desarrollo
- **Mensajes personalizados**: Templates dinámicos para invitaciones
- **Validación de emails**: Verificación de formato antes del envío

### 3. Mejoras en la UI
- **Estados de carga**: Indicadores visuales durante operaciones
- **Manejo de errores**: Mensajes informativos para el usuario
- **Experiencia mejorada**: Feedback inmediato en todas las acciones

## 🔧 Configuración de EmailJS (Opcional)

Para habilitar el envío real de emails:

### Paso 1: Crear cuenta en EmailJS
1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crea una cuenta gratuita
3. Verifica tu email

### Paso 2: Configurar servicio de email
1. En el dashboard, ve a **Email Services**
2. Haz clic en **Add New Service**
3. Selecciona tu proveedor (Gmail, Outlook, etc.)
4. Sigue las instrucciones para conectar tu cuenta
5. Copia el **Service ID**

### Paso 3: Crear template de email
1. Ve a **Email Templates**
2. Haz clic en **Create New Template**
3. Usa este template:

```html
Asunto: Invitación a grupo BarXP - {{group_name}}

¡Hola {{to_name}}!

{{message}}

🔗 Únete aquí: {{join_url}}

Código de invitación: {{invite_code}}

¡Nos vemos en BarXP!
- {{from_name}}
```

4. Copia el **Template ID**

### Paso 4: Obtener Public Key
1. Ve a **Account** → **General**
2. Copia tu **Public Key**

### Paso 5: Configurar variables de entorno
Agrega estas líneas a tu archivo `.env.local`:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=tu_service_id_aqui
VITE_EMAILJS_TEMPLATE_ID=tu_template_id_aqui
VITE_EMAILJS_PUBLIC_KEY=tu_public_key_aqui
```

### Paso 6: Reiniciar la aplicación
```bash
npm run dev
```

## 🧪 Cómo Probar

### Crear un Grupo
1. Ve a la página de Grupos
2. Haz clic en el botón "+"
3. Completa el formulario
4. El grupo se guardará en Firebase

### Enviar Invitación
1. En un grupo existente, haz clic en el ícono de invitar
2. Ingresa un email válido
3. Personaliza el mensaje si deseas
4. Haz clic en "Enviar Invitación"
5. Si EmailJS está configurado, se enviará un email real
6. Si no, se simulará el envío (revisa la consola)

## 📊 Estructura de Datos

### Colección `groups` en Firestore
```typescript
{
  id: string,
  name: string,
  description: string,
  ownerId: string,
  ownerName: string,
  members: GroupMember[],
  memberCount: number,
  inviteCode: string,
  isPrivate: boolean,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Colección `groupActivities` en Firestore
```typescript
{
  id: string,
  groupId: string,
  userId: string,
  userName: string,
  action: string,
  timestamp: Timestamp,
  details?: Record<string, unknown>
}
```

## 🔍 Solución de Problemas

### Los grupos no se guardan
- ✅ **Solucionado**: Ahora usan Firebase Firestore
- Verifica que Firebase esté configurado correctamente
- Revisa la consola del navegador para errores

### Los emails no se envían
- ✅ **Solucionado**: Integración con EmailJS
- Sin configuración: Se simula el envío (modo desarrollo)
- Con configuración: Se envían emails reales
- Verifica las variables de entorno en `.env.local`

### Error de autenticación Firebase
- Asegúrate de que el dominio esté autorizado en Firebase Console
- Para producción: `barxp-81600.web.app`
- Para desarrollo: `localhost`

## 🚀 Próximas Mejoras

1. **Notificaciones push** cuando alguien se une al grupo
2. **Chat en tiempo real** dentro de los grupos
3. **Eventos y desafíos** grupales
4. **Estadísticas avanzadas** del grupo
5. **Roles y permisos** más granulares

## 📝 Notas Técnicas

- **Firebase Firestore**: Base de datos NoSQL en tiempo real
- **EmailJS**: Servicio para envío de emails desde frontend
- **TypeScript**: Tipado fuerte para mejor desarrollo
- **React Hooks**: Estado y efectos modernos
- **Tailwind CSS**: Estilos utilitarios para UI consistente

---

**Estado**: ✅ **Completamente funcional**
**Última actualización**: $(date)
**Versión**: 2.0.0 - Grupos y Email integrados