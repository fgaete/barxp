# Solución para Error: auth/operation-not-allowed

## Problema Actual
Al intentar iniciar sesión con Google aparece el error: **"Firebase: Error (auth/operation-not-allowed)"**

## Causa
Este error específico indica que Google Authentication **NO está habilitado correctamente** en Firebase Console, aunque pueda parecer que está configurado.

## Solución Paso a Paso

### 1. Verificar y Habilitar Google Authentication

**🔗 Enlace directo**: https://console.firebase.google.com/project/barxp-app/authentication/providers

1. **Abre el enlace anterior** (debe llevarte directamente a la configuración de proveedores)
2. **Si ves "Get started"**, haz clic en él primero
3. **Busca "Google" en la lista de proveedores**
4. **Haz clic en "Google"** (no en el toggle, sino en el texto "Google")
5. **IMPORTANTE**: Verifica que el toggle esté **ACTIVADO** (azul)
6. **Configura los campos requeridos**:
   - ✅ **Enable**: Debe estar activado (toggle azul)
   - ✅ **Project support email**: Selecciona tu email
   - ✅ **Project public-facing name**: "BarXP App" (o el nombre que prefieras)
7. **Haz clic en "Save"**
8. **Espera a ver el mensaje de confirmación**

### 2. Verificar Dominios Autorizados

**🔗 Enlace directo**: https://console.firebase.google.com/project/barxp-app/authentication/settings

1. **Ve a la pestaña "Settings"**
2. **Busca la sección "Authorized domains"**
3. **Verifica que estén presentes**:
   - ✅ `localhost`
   - ✅ `barxp-app.web.app`
   - ✅ `barxp-app.firebaseapp.com`

4. **Si falta algún dominio**:
   - Haz clic en "Add domain"
   - Escribe: `localhost`
   - Haz clic en "Add"
   - Repite para los otros dominios si es necesario

### 3. Verificar Configuración OAuth

1. **En la misma página de Settings**
2. **Busca "OAuth redirect domains"**
3. **Debe incluir automáticamente**:
   - `barxp-app.firebaseapp.com`
   - `barxp-app.web.app`

### 4. Probar la Configuración

1. **Espera 2-3 minutos** después de guardar los cambios
2. **Abre la aplicación**: https://barxp-app.web.app
3. **Abre las herramientas de desarrollador** (F12)
4. **Ve a la pestaña Console**
5. **Intenta iniciar sesión con Google**
6. **Revisa los mensajes en la consola**

### 5. Si el Error Persiste

**Verifica estos puntos adicionales**:

1. **Google Cloud Console**:
   - Ve a: https://console.cloud.google.com/apis/credentials
   - Selecciona el proyecto `barxp-app`
   - Verifica que exista una "OAuth 2.0 Client ID"
   - Si no existe, Firebase debería crearla automáticamente

2. **Limpiar Cache del Navegador**:
   - Presiona `Ctrl+Shift+R` (o `Cmd+Shift+R` en Mac)
   - O ve a Configuración → Privacidad → Limpiar datos de navegación

3. **Probar en Modo Incógnito**:
   - Abre una ventana de incógnito
   - Ve a https://barxp-app.web.app
   - Intenta iniciar sesión

## Información del Proyecto

**Configuración actual**:
- **Project ID**: `barxp-app`
- **Auth Domain**: `barxp-app.firebaseapp.com`
- **App ID**: `1:478955023319:web:3319fe7d77eaf14afdb992`
- **Hosting URL**: https://barxp-app.web.app

## Mensajes de Error Mejorados

La aplicación ahora mostrará mensajes más específicos:
- ✅ **auth/operation-not-allowed**: "Google Authentication no está habilitado en Firebase Console"
- ✅ **auth/unauthorized-domain**: "Dominio no autorizado"
- ✅ **auth/popup-blocked**: "Popup bloqueado por el navegador"

## Checklist de Verificación

- [ ] Google Authentication está **habilitado** (toggle azul)
- [ ] **Project support email** está configurado
- [ ] **Dominios autorizados** incluyen localhost y barxp-app.web.app
- [ ] **Esperé 2-3 minutos** después de los cambios
- [ ] **Limpié el cache** del navegador
- [ ] **Probé en modo incógnito**

---

**💡 Tip**: Si todo parece estar configurado correctamente pero el error persiste, intenta **deshabilitar y volver a habilitar** Google Authentication en Firebase Console. A veces esto resuelve problemas de configuración interna.