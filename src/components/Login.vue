<template>
  <v-app id="inspire">
    <v-content v-if="!token">
      <v-container class="fill" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Login form</v-toolbar-title>
                <div class="flex-grow-1"></div>
              </v-toolbar>
              <v-card-text>
                <div class="form-signin">
                  <h1>
                    <a :href="loginUrl">
                      <img
                        alt="Sign in with Slack"
                        src="https://api.slack.com/img/sign_in_with_slack.png"
                        style="cursor:pointer"
                      />
                    </a>
                  </h1>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import firebase from 'firebase'
import constants from '@/constants'
import restConfig from '../restConfig'
// import 'firebaseui/dist/firebaseui.css'

export default {
  name: 'Login',
  props: {
    source: String,
  },
  data() {
    return {
      drawer: null,
      userInfo: {
        userid: '',
        password: '',
        displayName: '',
        rememberme: false,
      },
      token: null,
    }
  },
  created: function() {
    const param = new URLSearchParams(window.location.search)
    this.token = param.get('token')
    if (this.token) {
      this.loginByToken(this.token)
    }
  },
  computed: {
    loginUrl() {
      // return [restConfig.apiUri, '?fromUrl=', window.location.href].join('')
      return restConfig.apiUri
    },
  },
  methods: {
    loginByToken(token) {
      firebase
        .auth()
        .signInWithCustomToken(token)
        .then(result => {
          this.$store.commit(constants.mutations.user, result.user)
          this.$store.commit(constants.mutations.loginStatus, true)

          // firebase
          //   .auth()
          //   .currentUser.getIdToken()
          //   .then(token => {
          //     console.log(token)
          //   })

          // ログインできたらTOP画面に遷移
          this.$router.push(
            this.$route.query.redirect
              ? this.$route.query.redirect
              : constants.path.TOP,
          )
        })
        .catch(function(error) {
          const errorCode = error.code
          const errorMessage = error.message
          alert(errorCode + '\n' + errorMessage)
        })
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
html,
body {
  height: 100%;
}

body {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type='email'] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type='password'] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

/* Shared */
.loginBtn {
  box-sizing: border-box;
  position: relative;
  /* width: 13em;  - apply for fixed size */
  margin: 0.2em;
  padding: 0 15px 0 46px;
  border: none;
  text-align: left;
  line-height: 34px;
  white-space: nowrap;
  border-radius: 0.2em;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
}
.loginBtn:before {
  content: '';
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  width: 34px;
  height: 100%;
}
.loginBtn:focus {
  outline: none;
}
.loginBtn:active {
  box-shadow: inset 0 0 0 32px rgba(0, 0, 0, 0.1);
}

.google-button {
  height: 40px;
  border-width: 0;
  background: white;
  color: #737373;
  border-radius: 5px;
  white-space: nowrap;
  box-shadow: 1px 1px 0px 1px rgba(0, 0, 0, 0.05);
  transition-property: background-color, box-shadow;
  transition-duration: 150ms;
  transition-timing-function: ease-in-out;
  padding: 0;
  box-shadow: 1px 4px 5px 1px rgba(0, 0, 0, 0.1);
}

.google-button:hover {
  cursor: pointer;
}

.google-button:active {
  box-shadow: 3px 6px 7px 3px rgba(0, 0, 0, 0.1);
  transition-duration: 10ms;
}

.google-button__icon {
  display: inline-block;
  vertical-align: middle;
  margin: 8px 0 8px 8px;
  width: 18px;
  height: 18px;
  box-sizing: border-box;
}

.google-button__icon--plus {
  width: 27px;
}

.google-button__text {
  display: inline-block;
  vertical-align: middle;
  padding: 0 24px;
  font-size: 14px;
  font-weight: bold;
  font-family: 'Roboto', arial, sans-serif;
}
</style>
