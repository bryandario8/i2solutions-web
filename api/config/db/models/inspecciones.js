'use strict'
module.exports = (sequelize, DataTypes) => {
  let singular = 'inspecciones'
  let plural = 'inspecciones'
  let tableName = 'inspecciones'
  let define = sequelize.define(singular, {
    nombre: { type: DataTypes.STRING },
    fechaInicio: { type: DataTypes.DATE },
    tipoInspeccion: { type: DataTypes.STRING },
    fechaFin: { type: DataTypes.DATE }
  }, {
    name: {
      singular,
      plural
    },
    tableName,
    timestamps: true,
    updatedAt: 'fechaActualizacion',
    createdAt: 'fechaCreacion',
    freezeTableName: true
  })

  define.associate = function (models) {

  }

  define.Crear = function ({ nombre, fechaInicio, tipoInspeccion, fechaFin }) {
    let datos = arguments['0']
    return new Promise((resolve, reject) => {
      return this.create(datos)
        .then((resp) => {
          return resolve(resp.get({ plain: true }))
        })
        .catch((err) => {
          return reject(err)
        })
    })
  }

  define.Obtener = function ({ id }) {
    return new Promise((resolve, reject) => {
      this.findOne({ where: { id }, raw: true })
        .then((project) => {
          resolve(project)
        }).catch((err) => {
          return reject(err)
        })
    })
  }
  return define
}
