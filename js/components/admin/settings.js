import { el, icon, InputGroup, clear } from '../../utils/dom.js';
import { loadConfig, saveConfig, handlePasswordReset } from "../../services/data.js";

let currentTab = 'general';
let currentUser = null;
let configData = null;
let isSaving = false;

const SETTINGS_TABS = [
    { id: 'general', label: 'General', icon: 'settings', desc: 'Site identity and visibility' },
    { id: 'services', label: 'Services', icon: 'server', desc: 'Analytics and integrations' },
    { id: 'security', label: 'Security', icon: 'shield-lock', desc: 'Account management' }
];

export const renderSettings = async (user) => {
    currentUser = user;
    configData = await loadConfig();
    const container = el('div', { class: 'flex flex-col md:flex-row gap-8 pb-12 animate-in fade-in duration-500' });
    const sidebar = el('aside', { class: 'w-full md:w-64 space-y-1' });
    const contentArea = el('div', { class: 'flex-1 bg-gray-900 rounded-[2rem] p-8 md:p-10' });
    const updateView = () => {
        renderSettingsSidebar(sidebar, updateView);
        clear(contentArea);
        contentArea.appendChild(renderActiveTab(updateView));
        if (window.lucide) window.lucide.createIcons();
    };
    updateView();
    container.append(sidebar, contentArea);
    return container;
};

const renderSettingsSidebar = (sidebar, onUpdate) => {
    clear(sidebar);
    sidebar.appendChild(el('p', { class: 'px-4 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500' }, 'System'));
    SETTINGS_TABS.forEach(tab => {
        const isActive = currentTab === tab.id;
        const btn = el('button', {
            onclick: () => { currentTab = tab.id; onUpdate(); },
            class: `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
            }`
        }, [
            icon(tab.icon, 'w-4 h-4'),
            el('span', { class: 'text-sm font-bold' }, tab.label)
        ]);
        sidebar.appendChild(btn);
    });
};

const renderActiveTab = (onRefresh) => {
    const tabInfo = SETTINGS_TABS.find(t => t.id === currentTab);
    const header = el('div', { class: 'mb-8 border-b border-white/5 pb-6' }, [
        el('h2', { class: 'text-3xl font-black tracking-tight' }, tabInfo.label),
        el('p', { class: 'text-gray-500 mt-1 text-sm' }, tabInfo.desc)
    ]);
    const form = el('form', { id: 'settings-form', class: 'space-y-6' });
    if (currentTab === 'general') {
        form.append(
            InputGroup('Website Title', 'siteTitle', configData.siteTitle),
            InputGroup('Meta Description', 'siteDescription', configData.siteDescription, 'textarea'),
            el('div', { class: 'p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between' }, [
                el('div', {}, [
                    el('p', { class: 'font-bold text-sm' }, 'Maintenance Mode'),
                    el('p', { class: 'text-xs text-gray-500' }, 'Hide site from public view')
                ]),
                el('input', { 
                    type: 'checkbox', 
                    name: 'maintenanceMode',
                    id: 'maintenanceMode',
                    checked: configData.maintenanceMode,
                    class: 'w-10 h-6 rounded-full appearance-none bg-gray-700 checked:bg-blue-500 relative transition-all cursor-pointer before:content-[""] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-1 before:left-1 checked:before:left-5 before:transition-all'
                })
            ])
        );
    } else if (currentTab === 'services') {
        form.append(
            InputGroup('Google Analytics ID', 'gaId', configData.gaId, 'text', 'G-XXXXXXXXXX'),
            el('div', { class: 'p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-4 items-start' }, [
                icon('info', 'text-blue-400 w-5 h-5 shrink-0'),
                el('p', { class: 'text-xs text-blue-300 leading-relaxed' }, 'Analytics changes may take up to 24 hours to reflect in your dashboard.')
            ])
        );
    } else if (currentTab === 'security') {
        form.append(
            el('div', { class: 'space-y-4' }, [
                el('p', { class: 'text-sm text-gray-400' }, `Authenticated as: ${currentUser.email}`),
                el('button', {
                    type: 'button',
                    onclick: handlePasswordReset,
                    class: 'w-full py-4 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl text-xs font-bold transition-all border border-red-500/20'
                }, 'Send Password Reset Email')
            ])
        );
    }
    const saveButton = el('button', {
        type: 'button',
        onclick: () => handleSave(onRefresh),
        disabled: isSaving,
        class: `w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`
    }, [
        isSaving ? icon('loader-2', 'animate-spin w-5 h-5') : icon('save', 'w-5 h-5'),
        isSaving ? 'Saving Changes...' : 'Save Configuration'
    ]);
    form.appendChild(saveButton);
    return el('div', {}, [header, form]);
};
const handleSave = async (onRefresh) => {
    if (isSaving) return;
    const form = document.getElementById('settings-form');
    if (!form) return;
    const formData = new FormData(form);
    if (currentTab === 'general') {
        configData.siteTitle = formData.get('siteTitle');
        configData.siteDescription = formData.get('siteDescription');
        configData.maintenanceMode = document.getElementById('maintenanceMode')?.checked || false;
    } else if (currentTab === 'services') {
        configData.gaId = formData.get('gaId');
    }
    isSaving = true;
    onRefresh();
    try {
        saveConfig(configData);
        alertMessage('Configuration updated successfully', 'success');
    } catch (err) {
        alertMessage('Failed to save configuration', 'error');
    } finally {
        isSaving = false;
        onRefresh();
    }
};

const alertMessage = (message, type = 'info') => {
    const isSuccess = type === 'success';
    const alertDiv = el('div', { 
        class: `fixed bottom-10 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl shadow-2xl z-[100] transition-all duration-500 transform translate-y-0 flex items-center gap-4 border backdrop-blur-md ${
            isSuccess ? 'bg-emerald-500/90 text-white border-emerald-400/50' : 'bg-red-500/90 text-white border-red-400/50'
        }` 
    }, [
        icon(isSuccess ? 'check-circle' : 'alert-circle', 'w-5 h-5'),
        el('span', { class: 'font-bold text-sm tracking-tight' }, message)
    ]);
    document.body.appendChild(alertDiv);
    if (window.lucide) window.lucide.createIcons();
    setTimeout(() => {
        alertDiv.classList.add('opacity-0', 'translate-y-4');
        setTimeout(() => alertDiv.remove(), 500);
    }, 3000);
};