import { clear, el, icon, InputGroup, mount } from '../../utils/dom.js';
import { saveResumeData } from '../../services/data.js';
import { SECTION_ORDER, SECTION_SCHEMAS } from './schema.js';
import { openMediaManager } from './media.js';

let resumeData = null;
let editMode = 'form';
let activeTab = 'identity';
const editorId = 'editor-view';
const sidebarId = 'editor-nav';

window.addEventListener('open-media-library', (e) => {
    openMediaManager(e.detail);
});

export const renderEditor = (data) => {
    resumeData = data;
    const sidebar = el('aside', { id:sidebarId, class: 'w-full md:w-64 space-y-1' });
    const contentArea = el('div', { id: editorId, class: 'flex-1 bg-gray-900 rounded-[2rem] p-8 md:p-10' });
    renderSidebar(sidebar);
    contentArea.appendChild(renderActiveSection());
    return el('div', { class: 'flex flex-col md:flex-row gap-8 animate-in slide-in-from-left-4 duration-500' }, [
        sidebar,
        contentArea    
    ]);
};
const renderSidebar = (sidebar) => {
    clear(sidebar);
    sidebar.appendChild(el('p', { class: 'px-4 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600' }, 'Content Section'));
    SECTION_ORDER.forEach(key => {
        if(SECTION_SCHEMAS[key]) sidebar.appendChild(renderTabLink(key, sidebar));
    });
}
const renderTabLink = (key, sidebar) => {
    const section = SECTION_SCHEMAS[key];
    const isActive = activeTab === key;
    return el('button', {
        onclick: () => {  activeTab = key; renderSidebar(sidebar); refreshContent(); },
        class: `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${
            isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
        }`
    }, [
        icon(section.icon, `w-4 h-4 ${isActive ? 'text-white' : 'group-hover:text-blue-400'}`),
        el('span', { class: 'text-sm font-bold' }, section.label)
    ]);
};
const refreshContent = () => {
    const slot = document.getElementById(editorId);
    if (slot) {
        clear(slot);
        slot.appendChild(renderActiveSection());
        if (window.lucide) window.lucide.createIcons();
    }
};
const renderActiveSection = () => {
    const schema = SECTION_SCHEMAS[activeTab];
    if (!schema) return el('div', {}, 'Section schema not found.');
    const header = el('div', { class: 'flex justify-between items-center mb-6' }, [
        el('div', {}, [
            el('h2', { class: 'text-2xl font-black capitalize' }, schema.title || schema.label),
            el('p', { class: 'text-sm text-gray-500' }, `Manage ${activeTab} data and structure.`)
        ]),
        el('div', { class: 'flex bg-black/40 p-1 rounded-lg border border-white/5' }, [
            renderModeBtn('form', 'layout'),
            renderModeBtn('json', 'code')
        ])
    ]);
    const form = el('form', {
        onsubmit: handleSave,
        class: 'space-y-6 animate-in fade-in slide-in-from-right-2 duration-300'
    }, [
        editMode === 'json' ? renderJsonEditor() : renderDynamicFields(schema),
        el('button', {
            type: 'submit',
            class: 'w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2'
        }, [icon('save', 'w-4 h-4'), 'Save Changes'])
    ]);
    if (window.lucide) window.lucide.createIcons();
    return el('div', {}, [header, form]);
};
const renderModeBtn = (mode, iconName) => {
    const isActive = editMode === mode;
    return el('button', {
        type: 'button',
        onclick: () => { editMode = mode; refreshContent(); },
        class: `px-3 py-1.5 rounded-md flex items-center gap-2 transition-all ${
            isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
        }`
    }, [icon(iconName, 'w-3.5 h-3.5'), el('span', { class: 'text-[10px] font-bold uppercase' }, mode)]);
};
const renderJsonEditor = () => {
    const data = resumeData[activeTab];
    return el('textarea', { 
        name: 'jsonPayload',
        class: 'w-full h-[500px] bg-gray-950 font-mono text-xs text-blue-300 p-6 rounded-2xl border border-white/10 outline-none focus:border-blue-500 transition-all'
    }, JSON.stringify(data, null, 4));
};
const renderDynamicFields = (schema) => {
    if (schema !== null) {
        if(schema.fields) {
            let fields = [];
            schema.fields.forEach(field => {fields.push(renderField(field));});
            return el('div', { class: 'space-y-6' }, fields);
        }
    }
    return el('p', { class: 'text-red-500' }, 'Unsupported data format');
};
const renderField = (field, parentValue = null) => {
    let value = parentValue ? parentValue[field.path] : getDeepValue(resumeData, field.path);
    if(( !value || value === null) && field.value) value = field.value; 
    if (field.type === 'list') return renderListField(field, value);
    const inputGroup = InputGroup(field.label, field.path, value || '', field.type, field.placeholder || '', {
        isIcon: field.isIcon,
        isMedia: field.isMedia
    });
    const input = inputGroup.querySelector('input, textarea');
    if (input) {
        input.addEventListener('blur', () => {
            const error = validateField(input.value, field);
            if (error) {
                input.classList.add('border-red-500/50', 'bg-red-500/5');
                input.title = error;
            } else {
                input.classList.remove('border-red-500/50', 'bg-red-500/5');
                input.title = '';
            }
        });
    }
    return inputGroup;
};
const renderListField = (field, items = []) => {
    const listContainer = el('div', { class: 'space-y-4 pt-4 border-t border-white/5' }, [
        el('div', { class: 'flex justify-between items-center' }, [
            el('label', { class: 'text-xs font-bold text-blue-400 uppercase tracking-widest' }, field.label),
            el('button', { 
                type: 'button',
                onclick: (e) => addItemToList(e, field),
                class: 'p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-all'
            }, [icon('plus', 'w-4 h-4')])
        ])
    ]);
    const itemsGrid = el('div', { class: 'grid gap-4' });
    (items || []).forEach((item, idx) => {
        const itemCard = el('div', { class: 'bg-white/5 p-6 rounded-2xl border border-white/5 relative group' }, [
            el('button', {
                type: 'button',
                onclick: () => { items.splice(idx, 1); setDeepValue(resumeData, field.path, items); updateActiveSection(); },
                class: 'absolute top-4 right-4 p-2 text-gray-500 hover:text-red-400 transition-colors'
            }, [icon('trash-2', 'w-4 h-4')]),
            el('div', { class: 'grid grid-cols-1 gap-4' }, 
                field.fields.map(subField => {
                    const name = `${field.path}[${idx}].${subField.path}`;
                    return InputGroup(subField.label, name, item[subField.path], subField.type, '', subField);
                })
            )
        ]);
        itemsGrid.appendChild(itemCard);
    });
    listContainer.appendChild(itemsGrid);
    return listContainer;
};
const addItemToList = (e, field) => {
    const currentList = getDeepValue(resumeData, field.path) || [];
    const newItem = {};
    field.fields.forEach(f => newItem[f.path] = "");
    currentList.push(newItem);
    setDeepValue(resumeData, field.path, currentList);
    updateActiveSection();
};
const updateActiveSection = () => {
    const container = document.getElementById(editorId);
    if (!container) return;
    clear(container);
    container.appendChild(renderActiveSection());
    if (window.lucide) window.lucide.createIcons();
};
const getDeepValue = (obj, path) => {
  return path.replace(/\[(\d+)\]/g, '.$1').split('.').reduce((acc, part) => acc?.[part], obj);
};
const setDeepValue = (obj, path, value) => {
    const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
    console.log("Keys", keys);
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = isNaN(keys[i + 1]) ? {} : [];
        current = current[keys[i]];
    }
    const lastKey = keys[keys.length - 1];
    const trimmed = typeof value === 'string' ? value.trim() : value;
    if (lastKey === 'paragraphs' && typeof trimmed === 'string' ) {
        if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
            try {
                current[lastKey] = JSON.parse(trimmed); return;
            } catch (e) { }
        }
        current[lastKey] = trimmed.split('\n') .map(line => line.trim()).filter(line => line.length > 0);
    }  else {
        current[lastKey] = trimmed;
    }
};
const validateField = (value, field) => {
    const trimmed = typeof value === 'string' ? value.trim() : value;
    if (field.required && !trimmed) return "This field is required";
    if (trimmed) {
        if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Invalid email format";
        if (field.type === 'url' && !/^https?:\/\//.test(trimmed)) return "Invalid URL (must start with http/https)";
        if (field.isJson) {
            try { JSON.parse(trimmed); } 
            catch (e) { return "Invalid JSON format"; }
        }
    }
    return null;
};
const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    if (!validateForm(e.target, formData)) return;
    btn.disabled = true;
    btn.innerText = 'Saving...';
    try {
        const fullUpdate = JSON.parse(JSON.stringify(resumeData));
        if (editMode === 'json') {
            try {
                const updatedSection = JSON.parse(formData.get('jsonPayload'));
                fullUpdate[activeTab] = updatedSection;
            } catch {
                alertMessage('Invalid JSON format', 'error');
                return;
            }
        } else {
            for (let [path, value] of formData.entries()) {
                if (path === 'jsonPayload') continue;
                setDeepValue(fullUpdate, path, value);
            }
        }
        await saveResumeData("resume", fullUpdate); 
        Object.assign(resumeData, fullUpdate)
        alertMessage('Changes synchronized with Cloud Storage', 'success');
    } catch (err) {
        console.error(err);
        alertMessage('Update failed: ' + err.message, 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
        if (window.lucide) window.lucide.createIcons();
    }
};
const validateForm = (form, formData) => {
    let hasErrors = false;
    if (editMode === 'form') {
        const schema = SECTION_SCHEMAS[activeTab];
        schema.fields.forEach(field => {
            if (field.type === 'list') return;
            const val = formData.get(field.path);
            const error = validateField(val, field);
            const input = form.querySelector(`[name="${field.path}"]`);
            if (error) {
                input?.classList.add('border-red-500/50', 'bg-red-500/5');
                input.title = error;
                hasErrors = true;
            } else {
                input?.classList.remove('border-red-500/50', 'bg-red-500/5');
                input.title = '';
            }
        });
    }
    if (hasErrors) {
        alertMessage('Please correct highlighted errors.', 'error');
        return false;
    }
    return true;
}
const alertMessage = (message, type = 'info') => {
    const isSuccess = type === 'success';
    const alertDiv = el('div', { 
        class: `fixed bottom-10 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl shadow-2xl z-[100] transition-all duration-500 transform translate-y-0 flex items-center gap-4 border backdrop-blur-md ${
            isSuccess ? 'bg-emerald-500/90 text-white border-emerald-400/50' : 'bg-red-500/90 text-white border-red-400/50'
        }` 
    }, [
        icon(isSuccess ? 'check-circle' : 'alert-circle', 'w-6 h-6'),
        el('span', { class: 'text-sm font-bold tracking-tight' }, message)
    ]);
    document.body.appendChild(alertDiv);
    setTimeout(() => {
        alertDiv.classList.add('opacity-0', 'translate-y-8');
        setTimeout(() => alertDiv.remove(), 500);
    }, 4000);
};
