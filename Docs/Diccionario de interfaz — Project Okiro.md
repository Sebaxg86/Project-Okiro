# Diccionario de interfaz — Project Okiro

Inventario del copy visible de la interfaz de Okiro, actualizado para la versión actual de la aplicación. Cada entrada indica dónde aparece y qué comunica o habilita. Las expresiones entre llaves (`{…}`) son valores dinámicos; por ejemplo, un nombre, una fecha, una cantidad o una actividad seleccionada.

> Alcance: incluye textos de páginas públicas y autenticadas, formularios, estados vacíos, confirmaciones, errores, mensajes de carga y etiquetas de accesibilidad. No incluye nombres internos de variables, rutas, pruebas o código no visible para la persona usuaria.

## Marca y navegación global

| Texto | Ubicación | Función |
| --- | --- | --- |
| `OKIRO` | Landing, acceso y cabecera de la app | Identifica el producto; el logotipo lleva al inicio correspondiente. |
| `Sistema personal` | Menú lateral | Describe el área privada de la persona usuaria. |
| `Inicio` | Navegación | Lleva al panel principal de la semana. |
| `Registrar` | Menú lateral | Abre el formulario para crear una actividad. |
| `Registrar actividad` | Botón central de la navegación móvil | Abre el mismo registro de actividad; también es su etiqueta accesible. |
| `Misiones` | Menú lateral | Lleva a los objetivos diarios adaptados. |
| `Historial` | Navegación | Lleva al registro trazable de actividades y peso. |
| `Progreso` | Navegación | Lleva a niveles, atributos, rachas y ciclos cerrados. |
| `Perfil` | Navegación | Lleva a los datos personales, peso y sesión. |
| `Configuración` | Menú lateral | Enlace alterno a Perfil para modificar preferencias. |
| `Datos privados` | Tarjeta del menú lateral | Comunica que los datos mostrados pertenecen a la cuenta y son privados. |
| `{nombre preferido}` | Tarjeta del menú lateral y saludos | Identifica a la persona que inició sesión. |
| `{correo electrónico}` | Tarjeta del menú lateral y Perfil | Muestra el correo de acceso de la cuenta. |
| `Cerrar sesión` | Perfil y menú lateral | Finaliza la sesión del dispositivo actual. |
| `Abriendo {destino}` | Capa de carga de navegación | Confirma de inmediato el destino pulsado mientras termina de cargar. Los destinos son `Inicio`, `Historial`, `Progreso`, `Perfil`, `Registro` y `Misiones`. |
| `Ir al inicio de Okiro` | Etiqueta accesible del logotipo | Describe para lectores de pantalla la acción del logotipo. |
| `Navegación principal` | Etiqueta accesible del menú lateral | Identifica el conjunto de enlaces principal. |
| `Navegación móvil` | Etiqueta accesible de la barra inferior | Identifica el conjunto de enlaces de móvil. |

## Landing pública

| Texto | Ubicación | Función |
| --- | --- | --- |
| `Iniciar sesión` | Cabecera y llamadas a la acción | Lleva al acceso de una cuenta existente. |
| `Crear cuenta` | Cabecera | Lleva al registro de una nueva cuenta. |
| `Sistema activo · Protocolo de ascenso` | Antetítulo principal | Presenta el concepto de progreso como un sistema activo. |
| `Convierte tu vida en progreso medible.` | Título principal | Explica la promesa central del producto. |
| `Okiro transforma tus hábitos reales en niveles, atributos, rangos y misiones. Sin castigos destructivos. Sin progreso falso.` | Descripción principal | Resume el modelo de seguimiento y su enfoque. |
| `Iniciar mi progreso` | CTA principal | Lleva a crear una cuenta. |
| `Ya tengo una cuenta` | CTA secundaria | Lleva a iniciar sesión. |
| `Nivel permanente` | Beneficio | Comunica que el progreso consolidado no se pierde. |
| `Datos privados` | Beneficio | Comunica la privacidad de la información. |
| `Progreso equilibrado` | Beneficio | Comunica que el sistema distribuye la evaluación entre pilares. |
| `Interfaz de estado` | Encabezado de la maqueta | Nombra la vista de ejemplo del tablero. |
| `Ciclo semanal {n}` | Maqueta | Representa una semana de seguimiento. |
| `En progreso` | Estado de maqueta | Indica que el ciclo de ejemplo sigue abierto. |
| `Nivel` | Maqueta | Etiqueta el nivel de ejemplo. |
| `Rango semanal` | Maqueta | Etiqueta el rango temporal de la semana. |
| `Racha` | Maqueta | Etiqueta la continuidad de días. |
| `Objetivo semanal` | Maqueta | Etiqueta la meta de XP semanal. |
| `Ejercicio`, `Sueño`, `Alimentación`, `Hidratación`, `Enfoque` | Maqueta | Nombra los pilares de ejemplo. |
| `Misión completada` | Maqueta | Ejemplifica el logro automático de una misión. |
| `+{n} XP provisional` | Maqueta y vistas reales | Muestra XP aún no consolidada. |
| `Constancia sobre perfección` | Tarjeta de valor | Presenta la filosofía de no castigar un día difícil. |
| `Dos días difíciles no destruyen una buena semana.` | Tarjeta de valor | Explica el beneficio anterior. |
| `Tu nivel no retrocede` | Tarjeta de valor | Presenta la protección del avance consolidado. |
| `El progreso consolidado permanece protegido.` | Tarjeta de valor | Explica el beneficio anterior. |
| `Equilibrio real` | Tarjeta de valor | Presenta el reparto entre actividades. |
| `Una sola actividad nunca domina todo el sistema.` | Tarjeta de valor | Explica el beneficio anterior. |

## Acceso, registro y verificación

| Texto | Ubicación | Función |
| --- | --- | --- |
| `Acceso autorizado` | Antetítulo de inicio de sesión | Identifica el flujo de autenticación. |
| `Continúa tu ascenso` | Título de inicio de sesión | Invita a retomar el uso de la cuenta. |
| `Ingresa a tu sistema personal y retoma el progreso de esta semana.` | Descripción de inicio de sesión | Explica la consecuencia de acceder. |
| `Nuevo vínculo` | Antetítulo de registro | Identifica la creación de una relación con el sistema. |
| `Inicia tu progreso` | Título de registro | Invita a crear una cuenta. |
| `Crea una cuenta privada. Tu nivel histórico quedará protegido desde el primer ciclo.` | Descripción de registro | Explica privacidad y permanencia. |
| `¿Aún no tienes cuenta?` / `¿Ya tienes cuenta?` | Pie de acceso o registro | Orienta al flujo alternativo. |
| `Crear cuenta` / `Iniciar sesión` | Enlaces y envío de formulario | Cambia de flujo o envía las credenciales. |
| `Nombre completo` | Campo de registro y Perfil | Solicita nombre y apellidos. |
| `Tu nombre y apellidos` | Ejemplo del campo | Ayuda a entender el dato esperado. |
| `Nombre preferido` | Campo de registro y Perfil | Solicita el nombre visible dentro de Okiro. |
| `Cómo quieres que te llamemos` | Ejemplo del campo | Explica el uso del nombre preferido. |
| `Cumpleaños · opcional` | Campo de registro y Perfil | Permite guardar fecha de nacimiento de forma voluntaria. |
| `Peso inicial · kg · opcional` | Campo de registro | Permite crear la primera medición sin afectar XP. |
| `Correo electrónico` | Campo de acceso y registro | Solicita la dirección para autenticar la cuenta. |
| `nombre@correo.com` | Ejemplo del correo | Muestra el formato esperado. |
| `Contraseña` | Campo de acceso y registro | Solicita la credencial secreta. |
| `Tu contraseña` | Ejemplo del campo | Indica qué debe capturarse. |
| `Mínimo 10 caracteres` | Ayuda de contraseña | Comunica la longitud mínima. |
| `Confirmar contraseña` | Campo de registro | Pide repetir la contraseña para verificarla. |
| `Acepto los términos y el aviso de privacidad.` | Casilla de registro | Obtiene la aceptación requerida. |
| `Procesando` | Botón durante el envío | Indica que el acceso o registro está en curso. |
| `Ocultar contraseña` / `Mostrar contraseña` | Etiqueta accesible del control de visibilidad | Describe la acción del icono de contraseña. |
| `Tu cumpleaños y peso son privados. El peso se guarda como el primer punto de tu historial y nunca genera ni resta XP.` | Ayuda de registro | Aclara el tratamiento y efecto de esos datos opcionales. |
| `La conexión con Supabase debe configurarse antes de iniciar sesión.` | Estado de configuración | Explica por qué aún no es posible autenticar. |
| `Tu sesión se cerró después de 15 días sin actividad. Inicia sesión para continuar.` | Estado de sesión expirada | Explica el cierre por inactividad. |
| `Verificación requerida` | Antetítulo de verificación | Señala que la cuenta necesita confirmar correo. |
| `Revisa tu correo` | Título de verificación | Indica la siguiente acción necesaria. |
| `Enviamos un vínculo para confirmar tu identidad y activar tu cuenta.` | Descripción de verificación | Explica el correo enviado. |
| `Abre el mensaje enviado a {correo} y selecciona el botón de confirmación.` | Instrucción de verificación | Indica cómo activar la cuenta. |
| `Si no aparece, revisa spam. Por seguridad, no podrás entrar al dashboard hasta confirmar el correo.` | Ayuda de verificación | Explica la alternativa y la restricción. |
| `Volver al inicio de sesión` | Enlace de verificación | Regresa al acceso. |
| `Sistema de progresión personal` | Panel visual de autenticación | Resume el propósito de Okiro. |
| `Cada decisión cambia tu nivel.` | Panel visual de autenticación | Refuerza la idea de progreso personal. |
| `Cinco pilares. Un solo progreso. Construye constancia sin convertir un mal día en una derrota permanente.` | Panel visual de autenticación | Explica el enfoque del sistema. |
| `5 pilares` / `Equilibrio` | Tarjeta del panel de autenticación | Resume la estructura de evaluación. |
| `XP semanal` / `Progreso` | Tarjeta del panel de autenticación | Resume el avance del ciclo. |
| `Nivel seguro` / `Permanente` | Tarjeta del panel de autenticación | Resume la protección del nivel. |
| `La constancia vale más que la perfección.` | Pie del panel de autenticación | Refuerza el tono del producto. |
| `Protocolo seguro · Sesión cifrada · Datos privados` | Pie de autenticación | Comunica los principios de seguridad y privacidad. |

## Configuración inicial y objetivos

| Texto | Ubicación | Función |
| --- | --- | --- |
| `Configuración inicial` | Antetítulo de onboarding | Sitúa a la persona en el primer ajuste de cuenta. |
| `Bienvenido, {nombre}` | Título de onboarding | Personaliza la bienvenida. |
| `01 · Preferencias` | Sección de onboarding | Agrupa zona horaria y unidades. |
| `02 · Objetivos semanales` | Sección de onboarding | Agrupa metas de los pilares. |
| `03 · Sueño` | Sección de onboarding | Agrupa el rango y la hora de sueño. |
| `Zona horaria` | Campo de onboarding y Perfil | Define la referencia local de días y semanas. |
| `Sistema de unidades` / `Unidades` | Campo de onboarding y Perfil | Define las unidades de peso e hidratación. |
| `Métrico · kg, ml` | Opción de unidades | Selecciona kilogramos y mililitros. |
| `Imperial · lb, oz` | Opción de unidades | Selecciona libras y onzas. |
| `Ejercicio` | Objetivo semanal | Define los días de ejercicio esperados. |
| `Actividad principal de inteligencia` | Selector de objetivo y registro | Define qué actividad intelectual se medirá. |
| `Esta elección personalizará tus misiones y registros.` | Ayuda del selector | Explica el efecto de la actividad elegida. |
| `Nombre de tu actividad` | Campo de actividad personalizada | Permite nombrar una actividad no incluida en el catálogo. |
| `Ej. debate, filosofía o fotografía` | Ejemplo del campo personalizado | Sugiere formatos válidos de actividad. |
| `Días de {actividad}` | Objetivo semanal | Define cuántos días se busca practicar la actividad intelectual. |
| `Hidratación diaria` | Objetivo semanal | Define el volumen diario de agua. |
| `Comidas principales` | Objetivo semanal | Define la cantidad de comidas principales esperadas. |
| `Comidas flexibles` | Objetivo semanal | Define el margen semanal de comidas flexibles. |
| `Mínimo` / `Máximo` | Objetivos de sueño | Definen el rango de horas aceptable. |
| `Hora objetivo` | Objetivo de sueño | Define una referencia para acostarse. |
| `días`, `ml`, `al día`, `semana`, `horas` | Sufijos de objetivos | Aclaran la unidad de cada valor configurado. |
| `Tus objetivos podrán cambiar después mediante versiones nuevas; el historial anterior no se reescribe.` | Nota de onboarding | Comunica la preservación histórica de objetivos previos. |
| `Creando tu sistema` | Botón durante guardado | Indica que se están creando preferencias y objetivos. |
| `Confirmar y comenzar` | Botón de onboarding | Guarda la configuración y entra a la aplicación. |

### Catálogo de actividades de inteligencia

| Texto | Función |
| --- | --- |
| `Programación` — `Desarrollo de software y resolución técnica` | Selecciona práctica de desarrollo y razonamiento técnico. |
| `Lectura` — `Libros, ensayos y lectura formativa` | Selecciona lectura orientada al aprendizaje. |
| `Ajedrez` — `Partidas, problemas y análisis` | Selecciona práctica y estudio de ajedrez. |
| `Estudio académico` — `Aprendizaje estructurado de cualquier disciplina` | Selecciona estudio formal o estructurado. |
| `Idiomas` — `Estudio y práctica de una lengua` | Selecciona aprendizaje de idiomas. |
| `Matemáticas` — `Problemas, teoría y razonamiento cuantitativo` | Selecciona trabajo matemático. |
| `Ciencia` — `Aprendizaje y práctica científica` | Selecciona aprendizaje o práctica científica. |
| `Escritura` — `Redacción, ensayo o escritura creativa` | Selecciona escritura formativa o creativa. |
| `Práctica musical` — `Teoría, instrumento y entrenamiento auditivo` | Selecciona práctica y teoría musical. |
| `Curso o certificación` — `Formación guiada y clases en línea` | Selecciona aprendizaje mediante curso. |
| `Investigación` — `Búsqueda, síntesis y análisis de información` | Selecciona investigación documental. |
| `Memoria y lógica` — `Ejercicios cognitivos y razonamiento` | Selecciona entrenamiento cognitivo. |
| `Proyecto creativo` — `Diseño, creación y experimentación` | Selecciona trabajo creativo. |
| `Otra actividad` — `Define tu propio objetivo intelectual` | Habilita el campo de actividad personalizada; se muestra con icono de cerebro. |

## Inicio: nivel, semana y atributos

| Texto | Ubicación | Función |
| --- | --- | --- |
| `Panel operativo · semana en curso` | Antetítulo de Inicio | Indica que el tablero refleja el ciclo actual. |
| `Hola, {nombre}` | Encabezado de Inicio | Saludo personalizado. |
| `{fecha}` | Encabezado de Inicio | Muestra la fecha local actual. |
| `Proyección al consolidar` | Tarjeta de nivel | Señala que el cálculo incluye la XP pendiente. |
| `Avance del nivel actual` | Anillo de nivel | Describe la barra circular de progreso. |
| `Nivel` | Centro del anillo | Etiqueta el número de nivel actual. |
| `{n}` | Centro del anillo | Muestra el nivel actual. |
| `{n}% avance` | Anillo de nivel | Expresa el porcentaje hacia el próximo nivel. |
| `Consolidada` | Leyenda de nivel | Distingue XP ya permanente. |
| `Provisional` | Leyenda de nivel | Distingue XP que puede cambiar hasta el cierre. |
| `XP en el nivel` | Tarjeta de nivel | Muestra XP consolidada acumululada dentro del nivel. |
| `XP provisional` | Tarjeta de nivel | Muestra XP neta temporal de la semana. |
| `Atributos en progreso` | Mini sección de Inicio | Agrupa atributos que reciben proyección semanal. |
| `Fuerza`, `Resistencia`, `Vitalidad`, `Inteligencia`, `Disciplina` | Tarjetas de atributo | Nombran los cinco atributos calculados. |
| `Nv. {n}` | Tarjeta de atributo | Muestra el nivel de ese atributo. |
| `{actual}/{meta} XP` | Tarjeta de atributo | Muestra XP del atributo y su siguiente meta. |
| `+{n}` | Tarjeta de atributo | Muestra la proyección positiva semanal del atributo. |
| `Pulso semanal` | Tarjeta semanal | Resume el avance de la semana abierta. |
| `{actual}/1,000 XP objetivo` | Tarjeta semanal | Compara la XP provisional con la meta base. |
| `{n} XP histórica protegida` | Tarjeta semanal | Muestra XP que ya no puede retroceder. |
| `Rango provisional` | Tarjeta de rango | Nombra la calificación temporal de la semana. |
| `Evaluación en tiempo real` | Tarjeta de rango | Indica que el rango cambia con los registros. |
| `puntuación ponderada` | Tarjeta de rango | Explica la base del cálculo de rango. |
| `cobertura` | Tarjeta de rango | Indica la proporción de pilares atendidos. |
| `S`, `A`, `B`, `C`, `D`, `E` | Rango provisional y final | Letras de clasificación de rendimiento; el color refuerza cada rango. |
| `Misiones del día` | Sección de Inicio | Agrupa los objetivos automáticos del día. |
| `{completadas} de {total} completadas` | Sección de misiones | Resume el avance de las misiones disponibles. |
| `Misión diaria completa · +8 XP provisional` | Estado de misión | Comunica recompensa al completar la misión. |
| `Ver semana de misiones` | Enlace de Inicio | Lleva al detalle semanal de misiones. |
| `Pilares de la semana` | Sección de Inicio | Agrupa la evaluación de ejercicio, inteligencia, agua, sueño y alimentación. |
| `Puntuación y XP` | Ayuda de pilares | Explica los dos valores de cada pilar. |
| `{n} días` | Tarjeta de pilar | Muestra días registrados o meta semanal, según el pilar. |
| `{n} / 100` | Tarjeta de pilar | Muestra puntuación del pilar. |
| `Ciclo actual` | Resumen inferior | Etiqueta el estado de la semana. |
| `Semana abierta` | Estado de ciclo | Indica que la semana todavía admite cambios. |
| `{n} registros` | Resumen inferior | Muestra la cantidad de actividades registradas. |
| `XP provisional neta` | Resumen inferior | Etiqueta la suma temporal de XP. |
| `Último peso: {peso} {unidad} · no afecta XP` | Resumen inferior | Muestra peso solo como referencia privada. |
| `Acción rápida` | Sección de accesos | Identifica acciones para registrar pilares. |
| `¿Qué quieres registrar?` | Sección de accesos | Invita a elegir una actividad. |
| `Ver {n} registros` | Acceso rápido | Lleva al historial existente. |

## Registro de actividades

| Texto | Ubicación | Función |
| --- | --- | --- |
| `Registro verificado` | Antetítulo | Presenta el formulario como una captura que será validada. |
| `Registrar actividad` | Título del formulario | Indica que se creará un registro. |
| `Editar actividad` | Título del formulario | Indica que se modificará un registro existente. |
| `La XP se calcula en el servidor y respeta los límites diarios y semanales.` | Ayuda del formulario | Aclara que no se puede manipular XP desde la interfaz. |
| `Entrenamiento`, `Sueño`, `Comida`, `Agua`, `{actividad de inteligencia}` | Pestañas de registro | Seleccionan el tipo de actividad que se registrará. |
| `Fecha` | Campo de registro y peso | Define el día del registro. |
| `Día de despertar` | Campo de sueño | Define qué día se atribuye a una noche de sueño. |
| `Hora de inicio` | Campo de ejercicio o enfoque | Define el inicio de la sesión. |
| `Hora de dormir` / `Hora de despertar` | Campos de sueño | Permiten calcular la duración del descanso. |
| `Duración` / `min` | Campo de entrenamiento | Captura minutos de ejercicio. |
| `Tipo` | Campo de entrenamiento | Clasifica el ejercicio realizado. |
| `Fuerza`, `Cardio`, `Caminata`, `Ciclismo`, `Natación`, `Box`, `MMA`, `Deporte`, `Movilidad`, `Yoga`, `Recuperación activa`, `Funcional`, `Mixto`, `Otro` | Opciones de tipo | Especifican el entrenamiento para describirlo y clasificarlo. |
| `Intensidad` | Campo de entrenamiento | Registra exigencia percibida de la sesión. |
| `Ligera`, `Moderada`, `Intensa` | Opciones de intensidad | Seleccionan el nivel de esfuerzo. |
| `Nombre · opcional` | Campo de entrenamiento | Permite dar un nombre propio a la sesión. |
| `Fuerza de tren superior` | Ejemplo de nombre | Sugiere el formato del nombre de entrenamiento. |
| `Calidad · opcional` | Campo de sueño | Permite valorar subjetivamente el descanso. |
| `Sin valorar` | Opción de calidad | Indica que no se desea puntuar el sueño. |
| `Interrupciones · opcional` | Campo de sueño | Captura cuántas veces se interrumpió el sueño. |
| `Tipo de comida` | Campo de alimentación | Clasifica el momento o naturaleza de la comida. |
| `Desayuno`, `Comida`, `Cena`, `Snack`, `Otra` | Opciones de tipo de comida | Describen el registro alimentario. |
| `Clasificación` | Campo de alimentación | Define el impacto de la comida en el plan semanal. |
| `Equilibrada`, `Adecuada`, `Flexible planificada`, `Fuera del plan`, `Exceso considerable` | Opciones de clasificación | Seleccionan la valoración de la comida. |
| `Descripción` | Campo de alimentación | Permite describir los alimentos. |
| `Ej. pollo, arroz y verduras` | Ejemplo de descripción | Sugiere la información esperada. |
| `Cantidad` | Campo de agua | Captura el volumen de hidratación. |
| `250 ml`, `500 ml`, `750 ml` | Accesos rápidos de agua | Rellenan cantidades frecuentes. |
| `Duración enfocada` | Campo de inteligencia | Captura minutos de práctica intelectual. |
| `Objetivo de la sesión` | Campo de inteligencia | Permite registrar el propósito de la práctica. |
| `Ej. avanzar en {actividad}` | Ejemplo de objetivo | Sugiere el formato del objetivo. |
| `Proyecto · opcional` | Campo de inteligencia | Permite asociar la sesión a un proyecto. |
| `Notas · opcional` | Campo común | Permite añadir contexto libre. |
| `Calculando XP` | Botón mientras se guarda | Indica que el servidor está validando y calculando el impacto. |
| `Guardar registro` | Botón de creación | Envía una nueva actividad. |
| `Guardar cambios` | Botón de edición | Envía modificaciones de una actividad existente. |

## Misiones

| Texto | Ubicación | Función |
| --- | --- | --- |
| `Objetivos adaptados a tus metas` | Antetítulo de Misiones | Explica que las misiones dependen de la configuración personal. |
| `Misiones diarias` | Título de Misiones | Nombra la vista de seguimiento de objetivos diarios. |
| `Se completan automáticamente con tus registros. Hasta cinco bonos de +8 XP por semana.` | Descripción | Explica la automatización y el límite de bonificaciones. |
| `Registrar actividad` | CTA de Misiones | Lleva al formulario para avanzar una misión. |
| `Misiones completas` | Métrica | Muestra número de misiones logradas. |
| `XP provisional` | Métrica | Muestra XP temporal ganada. |
| `Rango en curso` | Métrica | Muestra la letra de rango temporal. |
| `Jornada activa` | Etiqueta de día | Indica el día seleccionado o actual del ciclo. |
| `Próxima` | Estado de misión | Indica una misión aún no activa. |
| `Completa` | Estado de misión | Indica una misión satisfecha. |
| `En marcha` | Estado de misión | Indica avance parcial. |
| `Pendiente` | Estado de misión | Indica que la misión no tiene avance suficiente. |
| `{actual} de {meta} requisitos` | Pie de misión | Compara progreso con el requisito de la misión. |
| `+8 XP obtenida` | Recompensa ya aplicada | Confirma XP de una misión completada. |
| `Bono +8 XP` | Recompensa disponible | Muestra el incentivo de una misión. |
| `El ciclo semanal se está preparando. Vuelve al inicio para actualizarlo con tu próximo registro.` | Estado vacío | Explica que todavía no hay misiones disponibles. |

## Historial y mediciones

| Texto | Ubicación | Función |
| --- | --- | --- |
| `Trazabilidad personal` | Antetítulo de Historial | Presenta el historial como auditoría de acciones. |
| `Historial` | Título | Nombra la vista de registros. |
| `Cada cambio de XP puede rastrearse hasta su registro.` | Descripción | Explica la relación entre actividad y XP. |
| `Nuevo registro` | CTA | Abre el formulario de actividad. |
| `Registro guardado · impacto provisional {+/-n} XP` | Confirmación | Informa que una actividad nueva modificó XP temporal. |
| `Registro actualizado · cambio provisional {+/-n} XP` | Confirmación | Informa el impacto de editar una actividad. |
| `Registro eliminado y XP recalculada · cambio {+/-n} XP` | Confirmación | Informa el impacto de eliminar una actividad. |
| `Actividades` | Tarjeta de historial | Agrupa los registros activos. |
| `{n} registros activos` | Tarjeta de historial | Muestra cuántos registros pueden consultarse. |
| `Sin actividades registradas` | Estado vacío | Indica que aún no existe actividad. |
| `Registra tu primera actividad; su XP aparecerá aquí después de calcularse en el servidor.` | Estado vacío | Explica el siguiente paso y el cálculo de XP. |
| `Registrar ahora` | CTA de estado vacío | Abre el registro. |
| `Mediciones de peso` | Sección de Historial | Agrupa datos de peso independientes de XP. |
| `Separadas del sistema de XP` | Subtítulo de peso | Aclara que el peso no tiene impacto gamificado. |
| `Agregar` | CTA de peso | Abre el registro de medición. |
| `No existen mediciones todavía.` | Estado vacío de peso | Indica que no hay datos de peso guardados. |

## Progreso e informes

| Texto | Ubicación | Función |
| --- | --- | --- |
| `Evolución verificable` | Antetítulo de Progreso | Presenta el avance como comprobable. |
| `Tus avances permanentes y el impulso que aún está pendiente de consolidación.` | Descripción de Progreso | Distingue avance permanente de XP temporal. |
| `Nivel actual` | Métrica | Muestra el nivel permanente actual. |
| `XP consolidada` | Métrica | Muestra XP ya protegida. |
| `Avance permanente` | Métrica | Muestra progreso consolidado hacia la siguiente meta. |
| `XP provisional` | Métrica | Muestra XP de la semana aún abierta. |
| `Proyección de nivel` | Tarjeta | Muestra cómo quedaría el nivel al consolidar. |
| `Nivel {n}` | Tarjeta | Muestra el nivel proyectado. |
| `meta` | Indicador | Identifica la meta de XP del nivel. |
| `XP consolidada en este nivel` | Indicador | Separa XP permanente de la proyección. |
| `{n}% proyectado` | Indicador | Muestra avance incluyendo XP provisional. |
| `Atributos calculados` | Sección | Agrupa el desarrollo por atributo. |
| `Desarrollo del cazador` | Subtítulo | Nombra estilísticamente el crecimiento de atributos. |
| `La sección translúcida incluye XP positiva de la semana; será permanente al cerrar el ciclo.` | Ayuda | Explica la parte proyectada de los atributos. |
| `Continuidad` | Sección | Agrupa rachas e hitos. |
| `Rachas` | Subtítulo | Nombra los indicadores de constancia. |
| `Racha diaria` / `Racha semanal` | Métricas | Distinguen continuidad por día y por semana. |
| `Mejor:` | Indicador | Muestra la mejor racha alcanzada. |
| `Próximo hito:` | Indicador | Muestra el siguiente objetivo de racha. |
| `Todos los hitos base alcanzados` | Estado | Indica que se lograron los hitos definidos. |
| `Las rachas se verifican durante el cierre semanal; sus recompensas se aplican una sola vez por hito.` | Ayuda | Explica cuándo se validan y bonifican rachas. |
| `Ciclos verificados` | Sección | Agrupa semanas ya consolidadas. |
| `Semanas consolidadas` | Subtítulo | Etiqueta el historial de cierres. |
| `Tu primera semana aparecerá aquí después del cierre automático.` | Estado vacío | Explica cuándo aparecerá un informe semanal. |
| `Evolución de peso` | Sección | Agrupa la tendencia de peso privada. |
| `Referencia privada · no afecta XP ni nivel` | Ayuda de peso | Aclara el uso informativo del peso. |
| `Se necesitan al menos dos mediciones para mostrar una tendencia.` | Estado de gráfico | Explica el mínimo de datos requerido. |
| `Unidad:` | Leyenda de gráfico | Identifica la unidad mostrada. |
| `Volver a Progreso` | Enlace de informe | Regresa de un informe al resumen de progreso. |
| `Informe consolidado` | Título de informe | Nombra el resultado de un ciclo cerrado. |
| `Cierre verificado · versión {n}` | Estado de informe | Identifica la versión del cálculo consolidado. |
| `puntos` | Sufijo de métrica | Nombra la unidad de puntuación. |
| `cobertura` | Métrica de informe | Muestra el alcance de pilares atendidos. |
| `Rango final` | Métrica de informe | Muestra la clasificación consolidada de la semana. |
| `XP positiva` | Métrica de informe | Muestra XP obtenida antes de descuentos. |
| `Bonificaciones` | Métrica de informe | Muestra XP adicional por reglas o hitos. |
| `Penalización aplicada` | Métrica de informe | Muestra el ajuste negativo consolidado. |
| `Nivel` | Métrica de informe | Muestra el resultado de nivel tras el cierre. |
| `Rendimiento por pilar` | Sección de informe | Desglosa la semana por pilar. |
| `Balance de XP` | Sección de informe | Resume entradas y ajustes de XP. |
| `Auditoría` | Sección de informe | Agrupa movimientos que justifican el cierre. |
| `Movimientos consolidados` | Subtítulo | Nombra los eventos de XP incluidos en el cierre. |
| `No hay movimientos visibles para este cierre.` | Estado vacío de auditoría | Indica que no hay eventos que mostrar. |

## Perfil, peso, privacidad y legales

| Texto | Ubicación | Función |
| --- | --- | --- |
| `Identidad del sistema` | Antetítulo de Perfil | Presenta los datos de identidad de la cuenta. |
| `Administra tu identidad, preferencias y mediciones privadas.` | Descripción de Perfil | Resume las acciones disponibles. |
| `Información personal` | Sección de Perfil | Agrupa nombre, cumpleaños, zona y unidades. |
| `El correo de acceso es {correo}` | Ayuda de Perfil | Informa cuál correo autentica la cuenta. |
| `Guardar perfil` | Botón | Guarda cambios de datos y preferencias. |
| `Guardando` | Estado de botón | Indica que se está guardando Perfil o peso. |
| `Registro de peso` | Sección de Perfil | Permite añadir una medición privada. |
| `Seguimiento informativo, separado del sistema de XP.` | Ayuda de peso | Aclara que el peso no afecta la gamificación. |
| `Fecha` | Campo de peso | Define el día de la medición. |
| `Peso · kg` / `Peso · lb` | Campo de peso | Captura peso según las unidades seleccionadas. |
| `72.5` / `160` | Ejemplos de peso | Sugieren el formato esperado en métrico e imperial. |
| `Una medición en la misma fecha reemplaza la anterior. El peso es privado y no afecta tu XP.` | Ayuda de medición | Explica la actualización por fecha y la privacidad. |
| `Guardar medición` | Botón | Envía el peso de la fecha seleccionada. |
| `Últimas mediciones` | Sección de Perfil | Agrupa el historial reciente de peso. |
| `Todavía no hay mediciones registradas.` | Estado vacío | Indica que no se guardó peso aún. |
| `Estos datos solo pueden ser consultados y modificados por tu cuenta mediante políticas RLS.` | Nota de seguridad | Explica el aislamiento de datos en Supabase. |
| `Sesión` | Sección de Perfil | Agrupa el control de acceso del dispositivo. |
| `Cierra tu sesión en este dispositivo. Tu progreso permanecerá guardado.` | Ayuda de sesión | Explica qué ocurre al salir. |
| `Documento preliminar` | Términos y privacidad | Advierte que los documentos legales aún no son definitivos. |
| `Aviso de privacidad` | Título legal | Nombra la política de privacidad. |
| `Okiro almacena los datos necesarios para operar tu cuenta: correo, nombre completo, nombre preferido y, cuando decides proporcionarlos, cumpleaños, objetivos y mediciones de peso.` | Aviso de privacidad | Explica las categorías de datos almacenadas. |
| `El cumpleaños y el peso son opcionales y privados. Se utilizan exclusivamente para tu seguimiento personal; no producen recompensas, penalizaciones ni comparaciones públicas.` | Aviso de privacidad | Explica el uso restringido de esos datos. |
| `Los datos de cada usuario están aislados mediante políticas de acceso en Supabase. Este aviso es preliminar y deberá completarse y revisarse legalmente antes del lanzamiento público.` | Aviso de privacidad | Comunica aislamiento técnico y estado legal pendiente. |
| `Términos de uso` | Título legal | Nombra las condiciones de uso. |
| `Okiro se encuentra en desarrollo. Estos términos deberán revisarse legalmente antes del lanzamiento público. La aplicación ofrece seguimiento personal y no sustituye asesoría médica, nutricional o profesional.` | Términos | Delimita el estado del producto y evita interpretarlo como consejo profesional. |
| `Volver al registro` | Enlace legal | Regresa al flujo de creación de cuenta. |

## Mensajes de validación, error y resultado

| Texto | Contexto | Función |
| --- | --- | --- |
| `Escribe un correo válido.` | Acceso o registro | Solicita un formato de correo válido. |
| `Escribe tu contraseña.` | Acceso o registro | Indica que falta la contraseña. |
| `Escribe tu nombre completo.` | Registro o Perfil | Indica que falta el nombre legal. |
| `El nombre es demasiado largo.` | Registro, onboarding o Perfil | Informa que se superó el máximo permitido. |
| `Escribe el nombre que quieres ver en Okiro.` | Registro o Perfil | Indica que falta el nombre preferido. |
| `Escribe una fecha de nacimiento válida.` | Registro o Perfil | Indica que la fecha no es válida. |
| `El peso debe estar entre 20 y 500 kg.` | Registro o peso | Indica el rango válido en sistema métrico. |
| `La contraseña debe tener al menos 10 caracteres.` | Registro | Comunica el requisito de seguridad. |
| `Las contraseñas no coinciden.` | Registro | Indica que la confirmación no coincide. |
| `Debes aceptar los términos y el aviso de privacidad.` | Registro | Indica que falta consentimiento. |
| `No fue posible completar la operación. Inténtalo nuevamente.` | Autenticación | Comunica un fallo genérico del flujo. |
| `La conexión segura todavía no está configurada.` | Autenticación | Explica que falta la configuración del servicio. |
| `Correo o contraseña incorrectos.` | Inicio de sesión | Informa credenciales inválidas sin revelar cuál falló. |
| `Confirma tu zona horaria.` | Onboarding | Indica que falta la zona horaria. |
| `El máximo de sueño no puede ser menor que el mínimo.` | Onboarding | Impide un rango de sueño incoherente. |
| `Escribe el nombre de tu actividad de inteligencia.` | Onboarding | Indica que se eligió actividad personalizada sin nombre. |
| `Revisa los datos del formulario.` | Onboarding | Solicita corregir campos no válidos. |
| `No pudimos guardar tus objetivos. Inténtalo nuevamente.` | Onboarding | Comunica fallo al guardar metas. |
| `El horario se solapa con otro entrenamiento o sesión de enfoque.` | Registro de actividad | Evita duplicar periodos de actividad. |
| `La fecha seleccionada no pertenece a una semana abierta.` | Registro de actividad | Impide modificar ciclos ya cerrados o futuros no válidos. |
| `Ya utilizaste las comidas flexibles disponibles esta semana.` | Registro de comida | Indica que se alcanzó el límite semanal configurado. |
| `Ya existe un registro equivalente para esa fecha.` | Registro de actividad | Evita duplicados equivalentes. |
| `No pudimos guardar el registro. Revisa los datos e inténtalo nuevamente.` | Registro de actividad | Comunica un fallo al crear o editar. |
| `No fue posible eliminar el registro.` | Historial | Comunica un fallo al eliminar. |

## Convenciones de lectura

- `XP` significa puntos de experiencia del sistema.
- `XP consolidada` es permanente; `XP provisional` pertenece a la semana abierta y se recalcula conforme se agregan, modifican o eliminan registros.
- `Nivel` es el avance general consolidado; `Nv.` es el nivel de un atributo específico.
- Los valores como `{n}`, `{fecha}`, `{peso}`, `{actividad}`, `{correo}` y `{nombre}` se sustituyen por datos reales de la cuenta o del ciclo.
- Los nombres de misiones se generan según objetivos personales. Su estructura muestra un objetivo, el avance `{actual} de {meta}` y, cuando corresponde, el bono de `+8 XP`.
