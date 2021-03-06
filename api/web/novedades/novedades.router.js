const responses = require('../../responses')
const db = require('../../config/db').db
const Controller = require('./novedades.controller')({ responses, db })
const schema = require('./API_SCHEMA')
const validar = require('../../utils').schemaFormato
const utils = require('../../utils')
module.exports = (app) => {
  // identificador: API_1
  // crear una novedad
  app.route('/novedades')
    .post((req, res) => {
      let { BODY } = schema.API_1_SCHEMA
      let [err, mensaje] = validar(BODY, req.body)
      if (err) {
        let resp = responses.NO_OK({ ...mensaje })
        res.status(resp.codigoEstado)
        res.json(resp)
      } else {
        Controller.Crear(req.body).then((resp) => {
          res.status(resp.codigoEstado)
          res.json(resp)
        }).catch(resp => {
          res.status(resp.codigoEstado)
          res.json(resp)
        })
      }
    })

  // identificador: API_2
  // actualizar una novedad
  app.route('/novedades/:novedadesId')
    .put((req, res) => {
      let params = utils.jsonToInt(req.params, ['novedadesId'])
      let { BODY, PARAMS } = schema.API_2_SCHEMA
      let [err, mensaje] = validar(BODY, req.body)
      let [errParams, mensajeParams] = validar(PARAMS, params)
      if (err || errParams) {
        let resp = responses.NO_OK({ ...mensaje, ...mensajeParams })
        res.status(resp.codigoEstado)
        res.json(resp)
      } else {
        let { novedadesId } = req.params
        let id = novedadesId
        Controller.Actualizar({ ...req.body, id }).then((resp) => {
          res.status(resp.codigoEstado)
          res.json(resp)
        }).catch(resp => {
          res.status(resp.codigoEstado)
          res.json(resp)
        })
      }
    })

  // identificador: API_3
  // eliminar una novedad
  app.route('/novedades/:novedadesId')
    .delete((req, res) => {
      let params = utils.jsonToInt(req.params, ['novedadesId'])
      let { PARAMS } = schema.API_3_SCHEMA
      let [err, mensaje] = validar(PARAMS, params)
      if (err) {
        let resp = responses.NO_OK(mensaje)
        res.status(resp.codigoEstado)
        res.json(resp)
      } else {
        let { novedadesId } = req.params
        Controller.Borrar({ id: novedadesId }).then((resp) => {
          res.status(resp.codigoEstado)
          res.json(resp)
        }).catch(resp => {
          res.status(resp.codigoEstado)
          res.json(resp)
        })
      }
    })

  // identificador: API_4
  // obtener una novedad
  app.route('/novedades/:novedadesId')
    .get((req, res) => {
      let params = utils.jsonToInt(req.params, ['novedadesId'])
      let { PARAMS } = schema.API_4_SCHEMA
      let [errParams, mensajeParams] = validar(PARAMS, params)
      if (errParams) {
        let resp = responses.NO_OK({ ...mensajeParams })
        res.status(resp.codigoEstado)
        res.json(resp)
      } else {
        let { novedadesId } = req.params
        Controller.Obtener({ id: novedadesId }).then((resp) => {
          res.status(resp.codigoEstado)
          res.json(resp)
        }).catch(resp => {
          res.status(resp.codigoEstado)
          res.json(resp)
        })
      }
    })

  // identificador: API_5
  // obtener por establecimientos
  app.route('/novedades/establecimientos/:establecimientosId')
    .get((req, res) => {
      let params = utils.jsonToInt(req.params, ['establecimientosId'])
      let { PARAMS } = schema.API_5_SCHEMA
      let [errParams, mensajeParams] = validar(PARAMS, params)
      if (errParams) {
        let resp = responses.NO_OK({ ...mensajeParams })
        res.status(resp.codigoEstado)
        res.json(resp)
      } else {
        let { establecimientosId } = req.params
        Controller.ObtenerPorEstablecimientos({ id: establecimientosId }).then((resp) => {
          res.status(resp.codigoEstado)
          res.json(resp)
        }).catch(resp => {
          res.status(resp.codigoEstado)
          res.json(resp)
        })
      }
    })

  // identificador: API_6
  // obtener por areas
  app.route('/novedades/areas/:areasId')
    .get((req, res) => {
      let params = utils.jsonToInt(req.params, ['areasId'])
      let { PARAMS } = schema.API_6_SCHEMA
      let [errParams, mensajeParams] = validar(PARAMS, params)
      if (errParams) {
        let resp = responses.NO_OK({ ...mensajeParams })
        res.status(resp.codigoEstado)
        res.json(resp)
      } else {
        let { areasId } = req.params
        Controller.ObtenerPorAreas({ id: areasId }).then((resp) => {
          res.status(resp.codigoEstado)
          res.json(resp)
        }).catch(resp => {
          res.status(resp.codigoEstado)
          res.json(resp)
        })
      }
    })

  // identificador: API_7
  // obtener por puestos
  app.route('/novedades/puestos/:puestosId')
    .get((req, res) => {
      let params = utils.jsonToInt(req.params, ['puestosId'])
      let { PARAMS } = schema.API_7_SCHEMA
      let [errParams, mensajeParams] = validar(PARAMS, params)
      if (errParams) {
        let resp = responses.NO_OK({ ...mensajeParams })
        res.status(resp.codigoEstado)
        res.json(resp)
      } else {
        let { puestosId } = req.params
        Controller.ObtenerPorPuestos({ id: puestosId }).then((resp) => {
          res.status(resp.codigoEstado)
          res.json(resp)
        }).catch(resp => {
          res.status(resp.codigoEstado)
          res.json(resp)
        })
      }
    })
}
