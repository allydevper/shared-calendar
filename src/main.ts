import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'vue-toastification/dist/index.css'
import './assets/tailwind.css'
import Toast, { POSITION, type PluginOptions } from 'vue-toastification'
import EventDetail from './components/EventDetail.vue'
import { createWebHistory, createRouter } from 'vue-router'

const options: PluginOptions = {
    timeout: 3000,
    position: POSITION.BOTTOM_RIGHT,
    hideProgressBar: true,
    closeOnClick: true,
    toastClassName: 'bg-gray-800 text-white rounded-lg shadow-lg p-4 flex items-center',
};

const routes = [
    { path: '/', component: App },
    { path: '/event/:uid', name: 'EventDetail', component: EventDetail, props: true }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

createApp(App).use(Toast, options).use(router).mount('#app');