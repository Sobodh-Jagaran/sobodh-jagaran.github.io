import { clear, el, icon } from '../utils/dom.js';
import { getAuth, signOut } from 'firebase/auth';
import { handleRouting, navigateTo } from '../services/router.js';
import { renderDashboard } from './admin/dashboard.js';
import { renderEditor } from './admin/editor.js';
import { renderMedia } from './admin/media.js';
import { renderSettings } from './admin/settings.js'

let currentModule = 'dashboard';
let resumeData = [];
let configData = null;
let currentUser = null;
export const initAdmin = (root, data) => {
    resumeData = data.resume;
    configData = data.config;
    const auth = getAuth();
    currentUser = auth.currentUser;
    if (!root.querySelector('nav')) root.innerHTML = '<div class="text-white text-center mt-20">Checking authentication...</div>';
    auth.onAuthStateChanged(user => {
        const route = handleRouting(user);
        if (route === 'admin') {
            renderAdminPortal(root);
        } else if (route === 'login') {
            navigateTo('/admin/login');
        }
    });
};

const renderAdminPortal = async (root) => {
    clear(root);
    root.className = "min-h-screen bg-gray-950 text-white flex flex-col";
    root.appendChild(renderAdminNav());
    root.appendChild(el('main', { class: 'flex-1 w-full max-w-[1600px] mx-auto p-6' }));    
    await updateUI();
};
const renderAdminNav = () => {
    return el('nav', { class: 'sticky top-0 z-50 w-full bg-black/40 backdrop-blur-xl border-b border-white/5 px-6 py-3 flex justify-between items-center' }, [
        el('div', { class: 'flex items-center gap-3' }, [
            el('div', { class: 'p-1.5 bg-blue-500 rounded-lg' }, [icon('shield', 'text-white w-5 h-5')]),
            el('span', { class: 'font-bold tracking-tight uppercase hidden sm:inline-block' }, 'System Admin')
        ]),
        el('div', { class: 'flex items-center gap-4' }, [
            el('div', { class: 'hidden md:flex items-center gap-1 pr-4 border-r border-white/10' }, [
                renderModuleLink('dashboard', 'layout-grid', 'Dashboard'),
                renderModuleLink('editor', 'edit-3', 'Editor'),
                renderModuleLink('media', 'image', 'Media'),
                renderModuleLink('settings', 'settings', 'Settings'),
            ]),
                el('button', {
                onclick: () => navigateTo('/'),
                class: 'flex items-center gap-2 px-4 py-2 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all text-xs font-bold uppercase tracking-widest'
            }, [icon('external-link', 'w-3 h-3'), 'View Portfolio']),
            el('button', { 
                class: 'flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-all text-xs font-medium',
                onclick: handleSignOut
            }, [
                icon('log-out', 'w-3.5 h-3.5'),
                el('span', { class: 'hidden sm:inline' }, 'Sign Out')
            ])
        ])
    ]); 
};
const renderModuleLink = (id, iconName, label) => {
        const isActive = currentModule === id;
        return el('button', {
            type: 'button',
            'data-module': id,
            onclick: (e) => { 
                e.preventDefault();
                 if (currentModule === id) return;
                currentModule = id;
                updateUI(); 
            },
            class: `flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm font-semibold ${
                isActive ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`
        }, [icon(iconName, 'w-4 h-4'), el('span', {}, label)]);
};
const updateUI = async () => {
    const nav = document.getElementsByTagName('nav')[0]
    const main = document.getElementsByTagName('main')[0];
    if (!main || !nav) return;
    const buttons = nav.querySelectorAll('[data-module]');
    buttons.forEach(btn => {
        const id = btn.getAttribute('data-module');
        const isActive = currentModule === id;
        btn.className = `flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm font-semibold ${
            isActive ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
        }`;
    });
    clear(main);
    main.appendChild( await renderModuleContent(resumeData));
    if (window.lucide) window.lucide.createIcons();
};
const renderModuleContent = async (resumeData) => {
    switch (currentModule) {
        case 'dashboard': return renderDashboard(resumeData, configData, currentUser);
        case 'editor': return renderEditor(resumeData);
        case 'media': return await renderMedia();
        case 'settings':  return renderSettings(currentUser);
        default: return el('div', {}, 'Module not found');
    }
};
const handleSignOut = async () => {
    const auth = getAuth();
    try {
        await signOut(auth);
        navigateTo('/admin/login');
    } catch (err) {
        console.error("Sign out failed", err);
    }
};