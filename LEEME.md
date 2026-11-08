# Proyector Bíblico — app de escritorio para Mac y Windows

Aplicación para proyectar la Biblia en la iglesia. **Funciona sin internet.**
Incluye la Reina-Valera 1909 y la King James Version completas (dominio público), 6 fotos de paisajes, 12 tipografías, temas claro y oscuro, y la ventana de proyección que se abre sola en el proyector.

---

## Opción A (recomendada): que GitHub construya los instaladores por ti

No necesitas instalar nada en tu computadora. GitHub crea los archivos `.dmg` (Mac) y `.exe` (Windows) gratis.

### 1. Crea el repositorio
1. Crea una cuenta gratis en **github.com** (si no tienes).
2. Arriba a la derecha: **+ → New repository**.
   - Nombre: `proyector-biblico`
   - Marca **Public** si quieres que cualquiera pueda descargarlo.
   - Pulsa **Create repository**.

### 2. Sube los archivos
1. En el repositorio nuevo, pulsa **uploading an existing file**.
2. Arrastra **todo el contenido de esta carpeta** (`main.js`, `package.json`, `LEEME.md`, y las carpetas `app`, `build`, `licenses`).
3. Pulsa **Commit changes**.

> ⚠️ La carpeta `.github` empieza con punto y a veces queda oculta. Si no se subió:
> en el repositorio pulsa **Add file → Create new file**, escribe como nombre
> `.github/workflows/build.yml`, pega el contenido del archivo `build.yml` de esta carpeta y guarda (**Commit**).

### 3. Construye y publica
1. Ve a **Releases → Draft a new release** (en la columna derecha del repositorio).
2. En **Choose a tag** escribe `v1.0.0` y pulsa **Create new tag**.
3. Título: `Proyector Bíblico 1.0.0` → **Publish release**.
4. Ve a la pestaña **Actions**: verás "Construir instaladores" trabajando (tarda unos 10 minutos).
5. Al terminar, los instaladores aparecen en la Release. Ese enlace es el que compartes:
   `https://github.com/TU-USUARIO/proyector-biblico/releases/latest`

Para una versión nueva: cambia `"version"` en `package.json` (por ejemplo a `1.0.1`) y crea otra Release con la etiqueta `v1.0.1`.

---

## Opción B: construirlo en tu propia computadora

Necesitas **Node.js** (descárgalo de nodejs.org, versión LTS). Luego, en una terminal dentro de esta carpeta:

```bash
npm install          # descarga Electron (solo la primera vez)
npm start            # abre la app para probarla
npm run dist:mac     # crea el .dmg (hazlo en una Mac)
npm run dist:win     # crea el .exe (hazlo en Windows)
```

Los instaladores quedan en la carpeta `dist/`.

---

## Qué verán las personas al instalarlo (importante)

Como la app no está firmada con un certificado de pago, el sistema muestra un aviso la primera vez.
Es normal, y conviene ponerlo en la página de descarga:

**Windows** — aparece "Windows protegió su PC":
pulsa **Más información → Ejecutar de todas formas**.

**Mac** — aparece "no se puede abrir porque Apple no puede comprobarla":
1. Arrastra la app a **Aplicaciones**.
2. Ábrela una vez (saldrá el aviso) y ciérralo.
3. Ve a **Ajustes del Sistema → Privacidad y seguridad**, baja hasta el final y pulsa **Abrir igualmente**.

Si aparece "la app está dañada", abre la **Terminal** y escribe:
```bash
xattr -cr "/Applications/Proyector Bíblico.app"
```

### Para quitar esos avisos (opcional, de pago)
- **Mac:** cuenta de Apple Developer (99 USD al año) para firmar y "notarizar" la app.
- **Windows:** un certificado de firma de código (desde unos 200 USD al año), o publicarla en la Microsoft Store.

Si algún día lo haces, electron-builder lee los certificados desde los "Secrets" del repositorio
(`CSC_LINK`, `CSC_KEY_PASSWORD`, `APPLE_ID`, `APPLE_APP_SPECIFIC_PASSWORD`, `APPLE_TEAM_ID`).

---

## Uso en la iglesia
- Conecta el proyector o TV **antes** de pulsar **Proyectar**: la ventana se abre sola en esa pantalla y a pantalla completa.
- Atajos: `Enter` muestra · `←` `→` versículo anterior/siguiente · `B` pantalla negra · `C` ocultar texto · `+` `−` tamaño de letra.

## Licencias del contenido
- **Biblia:** Reina-Valera 1909 y King James Version, dominio público.
- **Tipografías:** SIL Open Font License (ver carpeta `licenses`).
- **Fotos de paisajes:** antes de publicar, asegúrate de que tienes permiso para distribuir las fotos incluidas (por ejemplo, si son de Unsplash o Pexels, su licencia lo permite).
