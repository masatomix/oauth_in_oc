<template>
  <div class="about">
    <h1>This is an about page</h1>
    <v-btn class="btn btn-primary" @click="checkToken_without_sdk"
      >HTTP 呼び出し(Request)！</v-btn
    >
    <v-btn class="btn btn-primary" @click="checkToken"
      >HTTP 呼び出し(OnCall)！</v-btn
    >
  </div>
</template>

<script>
import firebase from 'firebase'
import axios from 'axios'

export default {
  methods: {
    checkToken() {
      if (firebase.auth().currentUser) {
        firebase
          .auth()
          .currentUser.getIdToken()
          .then(token => console.log(token))
      } else {
        console.log('currentUser is null')
      }

      const value = {
        id: '001',
        name: 'こんにちは',
        isDone: true,
      }
      // HTTP呼び出し
      const echo_onCall = firebase.functions().httpsCallable('echo_onCall')
      echo_onCall(value).then(result => alert(JSON.stringify(result)))
    },
    checkToken_without_sdk() {
      if (firebase.auth().currentUser) {
        firebase
          .auth()
          .currentUser.getIdToken()
          .then(token => {
            console.log(token)

            const value = {
              id: '001',
              name: 'こんにちは',
              isDone: true,
            }
            const config = {
              url: 'https://us-central1-fb2samples.cloudfunctions.net/echo_req',
              method: 'POST',
              headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              data: value,
              json: true,
            }
            axios(config)
              .then(response => alert(JSON.stringify(response.data)))
              .catch(error => alert(error.message))
          })
      } else {
        console.log('currentUser is null')
      }
    },
  },
}
</script>
