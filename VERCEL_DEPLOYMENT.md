# Publicar Motocom en Vercel

## Paso 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

## Paso 2: Login en Vercel

```bash
vercel login
```

Inicia sesión con tu cuenta (crea una si no tienes en vercel.com)

## Paso 3: Deploy inicial

```bash
vercel
```

Responde las preguntas:
- Project name: `motocom`
- Framework: `Other`
- Output Directory: `.`

## Paso 4: Configurar variables de entorno

En Vercel Dashboard:
1. Ve a tu proyecto → Settings → Environment Variables
2. Agrega: `GEMINI_API_KEY` = `AIzaSyBQ5HozM2KAXd4HNxpkBOQpUyE6I7ZhBjY`
3. Redeploy

## Paso 5: Cada vez que hagas cambios

```bash
vercel --prod
```

O simplemente:
```bash
git push
```

Si conectas tu repo de GitHub, se deploya automáticamente.

---

## URL de tu sitio

Una vez publicado, tendrás una URL como:
`https://motocom.vercel.app`

¡Y Moti estará disponible 24/7!
