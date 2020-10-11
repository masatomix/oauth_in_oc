<template>
  <div class="about">
    <h1>This is an about page</h1>
    <v-btn class="btn btn-primary" @click="checkToken_without_sdk"
      >HTTP 呼び出し(Request)！</v-btn
    >
  </div>
</template>

<script>
import firebase from 'firebase'
// import restConfig from '../restConfig'

export default {
  methods: {
    checkToken_without_sdk() {
      if (firebase.auth().currentUser) {
        firebase
          .auth()
          .currentUser.getIdToken()
          .then(token => {
            console.log(token)

            // const value = {
            //   id: '001',
            //   name: 'こんにちは',
            //   isDone: true,
            // }
            // const config = {
            //   url: restConfig.echoUri,
            //   method: 'POST',
            //   headers: {
            //     'Content-type': 'application/json',
            //     Authorization: `Bearer ${token}`,
            //   },
            //   data: value,
            //   json: true,
            // }
            // axios(config)
            //   .then(response => alert(JSON.stringify(response.data)))
            //   .catch(error => alert(error.message))
          })
      } else {
        console.log('currentUser is null')
      }
    },
  },
}
</script>
