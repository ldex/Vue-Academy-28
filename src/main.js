import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/animate.css'
import store from './store'

const app = createApp(App).use(store);

app
    .use(router)
    .mount('#app');

// Global error handler
app.config.errorHandler = (error) => {
    console.error('Global error: ', error.message);
    router.push({ name: 'error'});
}
