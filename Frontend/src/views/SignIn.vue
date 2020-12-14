<template>
  <v-container id="signinup-form" class="fill-height">
    <v-row align="center" justify="center" no-gutters>
      <v-col cols="12" sm="8" md="8" class="">
        <v-card class="elevation-24 card">
          <v-window v-model="step">
            <!--SignIn-->
            <v-window-item :value="1">
              <v-row class="">
                <v-col cols="12" md="8" class="pt-6 pb-6">
                  <v-card-text>
                    <v-form class="signup-form-form">
                      <h1
                        class="text-center display-1 mb-10"
                        :class="`${bgColor}--text`"
                      >
                        Inicia sesión
                      </h1>
                      <v-text-field
                        id="email"
                        v-model="email"
                        label="Correo electrónico"
                        name="email"
                        append-icon="email"
                        type="email"
                        :color="bgColor"
                        required
                      />
                      <v-text-field
                        id="password"
                        v-model="password"
                        label="Contraseña"
                        name="Password"
                        append-icon="lock"
                        type="password"
                        :color="bgColor"
                        required
                      />
                      <div class="text-center mt-6">
                        <v-btn @click="signin" large :color="bgColor" dark
                          >Iniciar sesión</v-btn
                        >
                      </div>
                    </v-form>
                  </v-card-text>
                </v-col>
                <v-col cols="12" md="4" class="vcenter bg">
                  <div>
                    <v-card-text :class="`${fgColor}--text`">
                      <h1 class="text-center headline mb-3">
                        ¿Aún no tienes cuenta?
                      </h1>
                      <h5 class="text-center overline mb-3">
                        Regístrate para acceder
                      </h5>
                    </v-card-text>
                    <div class="text-center mb-6">
                      <v-btn dark outlined @click="step = 2">Registrarse</v-btn>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-window-item>
            <!--SignUp-->
            <v-window-item :value="2">
              <v-row class="fill-height">
                <v-col cols="12" md="4" class="darken-2 vcenter bg">
                  <div>
                    <v-card-text :class="`${fgColor}--text`">
                      <h1 class="text-center headline mb-3">
                        ¿Ya tienes cuenta?
                      </h1>
                      <h5 class="text-center overline mb-3">Inicia sesión</h5>
                    </v-card-text>
                    <div class="text-center mb-6">
                      <v-btn dark outlined @click="step = 1"
                        >Iniciar sesión</v-btn
                      >
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" md="8" class=" pt-6 pb-6">
                  <v-card-text>
                    <h1
                      class="text-center display-1 mb-10"
                      :class="`${bgColor}--text`"
                    >
                      Regístrate
                    </h1>
                    <v-form class="signup-form-form">
                      <v-text-field
                        id="name"
                        v-model="name"
                        label="Nombre"
                        name="name"
                        append-icon="person"
                        type="text"
                        :color="bgColor"
                        required
                      />
                      <v-text-field
                        id="surname"
                        v-model="surname"
                        label="Apellidos"
                        name="surname"
                        append-icon="person"
                        type="text"
                        :color="bgColor"
                        required
                      />
                      <v-text-field
                        id="username"
                        v-model="username"
                        label="Nombre de usuario"
                        name="username"
                        append-icon="check"
                        type="text"
                        :color="bgColor"
                        required
                      />
                      <v-text-field
                        id="email"
                        v-model="email"
                        label="Correo electrónico"
                        name="email"
                        append-icon="email"
                        type="email"
                        :color="bgColor"
                        required
                      />
                      <v-text-field
                        id="password"
                        v-model="password"
                        label="Contraseña"
                        name="password"
                        append-icon="lock"
                        type="password"
                        :color="bgColor"
                        required
                      />
                      <div class="text-center mt-6">
                        <v-btn @click="signup" large :color="bgColor" dark>
                          Registrarse
                        </v-btn>
                      </div>
                    </v-form>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const axios = require("axios");
import { mapState, mapMutations } from "vuex";
export default {
  name: "SignIn",
  components: {},
  props: {
    source: {
      type: String,
      default: "",
    },
    bgColor: {
      type: String,
      default: "blue",
    },
    fgColor: {
      type: String,
      default: "white",
    },
  },
  data: () => ({
    step: 1,
    name: "",
    surname: "",
    username: "",
    email: "",
    password: "",
    login: "",
    snackbarType: "success",
    snackbarMessage: "",
    snackbar: false,
  }),
  computed: {
    ...mapState(["logged", "emailUsuario", "IP", "idUser"]),
  },
  methods: {
    signup() {
      if (this.nombre != "" && this.apellidos != "") {
        const userData = {
          name: this.name,
          surname: this.surname,
          email: this.email,
          pass: this.password,
          username: this.username,
        };
        var usernameError = { msg: "username" };
        var emailError = { msg: "email" };
        axios
          .post("http://localhost:3000/SignUp", userData)
          .then((response) => {
            if (Object.prototype.hasOwnProperty.call(response.data, "error")) {
              alert("Ha habido un error");
            } else if (
              JSON.stringify(response.data) == JSON.stringify(usernameError)
            ) {
              alert("El nombre de usuario ya está en uso");
            } else if (
              JSON.stringify(response.data) == JSON.stringify(emailError)
            ) {
              alert("El email ya está en uso");
            } else {
              this.logearse();
              this.setEmail(this.email);
              this.setIdUser(JSON.stringify(response.data));
              this.$router.push("/Intro");
            }
          });
      }
    },
    signin() {
      if (this.email != "" && this.password != "") {
        const userData = {
          email: this.email,
          pass: this.password,
        };
        //Provisional
        // this.logearse();
        // this.$router.push("/Home");

        axios.post("http://localhost:3000/Login", userData).then((response) => {
          var json = { msg: "Error" };
          if (JSON.stringify(response.data) == JSON.stringify(json)) {
            alert("Usuario o contraseña incorrectos");
            this.password = "";
            this.email = "";
            //this.alerta = true;
          } else {
            this.logearse();
            this.setEmail(this.email);
            this.setIdUser(JSON.stringify(response.data));
            this.$router.push("/Home");
          }
        });
      }
    },
    ...mapMutations([
      "logearse",
      "setEmail",
      "setOk",
      "setNombre",
      "setIdUser",
    ]),
  },
};
</script>

<style scoped lang="scss">
.v-input__icon--double .v-input__icon {
  margin-left: -4.25rem !important;
}
a.no-text-decoration {
  text-decoration: none;
}
#signinup-form {
  max-width: 100rem;
}
.signup-form-form {
  max-width: 25rem;
  margin: 0 auto;
}
.card {
  overflow: hidden;
}
.vcenter {
  display: flex;
  align-items: center;
  justify-content: center;
}
.bg {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("../assets/logo.png") no-repeat center center;
  background-size: cover;
}
</style>
