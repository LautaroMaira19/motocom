# 🚀 Pasos para publicar Motocom en Railway

## PASO 1: Crear repositorio en GitHub
1. Ve a [github.com](https://github.com)
2. Si no estás logueado, haz login
3. Click en **"+"** arriba a la derecha → **"New repository"**
4. Nombre: `motocom`
5. Descripción: `Chatbot Moti para Motocom`
6. **No** inicialices con README
7. Click **"Create repository"**

---

## PASO 2: Conectar código local con GitHub
Copia y pega EXACTAMENTE estos comandos en tu terminal (en la carpeta d:/Motocom):

```bash
git remote add origin https://github.com/LautaroMaira19/motocom.git
git branch -M main
git push -u origin main
```

**Nota:** Cuando ejecutes `git push`, GitHub te pedirá autenticación. Sigue estos pasos:
- Si tienes "Personal Access Token" (PAT), úsalo como contraseña
- Si no, genera uno aquí: https://github.com/settings/tokens
  - Click en "Generate new token"
  - Dale permisos: `repo` (full control)
  - Cópialo y úsalo como contraseña en git

---

## PASO 3: Conectar a Railway
1. Ve a [railway.app](https://railway.app)
2. Click en **"Start New Project"**
3. Selecciona **"Deploy from GitHub"**
4. Autoriza Railway para acceder a tu GitHub
5. Busca `motocom` y selecciona el repo
6. Click en **"Deploy"** 🚀
7. En 2-3 minutos tendrás tu URL: `algo.railway.app`

---

## ¿Problemas?
Si algo no funciona:
- Revisa que estés logueado en GitHub
- Verifica que el PAT tenga permisos `repo`
- Intenta ejecutar los comandos de git de nuevo

¡Listo! Tu chatbot Moti estará online 🎉
