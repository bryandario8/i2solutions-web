<template>
  <main id="DialogEditarPersonas">
    <v-dialog v-model="show" @keydown.esc="show=false" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Editar Persona</span>
        </v-card-title>
        <v-card-text>
              <v-form v-model="valid">
                <v-text-field
                :class="'nombrePersona' + this.personaId"
                  v-model = "newNombres"
                  label="Nombres" required
                  :rules="[rules.required]"
                  maxlength=30
                  :counter=30
                ></v-text-field>
                <v-text-field
                  v-model = "newApellidos"
                  :class="'apellidoPersona' + this.personaId"
                  label="Apellidos" required
                  :rules="[rules.required]"
                  maxlength=30
                  :counter=30
                ></v-text-field>
                <v-select
                :class="'rolPersona' + this.personaId"
              :items="roles"
              v-model="newRol"
              label="Rol"
              required
              :rules="[rules.required]"
            ></v-select>
                <v-text-field
                :class="'correoPersona' + this.personaId"
              v-model="newCorreo"
              label="Correo"
              :rules="emailRules"
              required
              maxlength=100
              :counter=100
            ></v-text-field>
            <v-text-field
            :class="'telefonoPersona' + this.personaId"
              v-model="newTelefono"
              label="Télefono"
              maxlength=10
              :rules="telefonoRules"
              :error-messages="errors.collect('telefono')"
              v-validate="'required | max:10'"
              :nudge-right="40"
              required
              counter="10"
            ></v-text-field>
              <v-text-field
              :class="'perfilPersona' + this.personaId"
              v-model="newPerfilOcupacional"
              label="Perfil Ocupacional"
              required
              :rules="[rules.required]"
              maxlength=50
              :counter=50
            ></v-text-field>
            </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :class="'editPersona' + this.personaId" color="blue darken-1" flat :disabled="!valid" @click = "edit ()">Editar</v-btn>
          <v-btn color="blue darken-1" flat @click.native="show = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      :timeout="3000"
      :multi-line="true"
      :color="color"
      :top="true"
      v-model="snackbar"
    >
      {{mensajeSnackbar}}
    </v-snackbar>
  </main>
</template>
<script>
import MyModule from '../MyModule.js'
const moment = require('moment')
export default {
  data () {
    return {
      //Variables a ser usadas por el componente
      date: null,
      menu: false,
      valid: false,
      newNombres: '',
      newApellidos: '',
      newDate: null,
      newRol: '',
      newCorreo: '',
      newCedula: '',
      newPerfilOcupacional: '',
      newTelefono: '',
      newUsuario: '',
      mensajeSnackbar: '',
      color: '',
      snackbar: false,
      rules: {
        required: (value) => !!value || 'Campo Requerido.',
        RUC: (value) => value.length <= 13 || 'Deben ser 13 caracteres'
      },
      emailRules: [
        v => !!v || 'El campo correo es obligatorio',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Ingrese correo válido'
      ],
      telefonoRules: [
        v => !!v || 'telefono es requerido',
        v => (v && v.length >= 10) || 'Teléfono debe tener 10 caracteres',
        v => (!Number.isNaN(parseInt(v))) || 'célular no valido'
      ],
      cedulaRules: [
        v => !!v || 'cédula es requerido',
        v => (v && v.length >= 10) || 'La cédula debe tener 10 caracteres',
        v => (!Number.isNaN(parseInt(v))) || 'cédula no valida'
      ],
      roles: [{ //Roles de los usuarios, por ahora solo puede escogerse 1 rol por usuario.
        value: 'jefe-seguridad',
        text: 'Jefe de Seguridad'
      },
      {
        value: 'inspector-seguridad',
        text: 'Inspector de Seguridad'
      },
      {
        value: 'empleado',
        text: 'Empleado'
      },
      {
        value: 'admin-empresa',
        text: 'Administrador de la empresa'
      }
      ]
    }
  },
  watch: {
    menu (val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = 'Año'))
    },
    nombres () {
      this.newNombres = this.nombres
    },
    apellidos () {
      this.newApellidos = this.apellidos
    },
    rol () {
      this.newRol = this.rol
    },
    fecha () {
      this.newDate = this.fecha
    },
    date () {
      this.newDate = moment(this.date).format('L')
    },
    correo () {
      this.newCorreo = this.correo
    },
    cedula () {
      this.newCedula = this.cedula
    },
    telefono () {
      this.newTelefono = this.telefono
    },
    perfilOcupacional () {
      this.newPerfilOcupacional = this.perfilOcupacional
    },
    usuario () {
      this.newUsuario = this.usuario
    }
  },
  methods: {
    save (date) {
      this.$refs.menu.save(date)
    },
    edit () {
      //Edita la persona, recibe nombres, apellidos, correo, rol, telefono y perfil ocupacional. En caso de exito edita los datos de la persona seleccionada
      let nombres = this.$data.newNombres
      let apellidos = this.$data.newApellidos
      let cedula = this.personaCedula
      let personasId = this.personaId
      let correo = this.$data.newCorreo
      let fechaNacimiento = moment(this.$data.newDate).format()
      console.log(fechaNacimiento)
      let rol = this.$data.newRol
      let telefono = this.$data.newTelefono
      let perfilOcupacional = this.$data.newPerfilOcupacional
      let usuario = this.personaUsuario
      let validacionCedula = MyModule(cedula)
      if (validacionCedula[0] === false) {
        this.snackbar = true
        this.mensajeSnackbar = validacionCedula[1]
        this.color = 'error'
      } else {
        this.$store.dispatch('updatePersona', { personasId, nombres, apellidos, cedula, correo, fechaNacimiento, rol, telefono, perfilOcupacional, usuario })
          .then((resp) => {
            for (let i = 0; i < this.$store.getters.personas.length; i++) {
              let persona = this.$store.getters.personas[i]
              if (persona.id === personasId) {
                persona.nombres = nombres
                persona.apellidos = apellidos
                persona.cedula = cedula
                persona.fechaNacimiento = fechaNacimiento
                persona.rol = rol
                persona.correo = correo
                persona.telefono = telefono
                persona.perfilOcupacional = perfilOcupacional
                persona.usuario = usuario
                break
              }
            }
            this.snackbar = true
            this.mensajeSnackbar = 'Persona editada exitosamente.'
            this.color = 'success'
            this.$emit('close')
          })
          .catch((err) => {
            this.color = 'error'
            this.snackbar = true
            this.mensajeSnackbar = err
          })
      }
    }
  },
  name: 'DialogEditarPersonas',
  props: ['visible', 'personaNombres', 'personaApellidos', 'personaFechaNacimiento', 'personaRol', 'personaCorreo', 'personaCedula', 'personaTelefono', 'personaPerfilOcupacional', 'personaUsuario', 'personaId'],
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
    nombres: {
      get () {
        return this.personaNombres
      },
      set (value) {
        this.newNombres = value
      }
    },
    apellidos: {
      get () {
        return this.personaApellidos
      },
      set (value) {
        this.newApellidos = value
      }
    },
    fecha: {
      get () {
        return this.personaFechaNacimiento
      },
      set (value) {
        this.newDate = value
      }
    },
    correo: {
      get () {
        return this.personaCorreo
      },
      set (value) {
        this.newCorreo = value
      }
    },
    cedula: {
      get () {
        return this.personaCedula
      },
      set (value) {
        this.newCedula = value
      }
    },
    rol: {
      get () {
        return this.personaRol
      },
      set (value) {
        this.newRol = value
      }
    },
    telefono: {
      get () {
        return this.personaTelefono
      },
      set (value) {
        this.newTelefono = value
      }
    },
    perfilOcupacional: {
      get () {
        return this.personaPerfilOcupacional
      },
      set (value) {
        this.newPerfilOcupacional = value
      }
    },
    usuario: {
      get () {
        return this.personaUsuario
      },
      set (value) {
        this.newUsuario = value
      }
    }
  }
}
</script>
<style>
.izq {
  text-align: left;
}
</style>
