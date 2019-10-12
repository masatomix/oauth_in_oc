<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
      v-if="loginStatus"
    >
      <v-list dense>
        <template v-for="item in items">
          <v-row v-if="item.heading" :key="item.heading" align="center">
            <v-col cols="6">
              <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
            </v-col>
            <v-col cols="6" class="text-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-col>
          </v-row>
          <v-list-group
            v-else-if="item.children"
            :key="item.text"
            v-model="item.model"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon
          >
            <template v-slot:activator>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ item.text }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <v-list-item v-for="(child, i) in item.children" :key="i">
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ child.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item v-else :key="item.text" @click="gotoPath(item)">
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="blue darken-3"
      dark
    >
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <v-app-bar-nav-icon
          @click.stop="drawer = !drawer"
          v-if="loginStatus"
        ></v-app-bar-nav-icon>
        <span class="hidden-sm-and-down">Google Contacts</span>
      </v-toolbar-title>

      <div class="flex-grow-1"></div>

      <v-btn @click="logout()" v-if="loginStatus">logout</v-btn>
      <v-btn icon>
        <v-icon>mdi-apps</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn>
      <v-btn icon large>
        <v-avatar size="32px" item>
          <v-img
            src="https://cdn.vuetifyjs.com/images/logos/logo.svg"
            alt="Vuetify"
          ></v-img>
        </v-avatar>
      </v-btn>
    </v-app-bar>
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import firebase from 'firebase'
import constants from '@/constants'

export default {
  props: {
    source: String,
  },
  computed: {
    loginStatus() {
      return this.$store.state.loginStatus
    },
    user() {
      return this.$store.state.user
    },
  },
  data: () => ({
    drawer: null,
    items: [
      { icon: 'work', text: 'Todo', path: './' },
      { icon: 'supervisor_account', text: 'Follower', path: 'about' },
      { icon: 'history', text: 'Timeline(未)', path: './' },
      { icon: 'settings', text: 'Settings(未)', path: 'about' },
    ],
  }),
  methods: {
    gotoPath: function(item) {
      this.$router.push({ path: item.path })
    },
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push(constants.path.TOP)
          window.location.reload()
        })
        .catch(function(error) {
          const errorCode = error.code
          const errorMessage = error.message
          alert(errorCode, errorMessage)
        })
    },
  },
}
</script>
