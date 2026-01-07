import { el, icon, clear } from '../../utils/dom.js';

export const renderDashboard = async (resumeData, config, currentUser) => {
    let dbStatus = 'checking';
    dbStatus = (config !== null) ? 'connected' : 'eror';
    const container = el('div', { class: 'space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700' });
    const header = el('div', { class: 'flex flex-col md:flex-row justify-between items-start md:items-center gap-4' }, [
        el('div', {}, [
            el('h1', { class: 'text-4xl font-black tracking-tight text-white' }, `System Overview`),
            el('p', { class: 'text-gray-500 mt-1' }, `Welcome back. Here is what is happening with your portfolio today.`)
        ]),
        el('div', { 
            class: `flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                config.maintenanceMode 
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' 
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
            }` 
        }, [
            el('span', { class: `w-2 h-2 rounded-full animate-pulse ${config.maintenanceMode ? 'bg-amber-500' : 'bg-emerald-500'}` }),
            el('span', { class: 'text-xs font-bold uppercase tracking-widest' }, 
                config.maintenanceMode ? 'Maintenance Mode Active' : 'Systems Operational'
            )
        ])
    ]);
    const statsGrid = el('div', { class: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4' }, [
        renderStatCard('Live Projects', resumeData.projects?.items?.length || 0, 'briefcase', 'blue'),
        renderStatCard('Experience', `${resumeData.experience?.items?.length || 0} Roles`, 'award', 'purple'),
        renderStatCard('Capabilities', resumeData.capabilities?.items?.length || 0, 'cpu', 'emerald'),
        renderStatCard('Media Assets', 'Library Active', 'image', 'rose')
    ]);
    const bodyGrid = el('div', { class: 'grid grid-cols-1 xl:grid-cols-3 gap-8' }, [
        el('div', { class: 'xl:col-span-2 space-y-6' }, [
            el('div', { class: 'bg-gray-900 border border-white/10 rounded-[2.5rem] p-8 md:p-10' }, [
                el('div', { class: 'flex justify-between items-center mb-8' }, [
                    el('h3', { class: 'text-xl font-bold flex items-center gap-3' }, [
                        icon('activity', 'text-blue-400 w-5 h-5'),
                        'System Diagnostics'
                    ]),
                    el('span', { class: 'text-[10px] font-mono text-gray-500' }, 'REFRESHING LIVE')
                ]),
                el('div', { class: 'grid grid-cols-1 md:grid-cols-2 gap-4' }, [
                    renderDiagnosticItem(
                        'Database Connection', 
                        dbStatus === 'connected' ? 'Stable handshake with Realtime Database' : 'Awaiting connection...',
                        dbStatus === 'connected' ? 'success' : 'warning'
                    ),
                    renderDiagnosticItem(
                        'Authentication', 
                        `Verified as ${currentUser?.email?.split('@')[0]}`,
                        'success'
                    ),
                    renderDiagnosticItem(
                        'Media Delivery', 
                        'Cloud storage resolution active',
                        'success'
                    ),
                    renderDiagnosticItem(
                        'Global Config', 
                        config.gaId ? `Analytics routing via ${config.gaId}` : 'Tracking ID missing in settings',
                        config.gaId ? 'success' : 'warning'
                    )
                ])
            ])
        ]),
        el('div', { class: 'space-y-6' }, [
            el('div', { class: 'bg-blue-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group' }, [
                el('div', { class: 'relative z-10' }, [
                    el('h3', { class: 'text-xl font-bold mb-2' }, 'Setup Checklist'),
                    el('p', { class: 'text-blue-100 text-xs mb-8' }, 'Optimization tasks for your site.'),
                    el('div', { class: 'space-y-4' }, [
                        renderCheckItem('Complete Resume Bio', !!resumeData?.summary),
                        renderCheckItem('Set GA Tracking ID', !!config.gaId),
                        renderCheckItem('Portfolio Image Set', !!resumeData?.identity?.hero),
                        renderCheckItem('Live Mode (Public)', !config.maintenanceMode),
                    ])
                ]),
                icon('shield-check', 'absolute -bottom-6 -right-6 w-40 h-40 text-white/10 -rotate-12 transition-transform group-hover:rotate-0 duration-700')
            ]),
            el('div', { class: 'bg-gray-900 border border-white/10 rounded-[2rem] p-6' }, [
                el('div', { class: 'flex items-center gap-4' }, [
                    el('div', { class: 'w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-500 border border-white/20' }),
                    el('div', {}, [
                        el('p', { class: 'text-[10px] font-black text-gray-500 uppercase tracking-widest' }, 'Admin Access'),
                        el('p', { class: 'text-xs font-bold text-white' }, currentUser?.email)
                    ])
                ])
            ])
        ])
    ]);
    container.append(header, statsGrid, bodyGrid);
    return container;
};
const renderStatCard = (label, value, iconName, colorName) => {
    const themes = {
        blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
        purple: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
        emerald: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
        rose: 'text-rose-400 bg-rose-400/10 border-rose-400/20'
    };

    return el('div', { class: 'bg-gray-900 border border-white/10 rounded-[2rem] p-6 flex items-center gap-5 hover:bg-white/[0.04] transition-all group' }, [
        el('div', { class: `p-4 rounded-2xl border transition-all group-hover:scale-110 ${themes[colorName]}` }, [
            icon(iconName, 'w-6 h-6')
        ]),
        el('div', {}, [
            el('p', { class: 'text-[10px] font-black text-gray-500 uppercase tracking-widest' }, label),
            el('p', { class: 'text-2xl font-black text-white' }, value)
        ])
    ]);
};
const renderDiagnosticItem = (title, status, type) => {
    const isSuccess = type === 'success';
    return el('div', { class: 'p-5 rounded-2xl bg-white/5 border border-white/5' }, [
        el('div', { class: 'flex items-center justify-between mb-2' }, [
            el('h4', { class: 'text-xs font-bold text-gray-300' }, title),
            el('div', { class: `w-1.5 h-1.5 rounded-full ${isSuccess ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'}` })
        ]),
        el('p', { class: 'text-[11px] text-gray-500' }, status)
    ]);
};
const renderActivityItem = (title, desc, time) => {
    return el('div', { class: 'flex gap-6' }, [
        el('div', { class: 'relative flex flex-col items-center' }, [
            el('div', { class: 'w-3 h-3 rounded-full bg-blue-500 z-10 shadow-[0_0_15px_rgba(59,130,246,0.6)]' }),
            el('div', { class: 'w-[1px] h-full bg-white/5 absolute top-3' })
        ]),
        el('div', { class: 'flex-1 pb-2' }, [
            el('div', { class: 'flex justify-between items-start mb-1' }, [
                el('h4', { class: 'text-sm font-bold text-gray-200' }, title),
                el('span', { class: 'text-[9px] font-mono text-gray-600 bg-white/5 px-2 py-0.5 rounded-md' }, time)
            ]),
            el('p', { class: 'text-xs text-gray-500 leading-relaxed' }, desc)
        ])
    ]);
};

const renderCheckItem = (text, isDone) => {
    return el('div', { class: 'flex items-center gap-3' }, [
        el('div', { 
            class: `w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                isDone ? 'bg-white border-white' : 'bg-transparent border-white/20'
            }` 
        }, [
            isDone ? icon('check', 'w-3 h-3 text-blue-600') : null
        ]),
        el('span', { class: `text-xs font-bold ${isDone ? 'text-white/40 line-through' : 'text-white'}` }, text)
    ]);
};