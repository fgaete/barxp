# Template Correcto para EmailJS - BarXP

## 🚨 Problema Actual
El template de EmailJS está usando variables incorrectas. La aplicación envía variables específicas que deben coincidir exactamente con las que uses en el template.

## ✅ Variables Disponibles

La aplicación BarXP envía estas variables a EmailJS:

```javascript
{
  to_email: "destinatario@ejemplo.com",     // Email del destinatario
  to_name: "Nombre del destinatario",       // Nombre del destinatario
  from_name: "Tu nombre",                   // Nombre de quien invita
  group_name: "Nombre del grupo",           // Nombre del grupo
  invite_code: "ABC123",                    // Código de invitación
  message: "Mensaje personalizado...",      // Mensaje personalizado
  app_url: "https://barxp-app.web.app",     // URL de la aplicación
  join_url: "https://barxp-app.web.app?invite=ABC123"  // URL directa para unirse
}
```

## 🔧 Template Correcto para EmailJS

### Configuración en EmailJS Dashboard:

1. **Ve a tu template en EmailJS**
2. **En "To Email"**: Usa `{{to_email}}`
3. **En "Subject" (Asunto)**:
```
🎯 Invitación a {{group_name}} - BarXP
```

4. **En "Content" (Contenido del email)**:
```html
¡Hola {{to_name}}!

{{message}}

🔗 Únete al grupo aquí: {{join_url}}

Código de invitación: {{invite_code}}

¡Nos vemos en BarXP! 🍻
- {{from_name}}

---
BarXP - La app que convierte cada trago en una aventura épica
Visita: {{app_url}}
```

## ❌ Variables Incorrectas vs ✅ Variables Correctas

| ❌ Incorrecto | ✅ Correcto | Descripción |
|---------------|-------------|-------------|
| `{{email}}`   | `{{to_email}}` | Email del destinatario |
| `{{name}}`    | `{{to_name}}`  | Nombre del destinatario |
| `{{sender}}`  | `{{from_name}}` | Nombre de quien invita |
| `{{group}}`   | `{{group_name}}` | Nombre del grupo |
| `{{code}}`    | `{{invite_code}}` | Código de invitación |
| `{{msg}}`     | `{{message}}` | Mensaje personalizado |
| `{{url}}`     | `{{app_url}}` | URL de la aplicación |

## 🧪 Ejemplo de Template Completo

### En EmailJS Dashboard:

**To Email:**
```
{{to_email}}
```

**Subject:**
```
🎯 Invitación a {{group_name}} - BarXP
```

**Content:**
```
¡Hola {{to_name}}!

{{from_name}} te ha invitado a unirte al grupo "{{group_name}}" en BarXP.

{{message}}

🔗 Haz clic aquí para unirte: {{join_url}}

O usa este código de invitación: {{invite_code}}

¡Nos vemos en la aventura! 🍻

---
BarXP - Donde cada trago cuenta
{{app_url}}
```

## 🔍 Cómo Verificar que Funciona

1. **Guarda el template** en EmailJS con las variables correctas
2. **Ve a la aplicación**: http://localhost:5173/groups
3. **Intenta enviar una invitación**
4. **Revisa la consola del navegador** (F12):
   - ✅ Debería mostrar: "✅ Email enviado exitosamente"
   - ❌ Si hay error: "❌ Error al enviar email"

## 🚨 Errores Comunes

### "Template parameter not found"
- **Causa**: Usaste una variable que no existe (ej: `{{email}}` en lugar de `{{to_email}}`)
- **Solución**: Usa exactamente las variables listadas arriba

### "Invalid template"
- **Causa**: Sintaxis incorrecta en el template
- **Solución**: Verifica que uses `{{variable}}` (con dobles llaves)

### "Email not sent"
- **Causa**: Variables mal configuradas o servicio no autorizado
- **Solución**: Verifica que el servicio de Gmail esté conectado correctamente

## 📋 Checklist de Verificación

- [ ] **To Email** configurado como: `{{to_email}}`
- [ ] **Subject** incluye: `{{group_name}}`
- [ ] **Content** usa todas las variables correctas
- [ ] **No hay variables inventadas** (como `{{email}}` o `{{name}}`)
- [ ] **Template guardado** en EmailJS
- [ ] **Servicio de Gmail** conectado y autorizado

## 🎯 Resultado Esperado

Una vez corregido el template, cuando envíes una invitación:

1. ✅ **La aplicación no mostrará errores**
2. ✅ **El email llegará al destinatario correcto**
3. ✅ **Todas las variables se reemplazarán correctamente**
4. ✅ **El link de invitación funcionará**

---

**💡 Tip**: Siempre usa las variables exactas que envía la aplicación. No inventes nombres de variables, ya que EmailJS no podrá reemplazarlas y causará errores.