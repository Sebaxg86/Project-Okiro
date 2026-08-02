# Especificación Funcional y Tecnológica — Project Okiro

## Control del documento

| Campo | Valor |
|---|---|
| Proyecto | Project Okiro |
| Tipo de documento | Especificación funcional y tecnológica |
| Versión | 1.0 |
| Estado | Base aprobada para implementación |
| Plataforma principal | Aplicación web mobile-first |
| Modalidad | Progressive Web App |
| Idioma inicial | Español de México |
| Backend y servicios | Supabase |
| Despliegue frontend | Vercel |
| Documento relacionado | `Especificación Funcional - Sistema de XP.md` |

---

# 1. Propósito del documento

Este documento define los requerimientos funcionales, tecnológicos, arquitectónicos, de seguridad, experiencia de usuario, persistencia, pruebas y despliegue de **Project Okiro**.

La lógica matemática y las reglas de progresión relacionadas con:

- XP provisional.
- XP consolidada.
- Niveles.
- Rangos semanales.
- Atributos.
- Penalizaciones.
- Bonificaciones.
- Rachas.
- Misiones de recuperación.
- Cierre semanal.

se encuentran definidas en:

```text
Especificación Funcional - Sistema de XP.md
```

Dicho documento será la fuente de verdad para la economía de progresión.

Este documento define cómo la aplicación permitirá al usuario interactuar con ese sistema.

---

# 2. Visión del producto

Okiro será una aplicación web mobile-first enfocada en ayudar al usuario a mejorar su condición física, alimentación, hidratación, sueño, estudio y disciplina mediante un sistema de progresión inspirado en los videojuegos RPG.

La aplicación deberá hacer que registrar hábitos sea:

- Rápido.
- Visual.
- Motivante.
- Comprensible.
- Consistente.
- Utilizable desde un teléfono.
- Seguro.
- Auditable.
- Difícil de manipular accidentalmente.

Okiro no será solamente un rastreador de hábitos.

Será un sistema personal de progresión que deberá responder tres preguntas:

1. ¿Qué debo hacer hoy?
2. ¿Cómo estoy progresando?
3. ¿Qué área de mi vida necesita atención?

---

# 3. Objetivos del producto

## 3.1 Objetivo principal

Permitir que una persona registre diariamente sus actividades y observe cómo estas afectan su nivel, atributos, rango semanal y progreso personal.

## 3.2 Objetivos secundarios

La aplicación deberá:

- Reducir la fricción al registrar información.
- Mostrar claramente las misiones del día.
- Ayudar al usuario a construir constancia.
- Evitar castigos destructivos.
- Mostrar tendencias semanales y mensuales.
- Funcionar correctamente desde un teléfono.
- Poder instalarse como PWA.
- Mantener los datos privados por usuario.
- Permitir cambios futuros sin reestructurar todo el sistema.
- Ser suficientemente clara para que un agente de programación pueda extenderla de forma segura.

---

# 4. Alcance del MVP

La primera versión funcional deberá incluir:

1. Registro de cuenta.
2. Inicio de sesión.
3. Confirmación de correo.
4. Recuperación y cambio de contraseña.
5. Cierre de sesión.
6. Onboarding inicial.
7. Configuración de objetivos.
8. Dashboard diario.
9. Misiones diarias.
10. Registro de entrenamientos.
11. Registro de sueño.
12. Registro de comidas.
13. Registro de hidratación.
14. Registro de sesiones de programación.
15. Historial de registros.
16. Calendario de actividad.
17. XP provisional.
18. Nivel general.
19. Atributos.
20. Rangos semanales.
21. Reportes semanales.
22. Rachas.
23. Modo de protección.
24. Configuración del usuario.
25. Instalación como PWA.
26. Diseño responsive.
27. Seguridad mediante Row Level Security.
28. Cierre semanal automático.
29. Eliminación de cuenta.
30. Exportación básica de información.

---

# 5. Funcionalidades fuera del MVP

Las siguientes funcionalidades no deberán implementarse durante la primera versión, salvo que hayan sido aprobadas expresamente:

- Inicio de sesión con Google.
- Inicio de sesión con Apple.
- Integración con Apple Health.
- Integración con Google Health Connect.
- Aplicación nativa para iOS.
- Aplicación nativa para Android.
- Integración con Apple Watch.
- Integración con relojes Garmin.
- Integración con Fitbit.
- Funciones sociales.
- Seguimiento entre amigos.
- Clasificaciones globales.
- Competencias.
- Mensajería.
- Entrenador mediante inteligencia artificial.
- Reconocimiento automático de comida por fotografía.
- Conteo detallado de calorías.
- Generación automática de rutinas.
- Suscripciones o pagos.
- Marketplace.
- Modo multijugador.
- Panel administrativo avanzado.
- Funcionamiento completamente offline.
- Sincronización offline compleja.
- Compartir progreso públicamente.

Estas funcionalidades podrán considerarse para fases posteriores, pero no deberán complicar la arquitectura inicial.

---

# 6. Tipo de aplicación

Okiro será una:

```text
Aplicación web responsive, mobile-first e instalable como PWA.
```

## 6.1 Mobile-first

La interfaz se diseñará primero para teléfonos y posteriormente se adaptará a:

- Tablets.
- Laptops.
- Monitores de escritorio.

La experiencia móvil será la experiencia principal, no una versión reducida de la aplicación de escritorio.

## 6.2 Progressive Web App

Okiro deberá poder:

- Instalarse desde un navegador compatible.
- Mostrar nombre e icono propios.
- Abrirse en modo independiente.
- Utilizar una pantalla de inicio.
- Definir color de tema.
- Respetar las áreas seguras del dispositivo.
- Mostrar una pantalla de respaldo cuando no haya conexión.
- Mantener en caché recursos estáticos esenciales.

Durante el MVP, los registros no se crearán sin conexión.

Cuando el usuario no tenga internet:

- Podrá abrir la estructura básica de la aplicación.
- Verá un aviso claro de falta de conexión.
- No podrá confirmar nuevos registros.
- No se simulará que un registro fue guardado.
- No se mantendrá una cola offline de operaciones.

La sincronización offline podrá desarrollarse en una fase posterior.

---

# 7. Usuarios y roles

## 7.1 Usuario autenticado

Será el rol principal del MVP.

Un usuario autenticado podrá:

- Consultar únicamente sus propios datos.
- Registrar sus actividades.
- Editar registros abiertos.
- Eliminar registros abiertos.
- Consultar su progreso.
- Configurar sus objetivos.
- Administrar su perfil.
- Exportar sus datos.
- Eliminar su cuenta.

## 7.2 Usuario no autenticado

Podrá acceder únicamente a:

- Página de presentación.
- Registro.
- Inicio de sesión.
- Recuperación de contraseña.
- Confirmación de cuenta.
- Documentos legales públicos.

## 7.3 Administrador del sistema

No se requiere un panel administrativo completo durante el MVP.

Las tareas administrativas se realizarán desde:

- Supabase Dashboard.
- Vercel Dashboard.
- Consolas de observabilidad.
- Scripts controlados.
- Operaciones SQL auditadas.

La arquitectura deberá permitir agregar un rol administrativo posteriormente sin modificar el modelo de propiedad de datos.

---

# 8. Stack tecnológico obligatorio

## 8.1 Frontend

| Tecnología | Uso |
|---|---|
| Next.js | Framework web |
| App Router | Enrutamiento y arquitectura |
| React | Construcción de interfaz |
| TypeScript | Tipado estático |
| Tailwind CSS | Sistema de estilos |
| shadcn/ui | Componentes base accesibles y personalizables |
| Lucide | Iconografía |
| React Hook Form | Manejo de formularios |
| Zod | Validación de datos |
| date-fns | Manejo de fechas y periodos |
| Recharts o equivalente | Gráficas de progreso |
| pnpm | Administración de dependencias |

## 8.2 Backend y datos

| Tecnología | Uso |
|---|---|
| Supabase Auth | Autenticación |
| PostgreSQL | Base de datos principal |
| Supabase Row Level Security | Autorización por usuario |
| Supabase Edge Functions | Operaciones privilegiadas y automatización |
| Supabase Cron | Cierre semanal y procesos programados |
| Supabase Storage | Avatares y archivos futuros |
| Supabase CLI | Desarrollo local y migraciones |

## 8.3 Infraestructura

| Tecnología | Uso |
|---|---|
| Vercel | Hosting de la aplicación |
| GitHub | Repositorio y control de versiones |
| GitHub Actions | Integración continua |
| Vercel Preview Deployments | Revisión de cambios |
| Supabase Hosted | Servicios de producción |

## 8.4 Pruebas

| Tecnología | Uso |
|---|---|
| Vitest | Pruebas unitarias |
| Testing Library | Pruebas de componentes |
| Playwright | Pruebas end-to-end |
| Supabase local | Pruebas de integración y RLS |

## 8.5 Reglas de versiones

- Se utilizarán versiones estables.
- No se utilizarán versiones beta, alfa o release candidate en producción.
- Las versiones deberán quedar fijadas mediante `pnpm-lock.yaml`.
- Las actualizaciones mayores deberán realizarse en ramas separadas.
- No deberán actualizarse dependencias críticas automáticamente sin ejecutar pruebas.
- El agente no deberá cambiar de framework sin autorización.
- El agente no deberá sustituir Supabase o Vercel sin una decisión arquitectónica explícita.

---

# 9. Arquitectura general

Okiro deberá construirse como un **monolito modular**.

No se utilizarán microservicios durante el MVP.

## 9.1 Capas principales

```text
Interfaz de usuario
        ↓
Casos de uso
        ↓
Servicios de dominio
        ↓
Repositorios y adaptadores
        ↓
Supabase / PostgreSQL
```

## 9.2 Responsabilidades

### Interfaz de usuario

Responsable de:

- Mostrar información.
- Recibir acciones.
- Validar formularios de manera inmediata.
- Mostrar estados de carga.
- Mostrar errores.
- Adaptarse a dispositivos móviles.

No deberá contener reglas complejas de XP.

### Casos de uso

Responsables de:

- Coordinar acciones.
- Validar permisos.
- Ejecutar operaciones.
- Invocar servicios.
- Devolver resultados tipados.

Ejemplos:

- Registrar entrenamiento.
- Actualizar comida.
- Eliminar sesión.
- Completar onboarding.
- Obtener dashboard.
- Cerrar semana.

### Dominio

Responsable de:

- Reglas de negocio.
- Interpretación de actividades.
- Cálculos de periodos.
- Reglas de edición.
- Estado de semanas.
- Lógica de XP.

### Persistencia

Responsable de:

- Consultas.
- Inserciones.
- Actualizaciones.
- Transacciones.
- Restricciones.
- Índices.
- Políticas RLS.
- Migraciones.

---

# 10. Principios arquitectónicos

## 10.1 Servidor primero

Siempre que sea posible:

- La consulta inicial se realizará en el servidor.
- Las rutas privadas validarán la sesión en el servidor.
- Las mutaciones pasarán por Server Actions, Route Handlers o Edge Functions.
- No se confiará en valores calculados por el navegador.

## 10.2 RLS como última barrera

Toda tabla que contenga información de usuario deberá tener:

```text
Row Level Security habilitado
```

La interfaz nunca será considerada una barrera de seguridad.

Ocultar un botón no sustituye una política de autorización.

## 10.3 Lógica única de XP

La lógica del sistema de XP deberá existir en un único módulo canónico.

No deberán existir:

- Una fórmula en el frontend.
- Otra fórmula en el backend.
- Otra fórmula en SQL.

El frontend solamente mostrará resultados calculados por el motor oficial.

## 10.4 Operaciones idempotentes

Las operaciones críticas deberán poder ejecutarse más de una vez sin duplicar resultados.

Especialmente:

- Cierre semanal.
- Creación de misiones.
- Generación de transacciones de XP.
- Entrega de logros.
- Notificaciones.
- Reintentos de funciones.

## 10.5 Base de datos mediante migraciones

Todo cambio estructural deberá realizarse mediante migraciones versionadas.

Queda prohibido depender exclusivamente de cambios manuales realizados desde Supabase Dashboard.

## 10.6 Código comprensible

El código deberá priorizar:

- Nombres explícitos.
- Módulos pequeños.
- Tipos claros.
- Funciones puras.
- Comentarios útiles.
- Documentación de decisiones.
- Separación de responsabilidades.

---

# 11. Autenticación

## RF-AUTH-001 — Registro

El usuario deberá poder registrarse mediante:

- Correo electrónico.
- Contraseña.
- Confirmación de contraseña.

El formulario deberá validar:

- Formato de correo.
- Contraseña mínima de 10 caracteres.
- Coincidencia de contraseñas.
- Aceptación de términos.
- Aceptación del aviso de privacidad.

## RF-AUTH-002 — Confirmación de correo

Después del registro:

1. Se enviará un correo de confirmación.
2. El usuario verá una pantalla explicativa.
3. El usuario no podrá acceder a la aplicación hasta confirmar su correo.
4. El enlace deberá regresar a Okiro.
5. La aplicación deberá procesar el callback.
6. La cuenta deberá quedar activada.
7. El usuario será dirigido al onboarding.

## RF-AUTH-003 — Reenvío de confirmación

El usuario podrá solicitar nuevamente el correo.

La interfaz deberá:

- Evitar envíos repetidos.
- Mostrar un tiempo de espera.
- No revelar información sensible.
- Mostrar un mensaje neutral ante errores.

## RF-AUTH-004 — Inicio de sesión

El usuario podrá iniciar sesión con:

- Correo electrónico.
- Contraseña.

La aplicación deberá:

- Mostrar errores comprensibles.
- Evitar indicar si un correo existe o no.
- Redirigir al dashboard cuando la sesión sea válida.
- Redirigir al onboarding si aún no fue completado.

## RF-AUTH-005 — Persistencia de sesión

La sesión deberá mantenerse mediante cookies seguras.

El usuario permanecerá autenticado entre visitas mientras:

- Su sesión siga siendo válida.
- No cierre sesión.
- No haya revocado sus sesiones.
- No haya eliminado la cuenta.

## RF-AUTH-006 — Recuperación de contraseña

El usuario podrá:

1. Escribir su correo.
2. Solicitar un enlace de recuperación.
3. Abrir el enlace.
4. Establecer una nueva contraseña.
5. Iniciar sesión con la nueva contraseña.

El mensaje mostrado deberá ser neutral:

```text
Si existe una cuenta asociada, recibirás las instrucciones correspondientes.
```

## RF-AUTH-007 — Cambio de contraseña

Desde configuración, el usuario podrá cambiar su contraseña.

Deberá requerirse:

- Sesión válida.
- Contraseña actual cuando corresponda.
- Nueva contraseña.
- Confirmación de la nueva contraseña.

## RF-AUTH-008 — Cierre de sesión

El usuario deberá poder cerrar la sesión actual.

Después del cierre:

- Se limpiará la sesión.
- Se eliminará información privada de la interfaz.
- Se redirigirá a inicio de sesión.

## RF-AUTH-009 — Gestión de sesiones

En una fase posterior deberá ser posible:

- Mostrar sesiones activas.
- Cerrar otras sesiones.
- Identificar dispositivo aproximado.
- Revocar tokens.

No es obligatorio para el MVP.

---

# 12. Onboarding inicial

El onboarding se mostrará una sola vez después de confirmar la cuenta.

## RF-ONB-001 — Bienvenida

La primera pantalla deberá explicar:

- Qué es Okiro.
- Qué información registrará.
- Cómo funciona el progreso.
- Que la aplicación no sustituye asesoría médica.
- Que los objetivos pueden modificarse posteriormente.

## RF-ONB-002 — Perfil

El usuario configurará:

- Nombre visible.
- Nombre de usuario opcional.
- Avatar opcional.
- Fecha de nacimiento opcional.
- Zona horaria.
- Sistema de unidades.
- Idioma.

La zona horaria se detectará automáticamente, pero deberá ser confirmada.

## RF-ONB-003 — Objetivos de ejercicio

El usuario configurará:

- Días objetivo por semana.
- Días preferidos.
- Días de descanso.
- Duración habitual.
- Tipos de entrenamiento preferidos.

Valor predeterminado:

```text
5 días por semana
```

## RF-ONB-004 — Objetivo de sueño

El usuario configurará:

- Horas mínimas.
- Horas máximas.
- Hora objetivo para dormir.
- Tolerancia de horario.

Valores predeterminados:

```text
Mínimo: 7 horas
Máximo: 9 horas
Tolerancia: 45 minutos
```

## RF-ONB-005 — Objetivo de hidratación

El usuario configurará:

- Cantidad diaria.
- Unidad de medida.
- Tamaños rápidos de registro.

Ejemplo:

```text
Objetivo: 2,500 ml
Botones rápidos: 250 ml, 500 ml, 750 ml
```

## RF-ONB-006 — Objetivo de programación

El usuario configurará:

- Días por semana.
- Duración mínima.
- Días preferidos.

Valor predeterminado:

```text
3 días por semana
```

## RF-ONB-007 — Alimentación

El usuario configurará:

- Número esperado de comidas principales.
- Disponibilidad de comida flexible.
- Preferencias básicas.
- Restricciones opcionales.

No se solicitarán diagnósticos médicos durante el MVP.

## RF-ONB-008 — Confirmación

Antes de finalizar, se mostrará un resumen.

Al confirmar:

- Se crearán las metas vigentes.
- Se generará el ciclo semanal actual.
- Se crearán las misiones correspondientes.
- Se marcará el onboarding como completado.
- Se dirigirá al dashboard.

---

# 13. Dashboard principal

Ruta:

```text
/app
```

El dashboard será la pantalla principal de uso diario.

## RF-DASH-001 — Encabezado

Deberá mostrar:

- Saludo.
- Nombre del usuario.
- Fecha actual.
- Estado general del día.
- Avatar.
- Acceso a notificaciones.

## RF-DASH-002 — Nivel

Deberá mostrar:

- Nivel actual.
- XP consolidada.
- XP necesaria para el siguiente nivel.
- Barra de progreso.
- XP provisional de la semana.

La XP provisional deberá distinguirse visualmente de la consolidada.

## RF-DASH-003 — Rango semanal

Deberá mostrar:

- Rango actual estimado.
- Puntuación semanal.
- Días restantes.
- Tendencia respecto a la semana anterior.

Antes del cierre semanal se deberá indicar que el rango es provisional.

## RF-DASH-004 — Misiones del día

Deberá mostrar:

- Lista de misiones.
- Estado de cada misión.
- Progreso.
- Recompensa potencial.
- Acceso directo al registro relacionado.

## RF-DASH-005 — Resumen de pilares

Deberá mostrar:

- Ejercicio.
- Sueño.
- Alimentación.
- Hidratación.
- Programación.

Cada pilar mostrará:

- Estado.
- Progreso diario o semanal.
- Indicador visual.
- Acción rápida.

## RF-DASH-006 — Acción rápida

El botón principal de acción permitirá registrar:

- Entrenamiento.
- Comida.
- Agua.
- Sueño.
- Sesión de programación.

La acción deberá estar disponible con el menor número posible de pulsaciones.

## RF-DASH-007 — Actividad reciente

Deberá mostrar los últimos registros:

- Tipo.
- Hora.
- XP generada o afectada.
- Estado provisional.
- Acceso al detalle.

---

# 14. Navegación móvil

La aplicación deberá utilizar una barra de navegación inferior.

## Navegación principal

1. Inicio.
2. Registrar.
3. Historial.
4. Progreso.
5. Perfil.

## Reglas

- La barra deberá permanecer accesible.
- Deberá respetar la zona segura inferior.
- La opción activa deberá ser visible.
- No deberá cubrir contenido.
- Deberá poder utilizarse con una sola mano.
- Las acciones frecuentes no deberán quedar ocultas en menús profundos.

En escritorio, la navegación podrá transformarse en una barra lateral.

---

# 15. Registro rápido

Ruta:

```text
/app/log
```

## RF-LOG-001 — Selector

El usuario elegirá el tipo de registro:

- Entrenamiento.
- Sueño.
- Comida.
- Agua.
- Programación.

## RF-LOG-002 — Valores recientes

La aplicación podrá mostrar:

- Últimos valores utilizados.
- Acciones frecuentes.
- Plantillas.
- Horarios comunes.

## RF-LOG-003 — Confirmación

Después de guardar:

- Se mostrará confirmación.
- Se mostrará XP generada o afectada.
- Se actualizará el dashboard.
- Se actualizarán misiones.
- Se actualizará el rango provisional.

## RF-LOG-004 — Prevención de duplicados

La aplicación deberá detectar posibles duplicados.

Ejemplo:

```text
Ya existe un entrenamiento registrado en este horario.
```

El usuario deberá poder:

- Cancelar.
- Revisar el registro existente.
- Confirmar que se trata de otra actividad.

---

# 16. Entrenamientos

Ruta:

```text
/app/workouts
```

## RF-WRK-001 — Crear entrenamiento

Campos:

- Fecha.
- Hora de inicio.
- Duración.
- Tipo.
- Intensidad.
- Nombre opcional.
- Notas opcionales.
- Origen del registro.
- Estado de verificación.

Tipos iniciales:

- Fuerza.
- Cardio.
- Caminata.
- Ciclismo.
- Natación.
- Box.
- MMA.
- Deporte.
- Movilidad.
- Yoga.
- Recuperación activa.
- Funcional.
- Mixto.
- Otro.

## RF-WRK-002 — Intensidad

Valores:

- Ligera.
- Moderada.
- Intensa.

La intensidad no alterará automáticamente la XP durante el MVP salvo que el documento de XP lo determine.

## RF-WRK-003 — Edición

Un entrenamiento podrá editarse mientras la semana esté abierta.

Editar deberá:

- Recalcular XP.
- Recalcular atributos.
- Actualizar misiones.
- Conservar auditoría.
- Evitar transacciones duplicadas.

## RF-WRK-004 — Eliminación

Un entrenamiento podrá eliminarse mientras la semana esté abierta.

La eliminación deberá:

- Marcar el registro como eliminado.
- Revertir la transacción correspondiente.
- Recalcular el resumen.
- Solicitar confirmación.

## RF-WRK-005 — Semana cerrada

Los entrenamientos de semanas consolidadas serán de solo lectura.

## RF-WRK-006 — Plantillas

El usuario podrá crear plantillas simples.

Ejemplo:

```text
Gimnasio — Fuerza — 60 minutos
```

Las plantillas no serán obligatorias para el MVP inicial, pero el modelo deberá permitirlas.

---

# 17. Sueño

Ruta:

```text
/app/sleep
```

## RF-SLP-001 — Registro

El usuario registrará:

- Fecha de sueño.
- Hora de dormir.
- Hora de despertar.
- Duración calculada.
- Calidad subjetiva opcional.
- Interrupciones opcionales.
- Notas opcionales.

## RF-SLP-002 — Cálculo automático

La duración deberá calcularse considerando:

- Cambio de día.
- Zona horaria.
- Horario de verano.
- Hora de dormir.
- Hora de despertar.

## RF-SLP-003 — Registro principal

Durante el MVP se permitirá un registro principal de sueño por día de despertar.

## RF-SLP-004 — Siestas

Las siestas podrán registrarse posteriormente.

No deberán sumarse automáticamente al sueño principal durante el MVP.

## RF-SLP-005 — Edición y eliminación

Aplicarán las mismas reglas de semana abierta y cerrada.

---

# 18. Alimentación

Ruta:

```text
/app/nutrition
```

## RF-NUT-001 — Crear comida

Campos:

- Fecha.
- Hora.
- Tipo de comida.
- Nombre o descripción.
- Clasificación.
- Etiquetas opcionales.
- Fotografía opcional.
- Notas opcionales.
- Indicador de comida flexible.

Tipos:

- Desayuno.
- Comida.
- Cena.
- Snack.
- Otro.

Clasificaciones:

- Equilibrada.
- Adecuada.
- Flexible.
- Fuera del plan.
- Exceso considerable.

## RF-NUT-002 — Comida flexible

La aplicación deberá:

- Indicar si está disponible.
- Permitir utilizarla.
- Mostrar cuántas se han utilizado.
- Impedir marcar varias cuando el límite haya sido alcanzado.
- Aplicar las reglas del sistema de XP.

## RF-NUT-003 — Fotografías

Las fotografías serán opcionales.

Cuando se implementen:

- Se guardarán en Supabase Storage.
- Tendrán tamaño limitado.
- Se comprimirán antes de subirlas.
- Serán privadas.
- Utilizarán una ruta basada en el usuario.

## RF-NUT-004 — No moralización

La interfaz no deberá utilizar expresiones como:

- Comida buena.
- Comida mala.
- Pecado.
- Trampa.
- Castigo.
- Compensación.

Se utilizará lenguaje descriptivo y neutral.

---

# 19. Hidratación

Ruta:

```text
/app/hydration
```

## RF-HYD-001 — Registro rápido

El usuario podrá registrar agua mediante botones rápidos:

- 250 ml.
- 500 ml.
- 750 ml.
- Cantidad personalizada.

## RF-HYD-002 — Progreso diario

Se mostrará:

- Cantidad consumida.
- Objetivo.
- Porcentaje.
- Cantidad restante.
- Historial del día.

## RF-HYD-003 — Edición

Cada entrada podrá:

- Editarse.
- Eliminarse.
- Recalcular el total diario.

## RF-HYD-004 — Límite visual

Al superar el objetivo:

- La barra no deberá crecer indefinidamente.
- Se mostrará la cantidad real.
- Se indicará que no existe XP adicional por exceso.

---

# 20. Programación y enfoque

Ruta:

```text
/app/focus
```

## RF-FCS-001 — Crear sesión

Campos:

- Fecha.
- Hora de inicio.
- Duración.
- Objetivo.
- Proyecto opcional.
- Tipo de actividad.
- Notas opcionales.

Tipos iniciales:

- Programación.
- Estudio técnico.
- Ejercicios.
- Curso.
- Lectura técnica.
- Proyecto personal.

Durante el MVP, únicamente programación deberá afectar el sistema principal si así lo determina la especificación de XP.

## RF-FCS-002 — Temporizador

El temporizador integrado será opcional para una fase posterior.

Durante el MVP se permitirá el registro manual.

## RF-FCS-003 — Solapamientos

La aplicación deberá detectar:

- Sesiones duplicadas.
- Horarios solapados.
- Duraciones imposibles.

---

# 21. Misiones diarias

Ruta de detalle:

```text
/app/missions
```

## RF-MIS-001 — Generación

Las misiones se generarán según:

- Objetivos activos.
- Día de la semana.
- Días de entrenamiento.
- Días de programación.
- Días de descanso.
- Modo de protección.
- Progreso registrado.

## RF-MIS-002 — Estados

Estados permitidos:

- Pendiente.
- En progreso.
- Completada.
- Fallida.
- Excluida.
- Protegida.

## RF-MIS-003 — Actualización automática

Una misión deberá actualizarse cuando el registro relacionado cambie.

Ejemplo:

Registrar 2,500 ml deberá completar la misión de hidratación correspondiente.

## RF-MIS-004 — Sin confirmación manual injustificada

Las misiones verificables mediante registros no deberán poder marcarse manualmente como completadas.

## RF-MIS-005 — Cierre diario

El estado final se calculará al finalizar el día local del usuario.

---

# 22. Historial y calendario

Ruta:

```text
/app/history
```

## RF-HIS-001 — Vista de calendario

El calendario deberá mostrar indicadores para:

- Entrenamiento.
- Sueño.
- Alimentación.
- Hidratación.
- Programación.
- Misión diaria completa.
- Rango semanal.

## RF-HIS-002 — Vista diaria

Al seleccionar un día se mostrarán:

- Registros.
- XP positiva.
- Penalizaciones.
- Misiones.
- Resumen de pilares.
- Estado del día.

## RF-HIS-003 — Filtros

Filtros disponibles:

- Periodo.
- Tipo de actividad.
- Pilar.
- Registros positivos.
- Registros con penalización.
- Semana abierta o cerrada.

## RF-HIS-004 — Búsqueda

La búsqueda textual podrá incluir:

- Nombre del entrenamiento.
- Descripción de comida.
- Objetivo de programación.
- Notas.

---

# 23. Progreso

Ruta:

```text
/app/progress
```

## RF-PRG-001 — Nivel general

Mostrar:

- Nivel.
- XP total.
- Progreso al siguiente nivel.
- Fecha de última subida.
- Historial de niveles.

## RF-PRG-002 — Atributos

Mostrar:

- Fuerza.
- Resistencia.
- Vitalidad.
- Inteligencia.
- Disciplina.

Cada atributo mostrará:

- Nivel.
- XP acumulada.
- Progreso.
- Actividades que lo alimentan.

## RF-PRG-003 — Tendencias

Gráficas:

- XP por semana.
- Rangos semanales.
- Días de ejercicio.
- Promedio de sueño.
- Alimentación.
- Hidratación.
- Programación.
- Cumplimiento de misiones.

Periodos:

- Cuatro semanas.
- Tres meses.
- Seis meses.
- Un año.
- Todo el historial.

## RF-PRG-004 — Comparación

La aplicación podrá comparar:

- Semana actual contra anterior.
- Mes actual contra anterior.
- Promedio reciente.
- Mejor semana histórica.

No se utilizarán comparaciones contra otros usuarios durante el MVP.

---

# 24. Reporte semanal

Ruta:

```text
/app/reports/[weekId]
```

## RF-REP-001 — Contenido

El reporte deberá mostrar:

- Fecha inicial y final.
- XP positiva.
- Bonificaciones.
- Penalizaciones.
- XP neta.
- XP consolidada.
- Rango.
- Puntuación por pilar.
- Cobertura de datos.
- Racha.
- Nivel anterior.
- Nivel nuevo.
- Atributos afectados.
- Logros obtenidos.
- Recomendación principal.

## RF-REP-002 — Explicabilidad

Cada cantidad deberá permitir consultar:

- Origen.
- Registro.
- Fecha.
- Regla aplicada.
- Límite aplicado.
- Ajuste realizado.

## RF-REP-003 — Estado

Estados del reporte:

- Provisional.
- Pendiente de cierre.
- Consolidado.
- Ajustado.

## RF-REP-004 — Semana sin actividad

Una semana sin actividad deberá generar un reporte válido.

No deberá provocar errores por:

- Divisiones entre cero.
- Falta de registros.
- Falta de transacciones positivas.
- Falta de atributos.

---

# 25. Rachas y logros

## RF-ACH-001 — Rachas

La aplicación mostrará:

- Racha diaria.
- Racha semanal.
- Mejor racha diaria.
- Mejor racha semanal.
- Próximo hito.

## RF-ACH-002 — Logros

Cada logro contendrá:

- Código único.
- Nombre.
- Descripción.
- Icono.
- Condición.
- Fecha de desbloqueo.
- Recompensa.
- Rareza opcional.

## RF-ACH-003 — Entrega idempotente

Un logro no repetible no podrá entregarse más de una vez.

## RF-ACH-004 — Logros ocultos

Podrán existir logros ocultos, pero no serán necesarios para el MVP.

---

# 26. Modo de protección

Ruta:

```text
/app/settings/protection
```

## RF-PRT-001 — Crear periodo

El usuario podrá seleccionar:

- Motivo.
- Fecha inicial.
- Fecha final.
- Pilares afectados.
- Notas opcionales.

Motivos:

- Enfermedad.
- Lesión.
- Viaje.
- Exámenes.
- Emergencia.
- Otro.

## RF-PRT-002 — Validación

El sistema deberá:

- Respetar el límite configurado.
- Evitar periodos duplicados.
- Evitar fechas inválidas.
- Recalcular misiones.
- Recalcular rango.
- Registrar auditoría.

## RF-PRT-003 — Cambios

Un periodo podrá modificarse mientras no haya sido consolidado.

---

# 27. Perfil y configuración

Ruta:

```text
/app/settings
```

## Secciones

- Perfil.
- Cuenta.
- Objetivos.
- Apariencia.
- Notificaciones.
- Privacidad.
- Datos.
- Modo de protección.
- Acerca de Okiro.

## RF-SET-001 — Perfil

El usuario podrá modificar:

- Nombre visible.
- Avatar.
- Nombre de usuario.
- Zona horaria.
- Idioma.
- Sistema de unidades.

## RF-SET-002 — Objetivos

El usuario podrá modificar:

- Ejercicio.
- Sueño.
- Hidratación.
- Programación.
- Alimentación.

Los cambios entrarán en vigor según las reglas del sistema de XP.

No deberán alterar retroactivamente una semana en curso cuando ello permita manipular resultados.

## RF-SET-003 — Apariencia

Configuraciones:

- Sistema.
- Claro.
- Oscuro.

El diseño inicial podrá priorizar tema oscuro, pero deberá utilizar tokens para permitir ambos temas.

## RF-SET-004 — Notificaciones

El usuario podrá activar o desactivar:

- Recordatorio de agua.
- Recordatorio de entrenamiento.
- Recordatorio de sueño.
- Recordatorio de registro.
- Reporte semanal.
- Aviso de misión.
- Subida de nivel.

## RF-SET-005 — Exportación

El usuario podrá solicitar una exportación de:

- Perfil.
- Objetivos.
- Actividades.
- XP.
- Reportes.
- Logros.

Formato inicial:

```text
JSON
```

CSV podrá agregarse posteriormente.

## RF-SET-006 — Eliminación de cuenta

La eliminación requerirá:

- Reautenticación.
- Confirmación explícita.
- Escritura de una frase de confirmación.
- Advertencia de irreversibilidad.

La eliminación deberá considerar:

- Datos de perfil.
- Registros.
- Transacciones.
- Archivos.
- Suscripciones push.
- Sesiones.
- Datos derivados.

---

# 28. Notificaciones

## 28.1 MVP

El MVP deberá incluir:

- Notificaciones dentro de la aplicación.
- Indicadores pendientes.
- Preferencias.
- Recordatorios visuales.
- Resumen semanal.

## 28.2 Notificaciones push

Las notificaciones Web Push podrán implementarse durante el MVP avanzado o una segunda fase.

Deberán requerir:

- Permiso explícito.
- PWA instalada cuando el navegador lo requiera.
- Service Worker.
- Suscripción push.
- Claves VAPID.
- Almacenamiento seguro de suscripciones.
- Posibilidad de desactivarlas.
- Eliminación de suscripciones inválidas.

## 28.3 Reglas

- Nunca solicitar permiso al abrir la aplicación por primera vez.
- Explicar el beneficio antes de abrir el diálogo del navegador.
- No enviar notificaciones excesivas.
- Respetar horario silencioso.
- No incluir datos sensibles en la pantalla bloqueada.
- Permitir personalizar horarios.

---

# 29. Mapa de rutas

## Públicas

```text
/
/login
/register
/verify-email
/forgot-password
/reset-password
/auth/callback
/privacy
/terms
/offline
```

## Protegidas

```text
/onboarding
/app
/app/log
/app/workouts
/app/workouts/[id]
/app/sleep
/app/nutrition
/app/hydration
/app/focus
/app/missions
/app/history
/app/progress
/app/reports
/app/reports/[weekId]
/app/achievements
/app/settings
/app/settings/profile
/app/settings/goals
/app/settings/account
/app/settings/notifications
/app/settings/privacy
/app/settings/protection
```

## Reglas de protección

- Un usuario no autenticado será dirigido a `/login`.
- Un usuario autenticado sin onboarding será dirigido a `/onboarding`.
- Un usuario autenticado con onboarding no deberá volver al onboarding salvo mediante configuración.
- Las rutas de autenticación podrán redirigir al dashboard cuando ya exista sesión.

---

# 30. Modelo de datos

Todas las tablas de usuario deberán incluir, cuando corresponda:

```text
id uuid primary key
user_id uuid not null
created_at timestamptz not null
updated_at timestamptz not null
deleted_at timestamptz null
```

Las fechas reales deberán guardarse en UTC.

Las agrupaciones diarias y semanales deberán realizarse utilizando la zona horaria del usuario.

---

## 30.1 `profiles`

Representa el perfil público y funcional del usuario.

Campos principales:

```text
id uuid
email text
display_name text
username text
avatar_path text
birth_date date
timezone text
locale text
unit_system text
onboarding_completed_at timestamptz
terms_accepted_at timestamptz
privacy_accepted_at timestamptz
created_at timestamptz
updated_at timestamptz
```

Reglas:

- `id` deberá corresponder con `auth.users.id`.
- `username` será opcional y único cuando exista.
- El correo no deberá utilizarse como identificador visible principal.

---

## 30.2 `user_preferences`

Campos:

```text
user_id uuid
theme text
week_starts_on integer
time_format text
date_format text
reduced_motion boolean
created_at timestamptz
updated_at timestamptz
```

---

## 30.3 `goal_versions`

Almacena versiones históricas de objetivos.

Campos:

```text
id uuid
user_id uuid
effective_from date
effective_until date
exercise_days_target numeric
programming_days_target integer
hydration_target_ml integer
sleep_min_minutes integer
sleep_max_minutes integer
sleep_target_time time
sleep_tolerance_minutes integer
expected_main_meals integer
flexible_meals_per_week integer
created_at timestamptz
```

Reglas:

- No deberán existir periodos vigentes solapados.
- Los cambios deberán crear una nueva versión.
- No se deberá sobrescribir el historial.

---

## 30.4 `weekly_cycles`

Campos:

```text
id uuid
user_id uuid
week_start date
week_end date
timezone text
goal_version_id uuid
status text
opened_at timestamptz
scheduled_close_at timestamptz
closed_at timestamptz
created_at timestamptz
updated_at timestamptz
```

Estados:

- `open`
- `pending_close`
- `closed`
- `adjusted`

Restricción:

```text
unique(user_id, week_start)
```

---

## 30.5 `workouts`

Campos:

```text
id uuid
user_id uuid
occurred_at timestamptz
local_date date
duration_minutes integer
workout_type text
intensity text
title text
notes text
source text
verification_status text
weekly_cycle_id uuid
created_at timestamptz
updated_at timestamptz
deleted_at timestamptz
```

Restricciones:

- Duración positiva.
- Fecha local obligatoria.
- Usuario obligatorio.
- Semana asociada.

---

## 30.6 `sleep_logs`

Campos:

```text
id uuid
user_id uuid
sleep_started_at timestamptz
woke_up_at timestamptz
wake_local_date date
duration_minutes integer
quality integer
interruptions integer
notes text
weekly_cycle_id uuid
created_at timestamptz
updated_at timestamptz
deleted_at timestamptz
```

Restricción inicial:

```text
unique(user_id, wake_local_date)
```

considerando únicamente registros activos.

---

## 30.7 `meal_logs`

Campos:

```text
id uuid
user_id uuid
occurred_at timestamptz
local_date date
meal_type text
description text
classification text
is_flexible_meal boolean
photo_path text
notes text
weekly_cycle_id uuid
created_at timestamptz
updated_at timestamptz
deleted_at timestamptz
```

---

## 30.8 `hydration_entries`

Campos:

```text
id uuid
user_id uuid
occurred_at timestamptz
local_date date
amount_ml integer
source text
weekly_cycle_id uuid
created_at timestamptz
updated_at timestamptz
deleted_at timestamptz
```

Restricción:

```text
amount_ml > 0
```

---

## 30.9 `focus_sessions`

Campos:

```text
id uuid
user_id uuid
started_at timestamptz
local_date date
duration_minutes integer
focus_type text
objective text
project_name text
notes text
weekly_cycle_id uuid
created_at timestamptz
updated_at timestamptz
deleted_at timestamptz
```

---

## 30.10 `daily_missions`

Campos:

```text
id uuid
user_id uuid
mission_date date
weekly_cycle_id uuid
status text
completed_required_items integer
total_required_items integer
bonus_earned boolean
created_at timestamptz
updated_at timestamptz
```

Restricción:

```text
unique(user_id, mission_date)
```

---

## 30.11 `daily_mission_items`

Campos:

```text
id uuid
daily_mission_id uuid
user_id uuid
mission_type text
title text
description text
target_value numeric
current_value numeric
unit text
is_required boolean
status text
source_type text
created_at timestamptz
updated_at timestamptz
```

---

## 30.12 `xp_transactions`

Campos:

```text
id uuid
user_id uuid
weekly_cycle_id uuid
category text
source_type text
source_id uuid
amount integer
attribute text
status text
rule_code text
rule_version text
metadata jsonb
occurred_at timestamptz
created_at timestamptz
reversed_transaction_id uuid
idempotency_key text
```

Restricciones:

```text
unique(idempotency_key)
```

Estados:

- `provisional`
- `consolidated`
- `reversed`
- `adjustment`

Reglas:

- El cliente no podrá insertar transacciones directamente.
- El cliente no podrá actualizar cantidades.
- Toda transacción deberá indicar la regla aplicada.
- Las reversiones deberán conservar el historial.

---

## 30.13 `weekly_summaries`

Campos:

```text
id uuid
user_id uuid
weekly_cycle_id uuid
positive_xp integer
bonus_xp integer
raw_penalty_xp integer
applied_penalty_xp integer
net_xp integer
consolidated_xp integer
rank_score numeric
rank text
exercise_score numeric
sleep_score numeric
nutrition_score numeric
hydration_score numeric
programming_score numeric
data_coverage numeric
previous_level integer
resulting_level integer
calculation_version text
calculation_snapshot jsonb
created_at timestamptz
updated_at timestamptz
```

Restricción:

```text
unique(weekly_cycle_id)
```

El snapshot deberá permitir reproducir el cálculo histórico.

---

## 30.14 `user_progress`

Campos:

```text
user_id uuid
current_level integer
total_consolidated_xp bigint
current_level_xp integer
xp_required_for_next_level integer
updated_at timestamptz
```

Restricción:

```text
unique(user_id)
```

---

## 30.15 `attribute_progress`

Campos:

```text
id uuid
user_id uuid
attribute text
level integer
total_xp bigint
current_level_xp integer
xp_required_for_next_level integer
updated_at timestamptz
```

Restricción:

```text
unique(user_id, attribute)
```

---

## 30.16 `streaks`

Campos:

```text
id uuid
user_id uuid
streak_type text
current_count integer
best_count integer
started_at date
last_qualified_date date
updated_at timestamptz
```

Restricción:

```text
unique(user_id, streak_type)
```

---

## 30.17 `achievements`

Catálogo global.

Campos:

```text
id uuid
code text
name text
description text
icon text
category text
is_repeatable boolean
is_hidden boolean
reward_xp integer
reward_attribute text
condition_config jsonb
created_at timestamptz
```

Restricción:

```text
unique(code)
```

---

## 30.18 `user_achievements`

Campos:

```text
id uuid
user_id uuid
achievement_id uuid
unlocked_at timestamptz
weekly_cycle_id uuid
metadata jsonb
idempotency_key text
```

---

## 30.19 `protection_periods`

Campos:

```text
id uuid
user_id uuid
reason text
starts_on date
ends_on date
affected_pillars text[]
notes text
status text
created_at timestamptz
updated_at timestamptz
```

---

## 30.20 `notification_preferences`

Campos:

```text
user_id uuid
hydration_enabled boolean
workout_enabled boolean
sleep_enabled boolean
logging_enabled boolean
weekly_report_enabled boolean
level_up_enabled boolean
quiet_hours_start time
quiet_hours_end time
timezone text
updated_at timestamptz
```

---

## 30.21 `push_subscriptions`

Campos:

```text
id uuid
user_id uuid
endpoint text
p256dh text
auth text
device_label text
last_used_at timestamptz
expires_at timestamptz
created_at timestamptz
```

El endpoint deberá almacenarse de forma segura.

---

## 30.22 `audit_events`

Campos:

```text
id uuid
user_id uuid
actor_type text
action text
entity_type text
entity_id uuid
before_data jsonb
after_data jsonb
request_id text
created_at timestamptz
```

No deberá almacenar:

- Contraseñas.
- Tokens.
- Secretos.
- Cookies.
- Claves API.

---

# 31. Índices mínimos

Se deberán crear índices para:

```text
(user_id, local_date)
(user_id, occurred_at)
(user_id, week_start)
(user_id, status)
(weekly_cycle_id)
(source_type, source_id)
(user_id, created_at)
(user_id, deleted_at)
```

Índices parciales recomendados:

```text
WHERE deleted_at IS NULL
```

Las consultas principales deberán revisarse con planes de ejecución cuando el volumen crezca.

---

# 32. Row Level Security

## 32.1 Regla general

Un usuario solamente podrá consultar registros donde:

```sql
auth.uid() = user_id
```

## 32.2 Tablas editables por usuario

El usuario podrá insertar y modificar sus propios registros en:

- `profiles`
- `user_preferences`
- `goal_versions`, mediante caso de uso controlado
- `workouts`
- `sleep_logs`
- `meal_logs`
- `hydration_entries`
- `focus_sessions`
- `protection_periods`
- `notification_preferences`
- `push_subscriptions`

## 32.3 Tablas de solo lectura para el cliente

El cliente podrá consultar, pero no insertar directamente:

- `xp_transactions`
- `weekly_summaries`
- `user_progress`
- `attribute_progress`
- `streaks`
- `user_achievements`
- `daily_missions`
- `daily_mission_items`

Sus escrituras deberán realizarse mediante funciones controladas.

## 32.4 Catálogos públicos autenticados

`achievements` podrá ser legible por usuarios autenticados.

No deberá ser modificable desde el cliente.

## 32.5 Claves privilegiadas

La clave secreta de Supabase:

- Nunca deberá incluirse en variables públicas.
- Nunca deberá utilizarse en componentes cliente.
- Nunca deberá aparecer en logs.
- Nunca deberá almacenarse en el repositorio.
- Solamente deberá utilizarse en procesos backend autorizados.

---

# 33. Storage

Buckets iniciales:

```text
avatars
meal-photos
exports
```

## Reglas

- Los buckets serán privados.
- Cada archivo deberá estar bajo una carpeta del usuario.
- El usuario solamente podrá acceder a su propia carpeta.
- Los nombres físicos deberán utilizar UUID.
- No se confiará en el nombre original.
- Se validará tipo MIME.
- Se limitará tamaño.
- Se eliminarán archivos asociados a registros eliminados cuando corresponda.

Ejemplo de ruta:

```text
{userId}/meals/{mealId}/{fileId}.webp
```

---

# 34. Motor de XP

## 34.1 Fuente de verdad

El motor deberá implementar exactamente:

```text
Especificación Funcional - Sistema de XP.md
```

## 34.2 Ubicación

La lógica deberá residir en un módulo independiente y probado.

Estructura sugerida:

```text
src/modules/xp/domain/
├── calculate-exercise-xp.ts
├── calculate-sleep-xp.ts
├── calculate-nutrition-xp.ts
├── calculate-hydration-xp.ts
├── calculate-focus-xp.ts
├── calculate-daily-missions.ts
├── calculate-weekly-rank.ts
├── calculate-level.ts
├── calculate-attributes.ts
├── calculate-streaks.ts
├── limits.ts
├── rules.ts
├── types.ts
└── index.ts
```

## 34.3 Reglas

- Las funciones deberán ser puras cuando sea posible.
- No deberán consultar la base directamente.
- Recibirán datos tipados.
- Devolverán resultados tipados.
- No deberán utilizar la hora actual directamente.
- La fecha de cálculo deberá recibirse como parámetro.
- Toda regla tendrá código y versión.
- Los redondeos deberán estar centralizados.
- Los límites deberán estar centralizados.
- Los resultados deberán ser deterministas.

## 34.4 Versión de cálculo

Cada resumen deberá almacenar:

```text
calculation_version
```

Ejemplo:

```text
xp-engine-1.0.0
```

Esto permitirá conservar reportes históricos aunque las reglas cambien posteriormente.

---

# 35. Procesamiento al crear o editar registros

Flujo obligatorio:

```text
1. Validar sesión.
2. Validar payload.
3. Resolver zona horaria.
4. Determinar fecha local.
5. Determinar ciclo semanal.
6. Verificar que la semana esté abierta.
7. Guardar o actualizar el registro.
8. Recalcular transacciones afectadas.
9. Recalcular misión diaria.
10. Recalcular resumen semanal provisional.
11. Registrar auditoría.
12. Invalidar caché.
13. Devolver resultado actualizado.
```

Si cualquier paso crítico falla:

- La operación no deberá quedar parcialmente aplicada.
- Deberá devolverse un error controlado.
- No deberá duplicarse XP al reintentar.

---

# 36. Cierre semanal automático

## 36.1 Programación

Supabase Cron ejecutará periódicamente una Edge Function responsable de localizar semanas elegibles para cierre.

## 36.2 Compatibilidad con zonas horarias

El proceso deberá ejecutarse al menos una vez por hora.

Para cada usuario verificará:

- Zona horaria.
- Semana pendiente.
- Hora local.
- Periodo de corrección.
- Estado del ciclo.

## 36.3 Flujo

```text
1. Encontrar ciclos abiertos elegibles.
2. Bloquear lógicamente el ciclo.
3. Obtener registros.
4. Recalcular transacciones.
5. Aplicar límites.
6. Calcular resumen.
7. Consolidar XP.
8. Actualizar nivel.
9. Actualizar atributos.
10. Actualizar rachas.
11. Entregar logros.
12. Crear siguiente ciclo.
13. Generar nuevas misiones.
14. Marcar el ciclo como cerrado.
15. Crear notificación.
```

## 36.4 Idempotencia

Cada cierre deberá utilizar una clave única:

```text
weekly-close:{userId}:{weekStart}:{calculationVersion}
```

## 36.5 Concurrencia

Dos procesos no deberán cerrar la misma semana simultáneamente.

Se deberá utilizar:

- Bloqueo transaccional.
- Estado intermedio.
- Restricción única.
- Idempotency key.

---

# 37. API y mutaciones

## 37.1 Preferencia

Se utilizarán:

- Server Actions para formularios internos.
- Route Handlers para endpoints HTTP.
- Edge Functions para procesos programados y operaciones privilegiadas.
- Funciones PostgreSQL para operaciones atómicas cuando sea necesario.

## 37.2 Formato de respuesta

```typescript
type ActionResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
        fieldErrors?: Record<string, string[]>;
        requestId?: string;
      };
    };
```

## 37.3 Códigos de error

Ejemplos:

```text
AUTH_REQUIRED
EMAIL_NOT_VERIFIED
ONBOARDING_REQUIRED
VALIDATION_ERROR
WEEK_CLOSED
DUPLICATE_RECORD
NOT_FOUND
FORBIDDEN
RATE_LIMITED
CONFLICT
INTERNAL_ERROR
```

## 37.4 Validación

Todo payload deberá validarse dos veces:

- Cliente: experiencia inmediata.
- Servidor: seguridad e integridad.

El servidor será la autoridad final.

---

# 38. Manejo de fechas

Las fechas representan uno de los riesgos principales del proyecto.

## Reglas

1. Los instantes se almacenan como `timestamptz`.
2. Los días lógicos se almacenan adicionalmente como `date`.
3. La zona horaria se almacenará en formato IANA.
4. No se asumirá que todos los usuarios están en UTC.
5. No se agruparán días mediante la zona horaria del servidor.
6. El sueño pertenece al día local de despertar.
7. Las semanas se calcularán en la zona del usuario.
8. Los cambios de zona horaria no deberán reescribir automáticamente el historial.
9. El ciclo almacenará la zona horaria utilizada al crearlo.
10. Las pruebas deberán incluir cambios de día y horario de verano.

Ejemplo:

```text
America/Monterrey
```

---

# 39. Diseño y experiencia de usuario

## 39.1 Principios

La interfaz deberá ser:

- Clara.
- Oscura o neutra.
- Moderna.
- Premium.
- Minimalista.
- Inspirada en una interfaz de sistema RPG.
- Sin copiar elementos protegidos de Solo Leveling.
- Fácil de operar con una mano.
- Visualmente consistente.
- Accesible.

## 39.2 Identidad original

No deberán utilizarse:

- Personajes del anime.
- Logotipos oficiales.
- Capturas.
- Música.
- Tipografías extraídas.
- Iconos registrados.
- Textos copiados.
- Nombres protegidos.

Okiro deberá construir su propia identidad.

## 39.3 Sistema de diseño

Deberá existir un sistema de tokens para:

- Colores.
- Tipografía.
- Espaciado.
- Bordes.
- Radios.
- Sombras.
- Animaciones.
- Capas.
- Estados.
- Tamaños.

## 39.4 Estados obligatorios

Cada componente de datos deberá contemplar:

- Cargando.
- Vacío.
- Error.
- Éxito.
- Deshabilitado.
- Sin conexión.
- Sin permisos.
- Datos incompletos.

## 39.5 Interacciones

- Los botones táctiles deberán ser suficientemente grandes.
- Las acciones destructivas requerirán confirmación.
- Las animaciones deberán ser breves.
- Se deberá respetar `prefers-reduced-motion`.
- Las barras de progreso no deberán depender únicamente del color.
- Las etiquetas deberán permanecer comprensibles sin iconos.

---

# 40. Responsive design

## Anchuras objetivo

```text
Móvil mínimo: 320 px
Móvil principal: 360–430 px
Tablet: 768 px
Escritorio: 1024 px o superior
```

## Reglas

- No deberá existir desplazamiento horizontal accidental.
- Los formularios serán de una columna en móvil.
- Los diálogos complejos podrán convertirse en pantallas completas.
- Las tablas deberán convertirse en tarjetas o listas.
- Las gráficas deberán ser legibles en pantallas pequeñas.
- El contenido principal tendrá un ancho máximo en escritorio.
- La navegación inferior se transformará cuando exista espacio suficiente.

---

# 41. Accesibilidad

La aplicación tendrá como objetivo WCAG 2.2 nivel AA.

Requisitos:

- Navegación mediante teclado.
- Indicadores de foco.
- Etiquetas en formularios.
- Mensajes de error asociados.
- Contraste suficiente.
- Semántica HTML.
- Uso correcto de encabezados.
- Compatibilidad con lectores de pantalla.
- Texto alternativo.
- No depender exclusivamente del color.
- Respeto a movimiento reducido.
- Estados anunciados mediante regiones accesibles.
- Botones con nombres comprensibles.

---

# 42. Rendimiento

## Objetivos

En una conexión móvil razonable:

- El dashboard deberá mostrar contenido útil rápidamente.
- La navegación deberá sentirse inmediata.
- Los formularios no deberán bloquearse.
- Las gráficas pesadas deberán cargarse bajo demanda.
- Las imágenes deberán optimizarse.
- Los componentes cliente deberán limitarse.
- No se deberá descargar todo el historial al abrir la aplicación.

## Estrategias

- React Server Components.
- Carga diferida.
- Paginación.
- Consultas específicas.
- Caché controlada.
- Optimización de imágenes.
- Dividir gráficas en módulos.
- Evitar dependencias grandes innecesarias.
- Evitar renderizados repetidos.
- Índices de base de datos.

## Presupuesto inicial

- JavaScript inicial de rutas principales: mantenerlo tan bajo como sea razonablemente posible.
- Imágenes de comida: comprimidas.
- Avatar: tamaño reducido.
- Historial: paginado.
- Gráficas: no cargar hasta ser visibles o requeridas.

---

# 43. Seguridad

## 43.1 Contraseñas

- Serán administradas por Supabase Auth.
- No se almacenarán en tablas propias.
- No se registrarán en logs.
- No se enviarán a servicios externos.
- Se habilitará protección contra contraseñas comprometidas cuando esté disponible.

## 43.2 Correo

Producción deberá utilizar:

- Dominio propio.
- Remitente verificable.
- SMTP configurado.
- Plantillas propias.
- URLs de redirección controladas.

## 43.3 Variables de entorno

Variables públicas:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_APP_URL
```

Variables privadas:

```text
SUPABASE_SECRET_KEY
SUPABASE_DATABASE_URL
CRON_SECRET
VAPID_PUBLIC_KEY
VAPID_PRIVATE_KEY
VAPID_SUBJECT
EMAIL_PROVIDER_API_KEY
SENTRY_AUTH_TOKEN
```

Reglas:

- `.env*` no deberá subirse.
- Se mantendrá `.env.example`.
- Las claves se separarán por entorno.
- Las claves privadas no llevarán prefijo `NEXT_PUBLIC_`.
- Cambiar un secreto deberá requerir rotación controlada.

## 43.4 Protección de endpoints

Los endpoints deberán validar:

- Sesión.
- Usuario.
- Origen.
- Método.
- Esquema.
- Tamaño del payload.
- Límites de frecuencia.
- Estado de la semana.
- Propiedad del recurso.

## 43.5 Sanitización

- No se deberá renderizar HTML introducido por usuarios.
- Las notas serán texto plano.
- Los nombres de archivo serán reemplazados.
- Las URLs deberán validarse.
- Los errores internos no se mostrarán directamente.

## 43.6 Datos sensibles

Los registros de hábitos pueden ser sensibles.

La aplicación deberá:

- Mantenerlos privados.
- Evitar indexación.
- No colocarlos en metadatos públicos.
- No incluirlos en URLs.
- No enviarlos a analítica sin consentimiento.
- No incluir detalles en notificaciones bloqueadas.

## 43.7 Rate limiting

Deberá aplicarse especialmente a:

- Registro.
- Inicio de sesión.
- Recuperación.
- Reenvío de correo.
- Exportaciones.
- Eliminación de cuenta.
- Edge Functions.
- Notificaciones.

---

# 44. Privacidad

## Requisitos

- Política de privacidad accesible.
- Términos accesibles.
- Consentimiento versionado.
- Exportación de datos.
- Eliminación de cuenta.
- Minimización de datos.
- No solicitar información innecesaria.
- No vender información.
- No utilizar datos de hábitos para publicidad.
- No exponer información entre usuarios.

## Analítica

Durante el MVP, la analítica deberá limitarse a eventos técnicos y agregados.

No deberá enviar:

- Descripción de comidas.
- Notas.
- Peso.
- Información de salud.
- Contenido introducido por el usuario.

---

# 45. Observabilidad

## 45.1 Logs

Los logs deberán incluir:

- Nivel.
- Fecha.
- Entorno.
- Operación.
- Request ID.
- User ID anonimizado o interno.
- Resultado.
- Duración.
- Código de error.

No deberán incluir:

- Contraseñas.
- Cookies.
- Tokens.
- Claves.
- Contenido sensible.
- Fotografías.

## 45.2 Monitoreo

Se recomienda integrar:

- Errores frontend.
- Errores backend.
- Fallos de Edge Functions.
- Fallos de Cron.
- Rendimiento.
- Errores de base de datos.
- Cierres semanales fallidos.

## 45.3 Alertas críticas

- Cron sin ejecutar.
- Semana bloqueada.
- Cierre duplicado.
- Error de migración.
- Tasa elevada de fallos de autenticación.
- Uso anormal de Storage.
- Fallos en envío de correo.

---

# 46. Pruebas

## 46.1 Unitarias

Deberán cubrir:

- Fórmulas de XP.
- Límites.
- Redondeos.
- Niveles.
- Rangos.
- Atributos.
- Rachas.
- Cobertura de datos.
- Modo de protección.
- Fechas.
- Selección de semanas.
- Validaciones.

El motor de XP deberá tener cobertura especialmente alta.

## 46.2 Casos frontera obligatorios

- Cero actividades.
- Actividad exactamente en un límite.
- Duración un minuto debajo del límite.
- Duración un minuto arriba.
- Cambio de nivel múltiple.
- Semana con XP negativa.
- Penalización superior al límite.
- Registro eliminado.
- Registro editado.
- Mismo cierre ejecutado dos veces.
- Cambio de zona horaria.
- Sueño que cruza medianoche.
- Semana de cambio de mes.
- Semana de cambio de año.
- Usuario sin onboarding.
- Usuario con datos incompletos.
- Periodo protegido.
- Comida flexible excedida.
- Registro duplicado.

## 46.3 Integración

Deberán probar:

- RLS.
- Migraciones.
- Funciones SQL.
- Edge Functions.
- Creación de usuario.
- Creación de perfil.
- Actualización de objetivos.
- Escrituras autorizadas.
- Escrituras denegadas.
- Storage privado.
- Cierre semanal.

## 46.4 End-to-end

Flujos mínimos:

1. Registrarse.
2. Confirmar correo.
3. Completar onboarding.
4. Iniciar sesión.
5. Registrar entrenamiento.
6. Registrar agua.
7. Registrar comida.
8. Registrar sueño.
9. Registrar programación.
10. Consultar dashboard.
11. Editar registro.
12. Eliminar registro.
13. Consultar reporte.
14. Cambiar objetivos.
15. Cerrar sesión.
16. Recuperar contraseña.
17. Eliminar cuenta.

## 46.5 Navegadores

Pruebas principales:

- Chromium móvil.
- WebKit móvil.
- Chromium escritorio.
- Firefox escritorio.

---

# 47. Entornos

## 47.1 Local

Incluye:

- Next.js local.
- Supabase CLI.
- PostgreSQL local.
- Auth local.
- Edge Functions locales.
- Datos de prueba.
- Correo capturado localmente.

## 47.2 Preview

Cada Pull Request deberá generar un despliegue Preview.

Preview deberá utilizar:

- Variables propias.
- Base de datos de desarrollo o staging.
- Datos no productivos.
- URLs de redirección autorizadas.

Preview nunca deberá apuntar por defecto a producción.

## 47.3 Production

Producción utilizará:

- Dominio oficial.
- Proyecto Supabase de producción.
- SMTP oficial.
- Secretos independientes.
- Monitoreo.
- Backups.
- Cron activo.
- Políticas RLS verificadas.

---

# 48. CI/CD

Cada Pull Request deberá ejecutar:

```text
1. Instalación reproducible.
2. Lint.
3. Typecheck.
4. Pruebas unitarias.
5. Pruebas de integración aplicables.
6. Build.
7. Revisión de migraciones.
8. Despliegue Preview.
```

La rama principal deberá estar protegida.

Requisitos:

- Pull Request obligatorio.
- Checks aprobados.
- No realizar push directo salvo emergencia.
- Commits descriptivos.
- Migraciones revisadas.
- Secretos ausentes.
- Build exitoso.

---

# 49. Migraciones

Estructura:

```text
supabase/
├── config.toml
├── migrations/
├── seed.sql
├── functions/
└── tests/
```

Reglas:

- Una migración aplicada no deberá modificarse.
- Las correcciones se harán con una nueva migración.
- Toda migración deberá poder aplicarse desde cero.
- `seed.sql` solamente contendrá datos no sensibles.
- Los catálogos deberán sembrarse de forma idempotente.
- Las políticas RLS deberán versionarse.
- Las funciones deberán utilizar `create or replace` cuando corresponda.
- Las migraciones destructivas deberán documentarse.

---

# 50. Estructura recomendada del repositorio

```text
project-okiro/
├── docs/
│   ├── Especificación Funcional - Sistema de XP.md
│   ├── Especificación Funcional y Tecnológica - Project Okiro.md
│   ├── Arquitectura.md
│   ├── Modelo de Datos.md
│   └── ADR/
├── public/
│   ├── icons/
│   ├── images/
│   └── manifest-assets/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   ├── (auth)/
│   │   ├── (protected)/
│   │   ├── api/
│   │   ├── manifest.ts
│   │   └── service-worker/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── forms/
│   │   ├── charts/
│   │   └── feedback/
│   ├── modules/
│   │   ├── auth/
│   │   ├── onboarding/
│   │   ├── dashboard/
│   │   ├── workouts/
│   │   ├── sleep/
│   │   ├── nutrition/
│   │   ├── hydration/
│   │   ├── focus/
│   │   ├── missions/
│   │   ├── progress/
│   │   ├── reports/
│   │   ├── achievements/
│   │   ├── protection/
│   │   └── xp/
│   ├── lib/
│   │   ├── supabase/
│   │   ├── auth/
│   │   ├── dates/
│   │   ├── validation/
│   │   ├── errors/
│   │   ├── logging/
│   │   └── utils/
│   ├── config/
│   ├── hooks/
│   ├── styles/
│   └── types/
├── supabase/
│   ├── migrations/
│   ├── functions/
│   │   ├── close-week/
│   │   ├── recalculate-week/
│   │   ├── delete-account/
│   │   └── send-notification/
│   ├── tests/
│   ├── seed.sql
│   └── config.toml
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── AGENTS.md
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── playwright.config.ts
├── pnpm-lock.yaml
├── tailwind.config.ts
├── tsconfig.json
└── vitest.config.ts
```

---

# 51. Convenciones de código

## TypeScript

- Modo estricto.
- No utilizar `any` salvo justificación documentada.
- No utilizar aserciones inseguras sin motivo.
- Tipar entradas y salidas.
- Utilizar uniones discriminadas.
- Evitar enums de TypeScript cuando una unión literal sea suficiente.
- Los tipos de base de datos deberán generarse desde Supabase.

## Nombres

- Componentes: `PascalCase`.
- Funciones: `camelCase`.
- Archivos de módulos: `kebab-case`.
- Constantes globales: `UPPER_SNAKE_CASE`.
- Tablas y columnas: `snake_case`.
- Códigos de regla: `UPPER_SNAKE_CASE`.

## Componentes

- Un componente no deberá concentrar lógica de negocio.
- Las páginas deberán coordinar, no implementar toda la funcionalidad.
- Las variantes visuales deberán ser explícitas.
- Los componentes compartidos deberán ser realmente reutilizables.
- No se deberá crear abstracción antes de tener un uso claro.

## Errores

- No lanzar textos sin estructura.
- Utilizar errores de dominio.
- Traducir errores técnicos a mensajes comprensibles.
- Registrar el error original en servidor.
- Mostrar un `requestId` cuando sea útil.

---

# 52. Estados y caché

## Estado del servidor

Los datos persistentes deberán tratarse como estado del servidor.

No deberán duplicarse innecesariamente en stores globales.

## Estado local

Se utilizará estado local para:

- Diálogos.
- Filtros temporales.
- Formularios.
- Selecciones.
- Navegación de interfaz.

## Store global

Zustand o una alternativa solamente se agregará cuando exista una necesidad clara.

No se utilizará Redux durante el MVP.

## Invalidación

Después de una mutación se deberán invalidar únicamente:

- Dashboard.
- Día afectado.
- Semana afectada.
- Módulo relacionado.
- Progreso cuando cambie.

---

# 53. Exportación y eliminación

## Exportación

La exportación deberá generarse en backend.

Proceso:

```text
1. Validar identidad.
2. Reunir datos.
3. Crear archivo.
4. Guardar temporalmente.
5. Entregar enlace firmado.
6. Expirar enlace.
7. Eliminar archivo temporal.
```

## Eliminación

La eliminación deberá realizarse mediante una operación privilegiada.

Proceso:

```text
1. Reautenticar.
2. Marcar solicitud.
3. Eliminar archivos.
4. Eliminar o anonimizar datos.
5. Eliminar usuario de Auth.
6. Revocar sesiones.
7. Registrar resultado técnico no identificable.
```

---

# 54. Criterios de aceptación globales

La primera versión se considerará funcional cuando:

1. Un usuario pueda registrarse.
2. Pueda confirmar su correo.
3. Pueda iniciar sesión.
4. Pueda recuperar su contraseña.
5. Pueda completar onboarding.
6. Pueda registrar los cinco pilares.
7. Pueda editar registros de una semana abierta.
8. No pueda editar una semana cerrada.
9. Pueda consultar XP provisional.
10. Pueda consultar nivel.
11. Pueda consultar atributos.
12. Pueda consultar rango semanal.
13. Pueda consultar misiones.
14. Las misiones se actualicen automáticamente.
15. El cierre semanal sea idempotente.
16. Una semana se cierre automáticamente.
17. El reporte explique cada cálculo.
18. Las políticas RLS impidan acceso cruzado.
19. Las claves privadas no lleguen al cliente.
20. La interfaz funcione correctamente en móvil.
21. La aplicación pueda instalarse como PWA.
22. Exista pantalla sin conexión.
23. Los formularios sean accesibles.
24. Las rutas privadas estén protegidas.
25. Las pruebas críticas pasen.
26. Los despliegues Preview no utilicen producción.
27. Las migraciones permitan reconstruir la base.
28. El usuario pueda exportar sus datos.
29. El usuario pueda eliminar su cuenta.
30. El motor respete la especificación de XP.

---

# 55. Orden recomendado de implementación

## Fase 0 — Preparación

- Crear repositorio.
- Crear estructura.
- Configurar Next.js.
- Configurar TypeScript.
- Configurar Tailwind.
- Configurar shadcn/ui.
- Configurar Supabase local.
- Configurar Vercel.
- Crear documentación.
- Crear CI.

## Fase 1 — Autenticación

- Registro.
- Confirmación.
- Login.
- Logout.
- Recuperación.
- Cookies SSR.
- Perfil automático.
- Protección de rutas.

## Fase 2 — Onboarding

- Perfil.
- Zona horaria.
- Objetivos.
- Versionado.
- Creación del primer ciclo.

## Fase 3 — Registros base

- Entrenamiento.
- Sueño.
- Comidas.
- Hidratación.
- Programación.
- Historial básico.

## Fase 4 — Motor de XP

- Reglas.
- Transacciones.
- Límites.
- Niveles.
- Atributos.
- Pruebas exhaustivas.

## Fase 5 — Dashboard y misiones

- Dashboard.
- Misiones diarias.
- Acción rápida.
- Resumen provisional.
- Navegación móvil.

## Fase 6 — Cierre semanal

- Resumen.
- Rango.
- Consolidación.
- Cron.
- Edge Function.
- Idempotencia.
- Reporte.

## Fase 7 — Progreso

- Gráficas.
- Atributos.
- Rachas.
- Logros.
- Calendario.

## Fase 8 — PWA

- Manifest.
- Iconos.
- Instalación.
- Service Worker.
- Pantalla offline.
- Safe areas.

## Fase 9 — Seguridad y privacidad

- Auditoría RLS.
- Rate limiting.
- Exportación.
- Eliminación.
- SMTP.
- Monitoreo.

## Fase 10 — Estabilización

- Pruebas E2E.
- Accesibilidad.
- Rendimiento.
- Corrección de errores.
- Beta privada.
- Producción.

---

# 56. Definition of Done

Una funcionalidad solamente estará terminada cuando:

- Cumpla sus requerimientos.
- Tenga validación.
- Controle errores.
- Tenga estado de carga.
- Tenga estado vacío.
- Sea responsive.
- Sea accesible.
- Respete RLS.
- Tenga pruebas adecuadas.
- No duplique lógica.
- No introduzca secretos.
- No rompa el build.
- No rompa otros módulos.
- Incluya migraciones cuando corresponda.
- Actualice documentación.
- Pase revisión.
- Funcione en Preview.
- Tenga criterios de aceptación comprobados.

---

# 57. Restricciones para agentes de programación

El agente deberá:

1. Leer este documento antes de implementar.
2. Leer `Especificación Funcional - Sistema de XP.md`.
3. Revisar el código existente.
4. Utilizar las migraciones existentes.
5. Respetar la arquitectura modular.
6. Reutilizar componentes.
7. Agregar pruebas.
8. Mantener TypeScript estricto.
9. Respetar RLS.
10. No exponer claves.
11. No modificar fórmulas de XP sin autorización.
12. No cambiar objetivos funcionales silenciosamente.
13. No instalar dependencias innecesarias.
14. No duplicar módulos.
15. No realizar cambios manuales no versionados en producción.
16. No implementar funcionalidades fuera de alcance.
17. Documentar decisiones relevantes.
18. Explicar cualquier desviación técnica.
19. Mantener compatibilidad mobile-first.
20. Verificar dónde se utiliza un elemento antes de eliminarlo.

---

# 58. Decisiones finales

La arquitectura oficial inicial será:

```text
Frontend:
Next.js + React + TypeScript + Tailwind CSS + shadcn/ui

Autenticación:
Supabase Auth con correo y contraseña

Base de datos:
Supabase PostgreSQL

Autorización:
Row Level Security

Procesos programados:
Supabase Cron + Edge Functions

Archivos:
Supabase Storage

Hosting:
Vercel

Pruebas:
Vitest + Testing Library + Playwright

Arquitectura:
Monolito modular, server-first y mobile-first

Formato:
Progressive Web App
```

No se construirá un backend independiente con:

- Express.
- NestJS.
- FastAPI.
- Spring Boot.
- Laravel.

durante el MVP.

Supabase y las capacidades de servidor de Next.js cubrirán las necesidades iniciales.

Un backend separado solamente deberá considerarse cuando exista una necesidad técnica demostrable que Supabase, PostgreSQL, Edge Functions y Next.js no puedan resolver razonablemente.

---

# 59. Resultado esperado

Al terminar el MVP, el usuario deberá poder abrir Okiro desde su teléfono y realizar este flujo:

```text
1. Abrir la aplicación.
2. Ver sus misiones.
3. Consultar su nivel.
4. Registrar una actividad en segundos.
5. Observar la XP generada.
6. Consultar su progreso semanal.
7. Identificar pilares incompletos.
8. Recibir su evaluación semanal.
9. Subir de nivel.
10. Mantener una representación histórica de su progreso real.
```

La aplicación deberá sentirse como un sistema personal de progresión, no como un formulario administrativo ni como una hoja de cálculo.

Cada decisión técnica deberá proteger esa experiencia.