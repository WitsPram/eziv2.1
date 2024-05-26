<template>
  <header class="p-8 pb-0">
    <nav class="bg-white border-gray-200 dark:bg-gray-900">
      <article class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <router-link to="/" class="flex items-center space-x-3 rtl:space-x-reverse">
          <img  src="../assets/logo.png" height="70" width="70" alt="Logo" />
          <section class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Ezezimalis</section>
        </router-link>
        <section class="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button type="button"
            class="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown"
            data-dropdown-placement="bottom" style="border-radius: 100%; background-color: white;">
            <img style="border-radius: 100%; background-color: white;" id="pfp" height="50" width="50" class="rounded-full h-0 bg-white" :src="pfp" alt="user photo">
          </button>
          <!-- Dropdown menu -->
          <section
            class="z-50 p-4 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
            id="user-dropdown">
            <section class="px-4 py-3">
              <section class="block text-sm text-gray-900 dark:text-white"> {{ userName }} </section>
              <section class="block text-sm  text-gray-500 truncate dark:text-gray-400">{{ userType }}</section>
            </section>
            <ul class="py-2" aria-labelledby="user-menu-button">
              <li>
                <router-link to="/"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Dashboard</router-link>
              </li>
              <li v-if="userType === 'Fund Manager' || userType === 'Admin'">
                <router-link to="/view-funding-oppurtunities"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">View
                  opportunities</router-link>
              </li>
              <li v-if="userType === 'Fund Manager'">
                <router-link to="/submit-funding-oppurtunity"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Create
                  an Oppurtunity</router-link>
              </li>
              <li v-if="userType === 'Fund Manager'">
                <router-link to="/funding-applications"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">View
                  Applications</router-link>
              </li>
              <!-- allows for blocking users or opps with an email id -->
              <li v-if="userType === 'Admin'">
              </li>
              <li v-if="userType === 'Applicant'">
                <router-link to="/apply-funding-manager"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Manager
                Application</router-link>
              </li>
              <li>
                <router-link to="/notifications"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Notifications</router-link>
                <router-link v-if="userType === 'Admin'" to="/funding-manager-applications"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Manage Applications</router-link>
                <router-link v-if="userType === 'Admin'" to="/admin"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Block User</router-link>
              </li>
              <li v-if="userType === 'Fund Manager'">
                <router-link to="/reports"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">View
                  Reports</router-link>
              </li>

              <li>
                <router-link to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Settings</router-link>
              </li>




              <li>
                <button v-if="userName == 'New User'" @click="handleLogin"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign
                  in</button>
                <button v-else @click="handleLogout"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign
                  out</button>
              </li>
            </ul>
          </section>

        </section>

      </article>
    </nav>

  </header>
</template>


<script>
import { onMounted, ref } from 'vue';
import { useAuth } from '../useAuth';
import { myMSALObj } from '../authService';
import { mapGetters } from 'vuex';

import toast from './toasty';
import router from '@/router';

export default {
  name: 'HeaderBar',
  data() {
    return {
      pfpUrl: "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"
    };
  },
  computed: {
    ...mapGetters([
      'getUser', 'getUserType'
    ]),
    userName() {
      return this.user ? this.user.username : 'New User';
    },
    userType() {
      return this.user ? this.user.user_type : 'Unknown User Type';
    },
    pfp() {
      return this.user ? this.user.profile_pic : this.pfpUrl;
    },
  },
  methods:{
    myMethod() {

// Since you returned `toast` from setup(), you can access it now
Toast.success("I'm an info toastdsd!");
}
  },
  setup() {
    const { login, logout, handleRedirect } = useAuth();

    const user = ref(null); // Initialize user ref
    
    const handleLogin = async () => {
      await login();       
    };

    const handleLogout = async () => {
      await logout();
    };

    const initialize = async () => {
      try {
        await myMSALObj.initialize();
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    onMounted(async () => {
      await initialize();
      const userData = await handleRedirect();

      console.log("fdsb",userData);


      // Update user ref
      user.value = userData;
      if (userData ){
        if (userData.disabled === true){
          toast.error("User is blocked!");
          window.location.href = "https://www.youtube.com/shorts/jw3jjN8kCyo";

        }
        else
        toast.success("User logged in successfully!");
      }
    else{
      toast.error("User not logged in!");
      await handleLogin();

    }
    });

    return {
      handleLogin,
      user,
      handleLogout
    };
  }
}
</script>