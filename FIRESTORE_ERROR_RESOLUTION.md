# Resolución de Error Firestore 400 - BarXP

## 🚨 Problema Identificado

**Error**: `GET https://firestore.googleapis.com/...` net::ERR_ABORTED 400 (Bad Request)

**Causa**: Configuración incorrecta de Firebase y falta de reglas de seguridad en Firestore

## ✅ Soluciones Implementadas

### 1. Configuración de Firebase Corregida

**Archivo**: `frontend/src/services/firebase.ts`

**Cambios**:
- ✅ Actualizada configuración con credenciales reales del proyecto `barxp-81600`
- ✅ API Key: `AIzaSyBMwLGdg4gZO-CfUC-a6Ge6kDpQxfFFikI`
- ✅ Project ID: `barxp-81600`
- ✅ Auth Domain: `barxp-81600.firebaseapp.com`
- ✅ Storage Bucket: `barxp-81600.firebasestorage.app`
- ✅ Messaging Sender ID: `24888466017`
- ✅ App ID: `1:24888466017:web:d1c4ed4f8cc5457f98a820`
- ✅ Measurement ID: `G-NL3DK4D3FM`

### 2. Reglas de Seguridad de Firestore

**Archivo**: `frontend/firestore.rules`

**Reglas implementadas**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reglas para la colección de grupos
    match /groups/{groupId} {
      allow read, write: if request.auth != null;
    }
    
    // Reglas para la colección de actividades de grupos
    match /groupActivities/{activityId} {
      allow read, write: if request.auth != null;
    }
    
    // Reglas para otras colecciones
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. Configuración de Firebase Deploy

**Archivo**: `frontend/firebase.json`

**Cambios**:
- ✅ Agregada configuración de Firestore
- ✅ Referencia a archivo de reglas: `firestore.rules`

### 4. Deploy Completado

**Comandos ejecutados**:
```bash
# Deploy de reglas de Firestore
firebase deploy --only firestore:rules

# Build de la aplicación
npm run build

# Deploy completo
firebase deploy
```

**Resultado**: ✅ Deploy exitoso

## 🔍 Verificación del Estado

### Servidor Web
- ✅ **Estado**: Activo y respondiendo
- ✅ **URL**: https://barxp-81600.web.app
- ✅ **Código de respuesta**: HTTP 200
- ✅ **Content-Type**: text/html; charset=utf-8

### Firebase Firestore
- ✅ **Reglas**: Desplegadas correctamente
- ✅ **Configuración**: Credenciales reales del proyecto
- ✅ **Permisos**: Usuarios autenticados pueden leer/escribir

### Funcionalidades
- ✅ **Grupos**: Persistencia en Firestore implementada
- ✅ **Emails**: Sistema de invitaciones con EmailJS
- ✅ **Autenticación**: Google Auth configurado
- ✅ **UI**: Estados de carga y manejo de errores

## 🛠️ Solución de Problemas

### Si persiste el error 400:

1. **Verificar autenticación**:
   - Asegúrate de estar autenticado con Google
   - Revisa que el dominio esté autorizado en Firebase Console

2. **Limpiar caché del navegador**:
   ```bash
   # Chrome/Safari
   Cmd + Shift + R (macOS)
   Ctrl + Shift + R (Windows/Linux)
   ```

3. **Verificar reglas de Firestore**:
   - Ve a Firebase Console > Firestore Database > Rules
   - Confirma que las reglas estén activas

4. **Verificar configuración**:
   ```bash
   firebase projects:list
   firebase apps:sdkconfig web
   ```

### Si el sitio no carga:

1. **Verificar DNS**:
   ```bash
   nslookup barxp-81600.web.app
   ```

2. **Verificar conectividad**:
   ```bash
   curl -I https://barxp-81600.web.app
   ```

3. **Probar en modo incógnito**:
   - Elimina posibles problemas de caché/extensiones

## 📊 Estado Final

- **Configuración Firebase**: ✅ Corregida
- **Reglas Firestore**: ✅ Implementadas
- **Deploy**: ✅ Exitoso
- **Servidor**: ✅ Respondiendo HTTP 200
- **Funcionalidades**: ✅ Grupos y emails implementados

## 🚀 Próximos Pasos

1. **Probar funcionalidades**:
   - Crear grupos
   - Enviar invitaciones
   - Verificar persistencia

2. **Configurar EmailJS** (opcional):
   - Seguir guía en `GRUPOS_Y_EMAIL_SETUP.md`
   - Configurar variables de entorno

3. **Monitorear errores**:
   - Revisar Firebase Console
   - Verificar logs del navegador

---

**Resolución**: ✅ **Completada**
**Fecha**: $(date)
**Estado**: Aplicación funcional con Firestore configurado correctamente