# Configuración de Firebase para BarXP

## Problemas Identificados

### 1. AuthContext.tsx
- ✅ **SOLUCIONADO**: Import incorrecto de `'./auth'` - ahora usa `'./auth.ts'`
- ✅ **FUNCIONANDO**: La lógica de autenticación está correctamente implementada

### 2. App.tsx
- ✅ **FUNCIONANDO**: No hay errores en el código, funciona correctamente con el AuthContext

### 3. Integración con Google
- ❌ **PROBLEMA**: Usando credenciales de Firebase de prueba/demo
- ❌ **SOLUCIÓN REQUERIDA**: Configurar proyecto real de Firebase

## Pasos para Configurar Firebase Real

### Paso 1: Crear Proyecto Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Crear un proyecto" o "Add project"
3. Nombre del proyecto: `BarXP`
4. Habilita Google Analytics (opcional pero recomendado)
5. Haz clic en "Crear proyecto"

### Paso 2: Configurar Autenticación
1. En el panel izquierdo, ve a **Authentication**
2. Haz clic en **Get started** si es la primera vez
3. Ve a la pestaña **Sign-in method**
4. Habilita **Google** como proveedor:
   - Haz clic en "Google"
   - Activa el toggle "Enable"
   - Selecciona un email de soporte del proyecto
   - Haz clic en "Save"

### Paso 3: Registrar App Web
1. En la página principal del proyecto, haz clic en el ícono **Web** (`</>`)
2. Nickname de la app: `BarXP Frontend`
3. **NO** marques "Firebase Hosting" por ahora
4. Haz clic en "Register app"

### Paso 4: Obtener Configuración
1. Copia el objeto `firebaseConfig` que aparece
2. Reemplaza los valores en el archivo `.env.local`:

```env
VITE_FIREBASE_API_KEY=tu-api-key-real
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id-real
VITE_FIREBASE_APP_ID=tu-app-id-real
```

### Paso 5: Configurar Dominio Autorizado
1. En Authentication > Settings > Authorized domains
2. Agrega `localhost` si no está (debería estar por defecto)
3. Para producción, agrega tu dominio real

## Verificación

Después de completar estos pasos:

1. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Ve a `http://localhost:5173/`

3. Intenta hacer login con Google - debería funcionar correctamente

## Notas Importantes

- **Seguridad**: Las credenciales en `.env.local` son para desarrollo local únicamente
- **Producción**: Usa variables de entorno del servidor para producción
- **Dominios**: Firebase solo permite autenticación desde dominios autorizados
- **Cuotas**: El plan gratuito de Firebase permite hasta 50,000 usuarios activos mensuales

## Solución de Problemas

### Error: "Firebase: Error (auth/configuration-not-found)"
- Verifica que las credenciales en `.env.local` sean correctas
- Asegúrate de que el proyecto Firebase esté correctamente configurado

### Error: "Firebase: Error (auth/unauthorized-domain)"
- Agrega `localhost:5173` a los dominios autorizados en Firebase Console

### Error: "Firebase: Error (auth/popup-blocked)"
- Permite popups en tu navegador para localhost
- Considera usar `signInWithRedirect` en lugar de `signInWithPopup`

---

**Estado Actual**: ✅ Código corregido, ⏳ Pendiente configuración Firebase real