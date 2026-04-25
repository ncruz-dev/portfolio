# 📊 Integración de Estadísticas de GitHub en tu Portfolio

## ✅ ¿Qué se implementó?

Se agregó una **integración en tiempo real con la API de GitHub** que muestra automáticamente tus estadísticas en la sección de números (funfact) de tu portfolio.

### Estadísticas que se Muestran

| Estadística | Descripción | Fuente |
|-----------|-----------|---------|
| 📦 **Repositorios** | Número de repositorios públicos | `/users/{username}` |
| 💾 **Commits** | Total de commits en todos tus repos | `/repos/{repo}/commits` |
| 🔀 **Pull Requests** | Total de PRs que has creado | `/search/issues` |

---

## 🗂️ Archivos Creados/Modificados

### Nuevos Archivos
```
assets/js/github-stats.js       ← Script principal
assets/css/github-stats.css     ← Estilos
```

### Archivos Modificados
```
html/index.html                 ← Actualizado
```

---

## 🚀 Cómo Funciona

```
1. Página se carga en navegador
   ↓
2. Script github-stats.js inicia automáticamente
   ↓
3. Consulta la API pública de GitHub
   ↓
4. Obtiene tus datos públicos (usuario: ncruz-dev)
   ↓
5. Actualiza los números en tiempo real
   ↓
6. Anima los números con efecto incremental
   ↓
7. Se actualiza automáticamente cada 30 minutos
```

---

## ⚙️ Configuración Actual

```javascript
// github-stats.js
const GITHUB_USERNAME = 'ncruz-dev';  // ← Cambiar si necesitas otro usuario
```

---

## 🔌 Endpoints de API Utilizados

El script consume estos endpoints públicos de GitHub:

1. **Información del usuario**
   ```
   GET https://api.github.com/users/ncruz-dev
   ```
   Retorna: `public_repos`, `followers`, etc.

2. **Repositorios del usuario**
   ```
   GET https://api.github.com/users/ncruz-dev/repos?per_page=100
   ```
   Retorna: lista de repos, stars, etc.

3. **Commits por repositorio**
   ```
   GET https://api.github.com/repos/ncruz-dev/REPO_NAME/commits?per_page=1
   ```
   Retorna: número total de commits

4. **Pull requests**
   ```
   GET https://api.github.com/search/issues?q=type:pr+author:ncruz-dev&per_page=1
   ```
   Retorna: total de PRs

---

## ⚡ Rendimiento

- **Tiempo de carga**: 3-10 segundos (depende de la cantidad de repositorios)
- **Actualización**: Cada 30 minutos
- **Límites de API**: 60 requests/hora sin autenticación

### Primera carga puede tardar porque:
- Obtiene todos tus repositorios (1-2 requests)
- Itera sobre cada repo para contar commits (N requests)
- Busca todos tus PRs (1 request)

---

## 🔐 Seguridad

✅ **Sin token personal requerido**
- Usa solo la API pública de GitHub
- No necesita autenticación
- Los datos mostrados son públicos

❌ **Limitaciones sin token:**
- 60 requests/hora por IP
- No incluye repositorios privados

---

## 🛠️ Si Quieres Más Velocidad o Datos Privados

### Opción 1: Usar Token Personal

1. Ve a **GitHub → Settings → Developer settings → Personal access tokens**
2. Crea un nuevo token con scope `public_repo`
3. En `github-stats.js`, agregar autenticación:

```javascript
const response = await fetch(url, {
  headers: {
    'Authorization': 'token YOUR_TOKEN_HERE'
  }
});
```

Con token: **5000 requests/hora**

### Opción 2: Usar Backend Proxy

Crear un servidor que:
- Almacene el token de forma segura
- Procese las llamadas a GitHub
- Devuelva solo los datos necesarios

---

## 🎨 Personalización

### Cambiar Usuario de GitHub

Edita `assets/js/github-stats.js`:

```javascript
const GITHUB_USERNAME = 'tu-usuario-aqui';  // ← Cambiar esto
```

### Cambiar Estadísticas Mostradas

Edita la sección en `html/index.html`:

```html
<!-- Cambia los atributos data-stat -->
<h1 class="number" data-stat="repositories">0</h1>
<h1 class="number" data-stat="commits">0</h1>
<h1 class="number" data-stat="pull-requests">0</h1>
```

### Agregar Más Estadísticas

En `github-stats.js`, modifica el objeto retornado:

```javascript
return {
  repositories: userData.public_repos,
  commits: totalCommits,
  pullRequests: prsData.total_count,
  followers: userData.followers,        // ← Disponible
  stars: repos.reduce(...)               // ← Disponible
};
```

---

## 🧪 Testing

1. Abre el navegador (F12) → Console
2. Deberías ver logs de la obtención de datos
3. Los números se actualizarán en la página
4. Verifica en la pestaña Network las llamadas a `api.github.com`

---

## ⚠️ Problemas Comunes

### "No se cargan los números"
- Verifica que tengas conexión a internet
- Abre Console (F12) para ver errores
- El usuario 'ncruz-dev' debe ser público en GitHub

### "Los números están en 0"
- Espera 5-10 segundos (primeras carga es lenta)
- Recarga la página
- Verifica que el usuario existe y es público

### "Números no se actualizan"
- Es normal, se actualizan cada 30 minutos
- Abre la consola para ver logs
- Recarga la página para actualización manual

---

## 📱 Responsividad

El CSS está optimizado para:
- ✅ Desktop (números grandes)
- ✅ Tablet (números medianos)
- ✅ Mobile (números pequeños)

---

## 📚 Recursos

- [GitHub API Docs](https://docs.github.com/en/rest)
- [GitHub Search API](https://docs.github.com/en/rest/search)
- [Rate Limits](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting)

---

## ✨ Resultado Final

Tu portfolio ahora muestra **estadísticas reales de GitHub que se actualizan automáticamente**, sin necesidad de mantener números ficticios.

¡Los visitantes ven tu actividad real en tiempo real! 🎉
