const co = require('co')
module.exports = ({ responses, db }) => {
  const proto = {
    Crear (datos) {
      return new Promise((resolve, reject) => {
        co(function * () {
          let { puestosId } = datos
          let puesto = yield db.puestos.Obtener({ id: puestosId })
          if (!puesto) {
            resolve(responses.NO_OK('El id de puestos no existe'))
          } else {
            let personaCreada = yield db.personas.Crear(datos)
            let relacionCreada = yield db.personasPuestos.Crear({ personasId: personaCreada['id'], puestosId })
            if (personaCreada && relacionCreada) {
              let tmp = JSON.parse(JSON.stringify(personaCreada))
              tmp['puestosId'] = puestosId
              resolve(responses.OK(tmp))
            } else {
              resolve(responses.NO_OK('Ocurrio un error al crearse'))
            }
          }
        }).catch((err) => {
          console.error(err)
          return reject(responses.ERROR_SERVIDOR)
        })
      })
    },
    ObtenerTodos () {
      return new Promise((resolve, reject) => {
        db.personas.ObtenerTodos()
          .then((resp) => {
            resolve(responses.OK(resp))
          }).catch((err) => {
            console.error(err)
            return reject(responses.ERROR_SERVIDOR)
          })
      })
    },
    Obtener ({ id }) {
      return new Promise((resolve, reject) => {
        db.personas.Obtener({ id })
          .then((resp) => {
            resolve(responses.OK(resp))
          }).catch((err) => {
            console.error(err)
            return reject(responses.ERROR_SERVIDOR)
          })
      })
    },
    Actualizar (datos) {
      return new Promise((resolve, reject) => {
        db.personas.Actualizar(datos)
          .then((resp) => {
            if (resp[0].toString() === '1') {
              resolve(responses.OK(true))
            } else {
              resolve(responses.NO_OK('Persona con ese id no existe'))
            }
          }).catch((err) => {
            console.error(err)
            return reject(responses.ERROR_SERVIDOR)
          })
      })
    },
    Borrar ({ id }) {
      // corroborar que se elimine de personasPuestos la tabla
      return new Promise((resolve, reject) => {
        db.personas.Borrar({ id })
          .then((resp) => {
            if (!resp) {
              resolve(responses.NO_OK('persona con es id no existe'))
            } else {
              resolve(responses.OK(resp))
            }
          }).catch((err) => {
            console.error(err)
            return reject(responses.ERROR_SERVIDOR)
          })
      })
    },
    AnadirAPuesto (datos) {
      let { puestosId, personasId } = datos
      return new Promise((resolve, reject) => {
        co(function * () {
          let persona = yield db.personas.Obtener({ id: personasId })
          let puesto = yield db.puestos.Obtener({ id: puestosId })
          if (!persona) {
            return resolve(responses.NO_OK('persona con es id no existe'))
          } else if (!puesto) {
            return resolve(responses.NO_OK('puesto con es id no existe'))
          } else {
            let resp = yield db.personasPuestos.Crear({ puestosId, personasId })
            return resolve(responses.OK(resp))
          }
        }).catch((err) => {
          if (process.env.NODE_ENV === 'testing') { console.error(err) }
          return reject(responses.ERROR_SERVIDOR)
        })
      })
    },
    ObtenerTodosPorEstablecimiento ({ id }) {
      return new Promise((resolve, reject) => {
        db.personas.ObtenerTodosPorEstablecimiento({ id })
          .then((resp) => {
            resolve(responses.OK(resp))
          }).catch((err) => {
            console.error(err)
            return reject(responses.ERROR_SERVIDOR)
          })
      })
    },
    ObtenerTodosPorAreas ({ id }) {
      return new Promise((resolve, reject) => {
        db.personas.ObtenerTodosPorAreas({ id })
          .then((resp) => {
            resolve(responses.OK(resp))
          }).catch((err) => {
            console.error(err)
            return reject(responses.ERROR_SERVIDOR)
          })
      })
    },
    ObtenerTodosPorPuestos ({ id }) {
      return new Promise((resolve, reject) => {
        db.personas.ObtenerTodosPorPuestos({ id })
          .then((resp) => {
            resolve(responses.OK(resp))
          }).catch((err) => {
            console.error(err)
            return reject(responses.ERROR_SERVIDOR)
          })
      })
    }
  }
  return Object.assign(Object.create(proto), {})
}
