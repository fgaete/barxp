# Solución para Google Authentication - BarXP

## Problema
La autenticación con Google se abre y se cierra inmediatamente sin completar el proceso de login.

## Causa Probable
El dominio localhost no está autorizado en la configuración de Firebase Authentication.

## Solución

### 1. Verificar Dominios Autorizados en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: `barxp-81600`
3. Ve a **Authentication** → **Settings** → **Authorized domains**
4. Verifica que estén presentes:
   - `localhost`
   - `127.0.0.1`
   - `barxp-81600.firebaseapp.com`

### 2. Si localhost no está autorizado:

1. Haz clic en **Add domain**
2. Agrega: `localhost`
3. Haz clic en **Add domain** nuevamente
4. Agrega: `127.0.0.1`
5. Guarda los cambios

### 3. Verificar Configuración de Google Sign-In

1. En Firebase Console, ve a **Authentication** → **Sign-in method**
2. Verifica que **Google** esté habilitado
3. Asegúrate de que el **Project support email** esté configurado

### 4. Verificar Credenciales en .env.local

Asegúrate de que las credenciales en `.env.local` coincidan exactamente con las de tu proyecto Firebase:

```
VITE_FIREBASE_PROJECT_ID=barxp-81600
VITE_FIREBASE_AUTH_DOMAIN=barxp-81600.firebaseapp.com
```

### 5. Limpiar Cache del Navegador

1. Abre las herramientas de desarrollador (F12)
2. Haz clic derecho en el botón de recarga
3. Selecciona "Empty Cache and Hard Reload"

### 6. Probar la Autenticación

1. Reinicia el servidor de desarrollo: `npm run dev`
2. Ve a `http://localhost:5173`
3. Intenta hacer login con Google
4. Revisa la consola del navegador para errores específicos

## Errores Comunes y Soluciones

### Error: "This domain is not authorized"
- **Solución**: Agregar el dominio a la lista de dominios autorizados en Firebase Console

### Error: "popup_closed_by_user"
- **Causa**: El usuario cerró el popup manualmente
- **Solución**: Intentar nuevamente

### Error: "popup_blocked"
- **Causa**: El navegador bloqueó el popup
- **Solución**: Permitir popups para localhost en la configuración del navegador

### Error: "configuration-not-found"
- **Causa**: Credenciales de Firebase incorrectas
- **Solución**: Verificar que las credenciales en `.env.local` sean correctas

## Verificación Final

Si todo está configurado correctamente, deberías ver:
1. El popup de Google se abre
2. Puedes seleccionar tu cuenta de Google
3. Se completa la autenticación
4. Regresas a la aplicación como usuario autenticado

## Contacto
Si el problema persiste después de seguir estos pasos, revisa los logs de la consola del navegador para errores específicos.