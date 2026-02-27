import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Toastify from 'toastify-js'

const app = createApp(App)

app.use(router)

app.config.globalProperties.$toast = (message, type = 'success') => {
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        offset: {
            y: 80,
            x: 0
        },
        stopOnFocus: true,
        style: {
            background:
                type === 'success'
                    ? "#22c55e"
                    : type === 'error'
                    ? "#ef4444"
                    : "#3b82f6",
        }
    }).showToast()
}
app.mount('#app')
