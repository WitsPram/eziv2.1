<template>
      <header class="p-8 pb-0">
        <nav class="bg-white border-gray-200 dark:bg-gray-900">
  <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
  <router-link to="/" class="flex items-center space-x-3 rtl:space-x-reverse">
      <img src="../assets/logo.png"  height="70" width="70" alt="Logo" />
      <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Ezezimalis</span>
  </router-link>
  <div class="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
      <button type="button" class="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
        <img id="pfp" height="50" width="50" class="rounded-full h-0 bg-white" :src="pfpUrl" alt="user photo">
      </button>
      <!-- Dropdown menu -->
      <div class="z-50 p-4 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600" id="user-dropdown">
        <div class="px-4 py-3">
          <span  class="block text-sm text-gray-900 dark:text-white"> {{ userName }} </span>
          <span class="block text-sm  text-gray-500 truncate dark:text-gray-400">{{ userEmail }}</span>
        </div>
        <ul class="py-2" aria-labelledby="user-menu-button">
          <li>
            <router-link to="./" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Dashboard</router-link>
          </li>
          <li v-if="userType === 'Fund Manager'">
            <router-link to="./earnings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">View opportunities</router-link>
          </li>
          <li v-if="userType === 'Fund Manager'">
            <router-link to="/submit-funding-oppurtunity" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Create an Oppurtunity</router-link></li>
          <li v-if="userType === 'Fund Manager'">
            <router-link to="/funding-applications" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">View Applications</router-link>
          </li>
          <!-- allows for blocking users or opps with an email id -->
          <li v-if="userType === 'Admin'">
            <router-link to="/submit-funding-oppurtunity" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Administraion</router-link></li>
            <li v-if="userType !== 'Applicant'">
              <router-link to="/apply-funding-manager" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Manager Application</router-link>
            </li>
          <li>
            <router-link to="./earnings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Notifications</router-link>
          </li>
          <li v-if="userType === 'Fund Manager'">
            <router-link to="./earnings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">View Earnings</router-link>
          </li>

            


          <li>
            <button v-if="userName=='User'" @click="handleLogin" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign in</button>
            <button v-else @click="handleLogout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</button>
          </li>
        </ul>
      </div>

  </div>
 
  </div>
</nav>

     </header>
  </template>
  
  <script>
  import { onMounted } from 'vue';
  import { useAuth } from '../useAuth';
  import { myMSALObj, state } from '../authService';

  import { ref , watch} from 'vue';

import { mapGetters } from 'vuex';
  
  export default {
    name: 'HeaderBar',
    data() {
      return {
        pfpUrl: "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg",
        userType: ''
      };
    },
    methods: {
      async getEmail(){
      return await this.getUser.username;
    },
      moop(){
        alert('moop')
        fetch('https://dbquery.azurewebsites.net/'+'/api/v1/auth/getUserData/jddsfbsdddf', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({"email" : "jddsfbsdddf" , "profile_pic_url": "joo"}) 
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
      }
    },

    computed: {
    ...mapGetters([
      'getUser', 'isAuthenticated'
    ]),
    userName() {
      if (this.getUser) {
        const fetchUserDetails = async (email) => {
        const baseurl = "http://localhost:3019";
        fetch(baseurl+`/api/v1/auth/getUserData/${email}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        .then(response => response.json())
        .then(data => {
          if (data.message !== 'Failure') {
            console.log('User datasss:', data);
             this.pfpUrl = data.profile_pic_url;
             this.userType = data.user_type;
            // userDetails.value = data;
          } else {
            console.log('Failed to fetch user data');
          }
        })
        .catch(error => console.error('Error:', error));
      };
        fetchUserDetails(this.getUser.username);
        return this.getUser.name;
      } else {
        return 'User';
      }
      // return this.getUser ? this.getUser.name : 'User';
    },

    userEmail() {

      return this.getUser ? this.getUser.username : 'example@gmail.com';

    },
  },
  mounted() {
    console.log("jfnkjss");

},
    setup() {
      const { login, logout, handleRedirect } = useAuth();
      const userDetails = ref(null);


      console.log('mounted');

    //   const baseurl = 
    //   'http://localhost:3019'
    //   ;
    //   const fetchUserDetails = async (email) => {
    //   fetch(`/api/v1/auth/getUserData/${email}`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //   })
    //   .then(response => response.json())
    //   .then(data => {
    //     if (data.message !== 'Failure') {
    //       console.log('User data:', data);
    //     } else {
    //       console.log('Failed to fetch user data');
    //     }
    //   })
    //   .catch(error => console.error('Error:', error));
    // };

      const handleLogin = async () => {
          await login(); 
          // await handleRedirect();
          // console.log('logged in', u);
          // alert(u)        
      };
  
      const handleLogout = async () => {
        await logout();

        console.log('logged out');
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
        const u = await handleRedirect();

        // console.log("fdwews",u.toString())
        // console.log("moop")
        
        // fetchUserDetails(u.toString()); 



        if (myMSALObj.getAllAccounts().length == 0) {
          console.log('No accounts');
          handleLogin();

        } else {
          console.log('Accounts 2:', myMSALObj.getAllAccounts());
          // fetchUserDetails(myMSALObj.getAllAccounts()[0].username.toString());
        }
      });
  
      return {
        handleLogin,
        userDetails,
        handleLogout
      };
    }
  }
  </script>