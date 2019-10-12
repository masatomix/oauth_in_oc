<template>
  <b-container>
    <form class="form-signin" @submit.prevent="signup">
      <h1 class="h3 mb-3 font-weight-normal">サインアップ</h1>
      <label for="inputUserName" class="sr-only">e-mail</label>
      <input
        type="email"
        id="inputUserName"
        class="form-control"
        placeholder="e-mail"
        required
        autofocus
        v-model="userInfo.userid"
      />
      <label for="inputPassword" class="sr-only">Password</label>
      <input
        type="password"
        id="inputPassword"
        class="form-control"
        placeholder="Password"
        required
        v-model="userInfo.password"
      />
      <label for="inputDisplayName" class="sr-only">DisplayName</label>
      <input
        type="text"
        id="inputDisplayName"
        class="form-control"
        placeholder="Display Name"
        v-model="userInfo.displayName"
        required
      />
      <button class="btn btn-lg btn-primary btn-block">Sign up</button>
    </form>
    <div class="form-signin">
      <router-link :to="loginPath">ログイン画面</router-link>
    </div>
  </b-container>
</template>

<script>
import firebase from 'firebase'
import constants from '@/constants'

export default {
  name: 'SignUp',
  data() {
    return {
      userInfo: {
        userid: '',
        password: '',
        displayName: '',
      },
    }
  },
  computed: {
    loginPath() {
      return { path: constants.path.LOGIN }
    },
  },
  methods: {
    signup() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(
          this.userInfo.userid,
          this.userInfo.password,
        )
        .then(result => {
          this.$store.commit(constants.mutations.user, result.user)
          this.$store.commit(constants.mutations.loginStatus, true)
          result.user
            .updateProfile({
              displayName: this.userInfo.displayName,
            })
            .then(() => {
              this.userInfo.password = ''
              localStorage.removeItem('userInfo')
              this.$router.push(
                this.$route.query.redirect
                  ? this.$route.query.redirect
                  : constants.path.TOP,
              )
            })
        })
        .catch(function(error) {
          // Handle Errors here.
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
