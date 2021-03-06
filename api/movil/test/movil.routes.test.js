const request = require('supertest')
const expect = require('chai').expect
const rfr = require('rfr')

const generatorDocs = rfr('api/config/documentacion')
const db = rfr('api/config/db')
const app = rfr('app')
const dump = rfr('api/config/dump')
const API = require('./API_DOCS')
const models = db.db
let docs = []

describe('MOVIL TEST', () => {
  let { areas, puestos, novedades, personas, establecimientos, accidentes, riesgos, capacitaciones, equipos, empresas } = dump
  let empresa = empresas.VALIDOS[0]
  let area = areas.VALIDOS[0]
  let area2 = areas.VALIDOS[1]
  let puesto = puestos.VALIDOS[0]
  let puesto2 = puestos.VALIDOS[1]
  let novedad = novedades.VALIDOS[0]
  let novedad2 = novedades.VALIDOS[1]
  let novedad3 = novedades.VALIDOS[2]
  let establecimiento = establecimientos.VALIDOS[0]
  let establecimiento2 = establecimientos.VALIDOS[1]
  let accidente = accidentes.VALIDOS[0]
  let riesgo = riesgos.VALIDOS[0]
  let equipo = equipos.VALIDOS[0]
  let persona = personas.INSPECTOR_SEGURIDAD
  let persona2 = personas.ADMIN_I2SOLUTIONS
  let capacitacion = capacitaciones.VALIDOS[0]
  let capacitacion2 = capacitaciones.VALIDOS[1]
  before('Limpiar la base de datos', async () => {
    await db.Limpiar()
  })
  after('Desconectar la base de datos', function() {
    generatorDocs.generateAPI({ docs, archivo: 'api.movil.md', nombre: 'Movil' })
  })
  afterEach('Limpiar la base de datos', async () => {
    await db.Limpiar()
  })

  describe('@API_1 obtener areas de trabajo dada un area', () => {
    let { API_1 } = API
    it('@CP1 OK', async () => {
      let areaCreada = await models.areas.Crear(area)
      let puestoCreada = await models.puestos.Crear(puesto)
      await models.areasPuestos.Crear({
        areasId: areaCreada['id'],
        puestosId: puestoCreada['id']
      })
      let areasId = areaCreada['id']
      let res = await request(app).get(`/api/movil/puestosDeUnArea/${areasId}`)
      expect(res.body.codigoEstado).to.equal(200)
      expect(res.body.estado).to.equal(true)
      expect(res.body.datos.length).to.equal(1)
      generatorDocs.OK({ docs, doc: API_1, res })
    })
  })

  // describe('@API_2 Crear una novedad', () => {
  //   let { API_2 } = API
  //   it('@CP2 OK', async () => {
  //     let req = { ...novedad, puestosId: 1, inspeccionId: 1 }
  //     let res = await request(app).post(`/api/movil/novedad`).send(req)
  //     expect(res.body.codigoEstado).to.equal(200)
  //     expect(res.body.estado).to.equal(true)
  //     expect(res.body.datos['descripcion']).to.equal(req['descripcion'])
  //     generatorDocs.OK({ docs, doc: API_2, res, req })
  //   })
  // })

  describe('@API_3 Obtener un puesto de trabajo dada un area y establecimiento', () => {
    let { API_3 } = API
    let areasId = -1
    let puestosId = -1
    let establecimientosId = -1
    beforeEach(async () => {
      let empresaCreada = await models.empresas.Crear(empresa)
      let empresasId = empresaCreada['id']
      let establecimientosCreada = await models.establecimientos.Crear(establecimiento)
      establecimientosId = establecimientosCreada['id']
      let establecimientosCreada2 = await models.establecimientos.Crear(establecimiento2)
      establecimientosId2 = establecimientosCreada2['id']
      let areaCreada = await models.areas.Crear({ ...area, establecimientosId })
      areasId = areaCreada['id']
      let puestoCreada = await models.puestos.Crear(puesto)
      puestosId = puestoCreada['id']
      await models.areasPuestos.Crear({ areasId, puestosId })


      // // riesgos
      await models.riesgos.Crear({ ...riesgo, puestosId })
      // // accidentes
      await models.accidentes.Crear({ ...accidente, puestosId })
      // // equipos
      let equipoCreada = await models.equipos.Crear({ ...equipo, puestosId })
      await models.equiposPuestos.Crear({ puestosId, equiposId: equipoCreada['id'] })
      // // personas
      let personaCreada = await models.personas.Crear(persona)
      let personaCreada2 = await models.personas.Crear(persona2)
      let pp = await models.personasPuestos.Crear({ personasId: personaCreada['id'], puestosId })

      // capacitaciones
      let capacitacionCreada = await models.capacitaciones.Crear({ ...capacitacion, areasId })
      let capacitacionCreada2 = await models.capacitaciones.Crear({ ...capacitacion2, areasId })
      await models.personasCapacitaciones.Crear({ personasId: personaCreada['id'], capacitacionesId: capacitacionCreada['id'] })
      await models.personasCapacitaciones.Crear({ personasId: personaCreada2['id'], capacitacionesId: capacitacionCreada['id'] })
      let novedadCreada = await models.novedades.Crear({ ...novedad, puestosId })
      let novedadCreada2 = await models.novedades.Crear({ ...novedad2, puestosId })
      await models.novedades.Atender({ id: novedadCreada['id'], atendida: true, descripcionAtendida: 'aaa' })
    })
    it('@ICE_API_3_01 OK', async () => {
      let res = await request(app).get(`/api/movil/area/${areasId}/puesto/${puestosId}/${establecimientosId}`)
      // console.log(JSON.stringify(res.body, null, 2))
      expect(res.body.codigoEstado).to.equal(200)
      expect(res.body.estado).to.equal(true)
      expect(res.body.datos['novedadesSinAtender'].length).to.equal(1)
      expect(res.body.datos['novedadesAtendidas'].length).to.equal(1)
      expect(res.body.datos['riesgos'].length).to.equal(1)
      expect(res.body.datos['cantidadEmpleados']).to.equal(1)
      expect(res.body.datos['detallesAccidentes'].length).to.equal(1)
      expect(res.body.datos['detallesCapacitaciones'].length).to.equal(2)
      expect(res.body.datos['equiposProteccion'].length).to.equal(1)
      generatorDocs.OK({ docs, doc: API_3, res })
    })
  })

  describe('@API_4 Atender una novedad', () => {
    let { API_4 } = API
    it('@CP4 OK', async () => {
      let novedadCreada = await models.novedades.Crear(novedad)
      let puestoCreada = await models.puestos.Crear(puesto)
      let req = { atendida: true, descripcionAtendida: '' }
      let res = await request(app).put(`/api/movil/novedad/${novedadCreada['id']}`).send(req)
      expect(res.body.codigoEstado).to.equal(200)
      expect(res.body.estado).to.equal(true)
      expect(res.body.datos).to.equal(true)
      generatorDocs.OK({ docs, doc: API_4, res, req })
    })
    it('@CP4.1 novedad no existe', async () => {
      let req = { atendida: true, descripcionAtendida: '' }
      let res = await request(app).put(`/api/movil/novedad/50`).send(req)
      expect(res.body.codigoEstado).to.equal(200)
      expect(res.body.estado).to.equal(false)
      generatorDocs.ERROR({ nombre: 'El Id de la novedad no existe', docs, doc: API_4, res, req })
    })
  })
})
