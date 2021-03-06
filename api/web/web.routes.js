const express = require('express')
const app = express()

require('./empresas/empresas.router')(app)
require('./personas/personas.router')(app)
require('./establecimientos/establecimientos.router')(app)
require('./areas/areas.router')(app)
require('./puestos/puestos.router')(app)
require('./capacitaciones/capacitaciones.router')(app)
require('./equipos/equipos.router')(app)
require('./accidentes/accidentes.router')(app)
require('./novedades/novedades.router')(app)
require('./riesgos/riesgos.router')(app)
require('./controles/controles.router')(app)
require('./matrices/matriz.router')(app)
app.route('*')
  .get((req, res) => {
    res.json({ mensaje: 'Esta ruta no existe' })
  })
module.exports = app
