# Troubleshooting Firestore - BarXP

## 🚨 Problema Reportado
- **Síntoma**: Los grupos no se crean ni se leen correctamente
- **Comportamiento**: Carga lenta al entrar a la sección de Grupos
- **Error**: Timeouts al intentar crear grupos

## 🔧 Soluciones Implementadas

### 1. Variables de Entorno de Producción
✅ **Creado**: `.env.production` con configuración correcta de Firebase
✅ **Verificado**: Credenciales coinciden con `firebase apps:sdkconfig web`

### 2. Reglas de Firestore Actualizadas
✅ **Desplegadas**: Reglas que permiten acceso a usuarios autenticados
✅ **Verificado**: Compilación exitosa de `firestore.rules`

### 3. Build y Deploy Completo
✅ **Build**: Generación exitosa de archivos de producción
✅ **Deploy**: Subida exitosa a Firebase Hosting

## 🧪 Pasos de Diagnóstico

### Paso 1: Verificar Autenticación
1. Abrir: `https://barxp-81600.web.app`
2. Abrir DevTools (F12)
3. Ir a Console
4. Iniciar sesión con Google
5. **Buscar**: Mensaje "🔥 Usando configuración Firebase del proyecto barxp-81600"

### Paso 2: Probar Creación de Grupo
1. Ir a la sección "Grupos"
2. Hacer clic en "+" para crear grupo
3. Llenar formulario:
   - Nombre: "Grupo Test"
   - Descripción: "Prueba de funcionamiento"
4. Hacer clic en "Crear Grupo"
5. **Observar**: Tiempo de respuesta y mensajes en consola

### Paso 3: Verificar en Firebase Console
1. Ir a: `https://console.firebase.google.com/project/barxp-81600/firestore`
2. Buscar colección `groups`
3. **Verificar**: Si aparece el grupo creado

## 🔍 Mensajes de Error Comunes

### Error de Permisos
```
FirebaseError: Missing or insufficient permissions
```
**Solución**: Verificar que el usuario esté autenticado

### Error de Conexión
```
FirebaseError: Failed to get document because the client is offline
```
**Solución**: Verificar conexión a internet y configuración de Firebase

### Error de Configuración
```
FirebaseError: Firebase: No Firebase App '[DEFAULT]' has been created
```
**Solución**: Verificar configuración en `firebase.ts`

## 🛠️ Comandos de Diagnóstico

### Verificar Estado de Firebase
```bash
# Verificar proyecto activo
firebase projects:list

# Verificar configuración
firebase apps:sdkconfig web

# Verificar reglas de Firestore
firebase deploy --only firestore:rules
```

### Verificar Build Local
```bash
# Limpiar y reconstruir
npm run build

# Servir localmente
npm run preview
```

## 📊 Configuración Actual

### Firebase Config
```javascript
{
  "projectId": "barxp-81600",
  "appId": "1:24888466017:web:d1c4ed4f8cc5457f98a820",
  "storageBucket": "barxp-81600.firebasestorage.app",
  "apiKey": "AIzaSyBMwLGdg4gZO-CfUC-a6Ge6kDpQxfFFikI",
  "authDomain": "barxp-81600.firebaseapp.com",
  "messagingSenderId": "24888466017",
  "measurementId": "G-NL3DK4D3FM"
}
```

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🚀 Próximos Pasos si el Problema Persiste

### 1. Verificar Índices de Firestore
- Ir a Firebase Console > Firestore > Indexes
- Verificar que no haya índices faltantes

### 2. Habilitar Logging Detallado
```javascript
// En firebase.ts, agregar:
import { connectFirestoreEmulator } from 'firebase/firestore';

// Solo para debugging
if (process.env.NODE_ENV === 'development') {
  console.log('🔥 Firebase Debug Mode Enabled');
}
```

### 3. Verificar Límites de Firestore
- Ir a Firebase Console > Usage
- Verificar que no se hayan excedido los límites gratuitos

### 4. Probar con Emulador Local
```bash
# Instalar emuladores
firebase init emulators

# Ejecutar emuladores
firebase emulators:start
```

## ✅ Checklist de Verificación

- [ ] Usuario autenticado correctamente
- [ ] Mensaje de configuración Firebase aparece en consola
- [ ] No hay errores de permisos en DevTools
- [ ] Reglas de Firestore desplegadas
- [ ] Variables de entorno configuradas
- [ ] Build y deploy exitosos
- [ ] Conexión a internet estable
- [ ] No hay límites de Firestore excedidos

## 📞 Información de Soporte

**Proyecto**: barxp-81600
**Región**: us-central1 (default)
**Plan**: Spark (gratuito)
**Última actualización**: $(date)

---

**Estado**: 🔄 **En diagnóstico**
**Prioridad**: 🔴 **Alta** - Funcionalidad core afectada