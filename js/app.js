const createElement = (tag, classes, innerHTMLContent = '') => {
    const el = document.createElement(tag);
    if (classes) el.className = classes;
    if (innerHTMLContent) el.innerHTML = innerHTMLContent;
    return el;
};
const renderHeader = () => {
    const headerRoot = document.getElementById('header-root');
    const data = resumeData.hero;
    const contact = resumeData.contact;
    const container = createElement('div', 'max-w-6xl mx-auto p-6 md:p-12');
    const flexContainer = createElement('div', 'flex flex-col md:flex-row justify-center items-start');
    const heroInfo = createElement('div', '');
    heroInfo.appendChild(createElement('h1', 'text-5xl font-extrabold tracking-widest text-blue-400 text-center', data.title));
    heroInfo.appendChild(createElement('p', 'text-gray-300 text-2xl mt-2 text-center', data.subtitle));
    const contactInfo = createElement('div', 'mt-2 flex flex-wrap gap-x-4 gap-y-2 text-left items-center');
    const createContactLink = (icon, text, href) => {
        const a = createElement('a', 'text-blue-200 hover:text-blue-300 transition duration-200 inline-flex items-center text-sm');
        a.href = href;
        a.innerHTML = `<i data-lucide="${icon}" class="w-3 h-3 text-blue-400 mr-2"></i> ${text}`;
        return a;
    };
    const contactLinks = [{ 
            icon: 'phone', 
            href: `tel:${contact.phone.replace(/[^\d+]/g, '')}`, 
            display: `${contact.phone}` 
        }, { 
            icon: 'mail', 
            href: `mailto:${contact.email}`, 
            display: `${contact.email}` 
        }, { 
            icon: 'linkedin', 
            href: contact.linkedin, 
            display: `LINKEDIN_PROFILE` 
        },
    ];
    contactLinks.forEach((linkData, index) => {
        contactInfo.appendChild(createContactLink(
            linkData.icon, 
            linkData.href, 
            linkData.display
        ));
        if (index < contactLinks.length - 1) {
            const separator = createElement('span', 'text-gray-700 text-sm font-light px-2');
            separator.textContent = '|';
            contactInfo.appendChild(separator);
        }
    });
    heroInfo.appendChild(contactInfo);
    flexContainer.appendChild(heroInfo);
    container.appendChild(flexContainer);
    headerRoot.appendChild(container);
};
const renderSummary = () => {
    const root = document.getElementById('content-root');
    const data = resumeData.summary;
    const section = createElement('section', 'mb-16 p-8 bg-[#161b22] rounded-sm shadow-2xl border-t-4 border-blue-500');
    // Header
    const header = createElement('h2', 'text-2xl font-bold text-blue-400 mb-4 flex items-center');
    header.innerHTML = `<i data-lucide="${data.icon}" class="w-6 h-6 mr-3 text-blue-400"></i> ${data.title}`;
    section.appendChild(header);
    // Paragraphs
    data.paragraphs.forEach(pText => {
        const p = createElement('p', 'text-gray-400 leading-relaxed mb-4');
        // Replace **bold** with <b> tag for rendering
        p.innerHTML = pText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        section.appendChild(p);
    });
    root.appendChild(section);
};
const renderCapabilities = () => {
    const root = document.getElementById('content-root');
    const data = resumeData.capabilities;
    const section = createElement('section', 'mb-16');
    section.appendChild(createElement('h2', 'section-header', data.title));
    const gridContainer = createElement('div', 'grid sm:grid-cols-2 lg:grid-cols-4 gap-6');
    data.items.forEach(item => {
        const card = createElement('div', `bg-[#161b22] p-6 rounded-sm shadow-lg border-l-4 border-${item.color}`);
        card.innerHTML += `<i data-lucide="${item.icon}" class="w-6 h-6 text-${item.color.replace('500', '400')} mb-3"></i>`;
        card.appendChild(createElement('h3', 'text-xl font-semibold mb-3 text-white', item.title));
        const chipsContainer = createElement('div', 'flex flex-wrap');
        item.skills.forEach(skill => {
            chipsContainer.appendChild(createElement('span', 'skill-chip', skill));
        });
        card.appendChild(chipsContainer);
        gridContainer.appendChild(card);
    });

    section.appendChild(gridContainer);
    root.appendChild(section);
};
const renderProjects = () => {
    const root = document.getElementById('content-root');
    const data = resumeData.projects;
    const section = createElement('section', 'mb-16');
    section.appendChild(createElement('h2', 'section-header', data.title));
    const spaceContainer = createElement('div', 'space-y-8');
    data.items.forEach(project => {
        const card = createElement('div', 'project-card');
        // Header and Icon
        const headerFlex = createElement('div', 'flex items-center mb-3');
        headerFlex.innerHTML = `<i data-lucide="${project.icon}" class="w-6 h-6 text-blue-400 mr-3"></i>`;
        headerFlex.appendChild(createElement('h3', 'text-2xl font-bold text-white', project.title));
        card.appendChild(headerFlex);
        // Target
        card.appendChild(createElement('p', 'text-sm text-blue-500 mb-3', `// Target: ${project.target}`));
        // Description
        const descP = createElement('p', 'text-gray-400 leading-relaxed');
        // Replace **bold** with <b> tag for rendering
        descP.innerHTML = project.description.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        card.appendChild(descP);
        // Tags
        const tagsContainer = createElement('div', 'mt-4 flex flex-wrap');
        project.tags.forEach(tag => {
            tagsContainer.appendChild(createElement('span', 'skill-chip', tag));
        });
        card.appendChild(tagsContainer);
        spaceContainer.appendChild(card);
    });
    section.appendChild(spaceContainer);
    root.appendChild(section);
};
const renderFooter = () => {
    const footerRoot = document.getElementById('footer-root');
    const data = resumeData.footer;
    footerRoot.appendChild(createElement('h3', 'text-xl font-bold mb-4 text-blue-400', data.cta));
    footerRoot.appendChild(createElement('p', 'mb-6 max-w-2xl mx-auto text-gray-400', data.message));
    const contactBtn = createElement('a', 'bg-blue-600 hover:bg-blue-500 text-black font-bold py-3 px-8 rounded-sm shadow-xl shadow-blue-500/50 transition duration-300 transform hover:scale-105 inline-flex items-center');
    contactBtn.href = data.contactButton.href;
    contactBtn.innerHTML = `<i data-lucide="send" class="w-5 h-5 mr-2"></i> ${data.contactButton.text}`;
    footerRoot.appendChild(contactBtn);
    const statusP = createElement('p', 'text-xs mt-10 text-gray-600');
    statusP.innerHTML = '&copy; 2024 Sobodh Jagaran. System Status: <span class="text-green-500">OPERATIONAL.</span>';
    footerRoot.appendChild(statusP);
}
const initializePortfolio = () => {
    if (typeof resumeData === 'undefined') {
        console.error("Error: resumeData object not found. Ensure js/data.js is loaded before js/app.js.");
        return;
    }
    renderHeader();
    renderSummary();
    renderCapabilities();
    renderProjects();
    renderFooter();
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    } else {
        console.warn("Lucide icons library not loaded or function not available.");
    }
};
window.onload = initializePortfolio;
