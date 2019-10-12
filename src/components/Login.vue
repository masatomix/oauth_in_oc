<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Login form</v-toolbar-title>
                <div class="flex-grow-1"></div>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Login"
                    name="login"
                    prepend-icon="person"
                    type="text"
                    v-model="userInfo.userid"
                  ></v-text-field>
                  <v-text-field
                    id="password"
                    label="Password"
                    name="password"
                    prepend-icon="lock"
                    type="password"
                    v-model="userInfo.password"
                  ></v-text-field>
                  <div class="checkbox mb-3">
                    <label>
                      <input
                        type="checkbox"
                        value="remember-me"
                        v-model="userInfo.rememberme"
                      />
                      Remember me
                    </label>
                  </div>
                </v-form>
                <div class="form-signin">
                  <button
                    type="button"
                    class="google-button"
                    @click="loginWithGoogle"
                  >
                    <span class="google-button__icon">
                      <svg
                        viewBox="0 0 366 372"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M125.9 10.2c40.2-13.9 85.3-13.6 125.3 1.1 22.2 8.2 42.5 21 59.9 37.1-5.8 6.3-12.1 12.2-18.1 18.3l-34.2 34.2c-11.3-10.8-25.1-19-40.1-23.6-17.6-5.3-36.6-6.1-54.6-2.2-21 4.5-40.5 15.5-55.6 30.9-12.2 12.3-21.4 27.5-27 43.9-20.3-15.8-40.6-31.5-61-47.3 21.5-43 60.1-76.9 105.4-92.4z"
                          id="Shape"
                          fill="#EA4335"
                        />
                        <path
                          d="M20.6 102.4c20.3 15.8 40.6 31.5 61 47.3-8 23.3-8 49.2 0 72.4-20.3 15.8-40.6 31.6-60.9 47.3C1.9 232.7-3.8 189.6 4.4 149.2c3.3-16.2 8.7-32 16.2-46.8z"
                          id="Shape"
                          fill="#FBBC05"
                        />
                        <path
                          d="M361.7 151.1c5.8 32.7 4.5 66.8-4.7 98.8-8.5 29.3-24.6 56.5-47.1 77.2l-59.1-45.9c19.5-13.1 33.3-34.3 37.2-57.5H186.6c.1-24.2.1-48.4.1-72.6h175z"
                          id="Shape"
                          fill="#4285F4"
                        />
                        <path
                          d="M81.4 222.2c7.8 22.9 22.8 43.2 42.6 57.1 12.4 8.7 26.6 14.9 41.4 17.9 14.6 3 29.7 2.6 44.4.1 14.6-2.6 28.7-7.9 41-16.2l59.1 45.9c-21.3 19.7-48 33.1-76.2 39.6-31.2 7.1-64.2 7.3-95.2-1-24.6-6.5-47.7-18.2-67.6-34.1-20.9-16.6-38.3-38-50.4-62 20.3-15.7 40.6-31.5 60.9-47.3z"
                          fill="#34A853"
                        />
                      </svg>
                    </span>
                    <span class="google-button__text">Sign in with Google</span>
                  </button>
                </div>
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="primary" @click="onSubmit()">Login</v-btn>
              </v-card-actions>
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
    }
  },
  created: function() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo')) || {}
  },
  computed: {
    signupPath() {
      return { path: constants.path.SIGN_UP }
    },
  },
  methods: {
    onSubmit() {
      // console.log(JSON.stringify(this.userInfo))
      firebase
        .auth()
        .signInWithEmailAndPassword(
          this.userInfo.userid,
          this.userInfo.password,
        )
        .then(result => {
          this.$store.commit(constants.mutations.user, result.user)
          this.$store.commit(constants.mutations.loginStatus, true)

          this.userInfo.password = ''
          if (this.userInfo.rememberme) {
            localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
          } else {
            localStorage.removeItem('userInfo')
          }
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

    gotoSignup() {
      this.$router.push(constants.path.SIGN_UP)
    },
    loginWithGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          this.$store.commit(constants.mutations.user, result.user)
          this.$store.commit(constants.mutations.loginStatus, true)
          this.$router.push(
            this.$route.query.redirect
              ? this.$route.query.redirect
              : constants.path.TOP,
          )
        })
        .catch(function(error) {
          const errorCode = error.code
          const errorMessage = error.message
          // alert(errorMessage)
          // ↑二回ダイアログを出したりとか、ポップアップ閉じたりとか、結構な頻度で発生するエラーだった。コレ。
          console.log(errorCode, errorMessage)
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
