# Sistema de XP — Especificación funcional v1.0

## 1. Propósito del sistema

El sistema debe convertir hábitos reales en una progresión estilo RPG, pero manteniendo cinco principios fundamentales:

1. **La constancia vale más que la perfección.**
2. **Un buen día no compensa completamente una semana desastrosa.**
3. **Un mal día no destruye una semana completa.**
4. **El usuario nunca pierde niveles que ya consolidó.**
5. **La aplicación premia comportamientos saludables, no obsesiones ni extremos.**

El objetivo no es conseguir la mayor cantidad posible de XP. El objetivo es construir una vida equilibrada mientras la progresión virtual representa ese crecimiento.

---

# 2. Las cuatro capas del progreso

El sistema no utilizará una sola cifra para representar todo. Tendrá cuatro capas distintas.

## 2.1 XP provisional semanal

Es la XP que el usuario gana y pierde durante la semana actual.

Ejemplos:

- Entrenamiento completado: `+70 XP`
- Noche con menos de cinco horas de sueño: `−25 XP`
- Comida chatarra no planificada: `−8 XP`
- Completar el objetivo semanal de ejercicio: `+50 XP`

Esta XP puede subir y bajar mientras la semana siga abierta.

## 2.2 XP de cuenta o XP consolidada

Es la XP permanente que determina el nivel general.

Cada lunes, al cerrar la semana, se calcula:

```text
XP semanal neta =
XP positiva
+ bonificaciones
− penalizaciones aplicadas
```

Después:

```text
XP consolidada = máximo entre 0 y XP semanal neta
```

La XP consolidada se agrega al progreso histórico del usuario.

### Regla fundamental

La XP de semanas anteriores jamás puede reducirse.

Si el usuario tiene una semana desastrosa:

- No baja de nivel.
- No pierde XP histórica.
- Puede terminar la semana con `0 XP consolidada`.
- Obtiene un rango semanal bajo.
- Pierde su racha de consistencia.

Las penalizaciones destruyen XP pendiente de la semana actual, pero nunca progreso que ya fue consolidado.

---

## 2.3 Rango semanal

El rango semanal mide la calidad y equilibrio de la semana, independientemente de la cantidad de XP obtenida.

Rangos disponibles:

| Puntuación | Rango |
|---:|:---:|
| 95–100 | S |
| 85–94.99 | A |
| 70–84.99 | B |
| 55–69.99 | C |
| 40–54.99 | D |
| Menos de 40 | E |

El usuario puede ganar bastante XP entrenando mucho, pero obtener solamente rango B si duerme mal y descuida su alimentación.

Esto impide que una sola actividad domine todo el sistema.

---

## 2.4 Atributos

Las actividades también alimentan atributos individuales:

- **Fuerza**
- **Resistencia**
- **Vitalidad**
- **Inteligencia**
- **Disciplina**

Los atributos son permanentes y nunca disminuyen.

El rango semanal es el encargado de mostrar el estado actual del usuario. Los atributos representan toda su trayectoria.

---

# 3. Ciclo semanal

Cada semana funciona de la siguiente manera:

```text
Inicio: lunes a las 00:00
Fin operativo: domingo a las 23:59
Periodo de corrección: lunes hasta las 12:00
Consolidación: lunes a las 12:00
```

El horario utilizado será siempre el horario local configurado por el usuario.

## Asignación de actividades

- Entrenamientos: día en que fueron realizados.
- Comidas: día en que fueron consumidas.
- Agua: día en que fue consumida.
- Programación: día de la sesión.
- Sueño: día en que el usuario despertó.

Ejemplo:

Si el usuario duerme desde el domingo a las 11:30 p. m. hasta el lunes a las 7:00 a. m., ese sueño pertenece al lunes.

## Cambios de objetivos

Los objetivos no pueden modificarse retroactivamente.

Si el usuario cambia su meta de ejercicio de cinco a tres días, el cambio entra en vigor la siguiente semana.

Esto evita reducir metas al final de una mala semana para escapar de una penalización.

---

# 4. Presupuesto semanal de XP

La semana ideal está diseñada alrededor de aproximadamente `1,000 XP`.

## XP base máxima

| Categoría | XP máxima semanal |
|---|---:|
| Ejercicio | 350 |
| Sueño | 245 |
| Alimentación | 210 |
| Hidratación | 105 |
| Programación | 120 |
| **Total base** | **1,030** |

## Bonificaciones máximas

| Bonificación | Máximo |
|---|---:|
| Objetivo completo de ejercicio | 50 |
| Sueño consistente | 20 |
| Programación constante | 20 |
| Misiones diarias | 40 |
| Semana equilibrada | 20 |
| **Total de bonificaciones** | **150** |

La XP máxima ordinaria por semana será:

```text
1,030 XP base + 150 XP de bonificación = 1,180 XP
```

Los logros especiales pueden entregar XP adicional, pero serán recompensas únicas y no repetibles.

---

# 5. Sistema de ejercicio

## 5.1 Objetivo predeterminado

```text
Cinco días equivalentes de ejercicio por semana
```

Se utiliza el concepto de **días equivalentes** para reconocer sesiones parciales y recuperación activa sin hacerlas equivalentes a un entrenamiento completo.

## 5.2 Entrenamiento estructurado

Incluye:

- Gimnasio
- Rutina de fuerza
- Cardio
- Ciclismo
- Natación
- Box
- MMA
- Deporte
- Entrenamiento funcional
- Rutinas guiadas

| Duración | XP | Días equivalentes |
|---:|---:|---:|
| Menos de 20 minutos | 0 | 0 |
| 20–29 minutos | +35 | 0.5 |
| 30–44 minutos | +55 | 1 |
| 45–74 minutos | +70 | 1 |
| 75 minutos o más | +80 | 1 |

Una sesión nunca puede aportar más de un día equivalente, independientemente de su duración.

Esto evita que un entrenamiento de tres horas sustituya toda una semana de constancia.

---

## 5.3 Actividad ligera o recuperación activa

Incluye:

- Caminata
- Movilidad
- Estiramientos
- Yoga ligero
- Recuperación activa
- Bicicleta recreativa
- Actividad física de baja intensidad

| Duración | XP | Días equivalentes |
|---:|---:|---:|
| Menos de 30 minutos | 0 | 0 |
| 30–44 minutos | +20 | 0.25 |
| 45–59 minutos | +30 | 0.5 |
| 60 minutos o más | +40 | 0.75 |

Solamente dos días de recuperación activa pueden contribuir al objetivo semanal.

Por lo tanto, para completar cinco días equivalentes, el usuario necesita como mínimo actividad estructurada suficiente. No podrá completar toda la semana registrando únicamente caminatas ligeras.

---

## 5.4 Límites

- Máximo diario ordinario: `80 XP`.
- Máximo semanal de ejercicio: `350 XP`.
- Solamente se utiliza la actividad de mayor valor del día.
- Varias sesiones pueden registrarse, pero no acumular XP ilimitadamente.
- Las sesiones adicionales después de alcanzar el límite siguen apareciendo en el historial, pero no generan XP.

No se recompensa el sobreentrenamiento.

---

## 5.5 Bonificación y penalización semanal

Sea `D` la cantidad de días equivalentes completados, limitada entre 0 y 5.

Si:

```text
D ≥ 5
```

Se concede:

```text
+50 XP
```

Si:

```text
D < 5
```

La penalización será:

```text
Penalización de ejercicio = −40 × (5 − D)
```

La cantidad final se redondea al múltiplo de cinco más cercano.

### Ejemplos

| Días equivalentes | Resultado semanal |
|---:|---:|
| 5 | +50 XP |
| 4.5 | −20 XP |
| 4 | −40 XP |
| 3 | −80 XP |
| 2 | −120 XP |
| 1 | −160 XP |
| 0 | −200 XP |

Esta penalización se suma a la pérdida natural de no haber ganado la XP de las sesiones faltantes.

Por eso incumplir el objetivo importa, pero no destruye el progreso histórico.

---

# 6. Sistema de sueño

## 6.1 Objetivo predeterminado

El rango predeterminado será de siete a nueve horas.

Debe poder personalizarse si el usuario tiene una recomendación diferente o un horario especial.

## 6.2 XP por duración

| Duración total | XP |
|---|---:|
| 7:00–9:00 horas | +30 |
| 6:30–6:59 horas | +20 |
| 9:01–9:30 horas | +20 |
| 6:00–6:29 horas | +10 |
| 9:31–10:00 horas | +10 |
| 5:00–5:59 horas | −10 |
| Menos de 5 horas | −25 |
| Más de 10 horas | 0 |

Dormir más de diez horas no se penaliza directamente, porque puede estar relacionado con recuperación, enfermedad o deuda de sueño, pero tampoco produce XP adicional.

## 6.3 Consistencia diaria

El usuario configura una ventana ideal para acostarse.

Ejemplo:

```text
Hora objetivo: 11:30 p. m.
Tolerancia: 45 minutos antes o después
```

Dormir dentro de la ventana concede:

```text
+5 XP
```

## 6.4 Límites

- Máximo diario: `+35 XP`.
- Penalización mínima diaria: `−25 XP`.
- Máximo semanal ordinario: `245 XP`.

## 6.5 Bonificación semanal

Se conceden `+20 XP` si se cumplen ambas condiciones:

1. El promedio semanal se encuentra dentro del objetivo configurado.
2. Por lo menos cinco noches recibieron los 30 XP completos por duración.

La bonificación reconoce consistencia, no solamente un promedio artificial.

Ejemplo:

Dormir cuatro horas tres días y diez horas los otros cuatro días no debe considerarse una buena semana aunque el promedio parezca aceptable.

---

# 7. Sistema de alimentación

El sistema no contará calorías durante el MVP.

Cada comida se clasifica por calidad general y alineación con el objetivo del usuario.

## 7.1 Comidas principales

Se pueden puntuar hasta tres comidas principales por día.

### Comida equilibrada

Características generales:

- Fuente de proteína
- Alimentos con valor nutricional
- Porción razonable
- Compatible con el objetivo del usuario

Recompensa:

```text
+10 XP
```

### Comida adecuada

No es perfecta, pero es una comida razonable y no representa un retroceso importante.

Recompensa:

```text
+6 XP
```

### Comida flexible planificada

Es una comida elegida conscientemente que puede no ser óptima, pero forma parte del equilibrio de la semana.

Recompensa:

```text
+2 XP
```

### Comida chatarra o fuera del plan

Ejemplos:

- Comida altamente procesada no planeada
- Consumo impulsivo
- Sustituir una comida adecuada por chatarra
- Pedido realizado por antojo sin control

Penalización:

```text
−8 XP
```

### Episodio de exceso considerable

Representa una conducta claramente distinta a una comida flexible:

- Comer hasta sentirse físicamente mal
- Pérdida evidente de control
- Cantidad excesiva de alimentos
- Varias porciones impulsivas consecutivas

Penalización:

```text
−15 XP
```

Esta clasificación reemplaza la puntuación normal de esa comida. No se suman simultáneamente `−8` y `−15`.

---

## 7.2 Snacks

| Tipo | XP |
|---|---:|
| Snack nutritivo | +2 |
| Snack discrecional o chatarra | −3 |

Límites diarios:

- Máximo de dos snacks positivos.
- Máximo de dos penalizaciones por snacks.

---

## 7.3 Comida flexible semanal

El usuario puede designar una comida flexible por semana.

Esta comida:

- No genera penalización.
- Entrega `+2 XP`.
- Debe registrarse antes de cerrar el día.
- No puede utilizarse retroactivamente después del cierre semanal.

No se llamará “cheat meal”, porque la comida no debe plantearse como una culpa moral.

---

## 7.4 Límites diarios

```text
Máximo diario: +30 XP
Mínimo diario: −20 XP
Máximo semanal positivo: 210 XP
```

## 7.5 Reglas de seguridad

La aplicación jamás entregará XP por:

- Saltarse comidas.
- Comer cantidades peligrosamente bajas.
- Ayunar más tiempo.
- Perder peso rápidamente.
- Compensar una comida mediante ejercicio excesivo.
- Vomitar o utilizar métodos compensatorios.
- Reducir calorías por debajo de un mínimo extremo.

No comer no equivale a comer bien.

Una comida no registrada genera `0 XP`, pero afecta la cobertura de datos y la puntuación semanal de alimentación.

---

# 8. Sistema de hidratación

El usuario establece un objetivo diario personal.

Ejemplo:

```text
Objetivo diario: 2.5 litros
```

La XP se calcula según el porcentaje alcanzado.

| Porcentaje del objetivo | XP |
|---:|---:|
| Menos del 40% | 0 |
| 40–59% | +4 |
| 60–79% | +8 |
| 80–99% | +12 |
| 100–120% | +15 |
| Más del 120% | +15 |

No existe XP adicional por exceder el 120%.

La aplicación no debe incentivar el consumo excesivo de agua.

## Límites

```text
Máximo diario: 15 XP
Máximo semanal: 105 XP
Sin penalización directa
```

No cumplir el objetivo reduce el rango semanal porque el pilar de hidratación tendrá una puntuación baja, aunque no reste XP directamente.

---

# 9. Sistema de programación

La categoría puede llamarse posteriormente **Enfoque** o **Inteligencia**, permitiendo agregar estudio, lectura técnica y aprendizaje.

Para el MVP se utilizarán sesiones de programación.

## 9.1 Sesión válida

Una sesión válida debe cumplir:

- Mínimo 25 minutos de trabajo enfocado.
- Tener un objetivo registrado.
- No encontrarse duplicada con otra sesión.
- Realizarse en un día distinto para contar hacia la constancia semanal.

## 9.2 XP por sesión

| Tiempo enfocado | XP |
|---:|---:|
| Menos de 25 minutos | 0 |
| 25–49 minutos | +20 |
| 50–89 minutos | +30 |
| 90 minutos o más | +40 |

Solamente se puntúa una sesión diaria.

Si el usuario realiza varias sesiones, pueden acumularse para calcular la duración total del día, pero el máximo sigue siendo `40 XP`.

## 9.3 Límites y objetivo semanal

```text
Objetivo: tres días por semana
Máximo semanal base: 120 XP
```

Si completa sesiones válidas en tres días diferentes:

```text
+20 XP de bonificación
```

Si no realiza ninguna sesión en toda la semana:

```text
−50 XP
```

Si realiza una o dos sesiones:

- Gana la XP correspondiente.
- No recibe bonificación.
- No recibe penalización.

Esto respeta la regla original: no programar un día no es un fracaso, pero abandonar completamente la semana sí tiene una consecuencia.

---

# 10. Misiones diarias

Cada día, el sistema genera una lista de tareas obligatorias basada en el plan del usuario.

Ejemplo de día de entrenamiento:

- Completar entrenamiento programado.
- Alcanzar por lo menos 90% del objetivo de agua.
- Registrar las comidas principales.
- Cumplir el objetivo de sueño.
- Completar sesión de programación, si estaba programada.

Ejemplo de día de descanso:

- Realizar descanso o recuperación planificada.
- Alcanzar por lo menos 90% del objetivo de agua.
- Registrar las comidas.
- Cumplir el objetivo de sueño.

## Bonificación diaria

Si el usuario completa el 100% de las tareas obligatorias del día:

```text
+8 XP
```

Límite:

```text
Máximo de cinco bonificaciones diarias por semana
Máximo semanal: +40 XP
```

No es necesario tener siete días perfectos para conseguir el máximo.

Esto permite dos días complicados sin destruir la posibilidad de una buena semana.

---

# 11. Bonificación de semana equilibrada

El usuario recibe:

```text
+20 XP
```

si cumple simultáneamente:

- Ejercicio: puntuación mínima de 70.
- Sueño: puntuación mínima de 70.
- Alimentación: puntuación mínima de 70.
- Hidratación: puntuación mínima de 70.
- Programación: puntuación mínima de 70.
- Cobertura de datos mínima de 80%.

Esta bonificación premia el equilibrio.

No importa que el usuario haya obtenido muchísima XP entrenando si abandonó por completo los demás pilares.

---

# 12. Penalizaciones

## 12.1 Penalizaciones diarias

Las penalizaciones diarias provienen principalmente de:

- Sueño insuficiente.
- Comidas fuera del plan.
- Episodios de exceso.
- Snacks discrecionales.

Las penalizaciones combinadas de sueño y alimentación estarán limitadas a:

```text
−40 XP por día
```

Ejemplo:

- Dormir menos de cinco horas: `−25`
- Dos episodios alimenticios negativos: `−20`

Resultado bruto:

```text
−45 XP
```

Penalización aplicada:

```text
−40 XP
```

## 12.2 Penalizaciones semanales

Provienen de:

- Incumplimiento del objetivo de ejercicio.
- Cero sesiones de programación.
- Penalizaciones diarias acumuladas.

## 12.3 Límite global

La penalización máxima aplicable durante una semana será:

```text
−300 XP
```

Aunque el cálculo bruto sea inferior a `−300`, solamente se aplicarán `−300 XP`.

## 12.4 No existe deuda

Si una semana termina con:

```text
−100 XP neta
```

La XP consolidada será:

```text
0 XP
```

Los `−100 XP` no se trasladan a la siguiente semana.

Cada lunes comienza una oportunidad nueva.

---

# 13. Fórmula de consolidación

Al cerrar la semana:

```text
XP positiva = suma de todas las transacciones positivas base
Bonificaciones = suma de las bonificaciones obtenidas
Penalización bruta = valor absoluto de todas las transacciones negativas
Penalización aplicada = mínimo entre penalización bruta y 300
```

Entonces:

```text
XP semanal neta =
XP positiva
+ bonificaciones
− penalización aplicada
```

Finalmente:

```text
XP consolidada =
máximo entre 0 y XP semanal neta
```

Ejemplo:

```text
XP positiva:        780
Bonificaciones:     110
Penalización bruta: 170
Penalización aplicada: 170

XP semanal neta:
780 + 110 − 170 = 720 XP

XP consolidada:
720 XP
```

---

# 14. Curva de niveles

La cantidad necesaria para avanzar desde el nivel actual `L` al siguiente será:

```text
XP necesaria = 400 + 60 × (L − 1)
```

## Ejemplos

| Nivel actual | XP para siguiente nivel |
|---:|---:|
| 1 | 400 |
| 2 | 460 |
| 5 | 640 |
| 10 | 940 |
| 25 | 1,840 |
| 50 | 3,340 |
| 100 | 6,340 |

La XP total necesaria para alcanzar un nivel será:

```text
XP total para nivel L =
((L − 1) ÷ 2) × [800 + 60 × (L − 2)]
```

## Progresión acumulada

| Nivel alcanzado | XP histórica necesaria |
|---:|---:|
| 5 | 1,960 |
| 10 | 5,760 |
| 25 | 26,160 |
| 50 | 90,160 |
| 100 | 330,660 |

Con un promedio de aproximadamente `900 XP semanales`:

- Nivel 10: aproximadamente 6–7 semanas.
- Nivel 25: aproximadamente 29 semanas.
- Nivel 50: aproximadamente 100 semanas.
- Nivel 100: aproximadamente siete años.

Los primeros niveles se sienten rápidos y emocionantes. Los niveles altos representan años de disciplina real.

## Regla de nivel

Una subida de nivel es permanente.

Si la XP consolidada de una semana permite subir varios niveles, el sistema realiza todas las subidas correspondientes.

---

# 15. Cálculo del rango semanal

El rango no se calcula directamente mediante XP.

Se calcula utilizando cinco pilares normalizados entre 0 y 100.

## 15.1 Ejercicio

```text
Puntuación de ejercicio =
20 × días equivalentes completados
```

Máximo:

```text
100 puntos
```

Ejemplos:

| Días equivalentes | Puntuación |
|---:|---:|
| 5 | 100 |
| 4 | 80 |
| 3 | 60 |
| 2 | 40 |
| 1 | 20 |
| 0 | 0 |

---

## 15.2 Sueño

Cada noche recibe una puntuación:

| Duración | Puntuación |
|---|---:|
| 7–9 horas | 100 |
| 6.5–7 o 9–9.5 horas | 75 |
| 6–6.5 o 9.5–10 horas | 50 |
| 5–6 horas | 20 |
| Menos de 5 horas | 0 |
| Más de 10 horas | 50 |
| Sin registro | 0 |

La puntuación semanal es el promedio de las siete noches.

---

## 15.3 Alimentación

Cada comida principal recibe:

| Clasificación | Puntuación |
|---|---:|
| Equilibrada | 100 |
| Adecuada | 75 |
| Flexible | 55 |
| No registrada | 40 |
| Chatarra o fuera del plan | 20 |
| Exceso considerable | 0 |

La puntuación semanal es el promedio de todas las comidas esperadas.

Los snacks pueden modificar la puntuación diaria en un máximo de cinco puntos positivos o negativos.

---

## 15.4 Hidratación

```text
Puntuación diaria =
porcentaje del objetivo alcanzado
```

Con un máximo de 100.

Ejemplos:

- 63% del objetivo: 63 puntos.
- 90% del objetivo: 90 puntos.
- 120% del objetivo: 100 puntos.

La puntuación semanal será el promedio diario.

---

## 15.5 Programación

```text
Puntuación =
(días válidos ÷ 3) × 100
```

Con un máximo de 100.

| Días válidos | Puntuación |
|---:|---:|
| 0 | 0 |
| 1 | 33.33 |
| 2 | 66.67 |
| 3 o más | 100 |

---

## 15.6 Fórmula ponderada

```text
Rango semanal =
Ejercicio × 0.35
+ Sueño × 0.25
+ Alimentación × 0.20
+ Hidratación × 0.10
+ Programación × 0.10
```

El ejercicio es el pilar de mayor peso porque el objetivo inicial del sistema es recuperar la condición física.

El sueño y la alimentación juntos pesan más que el ejercicio, evitando que entrenar mientras se descuida la salud produzca un rango alto.

---

# 16. Cobertura de datos

La aplicación debe distinguir entre:

- No cumplir.
- No registrar.
- Registro incompleto.

No registrar algo no genera automáticamente una penalización directa, pero tampoco puede utilizarse para ocultar una mala semana.

## Cobertura requerida

Se consideran registros importantes:

- Sueño.
- Comidas principales.
- Hidratación.
- Entrenamientos programados.
- Sesiones de programación programadas.

## Restricciones de rango

| Cobertura de datos | Rango máximo |
|---:|:---:|
| 80–100% | Sin límite |
| 60–79% | B |
| Menos de 60% | C |

El usuario no podrá obtener rango S o A registrando solamente sus mejores días.

---

# 17. Atributos

La XP positiva de cada actividad también se asigna a un atributo. No representa XP adicional para el nivel general.

Ejemplo:

Un entrenamiento de fuerza de `+70 XP` genera:

- `+70 XP general provisional`.
- `+70 XP de Fuerza`.

No genera `140 XP general`.

## 17.1 Fuerza

Recibe XP de:

- Pesas.
- Calistenia.
- Fuerza funcional.
- Entrenamiento de resistencia muscular.
- Rutinas de hipertrofia.

## 17.2 Resistencia

Recibe XP de:

- Cardio.
- Caminata.
- Ciclismo.
- Natación.
- Box.
- MMA.
- Deportes.
- Sesiones mixtas de acondicionamiento.

Una actividad mixta puede distribuirse 50/50 entre Fuerza y Resistencia.

## 17.3 Vitalidad

Recibe XP positiva de:

- Sueño.
- Alimentación.
- Hidratación.

Las penalizaciones no reducen Vitalidad acumulada.

La condición actual ya se refleja mediante el rango semanal.

## 17.4 Inteligencia

Recibe XP de:

- Programación.
- Estudio técnico.
- Resolución de ejercicios.
- Lectura académica.
- Cursos.

En el MVP solamente se habilitará programación.

## 17.5 Disciplina

Recibe XP de:

- Bonificaciones de misiones diarias.
- Objetivo semanal de ejercicio.
- Consistencia de sueño.
- Constancia en programación.
- Semana equilibrada.
- Rachas.
- Misiones de recuperación.

---

## 17.6 Niveles de atributos

La XP requerida para subir un atributo desde el nivel `A` será:

```text
XP requerida de atributo =
150 + 25 × (A − 1)
```

Los atributos suben más rápido que el nivel general, haciendo visible qué áreas domina el usuario.

---

# 18. Rachas

## 18.1 Racha diaria

Un día entra en la racha cuando se completan todas sus misiones obligatorias.

La racha no produce multiplicadores permanentes de XP.

Los multiplicadores generan dos problemas:

1. Inflan demasiado la economía del juego.
2. Hacen que perder una racha sea emocionalmente devastador.

En su lugar, se utilizan recompensas fijas por hitos.

| Hito | Recompensa única |
|---:|---:|
| 3 días | +10 XP |
| 7 días | +25 XP |
| 14 días | +40 XP |
| 30 días | +75 XP |
| 60 días | +100 XP |
| 100 días | +150 XP |
| 365 días | +500 XP |

Cada recompensa se obtiene una sola vez por ciclo de racha.

## 18.2 Racha semanal

Una semana cuenta para la racha si obtiene rango B o superior.

Hitos:

| Hito | Recompensa |
|---:|---:|
| 4 semanas | +100 XP |
| 8 semanas | +200 XP |
| 12 semanas | +300 XP |
| 26 semanas | +600 XP |
| 52 semanas | +1,200 XP |

Estas recompensas son especiales y no forman parte del límite ordinario semanal de bonificaciones.

---

# 19. Misión de recuperación

Si el usuario obtiene rango D o E, la siguiente semana aparece una misión especial.

## Objetivo

Recuperar estructura, no intentar compensar todo de golpe.

Requisitos predeterminados:

- Completar al menos tres días equivalentes de ejercicio.
- Conseguir puntuación de sueño mínima de 70.
- Alcanzar promedio de hidratación mínimo de 80%.
- Registrar al menos 80% de los datos.
- Mejorar por lo menos un rango respecto a la semana anterior.

Recompensa:

```text
+50 XP
+50 XP de Disciplina
Insignia de recuperación
```

La recompensa solamente se entrega una vez por cada semana fallida.

No se recupera la XP perdida de la semana anterior. Se recompensa haber retomado el control.

---

# 20. Días de descanso

El descanso programado es parte del sistema.

En un día de descanso:

- No existe misión obligatoria de entrenamiento.
- No se penaliza no entrenar.
- Puede aparecer una misión de movilidad o recuperación opcional.
- Se mantienen sueño, alimentación e hidratación.
- El día puede formar parte de una racha si se cumplen sus tareas correspondientes.

Descansar estratégicamente no es fallar.

---

# 21. Modo de protección

Debe existir un modo especial para:

- Enfermedad.
- Lesión.
- Viaje.
- Exámenes.
- Emergencia familiar.
- Situaciones extraordinarias.

## Funcionamiento

El usuario selecciona:

- Motivo.
- Fecha de inicio.
- Fecha de finalización.
- Pilares afectados.

Durante el modo de protección:

- Los pilares afectados se eliminan temporalmente del denominador.
- No generan penalizaciones.
- No generan bonificaciones.
- No ayudan a construir rachas.
- El rango se recalcula utilizando únicamente los pilares activos.
- La semana no puede obtener rango S.

## Restricción inicial

```text
Máximo de siete días protegidos dentro de cada periodo de 30 días
```

El objetivo es proteger al usuario ante circunstancias reales, no permitir que elimine cualquier semana incómoda.

---

# 22. Prevención de abusos

Aunque la aplicación sea personal, la economía debe estar protegida desde el diseño.

## Reglas

1. Una actividad solamente puede generar una transacción de XP.
2. Editar una actividad recalcula su transacción anterior.
3. Eliminar una actividad revierte su XP.
4. No pueden existir dos transacciones activas para el mismo registro.
5. Los límites diarios y semanales se aplican después de sumar las actividades.
6. Las metas modificadas entran en vigor la siguiente semana.
7. Una sesión no puede registrarse simultáneamente como ejercicio y programación.
8. Los minutos de varias sesiones solapadas no pueden contarse dos veces.
9. El usuario puede registrar actividades atrasadas únicamente antes del cierre semanal.
10. Después de consolidar la semana, los registros quedan bloqueados.
11. Una corrección posterior requiere una transacción de ajuste auditable.
12. Las integraciones con Apple Health o Health Connect no deben duplicar registros manuales.
13. El exceso de actividad nunca entrega XP ilimitada.
14. Los datos importados y manuales producen la misma XP; la verificación solamente afecta insignias especiales.
15. No existe ningún método para comprar XP con dinero.

---

# 23. Registro de transacciones

Cada cambio de XP debe almacenarse como una transacción independiente.

Estructura conceptual:

```text
XPTransaction
- id
- userId
- weekId
- category
- sourceType
- sourceId
- amount
- attribute
- occurredAt
- status
- metadata
- createdAt
- reversedTransactionId
```

## Estados posibles

- `provisional`
- `consolidated`
- `reversed`
- `adjustment`

Ejemplo:

```text
Categoría: ejercicio
Origen: workout
Origen ID: workout_9281
Cantidad: +70
Atributo: fuerza
Estado: provisional
```

Esto permite:

- Auditar cada punto.
- Recalcular semanas.
- Deshacer cambios.
- Explicar al usuario por qué ganó o perdió XP.
- Evitar errores de duplicación.

---

# 24. Algoritmo de cierre semanal

```text
1. Obtener todos los registros de la semana.
2. Generar o recalcular las transacciones base.
3. Aplicar límites diarios.
4. Aplicar límites semanales por categoría.
5. Calcular bonificación de ejercicio.
6. Calcular penalización de ejercicio.
7. Calcular bonificación de sueño.
8. Calcular bonificación o penalización de programación.
9. Calcular bonificaciones de misiones diarias.
10. Calcular bonificación de semana equilibrada.
11. Sumar XP positiva.
12. Sumar bonificaciones.
13. Sumar penalizaciones.
14. Limitar las penalizaciones a 300 XP.
15. Calcular XP semanal neta.
16. Convertir a cero cualquier resultado negativo.
17. Agregar la XP neta al total histórico.
18. Recalcular el nivel general.
19. Distribuir la XP positiva entre atributos.
20. Calcular la puntuación y el rango semanal.
21. Actualizar las rachas.
22. Entregar logros e hitos.
23. Bloquear la semana.
24. Generar el reporte semanal.
```

El proceso debe ser idempotente: ejecutarlo dos veces no puede duplicar XP.

---

# 25. Reporte semanal

El usuario recibirá un resumen como este:

```text
EVALUACIÓN SEMANAL COMPLETADA

Ejercicio
4.5 / 5 días equivalentes
XP base: +325
Ajuste por objetivo: −20

Sueño
Promedio: 7 h 18 min
XP base: +215
Consistencia: +20

Alimentación
Puntuación: 78/100
XP: +142
Penalizaciones: −16

Hidratación
Promedio: 91%
XP: +84

Programación
3 días completados
XP base: +90
Constancia: +20

Misiones diarias
5 días perfectos
Bonificación: +40

Semana equilibrada
Completada: +20

XP positiva y bonos: 956
Penalizaciones aplicadas: −36
XP consolidada: 920

Rango semanal: A
Racha semanal: 3
Nivel actual: 8
Progreso al nivel 9: 620 / 820 XP
```

Cada cifra debe ser presionable para mostrar exactamente de dónde surgió.

---

# 26. Ejemplo de una semana excelente

## Actividad

- Cinco entrenamientos de 45–74 minutos.
- Cinco noches perfectas y dos noches aceptables.
- Alimentación consistente.
- Hidratación cercana al objetivo.
- Tres días de programación.
- Cinco misiones diarias completas.
- Todos los pilares por encima de 70.

## Cálculo

```text
Ejercicio base:                 +350
Objetivo de ejercicio:           +50

Sueño base:                     +215
Consistencia de sueño:           +20

Alimentación:                   +150
Hidratación:                     +93

Programación:                    +90
Constancia de programación:      +20

Misiones diarias:                +40
Semana equilibrada:              +20
-------------------------------------
XP positiva total:            +1,048

Penalizaciones:                   0
-------------------------------------
XP consolidada:               +1,048
```

Resultado aproximado:

```text
Rango: A o S
Nivel: progreso considerable
Racha: continúa
```

---

# 27. Ejemplo de una semana intermedia

## Actividad

- Tres entrenamientos completos.
- Sueño aceptable, pero dos noches malas.
- Varias comidas adecuadas y dos comidas chatarra.
- Hidratación irregular.
- Una sesión de programación.

## Cálculo

```text
Ejercicio base:                 +210
Déficit de ejercicio:            −80

Sueño positivo:                 +120
Penalizaciones de sueño:         −35

Alimentación positiva:           +90
Penalizaciones alimenticias:     −16

Hidratación:                     +52

Programación:                    +20
Bonificación de programación:      0
Penalización de programación:      0

Misiones diarias:                +16
Semana equilibrada:                0
-------------------------------------
XP positiva y bonos:            +508
Penalizaciones:                 −131
-------------------------------------
XP consolidada:                 +377
```

Resultado probable:

```text
Rango: C
El usuario progresa, pero lentamente.
```

Esto comunica que hizo algunas cosas bien sin fingir que fue una gran semana.

---

# 28. Ejemplo de una semana abandonada

## Actividad

- Cero ejercicio.
- Cero programación.
- Pocos registros.
- Sin misiones diarias completas.

## Cálculo

```text
Ejercicio base:                    0
Penalización de ejercicio:      −200
Penalización de programación:    −50
Otras penalizaciones:            −70
-------------------------------------
Penalización bruta:             −320
Penalización máxima aplicada:   −300

XP positiva:                       0
XP semanal neta:                −300
XP consolidada:                    0
```

Resultado:

```text
Rango: E
Nivel general: no disminuye
Racha: termina
Misión de recuperación: activada
```

La app reconoce el fracaso de la semana sin destruir la identidad ni el progreso histórico del usuario.

---

# 29. Elementos que no deben existir

Para preservar el balance, la aplicación no debe incluir:

- Multiplicadores infinitos por racha.
- XP ilimitada por duración.
- Penalizaciones que bajen niveles.
- Deuda de XP entre semanas.
- Castigos por días de descanso programados.
- Premios por comer muy poco.
- Recompensas directas por peso perdido.
- Penalizaciones por subir de peso.
- Capacidad de comprar XP.
- Clasificaciones públicas basadas exclusivamente en XP.
- Castigos cada vez mayores por reincidencia.
- Sistemas que obliguen a entrenar lesionado.
- Metas que puedan reducirse retroactivamente.
- Rachas imposibles de proteger ante enfermedad.

---

# 30. Variables configurables

El sistema debe construirse utilizando parámetros y no números escritos directamente en la lógica.

```text
weeklyExerciseTarget = 5
weeklyProgrammingTarget = 3

exerciseWeeklyCap = 350
sleepWeeklyCap = 245
nutritionWeeklyCap = 210
hydrationWeeklyCap = 105
programmingWeeklyCap = 120

weeklyBonusCap = 150
weeklyPenaltyCap = 300
dailyBehaviorPenaltyCap = 40

dailyMissionReward = 8
dailyMissionWeeklyCap = 40

exerciseCompletionBonus = 50
sleepConsistencyBonus = 20
programmingConsistencyBonus = 20
balancedWeekBonus = 20

sleepMinimumTarget = 7 hours
sleepMaximumTarget = 9 hours

weeklyCloseDay = Monday
weeklyCloseTime = 12:00
```

Esto permitirá ajustar el balance sin reprogramar todo el sistema.

---

# 31. Criterios de aceptación

El sistema se considera correctamente implementado cuando cumple lo siguiente:

1. Un entrenamiento válido genera exactamente una transacción.
2. Editar su duración recalcula correctamente la XP.
3. El ejercicio nunca supera 350 XP base por semana.
4. Las bonificaciones ordinarias nunca superan 150 XP.
5. Las penalizaciones nunca superan 300 XP por semana.
6. La XP consolidada jamás es negativa.
7. El nivel nunca disminuye.
8. Un día de descanso programado no penaliza.
9. Cero programación genera `−50 XP`.
10. Una o dos sesiones de programación no penalizan.
11. Cinco días equivalentes de ejercicio conceden `+50 XP`.
12. Cambiar una meta no modifica la semana actual.
13. Un registro eliminado revierte su XP.
14. Ejecutar dos veces el cierre semanal no duplica progreso.
15. No registrar datos limita el rango máximo.
16. Los pilares determinan el rango independientemente de la XP.
17. El modo de protección elimina penalizaciones, pero también bonificaciones.
18. Los atributos reciben XP sin duplicar la XP general.
19. Una semana negativa consolida cero y no crea deuda.
20. Cada cambio de XP puede explicarse desde el historial.

---

# 32. Resultado final del diseño

El sistema tendrá tres maneras diferentes de decirle al usuario cómo está progresando:

## Nivel general

Responde:

> ¿Cuánto has avanzado desde que comenzaste?

Es permanente.

## Rango semanal

Responde:

> ¿Qué tan bien y equilibradamente viviste esta semana?

Puede subir o bajar.

## Atributos

Responden:

> ¿En qué áreas has construido más experiencia?

Son permanentes y especializados.

La combinación evita que toda la experiencia del usuario dependa de una sola cifra.

Un usuario puede ser:

```text
Nivel general: 28
Rango semanal: B

Fuerza: 22
Resistencia: 17
Vitalidad: 25
Inteligencia: 31
Disciplina: 19
```

Eso cuenta una historia real:

Ha avanzado mucho, tiene gran experiencia programando y buenos hábitos de vitalidad, pero todavía necesita mejorar su disciplina y consistencia física.

El sistema no busca que el usuario tema perder XP.

Busca que cada semana piense:

> Puedo superar mi rango anterior.