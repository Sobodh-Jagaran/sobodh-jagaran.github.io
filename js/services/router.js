export const handleRouting = (currentUser) => {
    const route = getRoute();
    if (currentUser === undefined) return route;
    if (currentUser === null) {
        if (route === 'admin') {
            window.history.replaceState({}, '', '/admin/login');
            return 'login';
        }
        return route;
    }
    if (route === 'login') {
        window.history.replaceState({}, '', '/admin');
        return 'admin';
    }
    return route;
};

export const getRoute = () => {
    const path = window.location.pathname.toLowerCase();
    if (path === '/admin/login' || path === '/admin/login/') return 'login';
    if (path.startsWith('/admin')) return 'admin';
    return 'portfolio';
};

export const navigateTo = (path) => {
    if (window.location.pathname.toLowerCase() === path.toLowerCase()) return;
    window.history.pushState({}, '', path);
    window.dispatchEvent(new CustomEvent('appnavigation'));
};