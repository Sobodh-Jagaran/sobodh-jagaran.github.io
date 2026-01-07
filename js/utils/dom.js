export const el = (tag, props = {}, children = []) => {
    const element = document.createElement(tag);
    Object.entries(props).forEach(([key, value]) => {
        if (key === 'className' || key === 'class') {
            element.className = value;
        } else if (key === 'style' && typeof value === 'object') {
            Object.assign(element.style, value);
        } else if (key.startsWith('on') && typeof value === 'function') {
            const eventName = key.toLowerCase().substring(2);
            element.addEventListener(eventName, value);
        } else {
            element.setAttribute(key, value);
        }
    });
    if (Array.isArray(children)) {
        children.forEach(child => {
            if (child) element.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
        });
    } else if (typeof children === 'string' || typeof children === 'number') {
        element.textContent = children;
    } else if (children instanceof HTMLElement) {
        element.appendChild(children);
    }
    return element;
};

export const icon = (iconName, className = '') => {
    return el('i', { 'data-lucide': iconName, class: `${className}`  });
};

export const InputGroup = (label, name, value, type = 'text', placeholder = '', options = {}) => {
    const inputId = `input-${name.replace(/\./g, '-')}`;
    const isMedia = options.isMedia || type === 'file';
    const isTextArea = type === 'textarea';
    const actualType = isMedia ? 'hidden' : type;
    const inputProps = {
        id: inputId,
        name: name,
        placeholder: placeholder,
        class: `w-full bg-gray-950/50 border border-gray-800/50 text-gray-200 text-xs px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-mono ${
            isTextArea ? 'min-h-[100px] resize-y' : ''
        } ${isMedia ? 'cursor-pointer pr-12' : ''}`
    };
    if (!isTextArea) {
        inputProps.type = actualType;
        inputProps.value = value || '';
        if (isMedia) inputProps.readonly = 'true';
    }
    const inputEl = el(
        isTextArea ? 'textarea' : 'input', 
        inputProps, 
        isTextArea ? (value || '') : []
    );
    if (isMedia) {
        inputEl.onclick = () => {
            window.dispatchEvent(new CustomEvent('open-media-library', { detail: { target: inputEl } }));
        };
    }
    let iconPreview = null;
    if (options.isIcon || name.toLowerCase().includes('icon')) {
        iconPreview = el('div', { class: 'absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center min-w-[34px] h-[34px]' }, [
            icon(value || 'help-circle', 'w-4 h-4 text-blue-400')
        ]);
        inputEl.addEventListener('input', (e) => {
            clear(iconPreview);
            iconPreview.appendChild(icon(e.target.value || 'help-circle', 'w-4 h-4 text-blue-400'));
            if (window.lucide) window.lucide.createIcons();
        });
    }
    let mediaPicker = null;
    if (isMedia) mediaPicker = MediaInput(name, value || '', options);
    return el('div', { class: 'space-y-2' }, [
        el('div', { class: 'flex justify-between items-center px-1' }, [
            el('label', { for: inputId, class: 'text-[10px] font-black text-gray-500 uppercase tracking-widest' }, label),
            options.required ? el('span', { class: 'text-[8px] text-red-500 font-bold' }, 'REQUIRED') : null
        ]),
        el('div', { class: 'relative group' }, [
            inputEl,
            iconPreview,
            mediaPicker
        ])
    ]);
};

export const MediaInput = (name, value = '', options = {}) => {
    const inputId = `input-${name.replace(/\./g, '-')}`;
    const hiddenInput = el('input', { type: 'hidden', name, value: value || '' });
    let preview = getMediaPreview(value);
    const previewSlot = el('div', {}, [preview]);
    const button = el('button', {
        type: 'button',
        class: 'flex items-center gap-4 p-3 rounded-xl bg-black/40 border border-white/10 hover:border-white/30 transition-all',
        onclick: () => {
            window.dispatchEvent(new CustomEvent('open-media-library', {
                detail: {
                    onSelect: (asset) => {
                        hiddenInput.value = asset.src;
                        clear(previewSlot);
                        previewSlot.appendChild(getMediaPreview(asset.src));
                        if (window.lucide) window.lucide.createIcons();
                    }
                }
            }));
        }
    }, [
        previewSlot,
        el('span', { class: 'text-xs text-gray-300 font-bold uppercase tracking-widest' }, 'Choose media')
    ]);
    setTimeout(() => { if (window.lucide) window.lucide.createIcons(); }, 0);
    return el('div', { class: 'space-y-2' }, [
        button,
        hiddenInput
    ]);
};
const getMediaPreview = (src) => {
    if (!src) return icon('image', 'w-6 h-6 text-gray-500');
    const cleanSrc = src.split('?')[0].split('#')[0];
    const ext = cleanSrc.split('.').pop().toLowerCase();
    if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)) return el('img', { src, class: 'w-20 h-20 object-cover rounded-xl'  });
    const iconMap = {
        pdf: 'file-text',
        doc: 'file-text',
        docx: 'file-text',
        ppt: 'presentation',
        pptx: 'presentation',
        xls: 'table',
        xlsx: 'table'
    };
    return el('div', {
        class: 'w-20 h-20 rounded-xl bg-gray-800 flex items-center justify-center text-blue-400'
    }, [
        icon(iconMap[ext] || 'file', 'w-8 h-8'),
        el('span', { class: 'text-[9px] uppercase tracking-widest text-gray-400' }, ext)
    ]);
};


export const clear = (element) => {
    if (element) element.innerHTML = '';
};

export const mount = (rootId, content) => {
    const root = document.getElementById(rootId);
    if (root) {
        clear(root);
        root.appendChild(content);
        if (window.lucide) window.lucide.createIcons();
    }
};