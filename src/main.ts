import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'vue-toastification/dist/index.css'
import './assets/tailwind.css'
import Toast, { POSITION, type PluginOptions } from 'vue-toastification'

const options: PluginOptions = {
    position: POSITION.BOTTOM_RIGHT,
    hideProgressBar: true,
    toastClassName: 'bg-gray-800 text-white rounded-lg shadow-lg p-4',
};

createApp(App).use(Toast, options).mount('#app');