<template>
  <div class="login">
    <transition
      name="fade"
      mode="out-in"
    >
      <div v-if="loading">
        <loading-screen :show="loading" />
      </div>
      <div
        v-show="errorMessage"
        ref="errorMessage"
        class="display-flex flex-direction-column align-items-center"
      >
        <div class="alert alert-info">
          <p>{{ errorMessage }}</p>
        </div>
        <a :href="redirectUrl">
          <p class="btn blue">
            Log in
          </p>
        </a>
      </div>
    </transition>
  </div>
</template>

<script>
/**
 * @module Login
 */

/* eslint-disable */
import LoginFunctions from "../controllers/Login";
import ajaxErrorHandler from "../controllers/ErrorController";
import LoadingScreen from "@/components/modules/LoadingScreen";
import { routes } from "@/router";
import { mapGetters, mapMutations, mapState } from "vuex";

export default {
  name: "login",
  components: { LoadingScreen },
  data() {
    return {
      loading: false,
      errorMessage: ""
    };
  },
  computed: {
    ...mapGetters(["redirectUrl", "accountToken"])
  },
  created() {
    if (this.$route.name === "LoginExpired") {
      window.location.href = this.redirectUrl;
    }
    if (this.$route.query.redirect) {
      this.setRedirectUrl(this.$route.query.redirect);
    }
    if (this.$route.query.token) {
      this.login(this.$route.query.token);
    } else if (this.accountToken) {
      this.login(this.accountToken);
    } else {
      window.location.href = this.redirectUrl;
    }
  },
  methods: {
    /**
     * To prompt the backend call that logs the user in.
     * @function
     * @param {object} token - The auth token
     * @returns {object} A promise that will either return an error message or display the success screen
     */
    login(token) {
      var loginVue = this;
      this.errorMessage = "";
      this.loading = true;
      return (
        LoginFunctions.login(token)
          /* eslint-disable no-undef */
          .then(response => {
            // set active user name
            loginVue.$root.activeUser = response.payload;
            localStorage.setItem(
              "activeUser",
              JSON.stringify(loginVue.$root.activeUser)
            );
            // set userToken
            this.setUserToken(response.session.token);
            localStorage.setItem("userToken", loginVue.$root.userToken);
            // set appId
            loginVue.setAppId(response.App.app_id);
            localStorage.setItem("appId", loginVue.$root.appId);
            // set appSecret
            this.setAppSecret(response.App.app_secret);
            localStorage.setItem("appSecret", loginVue.$root.appSecret);
            // set createdBy
            loginVue.$root.createdBy = response.session.admin_id;
            localStorage.setItem("createdBy", loginVue.$root.createdBy);
            // set roles
            let userRoles = response.payload.roles;
            loginVue.$root.roles = userRoles;
            localStorage.setItem("roles", JSON.stringify(loginVue.$root.roles));
            // set permissions
            let userPermissions = {};
            response.payload.assigned_permissions.forEach(permission => {
              userPermissions[permission.name] = true;
            });
            loginVue.setPermissions(userPermissions);

            // set account type && locations for Location Managers
            if (response.payload.type === "admin") {
              loginVue.$root.accountType = "application_admin";
              localStorage.setItem("accountType", loginVue.$root.accountType);
            } else if (response.payload.type === "restricted") {
              loginVue.$root.accountType = "store_admin";
              loginVue.setStoreLocations(response.payload.locations);
              localStorage.setItem("accountType", loginVue.$root.accountType);
            }

            // redirect
            let appRoutes = routes.filter(route => route.path === "/app")[0]
              .children;
            let accessible = false;
            // eslint-disable-next-line
            const routePath = sessionStorage.getItem("routePath");
            for (let i = 0; i < appRoutes.length; i++) {
              const route = appRoutes[i];
              accessible = route.meta.permissions.some(
                permission => this.$root.permissions[permission]
              );
              if (accessible) {
                if (routePath !== null) {
                  const routePathAccessible = appRoutes.find(route => {
                    if (`/app/${route.path}` === routePath) {
                      return route.meta.permissions.some(
                        permission => this.$root.permissions[permission]
                      );
                    }
                  });
                  if (routePathAccessible) {
                    this.$router.push({
                      path: routePath
                    });
                  } else {
                    this.$router.push({
                      path: `/app/${route.path}`
                    });
                  }
                } else {
                  this.$router.push({
                    path: `/app/${route.path}`
                  });
                }
                break;
              }
            }
            if (!accessible) {
              this.$router.push("/app/unauthorized");
            }
            loginVue.setAccountToken(token);
          })
          .catch(reason => {
            this.errorMessage = "We could not log you in"
            this.loading = false;
          })
      );
    },
    ...mapMutations({
      setRedirectUrl: "SET_REDIRECT_URL",
      setStoreLocations: "SET_STORE_LOCATIONS",
      setPermissions: "SET_PERMISSIONS",
      setAppId: "SET_APP_ID",
      setAppSecret: "SET_APP_SECRET",
      setUserToken: "SET_USER_TOKEN",
      setAccountToken: "SET_ACCOUNT_TOKEN"
    })
  }
};
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3rem;
}
.alert {
  max-width: 768px;
}
</style>
