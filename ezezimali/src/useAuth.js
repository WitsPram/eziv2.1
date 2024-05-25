import {ref }  from 'vue'
import { myMSALObj, state } from './authService'
import store from './store';
import { baseurl } from './config/config';
import axios from 'axios';
// import { useAuthStore } from './stores/counter'

// const { isAuthenticated, user } = useAuthStore();

export function useAuth() {
    const isAuthenticated = ref(false);
    
    const login = async () => {
        try {
            if(!myMSALObj){
                throw new Error('MSAL instance not initialized');
            }

            await myMSALObj.loginRedirect();
            

            
        } catch (error) {
            console.error(error);
        }
    }

    const logout = async () => {
        try {
            if(!myMSALObj){
                throw new Error('MSAL instance not initialized');
            }

            await myMSALObj.logoutRedirect();
            isAuthenticated.value = false;
            store.commit('CLEAR_USER');
            console.log('Logout successful');
        } catch (error) {
            console.error(error);
        }
    }

    const handleRedirect = async () => {
        try {
            await myMSALObj.handleRedirectPromise();
            state.isAuthenticated = myMSALObj.getAllAccounts().length > 0;
            state.user = myMSALObj.getAllAccounts()[0];

            async function fetchData() {
                try {
                    const id = myMSALObj.getAllAccounts()[0].localAccountId;
                    const name = myMSALObj.getAllAccounts()[0].name;
              
                  // Modify the axios call to include the token in the request headers
                  const response = await axios.get(`${baseurl}/api/v1/auth`, {
                    params: {
                      id: id,
                      name: name
                    }
                  });

                  response.data.id = id;
              
                  console.log(response.data); 

                    store.commit('SET_USER', response.data);
                } catch (error) {
                  console.error('Error fetching data:', error.response.data.message);
                }
              }
              
              await fetchData();

            // store.commit('SET_USER', state.user);
            console.log('Redirect successful', store.getters.isAuthenticated, store.getters.getUser );

            return store.getters.getUser

            // return myMSALObj.getAllAccounts()[0].username;  



        } catch (error) {
            console.error(error);
        }
    }

    return { isAuthenticated, login, logout, handleRedirect}
}