<template>
  <main id="DialogRiesgosFromPuestos">
    <v-dialog fullscreen v-model="show" @keydown.esc="show=false" hide-overlay transition="dialog-bottom-transition">
      <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click.native="show = false">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>{{nombreEstablecimiento}} > Riesgos Por Puestos</v-toolbar-title>
      </v-toolbar>
      <br>
      <v-layout>
      <v-flex xs12>
        <v-card>
            <h3>Riesgos en Puesto</h3>
            <h2> {{this.puesto}}</h2>
          <v-container  fluid>
            <v-layout row wrap>
              <v-flex
                v-for="(riesgo, index) in this.$store.getters.riesgoPuesto"
                :key="riesgo.id"
                xs3 lg4>
                <v-card style="padding:10px; margin:25px;" >
                  <div><b>Tipo De Riezgo: </b>{{riesgo.tipoRiesgo}}</div>
                  <div><b>Porcentaje de Riezgo: </b>{{riesgo.porcentajeRiesgo}} %</div>
                  <div><b>Valoración: </b>{{riesgo.valoracion}}</div>
                  <div><b>Valoración Literal: </b>{{riesgo.valoracionLiteral}}</div>
                  <div><b>Personas Expuestas: </b>{{riesgo.personasExpuestas}}</div>
                  <v-btn
                  :class="'editarRiesgo' + riesgo.id"
                    fab
                    dark
                    small
                    color="blue"
                    @click="visualizarEditar(riesgo)"
                    v-if="$store.getters.usuario.rol === 'admin-i2solutions' || $store.getters.usuario.rol === 'admin-empresa'"
                  >
                    <v-icon>edit</v-icon>
                  </v-btn>
                  <v-btn
                  :class="'elimiaRiesgo' + riesgo.id"
                    fab
                    dark
                    small
                    color="blue"
                     @click="eliminarRiesgo(riesgo,index)"
                     v-if="$store.getters.usuario.rol === 'admin-i2solutions' || $store.getters.usuario.rol === 'admin-empresa'"
                  >
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
    </v-card>
    </v-dialog>

        <!--Para Eliminar Riesgos-->
    <v-layout row justify-center>
      <v-dialog v-model="eliminarDialogRiesgo" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">Eliminar</v-card-title>
          <v-card-text>¿Está seguro que quiere eliminar este Equipo?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :class="'borraRiesgo' + this.riesgoId" color="blue darken-1" flat @click = "borrarRiesgo()">Sí</v-btn>
            <v-btn color="blue" flat @click.native="eliminarDialogRiesgo = false">No</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <v-snackbar
      :timeout="3000"
      :multi-line="true"
      :color="color"
      :top="true"
      v-model="snackbar"
    >
      {{mensajeSnackbar}}
    </v-snackbar>
    <footer>
      <DialogEditarRiesgos
      :visible="visibleEditar"
      :riesgoTipoRiesgo="riesgoTipoRiesgo"
      :riesgoPorcentajeRiesgo="riesgoPorcentajeRiesgo"
      :riesgoValoracion="riesgoValoracion"
      :riesgoValoracionLiteral="riesgoValoracionLiteral"
      :riesgoPersonasExpuestas="riesgoPersonasExpuestas"
      :riesgoFecha="riesgoFecha"
      :puestosId="puestosId"
      :riesgoId="riesgoId"
      @close="visibleEditar=false">
      ></DialogEditarRiesgos>
    </footer>
  </main>
</template>
<script>
import DialogEditarRiesgos from '../Editar/DialogEditarRiesgos'
export default {
  components: { DialogEditarRiesgos },
  name: 'DialogRiesgosFromPuestos',
  props: ['visible', 'puestoId', 'puestoNombre', 'nombreEstablecimiento'],
  /* mounted () {
  }, */
  data () {
    return {
      visibleEditar: false,
      riesgoTipoRiesgo: '',
      riesgoPorcentajeRiesgo: '',
      riesgoValoracion: '',
      riesgoValoracionLiteral: '',
      riesgoPersonasExpuestas: '',
      riesgoFecha: '',
      puestosId: '',
      size: 'sm',
      eliminarDialogRiesgo: false,
      riesgoId: '',
      indice: -1
    }
  },
  watch: {
    show () {
      this.cargarData()
    }
  },
  computed: {
    show: {
      get () {
        return this.visible
      },
      set (value) {
        if (!value) {
          this.$emit('close')
        }
      }
    },
    puestosEId: {
      get () {
        return this.puestoId
      }
    },
    puesto: {
      get () {
        return this.puestoNombre
      }
    }
  },
  methods: {
    cargarData () {
      this.valid = null
      this.loading = true
      this.verRiesgosFromPuestos()
      this.loading = false
      this.valid = true
      console.log('LOG')
    },
    verRiesgosFromPuestos () {
      let puestosId = this.puestoId
      this.$store.dispatch('getRiesgosFromPuestos', puestosId)
        .then((resp) => {
          console.log('Done')
        })
        .catch((err) => {
          this.color = 'error'
          this.snackbar = true
          this.mensajeSnackbar = err
        })
    },
    visualizarEditar (riesgo) {
      this.riesgoTipoRiesgo = riesgo.tipoRiesgo
      this.riesgoPorcentajeRiesgo = riesgo.porcentajeRiesgo
      this.riesgoValoracion = riesgo.valoracion
      this.riesgoValoracionLiteral = riesgo.valoracionLiteral
      this.riesgoPersonasExpuestas = riesgo.personasExpuestas
      this.puestosId = riesgo.puestosId
      this.riesgoFecha = riesgo.fecha
      this.riesgoId = riesgo.id
      this.visibleEditar = true
    },
    eliminarRiesgo (riesgo, indice) {
      this.riesgoId = riesgo.id
      console.log(this.riesgoId)
      this.indice = indice
      this.eliminarDialogRiesgo = true
    },
    borrarRiesgo () {
      console.log('Entre')
      this.eliminarDialogRiesgo = false
      let riesgosId = Number(this.riesgoId)
      console.log('idPuesto', riesgosId)
      this.$store.dispatch('deleteRiesgo', riesgosId)
        .then((resp) => {
          console.log('entre')
          this.snackbar = true
          this.mensajeSnackbar = 'Equipo borrada con exito.'
          this.color = 'success'
          this.$store.getters.riesgoPuesto.splice(this.indice, 1)
        })
        .catch((err) => {
          this.color = 'error'
          console.log(err)
          this.snackbar = true
          this.mensajeSnackbar = err
        })
    }
  }
}
</script>
<style>
.izq {
  text-align: left;
}
</style>
