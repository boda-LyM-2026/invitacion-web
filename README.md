# 🌿 Boda Lenan & Mauricio | Invitación Digital Exclusiva

> *"El amor se compone de una sola alma que habita en dos cuerpos."*

Este repositorio contiene el código fuente de la plataforma integral de invitaciones y gestión logística para el matrimonio de **Juan Mauricio Viamont Rico** y **Lenan Vaca Lozano**. 

Más que un proyecto de software, este sistema fue diseñado, arquitectado y programado desde cero como un **regalo de bodas**. Cada línea de código, cada transición y cada píxel fue pensado para que la experiencia de los invitados sea tan mágica como el día del evento.

---

## ✨ Características Principales

Esta plataforma no es una plantilla genérica, es un sistema robusto de gestión de eventos dividido en dos experiencias:

### 1. Experiencia del Invitado (Mobile-First)
* **Interacción Inmersiva:** Una carta de papel de lino virtual sellada con un sello de cera dinámico con el monograma "L & M". Al pulsar el sello, una transición táctil revela la invitación.
* **Acceso Sin Contraseñas:** Autenticación fluida mediante URLs únicas basadas en UUIDv4.
* **RSVP Dinámico:** Formularios inteligentes que permiten a los grupos familiares confirmar su asistencia de manera individual, registrar alergias alimenticias y actualizar datos de contacto.
* **Logística Inteligente:** Al confirmar asistencia, el sistema revela el itinerario, cuenta regresiva, mapas interactivos de la locación y el número de mesa y asiento exacto.

### 2. Dashboard Administrativo (Para los Novios)
* **Métricas en Tiempo Real:** Gráficos de confirmación y asistencia impulsados por vistas materializadas en PostgreSQL.
* **Control Total:** Panel CRUD para asignar asientos (Drag & Drop lógico), ajustar nombres y descargar listas en CSV para la Wedding Planner.

---

## 🛠️ Stack Tecnológico y Arquitectura

El proyecto está construido para garantizar tiempos de carga inferiores a 2 segundos y animaciones a 60fps en dispositivos móviles, utilizando herramientas de última generación:

* **Frontend:** React 18 + Vite (SPA)
* **Estilos:** TailwindCSS + CSS Variables (Sistema de Tokens Semánticos)
* **Animaciones:** Framer Motion (Físicas de resorte para el sello de cera)
* **Backend & Base de Datos:** Supabase (PostgreSQL)
* **Arquitectura de Datos:** Tercera Forma Normal (3FN) con políticas estrictas de *Row Level Security* (RLS) para proteger los datos de los invitados.

---

## 🎨 Sistema de Diseño (Tokens)

La paleta de colores fue extraída directamente de la visión de la novia, asegurando una identidad visual coherente y romántica:

* 🟩 **Primary (Pistachio):** `#93A27D` - Resaltes y el sello de cera principal.
* 🟫 **Primary Dark (Olive):** `#616E4D` - Tipografía de contraste y acentos.
* 🟨 **Neutral (Champagne):** `#EBE3D5` - Detalles y bordes.
* ⬜ **Surface (Alabaster):** `#F1F0E8` - Fondos y papel de lino.

---

## 🚀 Instalación y Desarrollo Local

Si deseas correr este proyecto en tu entorno local:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/boda-LyM-2026/invitacion-web.git
   cd invitacion-web
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Variables de Entorno:**
   Crea un archivo `.env` en la raíz y configura tus credenciales de Supabase:
   ```env
   VITE_SUPABASE_URL=tu_supabase_url
   VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
   ```

4. **Levantar servidor de desarrollo:**
   ```bash
   npm run dev
   ```

---

## 💌 Autoría

Diseñado y desarrollado con todo el cariño del mundo por **Alvaro Viamont Rico & Jessica Orihuela Rojas**, para celebrar el inicio de la nueva familia Viamont Vaca.

**¡Que vivan los novios!** 🥂