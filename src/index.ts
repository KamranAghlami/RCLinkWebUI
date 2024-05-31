import 'normalize.css';
import './css/style.css';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service_worker.js').then(registration => { }).catch(error => {
            console.log('ServiceWorker registration failed: ', error);
        });
    });
}

window.addEventListener('DOMContentLoaded', () => {
    import('./terminal').then(({ initiate_termial }) => {
        initiate_termial();

        console.log("Hello, RCLink!");
    });
});