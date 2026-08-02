# Diccionario temático de interfaz — Project Okiro

## 1. Dirección de voz

Okiro debe utilizar tres niveles de lenguaje.

### Voz del Sistema

Se utiliza en:

- Antetítulos.
- Encabezados.
- Misiones.
- Subidas de nivel.
- Rangos.
- Ciclos.
- Recompensas.
- Estados importantes.
- Confirmaciones de progreso.

Características:

- Frases cortas.
- Tono firme.
- Sensación de autoridad.
- Vocabulario RPG.
- Preferencia por mayúsculas en antetítulos.
- Sin explicaciones innecesarias.

Ejemplos:

```text
SISTEMA ACTIVO

MISIÓN COMPLETADA

CICLO SELLADO

RANGO ACTUALIZADO

ASCENSO DISPONIBLE
```

### Voz de acompañamiento

Se utiliza en:

- Descripciones.
- Estados vacíos.
- Recomendaciones.
- Mensajes motivacionales.
- Recuperación después de una mala semana.

Características:

- Cercana.
- Directa.
- Motivadora.
- Sin sonar infantil.
- Sin culpabilizar.

Ejemplos:

```text
Un día difícil no define tu ciclo.

Aún puedes cambiar el resultado de esta semana.

Tu progreso permanente sigue protegido.
```

### Voz funcional

Se utiliza en:

- Campos de formulario.
- Botones funcionales.
- Validaciones.
- Errores.
- Privacidad.
- Documentos legales.
- Etiquetas de accesibilidad.

Características:

- Clara.
- Literal.
- Sin lenguaje ambiguo.
- Sin sacrificar comprensión por ambientación.

Ejemplos:

```text
Correo electrónico

Guardar cambios

La contraseña debe tener al menos 10 caracteres.

No fue posible guardar el registro.
```

La temática nunca debe dificultar una acción importante.

---

# 2. Terminología oficial

La aplicación debe utilizar estos términos de manera consistente.

| Concepto técnico actual | Término visible recomendado |
| --- | --- |
| Dashboard | Estado |
| Inicio | Estado |
| Sistema personal | Sistema Okiro |
| Registrar | Registrar |
| Registrar actividad | Registrar acción |
| Historial | Registro |
| Progreso | Ascenso |
| Perfil | Identidad |
| Configuración | Ajustes |
| Semana | Ciclo |
| Semana actual | Ciclo actual |
| Semana abierta | Ciclo activo |
| Semana cerrada | Ciclo sellado |
| Cierre semanal | Resolución del ciclo |
| Reporte semanal | Resultado del ciclo |
| XP provisional | XP pendiente |
| XP consolidada | XP asegurada |
| XP histórica | XP permanente |
| XP provisional neta | Balance de XP |
| Nivel actual | Nivel |
| Proyección de nivel | Ascenso previsto |
| Rango semanal | Rango del ciclo |
| Rango provisional | Rango actual |
| Rango final | Rango obtenido |
| Puntuación ponderada | Evaluación del sistema |
| Cobertura | Sincronía |
| Pilares | Dominios |
| Ejercicio | Entrenamiento |
| Sueño | Descanso |
| Alimentación | Nutrición |
| Hidratación | Hidratación |
| Enfoque | Enfoque |
| Actividad de inteligencia | Disciplina mental |
| Atributos | Atributos |
| Objetivo semanal | Meta del ciclo |
| Bonificación | Recompensa |
| Penalización | XP perdida o Ajuste de XP |
| Auditoría | Registro del sistema |
| Movimientos consolidados | Eventos del ciclo |
| Trazabilidad | Registro |
| Registro verificado | Registro del sistema |
| Configuración inicial | Calibración inicial |
| Onboarding | Activación del sistema |
| Usuario | Cazador, solamente en textos ambientales |
| Usuario, en formularios y legales | Persona o cuenta |
| Datos privados | Datos protegidos |
| Modo de protección | Protocolo de recuperación |

## Términos que no deben utilizarse en la interfaz

Evitar:

```text
puntuación ponderada
cobertura de datos
trazabilidad personal
auditoría
proyección al consolidar
movimientos consolidados
datos derivados
registro verificado
panel operativo
impacto provisional
cierre verificado
versión de cálculo
```

Estos términos pueden permanecer en documentación técnica, pero no deben ser
copy principal de la interfaz.

---

# 3. Marca y navegación global

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `OKIRO` | `OKIRO` |
| `Sistema personal` | `Sistema Okiro` |
| `Inicio` | `Estado` |
| `Registrar` | `Registrar` |
| `Registrar actividad` | `Registrar acción` |
| `Misiones` | `Misiones` |
| `Historial` | `Registro` |
| `Progreso` | `Ascenso` |
| `Perfil` | `Identidad` |
| `Configuración` | `Ajustes` |
| `Datos privados` | `Datos protegidos` |
| `Cerrar sesión` | `Cerrar sesión` |
| `Abriendo {destino}` | `Cargando {destino}…` |
| `Ir al inicio de Okiro` | `Ir al estado de Okiro` |
| `Navegación principal` | Conservar |
| `Navegación móvil` | Conservar |

## Destinos de navegación

Los destinos visibles deben utilizar:

```text
Estado
Registro
Misiones
Ascenso
Identidad
Ajustes
```

En móvil:

```text
Estado
Misiones
Registrar
Registro
Ascenso
```

## Recomendación

La tarjeta lateral que actualmente muestra:

```text
Datos privados
{nombre}
{correo}
```

debería simplificarse a:

```text
{nombre}
Nivel {n} · Rango {rango}
```

El correo puede permanecer dentro de Identidad, pero no necesita ocupar espacio
permanente en la navegación.

Puede mostrarse un pequeño indicador:

```text
Protegido
```

con un icono de escudo y tooltip:

```text
Solo tú puedes consultar estos datos.
```

---

# 4. Landing pública

## Encabezado principal

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Sistema activo · Protocolo de ascenso` | `EL SISTEMA TE HA ENCONTRADO` |
| `Convierte tu vida en progreso medible.` | `Tu ascenso comienza en el mundo real.` |
| `Okiro transforma tus hábitos reales en niveles, atributos, rangos y misiones. Sin castigos destructivos. Sin progreso falso.` | `Entrena. Descansa. Aprende. Cumple misiones. Okiro convierte tus acciones reales en niveles, atributos y rangos.` |
| `Iniciar mi progreso` | `Comenzar mi ascenso` |
| `Ya tengo una cuenta` | `Continuar mi ascenso` |

## Variante de mayor intensidad

```text
EL SISTEMA TE HA ENCONTRADO

Tu ascenso comienza en el mundo real.

Cada entrenamiento, cada noche de descanso y cada sesión de enfoque fortalece
tu perfil. Cumple misiones, aumenta tus atributos y supera tu rango anterior.

[Comenzar mi ascenso]
[Ya estoy vinculado]
```

`Ya estoy vinculado` tiene más temática, pero es menos claro que `Ya tengo una
cuenta`. La opción recomendada para producción es:

```text
Continuar mi ascenso
```

## Beneficios

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Nivel permanente` | `Tu nivel permanece` |
| `Datos privados` | `Progreso protegido` |
| `Progreso equilibrado` | `Ascenso equilibrado` |
| `Interfaz de estado` | `ESTADO DEL CAZADOR` |
| `Ciclo semanal {n}` | `CICLO {n}` |
| `En progreso` | `ACTIVO` |
| `Nivel` | `NIVEL` |
| `Rango semanal` | `RANGO DEL CICLO` |
| `Racha` | `RACHA` |
| `Objetivo semanal` | `META DEL CICLO` |

## Dominios de ejemplo

Reemplazar:

```text
Ejercicio
Sueño
Alimentación
Hidratación
Enfoque
```

por:

```text
Entrenamiento
Descanso
Nutrición
Hidratación
Enfoque
```

## XP

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `+{n} XP provisional` | `+{n} XP pendiente` |
| `Misión completada` | `MISIÓN COMPLETADA` |

## Tarjetas de filosofía

### Tarjeta 1

Reemplazar:

```text
Constancia sobre perfección

Dos días difíciles no destruyen una buena semana.
```

por:

```text
LA CONSTANCIA DECIDE EL RESULTADO

Un día difícil no define todo tu ciclo.
```

### Tarjeta 2

Reemplazar:

```text
Tu nivel no retrocede

El progreso consolidado permanece protegido.
```

por:

```text
TU ASCENSO PERMANECE

La experiencia asegurada nunca se pierde.
```

### Tarjeta 3

Reemplazar:

```text
Equilibrio real

Una sola actividad nunca domina todo el sistema.
```

por:

```text
NINGÚN ATRIBUTO BASTA POR SÍ SOLO

El Sistema evalúa tu progreso completo.
```

---

# 5. Acceso, registro y verificación

## Inicio de sesión

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Acceso autorizado` | `ACCESO AL SISTEMA` |
| `Continúa tu ascenso` | Conservar |
| `Ingresa a tu sistema personal y retoma el progreso de esta semana.` | `Tu ciclo sigue activo. Inicia sesión para continuar.` |
| `Iniciar sesión` | Conservar |
| `¿Aún no tienes cuenta?` | `¿Todavía no has iniciado tu ascenso?` |
| `Crear cuenta` | `Crear cuenta` |

## Registro

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Nuevo vínculo` | `VÍNCULO INICIAL` |
| `Inicia tu progreso` | `Activa tu sistema` |
| `Crea una cuenta privada. Tu nivel histórico quedará protegido desde el primer ciclo.` | `Crea tu cuenta y establece el punto de inicio de tu ascenso.` |
| `¿Ya tienes cuenta?` | `¿El Sistema ya te reconoce?` |
| `Iniciar sesión` | Conservar |

## Campos

Los campos deben mantenerse claros.

Conservar:

```text
Nombre completo
Nombre preferido
Cumpleaños · opcional
Peso inicial · opcional
Correo electrónico
Contraseña
Confirmar contraseña
```

Cambiar solamente las ayudas:

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Tu nombre y apellidos` | `Nombre y apellidos` |
| `Cómo quieres que te llamemos` | `Nombre que mostrará el Sistema` |
| `Peso inicial · kg · opcional` | `Peso inicial · opcional` |
| `Mínimo 10 caracteres` | Conservar |
| `Procesando` | `Sincronizando…` |

## Cumpleaños y peso

El texto actual es demasiado largo:

```text
Tu cumpleaños y peso son privados. El peso se guarda como el primer punto de
tu historial y nunca genera ni resta XP.
```

Reemplazar por:

```text
Datos privados. El peso no modifica tu XP ni tu nivel.
```

La explicación completa puede mostrarse en un tooltip o acordeón.

## Verificación de correo

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Verificación requerida` | `ACTIVACIÓN PENDIENTE` |
| `Revisa tu correo` | Conservar |
| `Enviamos un vínculo para confirmar tu identidad y activar tu cuenta.` | `Confirma tu correo para completar el vínculo con Okiro.` |
| `Abre el mensaje enviado a {correo} y selecciona el botón de confirmación.` | Conservar |
| `Si no aparece, revisa spam. Por seguridad, no podrás entrar al dashboard hasta confirmar el correo.` | `Si no encuentras el mensaje, revisa spam. El acceso permanecerá bloqueado hasta confirmar tu correo.` |
| `Volver al inicio de sesión` | `Volver al acceso` |

## Panel visual de autenticación

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Sistema de progresión personal` | `SISTEMA DE ASCENSO PERSONAL` |
| `Cada decisión cambia tu nivel.` | `Cada acción fortalece tu perfil.` |
| `Cinco pilares. Un solo progreso.` | `Cinco dominios. Un solo ascenso.` |
| `Construye constancia sin convertir un mal día en una derrota permanente.` | `Avanza con constancia. Un mal día no borra tu recorrido.` |
| `5 pilares` | `5 dominios` |
| `Equilibrio` | `Sincronía` |
| `XP semanal` | `XP del ciclo` |
| `Progreso` | `Ascenso` |
| `Nivel seguro` | `Nivel protegido` |
| `Permanente` | `Asegurado` |
| `La constancia vale más que la perfección.` | `La constancia determina el ascenso.` |
| `Protocolo seguro · Sesión cifrada · Datos privados` | `CONEXIÓN SEGURA · DATOS PROTEGIDOS` |

---

# 6. Calibración inicial

## Encabezado

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Configuración inicial` | `CALIBRACIÓN DEL SISTEMA` |
| `Bienvenido, {nombre}` | `El Sistema te reconoce, {nombre}` |

Versión menos intensa:

```text
Configura tu sistema, {nombre}
```

La versión recomendada es:

```text
El Sistema te reconoce, {nombre}
```

## Secciones

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `01 · Preferencias` | `01 · Identidad` |
| `02 · Objetivos semanales` | `02 · Parámetros del ciclo` |
| `03 · Sueño` | `03 · Recuperación` |

## Campos

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Zona horaria` | Conservar |
| `Sistema de unidades` | `Unidades` |
| `Métrico · kg, ml` | Conservar |
| `Imperial · lb, oz` | Conservar |
| `Ejercicio` | `Días de entrenamiento` |
| `Actividad principal de inteligencia` | `Disciplina mental principal` |
| `Esta elección personalizará tus misiones y registros.` | `Okiro generará misiones relacionadas con esta disciplina.` |
| `Nombre de tu actividad` | `Nombre de la disciplina` |
| `Días de {actividad}` | `Días de práctica` |
| `Hidratación diaria` | `Meta diaria de hidratación` |
| `Comidas principales` | `Comidas principales por día` |
| `Comidas flexibles` | `Comidas flexibles por ciclo` |
| `Mínimo` | `Descanso mínimo` |
| `Máximo` | `Descanso máximo` |
| `Hora objetivo` | `Hora de recuperación` |

## Nota de historial

Reemplazar:

```text
Tus objetivos podrán cambiar después mediante versiones nuevas; el historial
anterior no se reescribe.
```

por:

```text
Los cambios futuros no alterarán los ciclos ya completados.
```

## Botones

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Creando tu sistema` | `INICIALIZANDO OKIRO…` |
| `Confirmar y comenzar` | `ACTIVAR SISTEMA` |

---

# 7. Disciplinas mentales

El catálogo debe conservar nombres comprensibles. La temática puede aplicarse
al título general y a las descripciones.

## Título del selector

```text
DISCIPLINA MENTAL
```

## Catálogo recomendado

| Nombre | Descripción recomendada |
| --- | --- |
| `Programación` | `Desarrollo, arquitectura y resolución técnica` |
| `Lectura` | `Conocimiento adquirido mediante lectura formativa` |
| `Ajedrez` | `Estrategia, partidas y análisis` |
| `Estudio académico` | `Aprendizaje estructurado de una disciplina` |
| `Idiomas` | `Estudio y práctica de una lengua` |
| `Matemáticas` | `Teoría, problemas y razonamiento` |
| `Ciencia` | `Conocimiento y práctica científica` |
| `Escritura` | `Redacción, ensayo o creación narrativa` |
| `Práctica musical` | `Técnica, teoría y entrenamiento auditivo` |
| `Curso o certificación` | `Formación guiada y progreso estructurado` |
| `Investigación` | `Búsqueda, análisis y síntesis de información` |
| `Memoria y lógica` | `Entrenamiento cognitivo y razonamiento` |
| `Proyecto creativo` | `Diseño, creación y experimentación` |
| `Otra disciplina` | `Define tu propia ruta de desarrollo` |

No conviene cambiar `Programación` por nombres como `Tecnomancia` o `Ingeniería
arcana`. Puede sonar temático, pero perjudica la comprensión cotidiana.

---

# 8. Estado principal

## Encabezado

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Panel operativo · semana en curso` | `SISTEMA ACTIVO · CICLO EN CURSO` |
| `Hola, {nombre}` | `Bienvenido, {nombre}` |
| `{fecha}` | Conservar |

Para días con actividad pendiente puede mostrarse:

```text
El ciclo continúa.
```

Para días con todo completo:

```text
Todas las misiones de hoy han sido completadas.
```

## Nivel

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Proyección al consolidar` | `ASCENSO PREVISTO` |
| `Avance del nivel actual` | `Progreso de nivel` |
| `Nivel` | `NIVEL` |
| `{n}% avance` | `{n}% COMPLETADO` |
| `Consolidada` | `Asegurada` |
| `Provisional` | `Pendiente` |
| `XP en el nivel` | `XP del nivel` |
| `XP provisional` | `XP pendiente` |

## Atributos

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Atributos en progreso` | `ATRIBUTOS EN ASCENSO` |
| `Fuerza` | Conservar |
| `Resistencia` | Conservar |
| `Vitalidad` | Conservar |
| `Inteligencia` | Conservar |
| `Disciplina` | Conservar |
| `Nv. {n}` | Conservar |
| `{actual}/{meta} XP` | Conservar |
| `+{n}` | `+{n} PENDIENTE` |

## Semana

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Pulso semanal` | `ESTADO DEL CICLO` |
| `{actual}/1,000 XP objetivo` | `{actual}/1,000 XP` |
| `{n} XP histórica protegida` | `{n} XP PERMANENTE` |
| `Rango provisional` | `RANGO ACTUAL` |
| `Evaluación en tiempo real` | `El rango cambiará con tus acciones.` |
| `puntuación ponderada` | `evaluación` |
| `cobertura` | `sincronía` |

La tarjeta puede mostrar:

```text
RANGO ACTUAL

A

Evaluación: 88
Sincronía: 92%
```

No es necesario mostrar las palabras “ponderada” ni “cobertura”.

## Misiones

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Misiones del día` | `MISIONES DIARIAS` |
| `{completadas} de {total} completadas` | `{completadas}/{total} COMPLETADAS` |
| `Misión diaria completa · +8 XP provisional` | `MISIÓN DIARIA COMPLETADA · +8 XP` |
| `Ver semana de misiones` | `Ver ciclo de misiones` |

## Dominios

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Pilares de la semana` | `DOMINIOS DEL CICLO` |
| `Puntuación y XP` | Eliminar |
| `Ejercicio` | `Entrenamiento` |
| `Sueño` | `Descanso` |
| `Alimentación` | `Nutrición` |
| `Hidratación` | Conservar |
| `Inteligencia` | Nombre de la disciplina elegida |
| `{n} / 100` | `{n}%` |

La tarjeta ya puede comunicar su información mediante jerarquía visual. No
necesita el texto “Puntuación y XP”.

## Resumen inferior

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Ciclo actual` | `CICLO ACTUAL` |
| `Semana abierta` | `ACTIVO` |
| `{n} registros` | `{n} ACCIONES REGISTRADAS` |
| `XP provisional neta` | `BALANCE DE XP` |
| `Último peso: {peso} {unidad} · no afecta XP` | `Último peso: {peso} {unidad}` |

El aviso `no afecta XP` no necesita repetirse en cada pantalla. Debe explicarse
en la sección de peso.

## Acciones rápidas

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Acción rápida` | `REGISTRO RÁPIDO` |
| `¿Qué quieres registrar?` | `Selecciona una acción` |
| `Ver {n} registros` | `Ver registro · {n}` |

---

# 9. Registro de acciones

## Encabezado

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Registro verificado` | `REGISTRO DEL SISTEMA` |
| `Registrar actividad` | `Registrar acción` |
| `Editar actividad` | `Modificar registro` |
| `La XP se calcula en el servidor y respeta los límites diarios y semanales.` | `El Sistema evaluará esta acción al guardarla.` |

La explicación técnica completa no debe mostrarse permanentemente. Puede
aparecer en un tooltip:

```text
La XP se calcula de forma segura y aplica los límites del ciclo.
```

## Pestañas

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Entrenamiento` | Conservar |
| `Sueño` | `Descanso` |
| `Comida` | `Nutrición` |
| `Agua` | `Hidratación` |
| `{actividad de inteligencia}` | Conservar el nombre seleccionado |

## Entrenamiento

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Fecha` | Conservar |
| `Hora de inicio` | Conservar |
| `Duración` | Conservar |
| `Tipo` | `Tipo de entrenamiento` |
| `Intensidad` | Conservar |
| `Ligera` | Conservar |
| `Moderada` | Conservar |
| `Intensa` | Conservar |
| `Nombre · opcional` | `Nombre de la sesión · opcional` |

Los tipos de entrenamiento actuales son claros y deben conservarse.

## Descanso

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Día de despertar` | Conservar |
| `Hora de dormir` | Conservar |
| `Hora de despertar` | Conservar |
| `Calidad · opcional` | `Calidad del descanso · opcional` |
| `Sin valorar` | Conservar |
| `Interrupciones · opcional` | Conservar |

## Nutrición

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Tipo de comida` | Conservar |
| `Clasificación` | `Resultado` |
| `Equilibrada` | `Equilibrada` |
| `Adecuada` | `Adecuada` |
| `Flexible planificada` | `Flexible` |
| `Fuera del plan` | Conservar |
| `Exceso considerable` | `Exceso` |
| `Descripción` | Conservar |

`Resultado` es más natural que `Clasificación`, pero puede causar confusión. Una
alternativa más clara es:

```text
¿Cómo encaja en tu objetivo?
```

Opciones:

```text
Equilibrada
Adecuada
Flexible
Fuera del plan
Exceso
```

Esta es la opción recomendada.

## Hidratación

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Cantidad` | `Agua registrada` |
| `250 ml` | Conservar |
| `500 ml` | Conservar |
| `750 ml` | Conservar |

## Disciplina mental

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Duración enfocada` | `Tiempo de enfoque` |
| `Objetivo de la sesión` | `Misión de la sesión` |
| `Ej. avanzar en {actividad}` | `Ej. completar el módulo de autenticación` |
| `Proyecto · opcional` | Conservar |
| `Notas · opcional` | Conservar |

## Botones

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Calculando XP` | `EVALUANDO ACCIÓN…` |
| `Guardar registro` | `REGISTRAR ACCIÓN` |
| `Guardar cambios` | `ACTUALIZAR REGISTRO` |

Después de guardar:

```text
ACCIÓN REGISTRADA

+70 XP pendiente
Fuerza +70
```

Cuando exista penalización:

```text
REGISTRO ACTUALIZADO

−10 XP del balance actual
```

No utilizar lenguaje humillante ni alarmista.

---

# 10. Misiones

## Encabezado

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Objetivos adaptados a tus metas` | `MISIONES GENERADAS POR EL SISTEMA` |
| `Misiones diarias` | `MISIONES DEL CICLO` |
| `Se completan automáticamente con tus registros. Hasta cinco bonos de +8 XP por semana.` | `Registra tus acciones para completar misiones y obtener recompensas.` |
| `Registrar actividad` | `Registrar acción` |

La regla de cinco bonos puede mostrarse en un tooltip, no en la descripción
principal.

## Métricas

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Misiones completas` | `COMPLETADAS` |
| `XP provisional` | `XP OBTENIDA` |
| `Rango en curso` | `RANGO ACTUAL` |

## Días y estados

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Jornada activa` | `DÍA ACTIVO` |
| `Próxima` | `BLOQUEADA` |
| `Completa` | `COMPLETADA` |
| `En marcha` | `EN PROGRESO` |
| `Pendiente` | `SIN INICIAR` |

`Bloqueada` debe utilizarse solamente cuando la misión pertenece a un día
futuro. No debe utilizarse para misiones disponibles sin progreso.

## Progreso

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `{actual} de {meta} requisitos` | `{actual}/{meta} OBJETIVOS` |
| `+8 XP obtenida` | `RECOMPENSA OBTENIDA · +8 XP` |
| `Bono +8 XP` | `RECOMPENSA · +8 XP` |

## Estado vacío

Reemplazar:

```text
El ciclo semanal se está preparando. Vuelve al inicio para actualizarlo con tu
próximo registro.
```

por:

```text
EL SISTEMA ESTÁ GENERANDO TUS MISIONES

Registra una acción para actualizar el ciclo.
```

---

# 11. Registro histórico

## Encabezado

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Trazabilidad personal` | `ARCHIVO DEL SISTEMA` |
| `Historial` | `Registro` |
| `Cada cambio de XP puede rastrearse hasta su registro.` | `Consulta todas las acciones vinculadas a tu progreso.` |
| `Nuevo registro` | `Registrar acción` |

## Confirmaciones

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Registro guardado · impacto provisional {+/-n} XP` | `ACCIÓN REGISTRADA · {+/-n} XP` |
| `Registro actualizado · cambio provisional {+/-n} XP` | `REGISTRO ACTUALIZADO · {+/-n} XP` |
| `Registro eliminado y XP recalculada · cambio {+/-n} XP` | `REGISTRO ELIMINADO · BALANCE {+/-n} XP` |

## Contenido

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Actividades` | `ACCIONES REGISTRADAS` |
| `{n} registros activos` | `{n} REGISTROS` |
| `Sin actividades registradas` | `AÚN NO HAY ACCIONES REGISTRADAS` |
| `Registra tu primera actividad; su XP aparecerá aquí después de calcularse en el servidor.` | `Registra tu primera acción para comenzar a construir tu perfil.` |
| `Registrar ahora` | `REGISTRAR PRIMERA ACCIÓN` |

## Peso

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Mediciones de peso` | `REGISTRO DE PESO` |
| `Separadas del sistema de XP` | `Seguimiento privado` |
| `Agregar` | `Registrar peso` |
| `No existen mediciones todavía.` | `Aún no has registrado mediciones.` |

No conviene tematizar demasiado el peso. Debe seguir siendo una métrica neutral.

---

# 12. Ascenso

## Encabezado

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Evolución verificable` | `ASCENSO REGISTRADO` |
| `Progreso` | `Ascenso` |
| `Tus avances permanentes y el impulso que aún está pendiente de consolidación.` | `Consulta tu nivel, atributos y experiencia pendiente del ciclo actual.` |

## Métricas

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Nivel actual` | `NIVEL` |
| `XP consolidada` | `XP ASEGURADA` |
| `Avance permanente` | `PROGRESO PERMANENTE` |
| `XP provisional` | `XP PENDIENTE` |
| `Proyección de nivel` | `ASCENSO PREVISTO` |
| `Nivel {n}` | Conservar |
| `meta` | `SIGUIENTE NIVEL` |
| `XP consolidada en este nivel` | `XP ASEGURADA EN ESTE NIVEL` |
| `{n}% proyectado` | `{n}% CON XP PENDIENTE` |

## Atributos

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Atributos calculados` | `ATRIBUTOS` |
| `Desarrollo del cazador` | `DESARROLLO DEL CAZADOR` |
| `La sección translúcida incluye XP positiva de la semana; será permanente al cerrar el ciclo.` | `La franja luminosa representa la XP pendiente del ciclo.` |

`Desarrollo del cazador` ya encaja muy bien con la temática y puede conservarse.

## Rachas

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Continuidad` | `CONSTANCIA` |
| `Rachas` | `RACHAS ACTIVAS` |
| `Racha diaria` | `RACHA DIARIA` |
| `Racha semanal` | `RACHA DE CICLOS` |
| `Mejor:` | `RÉCORD` |
| `Próximo hito:` | `SIGUIENTE HITO` |
| `Todos los hitos base alcanzados` | `TODOS LOS HITOS HAN SIDO SUPERADOS` |
| `Las rachas se verifican durante el cierre semanal; sus recompensas se aplican una sola vez por hito.` | `Los hitos se validan al resolver el ciclo.` |

## Ciclos completados

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Ciclos verificados` | `CICLOS SELLADOS` |
| `Semanas consolidadas` | `HISTORIAL DE CICLOS` |
| `Tu primera semana aparecerá aquí después del cierre automático.` | `Tu primer resultado aparecerá cuando termine el ciclo actual.` |

## Peso

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Evolución de peso` | `EVOLUCIÓN DE PESO` |
| `Referencia privada · no afecta XP ni nivel` | `Seguimiento privado` |
| `Se necesitan al menos dos mediciones para mostrar una tendencia.` | Conservar |
| `Unidad:` | Conservar |

---

# 13. Resultado del ciclo

## Encabezado

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Volver a Progreso` | `Volver a Ascenso` |
| `Informe consolidado` | `RESULTADO DEL CICLO` |
| `Cierre verificado · versión {n}` | `CICLO SELLADO · PROTOCOLO {n}` |
| `puntos` | `PTS.` |
| `cobertura` | `SINCRONÍA` |
| `Rango final` | `RANGO OBTENIDO` |
| `XP positiva` | `XP OBTENIDA` |
| `Bonificaciones` | `RECOMPENSAS` |
| `Penalización aplicada` | `XP PERDIDA` |
| `Nivel` | `NIVEL RESULTANTE` |

## Secciones

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Rendimiento por pilar` | `RESULTADO POR DOMINIO` |
| `Balance de XP` | `RESULTADO DE EXPERIENCIA` |
| `Auditoría` | `REGISTRO DEL SISTEMA` |
| `Movimientos consolidados` | `EVENTOS DEL CICLO` |
| `No hay movimientos visibles para este cierre.` | `No se registraron eventos de XP en este ciclo.` |

## Ejemplo de resultado

```text
CICLO SELLADO

RANGO OBTENIDO
A

XP OBTENIDA
920

NIVEL RESULTANTE
12

DOMINIOS

Entrenamiento      92%
Descanso           81%
Nutrición          78%
Hidratación        95%
Programación       100%

RECOMPENSAS

Objetivo de entrenamiento        +50 XP
Constancia de descanso           +20 XP
Disciplina mental completada     +20 XP
Semana equilibrada               +20 XP
```

## Mensaje final según rango

### Rango S

```text
RESULTADO EXCEPCIONAL

Has dominado todos los dominios del ciclo.
```

### Rango A

```text
CICLO SUPERADO

Tu constancia produjo un ascenso considerable.
```

### Rango B

```text
PROGRESO SÓLIDO

El ciclo fue completado con buen equilibrio.
```

### Rango C

```text
CICLO COMPLETADO

Hubo progreso, pero algunos dominios requieren atención.
```

### Rango D

```text
ASCENSO INESTABLE

Aún puedes recuperar el control en el siguiente ciclo.
```

### Rango E

```text
CICLO FALLIDO

Tu nivel permanece protegido. Se ha generado una misión de recuperación.
```

---

# 14. Identidad y ajustes

## Perfil

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Identidad del sistema` | `IDENTIDAD VINCULADA` |
| `Perfil` | `Identidad` |
| `Administra tu identidad, preferencias y mediciones privadas.` | `Gestiona los datos vinculados a tu cuenta.` |
| `Información personal` | `DATOS DE IDENTIDAD` |
| `El correo de acceso es {correo}` | `Cuenta vinculada: {correo}` |
| `Guardar perfil` | `GUARDAR IDENTIDAD` |
| `Guardando` | `SINCRONIZANDO…` |

## Peso

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Registro de peso` | Conservar |
| `Seguimiento informativo, separado del sistema de XP.` | `Seguimiento privado. No modifica tu XP.` |
| `Guardar medición` | `REGISTRAR MEDICIÓN` |
| `Últimas mediciones` | `MEDICIONES RECIENTES` |
| `Todavía no hay mediciones registradas.` | `Aún no has registrado mediciones.` |

## Seguridad

Reemplazar:

```text
Estos datos solo pueden ser consultados y modificados por tu cuenta mediante
políticas RLS.
```

por:

```text
DATOS PROTEGIDOS

Solo tu cuenta puede consultar y modificar esta información.
```

`RLS` es un detalle técnico y no debe aparecer en copy visible.

## Sesión

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Sesión` | `SESIÓN ACTIVA` |
| `Cierra tu sesión en este dispositivo. Tu progreso permanecerá guardado.` | `Tu progreso permanecerá protegido después de salir.` |
| `Cerrar sesión` | Conservar |

---

# 15. Privacidad y documentos legales

Los documentos legales deben permanecer claros y sin ambientación RPG.

Conservar:

```text
Aviso de privacidad
Términos de uso
Volver al registro
```

Cambiar:

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Documento preliminar` | `Documento en revisión` |

No utilizar palabras como:

```text
Sistema
Cazador
Protocolo
Misión
Ascenso
```

dentro de cláusulas legales si perjudican la claridad jurídica.

---

# 16. Validaciones y errores

Los errores deben ser claros. Puede incorporarse ligeramente la voz del Sistema,
pero nunca a costa de la comprensión.

## Autenticación

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Escribe un correo válido.` | Conservar |
| `Escribe tu contraseña.` | Conservar |
| `La contraseña debe tener al menos 10 caracteres.` | Conservar |
| `Las contraseñas no coinciden.` | Conservar |
| `Debes aceptar los términos y el aviso de privacidad.` | Conservar |
| `Correo o contraseña incorrectos.` | Conservar |
| `La conexión segura todavía no está configurada.` | `El acceso todavía no está disponible.` |
| `No fue posible completar la operación. Inténtalo nuevamente.` | Conservar |

## Onboarding

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `Confirma tu zona horaria.` | Conservar |
| `El máximo de sueño no puede ser menor que el mínimo.` | `El descanso máximo debe ser mayor o igual que el mínimo.` |
| `Escribe el nombre de tu actividad de inteligencia.` | `Escribe el nombre de tu disciplina mental.` |
| `Revisa los datos del formulario.` | Conservar |
| `No pudimos guardar tus objetivos. Inténtalo nuevamente.` | `No fue posible activar tus parámetros. Inténtalo nuevamente.` |

## Registros

| Texto actual | Reemplazo recomendado |
| --- | --- |
| `El horario se solapa con otro entrenamiento o sesión de enfoque.` | Conservar |
| `La fecha seleccionada no pertenece a una semana abierta.` | `La fecha pertenece a un ciclo que ya no admite cambios.` |
| `Ya utilizaste las comidas flexibles disponibles esta semana.` | `Ya utilizaste las comidas flexibles disponibles en este ciclo.` |
| `Ya existe un registro equivalente para esa fecha.` | Conservar |
| `No pudimos guardar el registro. Revisa los datos e inténtalo nuevamente.` | Conservar |
| `No fue posible eliminar el registro.` | Conservar |

## Error de semana cerrada

Versión recomendada:

```text
CICLO SELLADO

Este registro pertenece a un ciclo completado y ya no puede modificarse.
```

## Error de conexión

```text
SIN CONEXIÓN

Okiro no puede registrar acciones en este momento. Revisa tu conexión e
inténtalo nuevamente.
```

## Error inesperado

```text
EL SISTEMA NO PUDO COMPLETAR LA OPERACIÓN

Inténtalo nuevamente. Si el problema continúa, utiliza el código de referencia
{requestId}.
```

---

# 17. Estados de carga

Reemplazar textos genéricos por estados coherentes.

| Contexto | Texto recomendado |
| --- | --- |
| Navegación | `CARGANDO {destino}…` |
| Login | `VERIFICANDO IDENTIDAD…` |
| Registro | `CREANDO VÍNCULO…` |
| Onboarding | `INICIALIZANDO OKIRO…` |
| Guardar actividad | `EVALUANDO ACCIÓN…` |
| Editar actividad | `RECALCULANDO RESULTADO…` |
| Eliminar actividad | `ACTUALIZANDO EL CICLO…` |
| Dashboard | `SINCRONIZANDO ESTADO…` |
| Misiones | `GENERANDO MISIONES…` |
| Progreso | `CALCULANDO ASCENSO…` |
| Reporte semanal | `RESOLVIENDO CICLO…` |
| Perfil | `SINCRONIZANDO IDENTIDAD…` |
| Peso | `REGISTRANDO MEDICIÓN…` |

No todos los estados necesitan cubrir toda la pantalla. Deben mostrarse solamente
cuando exista una espera perceptible.

---

# 18. Confirmaciones del Sistema

## Registro positivo

```text
ACCIÓN REGISTRADA

+70 XP pendiente
Fuerza +70
```

## Registro neutral

```text
ACCIÓN REGISTRADA

Esta acción no modifica tu XP.
```

## Registro con pérdida

```text
ACCIÓN REGISTRADA

−10 XP del balance actual
```

## Edición

```text
REGISTRO ACTUALIZADO

El Sistema ha recalculado el ciclo.
```

## Eliminación

```text
REGISTRO ELIMINADO

La XP relacionada ha sido recalculada.
```

## Misión completada

```text
MISIÓN COMPLETADA

Recompensa obtenida: +8 XP
```

## Todas las misiones completadas

```text
MISIONES DIARIAS COMPLETADAS

El Sistema ha registrado tu constancia.
```

## Nivel aumentado

```text
NIVEL AUMENTADO

Has alcanzado el nivel {n}.
```

## Atributo aumentado

```text
ATRIBUTO MEJORADO

{atributo} ha alcanzado el nivel {n}.
```

## Hito de racha

```text
HITO ALCANZADO

Has mantenido una racha de {n} días.
```

## Rango actualizado

```text
RANGO ACTUALIZADO

Tu rango provisional ahora es {rango}.
```

---

# 19. Estados vacíos

## Sin acciones

```text
AÚN NO HAY ACCIONES REGISTRADAS

Registra tu primera acción para comenzar a construir tu perfil.
```

## Sin misiones

```text
NO HAY MISIONES DISPONIBLES

Completa la calibración inicial para generar tu primer ciclo.
```

## Sin ciclos cerrados

```text
AÚN NO HAY CICLOS SELLADOS

Tu primer resultado aparecerá cuando termine el ciclo actual.
```

## Sin atributos proyectados

```text
SIN XP PENDIENTE

Registra acciones para fortalecer tus atributos.
```

## Sin peso

```text
SIN MEDICIONES

Registra al menos dos mediciones para visualizar una tendencia.
```

## Sin notificaciones

```text
SIN EVENTOS PENDIENTES

El Sistema no tiene nuevos avisos.
```

---

# 20. Textos que deben eliminarse de la interfaz principal

Los siguientes mensajes comunican detalles técnicos que no aportan valor
cotidiano y deben eliminarse, resumirse o moverse a tooltips:

```text
La XP se calcula en el servidor y respeta los límites diarios y semanales.

Cada cambio de XP puede rastrearse hasta su registro.

puntuación ponderada

cobertura

Cierre verificado · versión {n}

Estos datos solo pueden ser consultados y modificados por tu cuenta mediante
políticas RLS.

La sección translúcida incluye XP positiva de la semana; será permanente al
cerrar el ciclo.

Las rachas se verifican durante el cierre semanal; sus recompensas se aplican
una sola vez por hito.
```

## Reemplazos breves

```text
El Sistema evaluará esta acción.

Consulta las acciones vinculadas a tu progreso.

Evaluación

Sincronía

CICLO SELLADO

Solo tú puedes consultar estos datos.

La franja luminosa representa XP pendiente.

Los hitos se validan al terminar el ciclo.
```

---

# 21. Etiquetas de accesibilidad

Las etiquetas de accesibilidad deben priorizar comprensión, no ambientación.

Conservar o utilizar:

```text
Ir al estado de Okiro

Abrir navegación principal

Cerrar navegación

Navegación principal

Navegación móvil

Mostrar contraseña

Ocultar contraseña

Registrar acción

Abrir misiones

Abrir registro

Abrir ascenso

Abrir identidad

Progreso del nivel actual

Progreso de la misión

Rango actual del ciclo
```

No utilizar etiquetas ambiguas como:

```text
Abrir el portal

Activar vínculo

Consultar poder

Entrar al sistema
```

Un lector de pantalla necesita acciones literales y predecibles.

---

# 22. Copy principal recomendado

## Landing

```text
EL SISTEMA TE HA ENCONTRADO

Tu ascenso comienza en el mundo real.

Entrena. Descansa. Aprende. Cumple misiones. Okiro convierte tus acciones
reales en niveles, atributos y rangos.

[Comenzar mi ascenso]
[Continuar mi ascenso]
```

## Inicio de sesión

```text
ACCESO AL SISTEMA

Continúa tu ascenso

Tu ciclo sigue activo. Inicia sesión para continuar.
```

## Registro

```text
VÍNCULO INICIAL

Activa tu sistema

Crea tu cuenta y establece el punto de inicio de tu ascenso.
```

## Onboarding

```text
CALIBRACIÓN DEL SISTEMA

El Sistema te reconoce, {nombre}

Define tus parámetros iniciales. Los ciclos completados conservarán siempre las
reglas con las que fueron evaluados.
```

## Inicio

```text
SISTEMA ACTIVO · CICLO EN CURSO

Bienvenido, {nombre}

Tu rango actual es {rango}. Aún quedan {n} días para cambiar el resultado.
```

## Misiones

```text
MISIONES GENERADAS POR EL SISTEMA

Completa acciones reales para obtener XP y fortalecer tus atributos.
```

## Registro

```text
REGISTRO DEL SISTEMA

Registrar acción

El Sistema evaluará esta acción al guardarla.
```

## Ascenso

```text
ASCENSO REGISTRADO

Consulta tu nivel, atributos, rachas y resultados anteriores.
```

## Resultado semanal

```text
CICLO SELLADO

Rango obtenido: {rango}

XP asegurada: {xp}

Tu nivel ahora es {nivel}.
```

---

# 23. Frases ambientales rotativas

Estas frases pueden aparecer ocasionalmente en Inicio, pantallas de carga o
estados vacíos.

No deben mostrarse todas al mismo tiempo.

```text
El ciclo todavía no ha terminado.

Cada acción fortalece tu perfil.

La constancia determina el ascenso.

Tu nivel permanece protegido.

Una derrota diaria no decide el resultado semanal.

El Sistema registra lo que haces, no lo que prometes.

El descanso también forma parte del entrenamiento.

El equilibrio fortalece todos tus atributos.

Aún puedes cambiar el rango de este ciclo.

La disciplina se construye una acción a la vez.

Tu cuerpo recuerda cada entrenamiento.

El progreso asegurado nunca retrocede.

No necesitas un día perfecto. Necesitas continuar.

El siguiente nivel requiere una versión más fuerte de ti.

La recuperación no es inactividad. Es preparación.

El Sistema ha detectado progreso.

Tu racha continúa.

La misión sigue activa.

Has superado tu resultado anterior.

El ciclo comienza de nuevo. Tu experiencia permanece.
```

---

# 24. Frases que deben evitarse

Evitar mensajes demasiado agresivos:

```text
Has fracasado.

Eres débil.

No cumpliste.

El Sistema está decepcionado.

Recibirás un castigo.

No mereces la recompensa.

Has desperdiciado la semana.
```

Utilizar:

```text
El ciclo no alcanzó el resultado esperado.

La misión no fue completada.

Se ha generado una misión de recuperación.

Tu nivel permanece protegido.

El siguiente ciclo es una nueva oportunidad.
```

Okiro debe ser exigente, pero no humillante.

---

# 25. Sistema visual de mayúsculas

Utilizar mayúsculas para:

- Antetítulos.
- Estados del Sistema.
- Recompensas.
- Rangos.
- Subidas de nivel.
- Resolución de ciclos.
- Mensajes breves.

Ejemplos:

```text
SISTEMA ACTIVO

MISIÓN COMPLETADA

RANGO ACTUALIZADO

CICLO SELLADO

NIVEL AUMENTADO
```

No utilizar mayúsculas en:

- Párrafos.
- Descripciones largas.
- Campos.
- Errores detallados.
- Documentos legales.
- Ayudas de formulario.

---

# 26. Diccionario final resumido

| Área | Nombre oficial |
| --- | --- |
| Inicio | Estado |
| Registro de actividad | Registrar acción |
| Historial | Registro |
| Progreso | Ascenso |
| Perfil | Identidad |
| Configuración | Ajustes |
| Semana | Ciclo |
| Semana abierta | Ciclo activo |
| Semana terminada | Ciclo sellado |
| Informe semanal | Resultado del ciclo |
| XP provisional | XP pendiente |
| XP consolidada | XP asegurada |
| XP histórica | XP permanente |
| Rango semanal | Rango del ciclo |
| Pilares | Dominios |
| Ejercicio | Entrenamiento |
| Sueño | Descanso |
| Alimentación | Nutrición |
| Actividad intelectual | Disciplina mental |
| Objetivo semanal | Meta del ciclo |
| Bonificación | Recompensa |
| Penalización | XP perdida |
| Auditoría | Registro del sistema |
| Cobertura | Sincronía |
| Puntuación ponderada | Evaluación |
| Modo de protección | Protocolo de recuperación |
| Onboarding | Calibración del sistema |
| Dashboard | Estado del cazador |

---

# 27. Regla final de producto

Antes de agregar cualquier texto visible, clasifícalo:

## Es una acción funcional

Debe ser literal:

```text
Guardar cambios
Correo electrónico
Cerrar sesión
Eliminar registro
```

## Es una respuesta del sistema

Puede ser temática:

```text
MISIÓN COMPLETADA
NIVEL AUMENTADO
CICLO SELLADO
```

## Es una explicación

Debe ser breve y humana:

```text
Tu nivel permanece protegido.

Aún puedes cambiar el resultado del ciclo.
```

## Es un detalle técnico

No debe aparecer en la interfaz principal:

```text
RLS
datos derivados
puntuación ponderada
versión de cálculo
idempotencia
transacción provisional
```

La interfaz debe hacer sentir que Okiro es un Sistema de progresión, sin obligar
a la persona a comprender cómo está implementado.