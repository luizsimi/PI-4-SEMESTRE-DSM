// resources/js/app.jsx
import React from "react";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import ReactDOM from "react-dom/client";
import "../css/app.css"; // ou qualquer outro arquivo de estilos
import "izitoast/dist/css/iziToast.min.css"; // estilos do iziToast, se quiser global

createInertiaApp({
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        ReactDOM.createRoot(el).render(<App {...props} />);
    },
});
