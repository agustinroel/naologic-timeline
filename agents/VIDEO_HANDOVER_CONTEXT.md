Specific UI Interactions from Handover Video:

- Hover on Empty Cell: Debe aparecer un botón sutil o un estado visual de "Click to add event" (#5658FF con opacidad).

- Panel Animation: El panel lateral no aparece de golpe; debe tener una transición de entrada transform: translateX(0) desde translateX(100%) con una duración de 0.3s cubic-bezier(0.25, 0.8, 0.25, 1).

- Action Menu Trigger: El menú de tres puntos solo es visible al hacer hover sobre la barra de la Work Order.

- Status Transformation: Reitera que al abrir el dropdown de estatus en el formulario, las opciones son texto plano, pero al seleccionar una, se transforma en el "Pill" badge dentro del campo de selección.
