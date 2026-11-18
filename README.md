# PROYECTO-FINAL
SISTEMA DEL TELEFÉRICO
# 🚠 SIMTELE-WEB | Panel Interactivo de Prevención y Monitoreo

Proyecto académico desarrollado para la asignatura de **Programación Web I**. **SIMTELE-WEB** es una aplicación web educativa que simula un centro de control y monitoreo preventivo inspirado en el sistema de transporte por cable **Mi Teleférico** (La Paz - El Alto, Bolivia)[cite: 1].

> **Nota Importante:** Todos los umbrales, cálculos y lecturas de este sistema son **simulaciones didácticas**[cite: 1] diseñadas para practicar HTML semántico, CSS responsivo y JavaScript puro (manipulación del DOM, arreglos de objetos, expresiones regulares y `localStorage`)[cite: 1]. No representan límites ni datos operativos reales[cite: 1].

---

## 👥 Integrantes del Grupo

* **Integrante 1:** Abdiel Sergio Mengoa Pacheco — *Arquitectura Base, Sistema de Autenticación y Módulo 1 (Detención de Emergencia)*
* **Integrante 2:** [Nombre del Integrante 2] — *Módulo 2 (Control de Mantenimiento)*
* **Integrante 3:** [Nombre del Integrante 3] — *Módulo 3 (Viento y Oscilación)*
* **Integrante 4:** [Nombre del Integrante 4] — *Módulo 4 (Monitoreo de Sensores y Validaciones RegExp)*

---

## 🔐 Sistema de Seguridad y Persistencia (`localStorage`)

Antes de acceder al panel operativo, el sistema cuenta con un módulo de control de acceso para personal autorizado:
* **Registro e Inicio de Sesión:** Creación de cuentas de operador con validación de contraseña mínima de **8 caracteres**.
* **Bloqueo Preventivo:** Tras **4 intentos fallidos** consecutivos de inicio de sesión, el acceso se bloquea temporalmente por seguridad.
* **Recuperación de Cuenta:** Restablecimiento directo de contraseña para usuarios registrados.
* **Almacenamiento Local:** Todas las cuentas, sesiones activas e historiales de los 4 módulos se conservan en el navegador mediante `localStorage`[cite: 1].

---

## ⚙️ Módulos del Sistema

1. **Detención de Emergencia (Línea Roja):**[cite: 1]
   Calcula la distancia recorrida durante el tiempo de reacción aplicando la fórmula $d = (v / 3.6) \times t$[cite: 1]. Evalúa el resultado frente a un umbral simulado de **50 metros** y guarda un historial de pruebas[cite: 1].
2. **Control de Mantenimiento (Línea Amarilla):**[cite: 1]
   Gestiona un arreglo de objetos con componentes mecánicos, horas de operación y estado (*Normal, Revisión, Urgente*)[cite: 1]. Permite agregar registros (`push`) y eliminarlos dinámicamente (`splice`) en una tabla interactiva[cite: 1].
3. **Viento y Oscilación (Línea Verde):**[cite: 1]
   Procesa cinco mediciones simuladas de intensidad de viento para calcular el promedio, la ráfaga máxima y clasificar el nivel de alerta (*Leve, Moderado, Fuerte*)[cite: 1].
4. **Monitoreo de Sensores (Línea Celeste):**[cite: 1]
   Registra lecturas de telemetría validando estrictamente que el código del sensor cumpla con la expresión regular `/^SEN-\d{3}$/` (ejemplo: `SEN-001`) y detectando entradas vacías o no numéricas[cite: 1].

---

## 🚀 Instrucciones de Uso y Pruebas Rápidas

1. **Acceso al Sistema:**
   * Crea una cuenta nueva en la pantalla de inicio (usando una contraseña de al menos 8 caracteres) o ingresa con las credenciales de prueba por defecto: **Usuario:** `admin` | **Contraseña:** `1234`.
2. **Navegación:**
   * Utiliza la barra de navegación superior fija para desplazarte rápidamente entre los 4 módulos[cite: 1].
3. **Pruebas de Aceptación Recomendadas:**[cite: 1]
   * **Detención:** Ingresar `72` km/h y `3` s $\rightarrow$ Genera `60.00 m` y dispara la alerta roja[cite: 1].
   * **Mantenimiento:** Agregar dos componentes, verificar que se muestren dos filas en la tabla y eliminar uno[cite: 1].
   * **Viento:** Ingresar `10, 20, 30, 40, 50` $\rightarrow$ Genera promedio `30.00 km/h` y máximo `50 km/h`[cite: 1].
   * **Sensores:** Probar `SEN-001` (válido) vs `SEN-1` o campos vacíos (muestra mensaje de error)[cite: 1].

---

## 📂 Estructura del Repositorio

```text
├── index.html      # Estructura semántica del login y los 4 módulos
├── styles.css      # Estilos institucionales y diseño adaptable (Media Queries)
├── app.js          # Lógica de validación, DOM, RegExp y LocalStorage
└── README.md       # Documentación del proyecto
