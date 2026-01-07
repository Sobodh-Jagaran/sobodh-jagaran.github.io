import { initializeFirebaseAndAuth, loadResume, loadConfig } from './services/data.js';
import { renderPortfolio } from './components/portfolio.js';
import { initAdmin } from './components/admin.js';
import { renderLoginView } from './components/login.js';
import { clear } from './utils/dom.js';
import { handleRouting } from './services/router.js';
import { onAuthStateChanged } from 'firebase/auth';

let currentUser = null;
let resume = null;
let config = null;
const init = async () => {
    try {
        const { auth, db } = await initializeFirebaseAndAuth();
        resume = await loadResume();
        config =  await loadConfig();
        if (config.siteTitle) document.title = config.siteTitle;
        if (config.gaId) injectAnalytics(config.gaId);
        onAuthStateChanged(auth, (user) => {
            currentUser = user;
            renderApp({resume, config});
        });
        window.addEventListener('popstate', () => renderApp());
        window.addEventListener('appnavigation', () => renderApp());
        //renderApp();
    }  catch (error) {
        console.error("Application Setup Failed:", error);
        document.body.innerHTML = `<div class="p-10 text-red-600 bg-red-100 rounded-lg max-w-lg mx-auto mt-10">Critical Error during Firebase Initialization: ${error.message}. Check console for details.</div>`;
    }
};
const renderApp = (manualData = null) => {
    const appRoot = document.getElementById('app-root');
    if (!appRoot) return;
    const data = manualData && !(manualData instanceof Event) ? manualData : {resume, config}
    const route = handleRouting(currentUser);
    clear(appRoot);
    switch (route){
        case 'admin': initAdmin(appRoot, data); break;
        case 'login': renderLoginView(appRoot); break;
        default: (config.maintenanceMode) ? renderMaintenancePage(root, config) : renderPortfolio(appRoot, data.resume); break;
    }
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
};
const injectAnalytics = (id) => {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    script.async = true;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', id);
};
const renderMaintenancePage = (root, config) => {
    clear(root);
    root.className = "min-h-screen bg-black flex items-center justify-center p-6 text-center";
    root.appendChild(el('div', { class: 'space-y-6 max-w-md' }, [
        el('div', { class: 'w-20 h-20 bg-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8' }, [
            el('i', { 'data-lucide': 'hammer', class: 'text-blue-500 w-10 h-10' })
        ]),
        el('h1', { class: 'text-4xl font-black text-white tracking-tighter' }, 'Down for Maintenance'),
        el('p', { class: 'text-gray-400 leading-relaxed' }, 
            config.siteDescription || "We're currently updating the portfolio. Please check back shortly."
        ),
        el('div', { class: 'pt-8' }, [
            el('div', { class: 'inline-block px-4 py-2 rounded-full border border-white/10 text-[10px] text-gray-500 font-bold uppercase tracking-widest' }, 'System Offline')
        ])
    ]));
    if (window.lucide) window.lucide.createIcons();
};
window.onload = init;