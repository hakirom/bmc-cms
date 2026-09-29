# Informe de calidad de código — Demo BMC

Análisis de **SonarQube Cloud** sobre los dos repositorios de la demo.
Datos tomados de la API el 29 de septiembre de 2026.

- CMS: https://sonarcloud.io/project/overview?id=hakirom_bmc-cms
- Front: https://sonarcloud.io/project/overview?id=hakirom_bmc-web

## Resumen

| Métrica | CMS (Strapi) | Front (React) |
|---|---|---|
| Líneas de código | 2.803 | 3.592 |
| **Bugs** | **0** | **0** |
| Vulnerabilidades | 8 | 2 |
| Código con olor | 25 | 43 |
| Deuda técnica | 3 h 1 min | 3 h 55 min |
| Fiabilidad | **A** | **A** |
| Mantenibilidad | **A** | **A** |
| Seguridad | E | C |
| Duplicación | 13,0 % | 4,1 % |
| Cobertura de pruebas | 0 % | 0 % |

**Cero bugs y mantenibilidad A en ambos** sobre 6.400 líneas. La deuda técnica total
—menos de siete horas— es baja para un proyecto de este alcance.

Las calificaciones de seguridad (E y C) exigen contexto: en Sonar, **una sola incidencia
de tipo bloqueante basta para calificar E**, por severidad y no por cantidad. Todas las
incidencias del CMS están en infraestructura y empaquetado, ninguna en la lógica de la
aplicación.

## Hallazgos del CMS

| Severidad | Dónde | Qué dice | Valoración |
|---|---|---|---|
| Bloqueante | `infra/main.tf:152` | La instancia EC2 tiene IP pública | **Contextual.** Es necesaria: CloudFront alcanza el origen por ahí. El puerto de la aplicación ya está restringido a los rangos de CloudFront |
| Bloqueante | `infra-azure/main.tf:26` | El registro de imágenes acepta red pública | **Real.** Se cierra con `public_network_access_enabled = false`, aunque exige que el despliegue salga desde red autorizada |
| Mayor | `infra-azure/main.tf:35` | Cuenta administrativa habilitada en el registro | **Decisión consciente.** La identidad administrada exigía asignar roles, y la suscripción delegada no lo permite. Documentado |
| Mayor | `infra-azure/main.tf:26` | Sin identidad administrada | Misma causa que el anterior |
| Mayor | `infra/main.tf:194` | CloudFront sin registro de accesos | **Real y fácil.** Añadir `logging_config` |
| Mayor | `Dockerfile:9` | `npm ci` sin `--ignore-scripts` | **Falso positivo aquí.** `better-sqlite3` y `sharp` compilan en la instalación; desactivar los scripts rompe la imagen |
| Menor | `Dockerfile:19` | El contenedor corre como `root` | **Real.** Se corrige con un usuario sin privilegios, cuidando los permisos de `/app` |
| Mayor | `.github/workflows/sonar.yml:22` | La acción no está fijada a un commit | **Real.** Buena práctica de cadena de suministro: fijar el SHA |

## Hallazgos del front

| Severidad | Dónde | Qué dice | Valoración |
|---|---|---|---|
| Mayor | `src/pages/pqrsf.tsx:20` | Generador de números pseudoaleatorio | **Real y con consecuencia de negocio.** El número de radicado se genera con `Math.random()`: es predecible y puede colisionar. En producción debería generarlo el CMS de forma secuencial y garantizada única |
| Mayor | `.github/workflows/sonar.yml:22` | La acción no está fijada a un commit | Igual que en el CMS |

## Los dos números que conviene explicar

**Cobertura 0 %.** No hay pruebas automatizadas en ninguno de los dos proyectos. Es el
dato correcto, no un fallo de configuración. En una demo es defendible; antes de
producción, lo primero a cubrir sería el seed del CMS y el mapeo del cliente REST.

**Duplicación 13 % en el CMS.** Viene sobre todo de mantener dos definiciones de
infraestructura equivalentes (`infra/` para AWS e `infra-azure/` para Azure) y de tener el
contenido semilla en español e inglés. Es duplicación deliberada, no descuido.

## Qué haría, por orden

1. **Radicado del PQRSF** — es el único hallazgo con efecto sobre el negocio.
2. **Usuario sin privilegios en el contenedor** y **registro de accesos en CloudFront**: correcciones pequeñas que suben la calificación.
3. **Fijar los SHA de las acciones** de GitHub.
4. **Primeras pruebas** sobre el seed y el cliente REST, que es donde un fallo pasa desapercibido.
5. Los avisos de infraestructura restantes: marcarlos como revisados en Sonar con la justificación, en vez de dejarlos abiertos.
