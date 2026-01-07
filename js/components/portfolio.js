import { clear, el, mount } from '../utils/dom.js';

export const renderPortfolio = (root, data) => {
    clear(root);
    if (!data) {
        const loading = el('div', {
            class:"text-center p-10 text-gray-500"
        } ["Loading portfolio data..."]);
        mount(root.getAttribute('id'), loading);
        return;
    }
    renderHeader(root,data);
    renderContent(root, data)
    renderFooter(root, data);
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    } else {
        console.warn("Lucide icons library not loaded or function not available.");
    }
}
const renderHeader = (root, data) => {
    const headerRoot = el('header', { class: 'bg-gray-950 text-white shadow-2xl shadow-blue-500/20 pt-6 pb6' });
    headerRoot.id = 'header-root';
    headerRoot.innerHTML = ''; 
    if (!data || !data.identity) return;
    const heroData = data.identity.hero;
    const contact = data.identity.contact;
    const container = el('div', { class: 'max-w-6xl mx-auto p-2 md:p-4' });
    const gridContainer = el('div', { class: 'grid grid-cols-1 lg:grid-cols-12 items-center text-center' });
    const logoCol = el('div', { class: 'hidden lg:col-span-2 lg:flex justify-start items-center' });
    const logoContainer = el('div', { class: 'flex justify-center mb-6' });
    const logo = el('img', { class: 'w-32 h-32 rounded-full border-4 border-blue-500 shadow-xl object-cover transform hover:scale-105 transition duration-300' });
    logo.src = 'assets/logo_solid.png';
    logo.alt = `${heroData.title} Logo`;
    logoContainer.appendChild(logo);
    logoCol.appendChild(logoContainer);
    gridContainer.appendChild(logoCol);
    const contextCol = el('div', { class: 'col-span-1 lg:col-span-8' });
    const flexContainer = el('div', { class: 'flex flex-col md:flex-row justify-center items-start' });
    const heroInfo = el('div', '');
    heroInfo.appendChild(el('h1', { class: 'text-5xl font-extrabold tracking-widest text-blue-400 text-center' }, heroData.title));
    heroInfo.appendChild(el('p', { class: 'text-gray-300 text-2xl mt-2 text-center' }, heroData.subtitle));
    const slogan = el('p', { class: 'text-xl font-bold text-blue-200 uppercase tracking-widest text-center py-2 px-4' });
    slogan.textContent = heroData.slogan;
    heroInfo.appendChild(slogan);
    const contactInfo = el('div', { class: 'mt-2 mb-3 flex flex-col items-center justify-center' });
    const linkWrapper = el('div', { class: 'flex flex-wrap items-center justify-center gap-y-2' });
    const createContactLink = (icon, text, href) => {
        const a = el('a', { class: 'text-blue-200 hover:text-blue-300 transition duration-200 inline-flex items-center text-sm text-center' });
        a.href = href;
        a.innerHTML = `<i data-lucide="${icon}" class="w-4 h-4 text-blue-400 mr-2"></i> ${text}`;
        return a;
    };
    const contactLinks = [{ 
            icon: 'phone', 
            href: `tel:${contact.phone.replace(/[^\d\s+]/g, '')}`,
            display: `${contact.phone}` 
        }, { 
            icon: 'mail', 
            href: `mailto:${contact.email}`, 
            display: `${contact.email}` 
        }, { 
            icon: 'linkedin', 
            href: contact.linkedin, 
            display: contact.linkedin 
        },
    ];
    contactLinks.forEach((linkData, index) => {
        linkWrapper.appendChild(createContactLink(
            linkData.icon,  
            linkData.display,
            linkData.href
        ));
        if (index < contactLinks.length - 1) {
            const separator = el('span', { class: 'text-gray-700 text-sm font-light px-2' });
            separator.textContent = '|';
            linkWrapper.appendChild(separator);
        }
    });
    contactInfo.appendChild(linkWrapper);
    heroInfo.appendChild(contactInfo);
    const resumeLink = contact.resumeLink; 
    const resumeDownloadBtn = el('a', { class: 'mt-2 mb-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-sm shadow-xl shadow-blue-500/50 transition duration-300 transform hover:scale-105 inline-flex items-center' });
    resumeDownloadBtn.href = resumeLink;
    resumeDownloadBtn.setAttribute('download', 'Sobodh_Jagaran_Resume.pdf');
    resumeDownloadBtn.innerHTML = `<i data-lucide="download" class="w-5 h-5 mr-2"></i> DOWNLOAD RESUME`;
    heroInfo.appendChild(resumeDownloadBtn);
    flexContainer.appendChild(heroInfo);
    contextCol.appendChild(flexContainer);
    gridContainer.appendChild(contextCol);
    const avatarCol = el('div', { class: 'hidden lg:col-span-2 lg:flex justify-end items-center' }); 
    const avatar = el('img', { class: 'w-32 h-32 rounded-full border-4 border-blue-500 shadow-xl object-cover transform hover:scale-105 transition duration-300' });
    avatar.src = 'assets/profile_pic.png';
    avatar.alt = `${heroData.title} Avatar`;
    avatarCol.appendChild(avatar);
    gridContainer.appendChild(avatarCol);
    container.appendChild(gridContainer);
    headerRoot.appendChild(container);
    root.appendChild(headerRoot);
};
const renderContent = (root, data) => {
    const contentRoot = el('main', { class: 'max-w-6xl mx-auto p-3 md:p-5', id: 'content-root' });
    renderSummary(contentRoot, data),
    renderCapabilities(contentRoot, data),
    renderExperience(contentRoot, data),
    renderInsights(contentRoot, data),
    renderProjects(contentRoot, data)
    root.appendChild(contentRoot);
}
const renderSummary = (root, data) => {
    const summaryData = data.summary;
    const section = el('section', {'class': 'mt-8 mb-8 p-8 bg-[#161b22] rounded-sm shadow-2xl border-t-4 border-blue-500'});
    summaryData.paragraphs.forEach(pText => {
        const p = el('p', {'class': 'text-gray-400 leading-relaxed mb-4'});
        p.innerHTML = pText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        section.appendChild(p);
    });
    root.appendChild(section);
};
const renderCapabilities = (root, data) => {
    const capabilitiesData = data.capabilities;
    const section = createSection('capabilities');
    section.appendChild(createSectionHeader(data.capabilities.title, 'cpu'));
    const gridContainer = el('div', {'class': 'grid sm:grid-cols-1 lg:grid-cols-3 gap-6'});
    capabilitiesData.items.forEach(item => {
        const card = el('div', {'class': `bg-[#161b22] p-6 rounded-sm shadow-lg border-l-4 border-${item.color}`});
        card.innerHTML += `<i data-lucide="${item.icon}" class="w-6 h-6 text-${item.color.replace('500', '400')} mb-3"></i>`;
        card.appendChild(el('h3', {'class': 'text-xl font-semibold mb-3 text-white'}, item.title));
        const chipsContainer = el('div', {'class': 'flex flex-wrap'});
        item.skills.forEach(skill => {
            chipsContainer.appendChild(el('span', {'class': 'skill-chip'}, skill));
        });
        card.appendChild(chipsContainer);
        gridContainer.appendChild(card);
    });
    section.appendChild(gridContainer);
    root.appendChild(section);
};
const renderExperience = (root, data) => {
    const experienceData = data.experience;
    const section = createSection('experience');
    section.appendChild(createSectionHeader(data.experience.title, 'briefcase'));
    const card = el('div', {'class': 'experience-card rounded-sm'});
    const timeline = el('div', { class: 'relative ml-4 border-l border-gray-800 space-y-8' });
    experienceData.items.forEach((exp, index) => {
        const entry = el('div', { class: 'relative pl-8 mb-2' });
         if (index > 0) {
            const separator = el('div', { class: 'h-px w-full bg-gradient-to-r from-blue-500/20 via-transparent to-transparent' });
            timeline.appendChild(separator);
        }
        const dateTag = exp.tags.find(tag => /\d{4}/.test(tag)) || 'Present';
        const techTags = exp.tags.filter(tag => tag !== dateTag);
        const node = el('div', { 
            class: 'absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] z-10' 
        });
        const content = el('div', { class: 'group' });
        const header = el('div', { class: 'mb-4' }, [
            el('h3', { class: 'text-2xl font-bold text-white group-hover:text-blue-400 transition-colors' }, exp.title),
            el('div', { class: 'flex flex-wrap items-center gap-3 mt-2' }, [
                el('span', { class: 'text-blue-500 font-mono text-sm font-bold tracking-tight' }, exp.target),
                el('span', { class: 'w-1 h-1 rounded-full bg-gray-700' }),
                el('span', { class: 'bg-blue-600/10 text-blue-400 border border-blue-500/20 font-mono text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-widest' }, dateTag)
            ])
        ]);
        const description = el('div', { class: 'space-y-4 text-gray-400 text-sm leading-relaxed max-w-3xl' });
        exp.description.split('\n').filter(line => line.trim()).forEach(line => {
            const cleanLine = line.replace(/^\*\s*/, '');
            const p = el('p', { class: 'flex gap-3' });
            p.innerHTML = `<span class="text-blue-600 flex-shrink-0">▹</span> <span>${cleanLine.replace(/\*\*(.*?)\*\*/g, '<b class="text-gray-200">$1</b>')}</span>`;
            description.appendChild(p);
        });
        const tags = el('div', { class: 'mt-6 flex flex-wrap gap-2' });
        techTags.forEach(tag => {
            tags.appendChild(el('span', { class: 'text-[10px] font-mono border border-white/5 bg-white/5 px-2 py-0.5 rounded text-gray-500 uppercase' }, tag));
        });
        content.appendChild(header);
        content.appendChild(description);
        entry.appendChild(node);
        entry.appendChild(content);
        timeline.appendChild(entry);
    });
    card.appendChild(timeline)
    section.appendChild(card);
    root.appendChild(section);
};
const renderInsights = (root, data) => {
    const insightsData = data.insights;
    const section = createSection('insights');
    section.appendChild(createSectionHeader(data.insights.title, 'database'));;
    if (!insightsData.items || insightsData.items.length === 0) {
        const placeholder = el('div', {'class': 'p-12 bg-[#161b22] rounded-xl border-2 border-dashed border-gray-700 text-center flex flex-col items-center justify-center'});
        placeholder.innerHTML = `
            <i data-lucide="wrench" class="w-10 h-10 text-yellow-500 mb-4 animate-pulse"></i>
            <h3 class="text-2xl font-bold text-white mb-2">Architect's Log: Under Construction</h3>
            <p class="text-gray-400 max-w-md">The in-depth insights and articles on System Reliability and Software Architecture are planned for a future release. Check back soon for new content!</p>
        `;
        section.appendChild(placeholder);
        root.appendChild(section);
        return;
    }
    const accordionContainer = el('div', { class: 'space-y-2' });
    insightsData.items.forEach((insight, index) => {
        let isOpen = false;
        const itemWrap = el('div', { 
            class: 'group border border-gray-800 bg-[#161b22] overflow-hidden transition-all duration-300' 
        });
        const trigger = el('button', {
            class: 'w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors group-hover:border-blue-500/30',
            onclick: () => {
                isOpen = !isOpen;
                content.style.maxHeight = isOpen ? `${content.scrollHeight}px` : '0px';
                icon.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
                itemWrap.classList.toggle('border-blue-500/50', isOpen);
                itemWrap.classList.toggle('bg-blue-500/[0.02]', isOpen);
            }
        });
        const titleSection = el('div', { class: 'flex items-center gap-4' }, [
            el('span', { class: 'font-mono text-xs text-gray-600' }, (index + 1).toString().padStart(2, '0')),
            el('div', {}, [
                el('span', { class: 'block text-[9px] font-mono text-blue-400 uppercase tracking-tighter mb-1' }, insight.category || 'Documentation'),
                el('h3', { class: 'text-lg font-bold text-gray-200 group-hover:text-white transition-colors' }, insight.title)
            ])
        ]);
        const icon = el('i', { 
            'data-lucide': 'chevron-down', 
            class: 'w-5 h-5 text-gray-600 transition-transform duration-300' 
        });
        trigger.appendChild(titleSection);
        trigger.appendChild(icon);
        const content = el('div', {
            class: 'transition-all duration-300 ease-in-out',
            style: 'max-height: 0px; overflow: hidden;'
        }, [
            el('div', { class: 'p-6 pt-0 border-t border-gray-800/50 mt-2 flex flex-col md:flex-row gap-8' }, [
                el('div', { class: 'flex-1' }, [
                    el('p', { class: 'text-gray-400 text-sm leading-relaxed mb-6' }, insight.description),
                    el('div', { class: 'flex flex-wrap gap-4' }, [
                        el('div', { class: 'flex flex-col' }, [
                            el('span', { class: 'text-[9px] uppercase text-gray-600 font-mono' }, 'Read Time'),
                            el('span', { class: 'text-xs text-gray-300' }, insight.readTime || '5 min')
                        ]),
                        el('div', { class: 'flex flex-col' }, [
                            el('span', { class: 'text-[9px] uppercase text-gray-600 font-mono' }, 'Last Updated'),
                            el('span', { class: 'text-xs text-gray-300' }, '2023.Q4')
                        ])
                    ])
                ]),
                el('div', { class: 'md:w-48 flex items-end' }, [
                    el('a', {
                        href: insight.article || '#',
                        class: 'w-full py-3 px-4 bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white border border-blue-500/20 text-center text-[10px] font-bold tracking-widest uppercase transition-all'
                    }, 'Open Full Log')
                ])
            ])
        ]);
        itemWrap.appendChild(trigger);
        itemWrap.appendChild(content);
        accordionContainer.appendChild(itemWrap);
    });
    section.appendChild(accordionContainer);
    root.appendChild(section);
}
const renderProjects = (root, data) => {
    const projectsData = data.projects;
    const section = createSection('projects');
    section.appendChild(createSectionHeader(data.projects.title, 'layout'));
    if (!projectsData.items || projectsData.items.length === 0) {
        const placeholder = el('div', {'class': 'p-12 bg-[#161b22] rounded-xl border-2 border-dashed border-gray-700 text-center flex flex-col items-center justify-center'});
        placeholder.innerHTML = `
            <i data-lucide="blocks" class="w-10 h-10 text-red-500 mb-4 animate-pulse"></i>
            <h3 class="text-2xl font-bold text-white mb-2">Project Highlights: Coming Soon</h3>
            <p class="text-gray-400 max-w-md">Detailed case studies demonstrating precision, stability, and architectural clarity are being prepared. This section will feature my most impactful, mission-critical solutions.</p>
        `;
        section.appendChild(placeholder);
        root.appendChild(section);
        return;
    }
    const carouselWrapper = el('div', {'class': 'relative'});
    const carouselInner = el('div', {'class': 'flex transition-transform duration-500 ease-in-out'});
    carouselInner.id = 'projects-carousel-inner';
    projectsData.items.forEach((project, index) => {
        const card = el('div', {'class': 'min-w-full section-card p-6 opacity-0 transition-opacity duration-500'});
        card.setAttribute('data-slide-index', index);
        const tagsContainer = el('div', {'class': 'mb-3 flex flex-wrap justify-end'});
        const tags = (typeof project.tags === 'string') ? project.tags.split(',').map(tag => tag.trim()) : [];
        tags.forEach(tag => {
            if (tag) tagsContainer.appendChild(el('span', {'class': 'date-chip'}, tag));
        });
        card.appendChild(tagsContainer);
        const headerFlex = el('div', {'class': 'flex items-center mb-3'});
        headerFlex.innerHTML = `<i data-lucide="${project.icon}" class="w-6 h-6 text-blue-400 mr-3"></i>`;
        headerFlex.appendChild(el('h3', {'class': 'text-2xl font-bold text-white'}, project.title));
        card.appendChild(headerFlex);
        card.appendChild(el('p', {'class': 'text-sm text-blue-500 mb-4 font-semibold'}, project.target));
        const listContainer = el('div', {'class': 'text-gray-400 leading-relaxed'});
        const ul = el('ul', {'class': 'list-disc ml-5 space-y-3'});
        const rawItems = project.description.split('\n').filter(item => item.trim().startsWith('*'));
        rawItems.forEach(itemText => {
            const cleanedText = itemText.replace(/^\*\s*/, '').trim();
            if (cleanedText) {
                const li = el('li', {'class': 'pl-1'});
                li.innerHTML = cleanedText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
                ul.appendChild(li);
            }
        });
        listContainer.appendChild(ul);
        card.appendChild(listContainer);
        carouselInner.appendChild(card);
    });
    carouselWrapper.appendChild(carouselInner);
    const navContainer = el('div', {'class': 'flex justify-between mt-4 space-x-4'});
    const prevBtn = el('button', {'class': 'nav-button px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition duration-200 flex items-center shadow-lg hover:shadow-xl disabled:opacity-50'});
    prevBtn.id = 'carousel-prev';
    prevBtn.innerHTML = '<i data-lucide="chevron-left" class="w-5 h-5 mr-1"></i> Previous Project';
    prevBtn.disabled = true;
    const nextBtn = el('button', {'class': 'nav-button px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition duration-200 flex items-center shadow-lg hover:shadow-xl disabled:opacity-50 ml-auto'});
    nextBtn.id = 'carousel-next';
    nextBtn.innerHTML = 'Next Project <i data-lucide="chevron-right" class="w-5 h-5 ml-1"></i>';
    if (projectsData.items.length <= 1)  nextBtn.disabled = true;
    navContainer.appendChild(prevBtn);
    navContainer.appendChild(nextBtn);
    section.appendChild(carouselWrapper);
    section.appendChild(navContainer);
    root.appendChild(section);
    let currentSlide = 0;
    const slides = data.items;
    const slideElements = carouselInner.children;
    if (slideElements.length > 0) {
        slideElements[currentSlide].classList.remove('opacity-0');
        slideElements[currentSlide].classList.add('opacity-100');
    }
    const updateCarousel = (newIndex) => {
        if (newIndex < 0) {
            newIndex = 0;
        } else if (newIndex >= slides.length) {
            newIndex = slides.length - 1;
        }
        slideElements[currentSlide].classList.remove('opacity-100');
        slideElements[currentSlide].classList.add('opacity-0');
        currentSlide = newIndex;
        slideElements[currentSlide].classList.remove('opacity-0');
        slideElements[currentSlide].classList.add('opacity-100');
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === slides.length - 1;
    };
    prevBtn.onclick = () => updateCarousel(currentSlide - 1);
    nextBtn.onclick = () => updateCarousel(currentSlide + 1);
};
const renderFooter = (root, data) => {
    const footerRoot = el('footer', {'class': 'bg-gray-950 text-white p-4 md:p-8 text-center border-t-2 border-blue-700/50'});
    const footerData = data.footer;
    footerRoot.appendChild(el('h3', {'class': 'text-xl font-bold mb-4 text-blue-400'}, footerData.cta));
    footerRoot.appendChild(el('p', {'class': 'mb-6 max-w-2xl mx-auto text-gray-400'}, footerData.message));
    const contactBtn = el('a', {'class': 'bg-blue-600 hover:bg-blue-500 text-black font-bold py-3 px-8 rounded-sm shadow-xl shadow-blue-500/50 transition duration-300 transform hover:scale-105 inline-flex items-center'});
    contactBtn.href = footerData.contactButton.href;
    contactBtn.innerHTML = `<i data-lucide="send" class="w-5 h-5 mr-2"></i> ${footerData.contactButton.text}`;
    footerRoot.appendChild(contactBtn);
    const statusP = el('p', {'class': 'text-xs mt-10 text-gray-600'});
    statusP.innerHTML = '&copy; 2024 Sobodh Jagaran. System Status: <span class="text-green-500">OPERATIONAL.</span>';
    footerRoot.appendChild(statusP);
    root.appendChild(footerRoot);
}
const createSection = (id, extraClass = '') => {
    return el('section', { id: id, class: `mb-8 ${extraClass}` });
};

const createSectionHeader = (title, iconName = null) => {
    const container = el('div', { class: 'section-header' });
    const heading = el('h2', {  class: 'font-black text-white tracking-tighter uppercase flex items-center gap-4' });
    if (iconName) {
        heading.innerHTML = `<i data-lucide="${iconName}" class="w-8 h-8 text-blue-500"></i> ${title}`;
    } else {
        heading.textContent = title;
    }
    container.appendChild(heading);
    return container;
};