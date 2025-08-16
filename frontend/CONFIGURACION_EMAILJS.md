# Configuración de EmailJS para Envío de Invitaciones

## 🎯 Problema Actual
Las invitaciones por email no se están enviando porque **EmailJS no está configurado**. Actualmente el sistema está en "modo simulación" y solo muestra los emails en la consola del navegador.

## ✅ Solución: Configurar EmailJS

EmailJS es un servicio gratuito que permite enviar emails directamente desde el frontend sin necesidad de un servidor backend.

### Paso 1: Crear Cuenta en EmailJS

1. **Ve a**: https://www.emailjs.com/
2. **Haz clic en "Sign Up"**
3. **Crea tu cuenta** con tu email personal
4. **Verifica tu email** (revisa spam si no llega)
5. **Inicia sesión** en tu dashboard

### Paso 2: Configurar Servicio de Email

1. **En el dashboard, ve a "Email Services"**
2. **Haz clic en "Add New Service"**
3. **Selecciona tu proveedor de email**:
   - **Gmail** (recomendado)
   - Outlook
   - Yahoo
   - Otros

#### Para Gmail:
1. **Selecciona "Gmail"**
2. **Haz clic en "Connect Account"**
3. **Autoriza EmailJS** a acceder a tu Gmail
4. **Copia el Service ID** que aparece (ejemplo: `service_abc123`)

### Paso 3: Crear Template de Email

1. **Ve a "Email Templates"**
2. **Haz clic en "Create New Template"**
3. **Configura el template así**:

**Subject (Asunto):**
```
🎯 Invitación a {{group_name}} - BarXP
```

**Content (Contenido):**
```html
¡Hola {{to_name}}!

{{message}}

🔗 Únete al grupo aquí: {{join_url}}

Código de invitación: {{invite_code}}

¡Nos vemos en BarXP! 🍻
- {{from_name}}

---
BarXP - La app que convierte cada trago en una aventura épica
```

4. **Guarda el template**
5. **Copia el Template ID** (ejemplo: `template_xyz789`)

### Paso 4: Obtener Public Key

1. **Ve a "Account" → "General"**
2. **Busca "Public Key"**
3. **Copia tu Public Key** (ejemplo: `abcdef123456`)

### Paso 5: Configurar Variables de Entorno

1. **Abre el archivo** `frontend/.env.local`
2. **Descomenta y completa estas líneas**:

```env
# Reemplaza con tus valores reales:
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=abcdef123456
```

### Paso 6: Reiniciar la Aplicación

```bash
# En la terminal, detén el servidor (Ctrl+C) y reinicia:
npm run dev
```

## 🧪 Probar el Envío de Emails

1. **Ve a la página de Grupos**: http://localhost:5173/groups
2. **Selecciona un grupo existente**
3. **Haz clic en el ícono de invitar** (👥+)
4. **Ingresa tu propio email** para probar
5. **Personaliza el mensaje** si deseas
6. **Haz clic en "Enviar Invitación"**
7. **Revisa tu bandeja de entrada** (y spam)

## 🔍 Verificar que Funciona

### En la Consola del Navegador (F12):
- ✅ **Antes**: "📧 Simulando envío de email..."
- ✅ **Después**: "✅ Email enviado exitosamente"

### En tu Email:
- ✅ **Deberías recibir** un email con el asunto "🎯 Invitación a [Nombre del Grupo] - BarXP"
- ✅ **El email debe contener** el mensaje personalizado y el código de invitación

## 🚨 Solución de Problemas

### "Email enviado exitosamente" pero no llega el email
1. **Revisa la carpeta de spam**
2. **Verifica que el email esté bien escrito**
3. **Prueba con otro email**
4. **Revisa los límites de EmailJS** (100 emails/mes gratis)

### "Error al enviar email"
1. **Verifica las variables de entorno** en `.env.local`
2. **Asegúrate de que no haya espacios** en los IDs
3. **Reinicia el servidor** después de cambiar `.env.local`
4. **Revisa la consola** para errores específicos

### "Service ID not found"
1. **Verifica que el Service ID sea correcto**
2. **Asegúrate de que el servicio esté activo** en EmailJS
3. **Revisa que hayas autorizado** tu cuenta de email

## 📊 Límites del Plan Gratuito

- ✅ **100 emails por mes** (suficiente para empezar)
- ✅ **Todos los proveedores** de email soportados
- ✅ **Templates ilimitados**
- ✅ **Sin marca de agua**

## 🎯 Ejemplo de Configuración Completa

**Archivo `.env.local` configurado:**
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyBMwLGdg4gZO-CfUC-a6Ge6kDpQxfFFikI
VITE_FIREBASE_AUTH_DOMAIN=barxp-81600.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=barxp-81600
VITE_FIREBASE_STORAGE_BUCKET=barxp-81600.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=24888466017
VITE_FIREBASE_APP_ID=1:24888466017:web:d1c4ed4f8cc5457f98a820

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_gmail123
VITE_EMAILJS_TEMPLATE_ID=template_barxp456
VITE_EMAILJS_PUBLIC_KEY=abc123def456
```

## 🚀 Próximos Pasos

Una vez configurado EmailJS:
1. ✅ **Las invitaciones se enviarán por email real**
2. ✅ **Los usuarios podrán unirse** usando el código de invitación
3. ✅ **El sistema registrará** todas las actividades del grupo
4. ✅ **Podrás invitar** hasta 100 personas por mes

---

**💡 Tip**: Guarda tus IDs de EmailJS en un lugar seguro. Los necesitarás si cambias de computadora o recreas el proyecto.

**🔒 Seguridad**: Las variables de entorno están en `.env.local` que no se sube a GitHub, así que tus credenciales están seguras.