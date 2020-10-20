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
                  <a :href="authorization_endpoint_uri">
                    OC APIと接続
                  </a>
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
import oauthConfig from '../oauthConfig'
import request from 'request'
import crypto from 'crypto'
import urljoin from 'url-join'

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
      authorization_endpoint_uri: null,
      oauthConfig: null,
    }
  },
  created: async function() {
    this.oauthConfig = await createOAuthConfig(oauthConfig.endpoint)
    const param = new URLSearchParams(window.location.search)

    if (param.get('code')) {
      // reponse_mode = form_post の場合は、HTMLとしてPOSTしようとするので、子の受け方じゃなく /login へPOSTされるコードを書く。SPAで?
      this.loginByCode(param.get('code')).finally(() =>
        history.pushState('', '', '/'),
      )
    } else {
      const {
        code_verifier,
        authorization_endpoint_uri,
      } = createAuthorizationURL(this.oauthConfig)

      this.$store.commit('code_verifier', code_verifier)
      this.authorization_endpoint_uri = authorization_endpoint_uri
    }
  },
  computed: {},
  methods: {
    async loginByCode(code) {
      const code_verifier = this.$store.state.code_verifier
      this.$store.commit('code_verifier', '')

      const formParams = {
        redirect_uri: oauthConfig.redirect_uri,
        client_id: oauthConfig.client_id,
        // client_secret: oauthConfig.client_secret,
        grant_type: 'authorization_code',
        code: code,
        code_verifier: code_verifier,
      }

      const options = {
        uri: this.oauthConfig.token_endpoint,
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        form: formParams,
        json: true,
      }
      const body = await doRequest(options)
      alert(body.access_token)
    },
  },
}

function createAuthorizationURL(oauthConfigFromWeb) {
  const state = getRandomString()
  const nonce = getRandomString()

  // const code_verifier = 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk'
  const code_verifier = getRandomString()
  console.log(`code_verifier: ${code_verifier}`)

  // const code_challenge = 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM'
  const code_challenge = sha256(code_verifier)

  // console.log('randomValue: ' + randomValue)
  const authorization_endpoint_uri = [
    oauthConfigFromWeb.authorization_endpoint,
    '?client_id=',
    oauthConfig.client_id,
    '&redirect_uri=',
    encodeURIComponent(oauthConfig.redirect_uri),
    '&state=',
    state,
    '&nonce=',
    nonce,
    '&response_type=',
    encodeURIComponent('code'),
    // '&response_mode=',
    // 'form_post',
    '&code_challenge=',
    code_challenge,
    '&code_challenge_method=',
    'S256',
    '&scope=',
    encodeURIComponent(oauthConfig.scope),
  ].join('')

  return { code_verifier, authorization_endpoint_uri }
}

function createOAuthConfig(openidConfigurationUrl) {
  const url = openidConfigurationUrl.endsWith(
    '.well-known/openid-configuration',
  )
    ? openidConfigurationUrl
    : urljoin(openidConfigurationUrl, '.well-known/openid-configuration')

  const options = {
    uri: url,
    method: 'GET',
    json: true,
  }
  return doRequest(options)
}

// https://qiita.com/fukasawah/items/db7f0405564bdc37820e 感謝！
function getRandomString() {
  const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const N = 50
  const randomValue = Array.from(Array(N))
    .map(() => S[Math.floor(Math.random() * S.length)])
    .join('')
  return randomValue
}

function sha256(target) {
  const base64 = crypto
    .createHash('sha256')
    .update(target, 'utf8')
    .digest('base64')
  return base64
    .replace('+', '-')
    .replace('/', '_')
    .replace('=', '')
}

function doRequest(option) {
  console.log(option)
  return new Promise((resolve, reject) => {
    request(option, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(body)
      } else {
        reject(error)
      }
    })
  })
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
