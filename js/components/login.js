import { clear, el, icon, mount } from '../utils/dom.js';
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { navigateTo } from '../services/router.js';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

export const renderLoginView = (root) => {
    clear(root);
    root.className = "min-h-screen w-full flex items-center justify-center bg-gray-950 p-4";
    const loginCard = el('div', { 
        class: 'bg-gray-900 p-8 rounded-xl border border-blue-500/20 shadow-2xl w-full max-w-md' 
    }, [
        icon('shield-check', 'text-blue-400 w-12 h-12 mb-4 mx-auto block'),
        el('h2', { class: 'text-2xl font-bold text-white text-center' }, 'Admin Login'),
        el('p', { class: 'text-gray-400 mt-2 text-center text-sm' }, 'Please sign in to access the admin portal.'),
        el('form', { 
                class: 'mt-6 space-y-4',  
                onsubmit: (e) => {
                    e.preventDefault();
                    const password = e.target.password.value; 
                    const btn = e.target.querySelector('button[type="submit"]');
                    const errorMsg = document.getElementById('login-error');
                    handleSignIn(password, btn, errorMsg);
                }
            }, [
            el('input', { 
                type: 'text', 
                name: 'username', 
                value: ADMIN_EMAIL,
                autocomplete: 'username',
                class: 'sr-only',
                readonly: true
            }),     
            el('div', {}, [
                el('label', { class: 'text-xs text-gray-500 uppercase font-bold ml-1' }, 'Password/Pin'),
                el('input', { 
                    name: 'password',
                    type: 'password', 
                    placeholder: '••••••••', 
                    required: true,
                    autocomplete: 'current-password',
                    class: 'w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 outline-none transition mt-1' 
                }),
            ]),
            el('div', { 
                id: 'login-error', 
                class: 'hidden text-red-400 text-xs text-center bg-red-400/10 py-2 rounded border border-red-400/20' 
            }, ''),
            el('button', {
                type: 'submit', 
                class: 'w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-900/20 transition-all transform active:scale-95',
            }, 'Sign In'),
        ]),

        el('button', {
            class: 'w-full mt-4 text-gray-500 text-xs hover:text-gray-300 transition',
            onclick: () => navigateTo('/')
        }, 'Return to Portfolio')
    ]);
    mount(root.getAttribute('id'), loginCard);
};

async function handleSignIn(password, submitBtn, errorElement) {
    const auth = getAuth();
    errorElement.classList.add('hidden');
    submitBtn.disabled = true;
    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'Verifying...';
    try {
        await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
        console.log("Login successful");
        navigateTo('/admin');
    } catch (error) {
        console.error("Login Error:", error.code, error.message);
        submitBtn.disabled = false;
        submitBtn.innerText = originalText;
        errorElement.innerText = "Invalid PIN. Access Denied.";
        errorElement.classList.remove('hidden');
        const form = errorElement.closest('form');
        if (form) form.pin.value = '';
    }
}