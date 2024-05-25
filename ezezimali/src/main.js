import { createApp } from 'vue'
// import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './index.css'
import store from './store';
import Emitter from 'tiny-emitter';

import Toast, {TYPE} from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
const options = {
    transition: "Vue-Toastification__bounce",
    // maxToasts: 20,
    toastDefaults: {
        // ToastOptions object for each type of toast
        [TYPE.ERROR]: {
            timeout: 10000,
            closeButton: false,
        },
        [TYPE.SUCCESS]: {
            timeout: 3000,
            hideProgressBar: true,
        }    
    },
    draggable: true,
    newestOnTop: true
  }
  import CanvasJSChart from '@canvasjs/vue-charts';

  const app = createApp(App)
  app.config.globalProperties.$msalInstance = {};
  app.config.globalProperties.$emitter = new Emitter();
  
  app.use(CanvasJSChart)
  app.use(store)
  app.use(router)
  app.use(Toast, options);

app.mount('#app')
