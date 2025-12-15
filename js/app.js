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
    const container = createElement('div', 'max-w-6xl mx-auto p-2 md:p-4');
    const gridContainer = createElement('div', 'grid grid-cols-1 lg:grid-cols-12 items-center text-center');
    const logoCol = createElement('div', 'hidden lg:col-span-2 lg:flex justify-start items-center');
    const logoContainer = createElement('div', 'flex justify-center mb-6');
    const logo = createElement('img', 'w-32 h-32 rounded-full border-4 border-blue-500 shadow-xl object-cover transform hover:scale-105 transition duration-300');
    logo.src = 'assets/logo_solid.png';
    logo.alt = `${data.title} Logo`;
    logoContainer.appendChild(logo);
    logoCol.appendChild(logoContainer);
    gridContainer.appendChild(logoCol);
    const contextCol = createElement('div', 'col-span-1 lg:col-span-8');
    const flexContainer = createElement('div', 'flex flex-col md:flex-row justify-center items-start');
    const heroInfo = createElement('div', '');
    heroInfo.appendChild(createElement('h1', 'text-5xl font-extrabold tracking-widest text-blue-400 text-center', data.title));
    heroInfo.appendChild(createElement('p', 'text-gray-300 text-2xl mt-2 text-center', data.subtitle));
    const slogan = createElement('p', 'text-xl font-bold text-blue-200 uppercase tracking-widest text-center py-2 px-4');
    slogan.textContent = data.slogan;
    heroInfo.appendChild(slogan);
    const contactInfo = createElement('div', 'mt-2 mb-3 flex flex-col items-center justify-center');
    const linkWrapper = createElement('div', 'flex flex-wrap items-center justify-center gap-y-2')
    const createContactLink = (icon, text, href) => {
        const a = createElement('a', 'text-blue-200 hover:text-blue-300 transition duration-200 inline-flex items-center text-sm text-center');
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
            const separator = createElement('span', 'text-gray-700 text-sm font-light px-2');
            separator.textContent = '|';
            linkWrapper.appendChild(separator);
        }
    });
    contactInfo.appendChild(linkWrapper);
    heroInfo.appendChild(contactInfo);
    flexContainer.appendChild(heroInfo);
    contextCol.appendChild(flexContainer);
    gridContainer.appendChild(contextCol);
    const avatarCol = createElement('div', 'hidden lg:col-span-2 lg:flex justify-end items-center'); 
    const avatar = createElement('img', 'w-32 h-32 rounded-full border-4 border-blue-500 shadow-xl object-cover transform hover:scale-105 transition duration-300');
    avatar.src = 'assets/profile_pic.png';
    avatar.alt = `${data.title} Avatar`;
    avatarCol.appendChild(avatar);
    gridContainer.appendChild(avatarCol);
    container.appendChild(gridContainer);
    headerRoot.appendChild(container);
};
const renderSummary = () => {
    const root = document.getElementById('content-root');
    const data = resumeData.summary;
    const section = createElement('section', 'mt-6 mb-6 p-8 bg-[#161b22] rounded-sm shadow-2xl border-t-4 border-blue-500');
    const header = createElement('h2', 'text-2xl font-bold text-blue-400 mb-4 flex items-center');
    header.innerHTML = `<i data-lucide="${data.icon}" class="w-6 h-6 mr-3 text-blue-400"></i> ${data.title}`;
    section.appendChild(header);
    data.paragraphs.forEach(pText => {
        const p = createElement('p', 'text-gray-400 leading-relaxed mb-4');
        p.innerHTML = pText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        section.appendChild(p);
    });
    root.appendChild(section);
};
const renderCapabilities = () => {
    const root = document.getElementById('content-root');
    const data = resumeData.capabilities;
    const section = createElement('section', 'mb-6');
    section.appendChild(createElement('h2', 'section-header', data.title));
    const gridContainer = createElement('div', 'grid sm:grid-cols-1 lg:grid-cols-3 gap-6');
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
const renderExperience = () => {
    const root = document.getElementById('content-root');
    const data = resumeData.experience;
    const section = createElement('section', 'mb-6');
    section.appendChild(createElement('h2', 'section-header', data.title));
    const spaceContainer = createElement('div', 'space-y-8');
    data.items.forEach(experience => {
        const card = createElement('div', 'experience-card');
        const headerFlex = createElement('div', 'flex items-center mb-3');
        headerFlex.innerHTML = `<i data-lucide="${experience.icon}" class="w-6 h-6 text-blue-400 mr-3"></i>`;
        headerFlex.appendChild(createElement('h3', 'text-2xl font-bold text-white', experience.title));
        card.appendChild(headerFlex);
        card.appendChild(createElement('p', 'text-sm font-bold text-blue-500 mb-3', `${experience.target}`));
        const listContainer = createElement('div', 'text-gray-400 leading-relaxed mt-4');
        const ul = createElement('ul', 'list-disc ml-5 space-y-2');
        const rawItems = experience.description.split('\n').filter(item => item.trim().startsWith('*'));
        rawItems.forEach(itemText => {
            const cleanedText = itemText.replace(/^\*\s*/, '').trim();
            if (cleanedText) {
                const li = createElement('li', '');
                li.innerHTML = cleanedText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
                ul.appendChild(li);
            }
        });
        listContainer.appendChild(ul);
        card.appendChild(listContainer);
        const tagsContainer = createElement('div', 'mt-4 flex flex-wrap');
        experience.tags.forEach(tag => {
            tagsContainer.appendChild(createElement('span', 'date-chip', tag));
        });
        card.appendChild(tagsContainer);
        spaceContainer.appendChild(card);
    });
    section.appendChild(spaceContainer);
    root.appendChild(section);
};
const renderProjects = () => {
    const root = document.getElementById('content-root');
    const data = resumeData.projects;
    const section = createElement('section', 'mb-6');
    section.appendChild(createElement('h2', 'section-header', data.title));
    if (!data.items || data.items.length === 0) {
        const placeholder = createElement('div', 'p-12 bg-[#161b22] rounded-xl border-2 border-dashed border-gray-700 text-center flex flex-col items-center justify-center');
        placeholder.innerHTML = `
            <i data-lucide="blocks" class="w-10 h-10 text-red-500 mb-4 animate-pulse"></i>
            <h3 class="text-2xl font-bold text-white mb-2">Project Highlights: Coming Soon</h3>
            <p class="text-gray-400 max-w-md">Detailed case studies demonstrating precision, stability, and architectural clarity are being prepared. This section will feature my most impactful, mission-critical solutions.</p>
        `;
        section.appendChild(placeholder);
        root.appendChild(section);
        return;
    }
    const carouselWrapper = createElement('div', 'relative');
    const carouselInner = createElement('div', 'flex transition-transform duration-500 ease-in-out');
    carouselInner.id = 'projects-carousel-inner';
    data.items.forEach((project, index) => {
        const card = createElement('div', 'min-w-full section-card p-6 opacity-0 transition-opacity duration-500');
        card.setAttribute('data-slide-index', index);
        const tagsContainer = createElement('div', 'mb-3 flex flex-wrap justify-end');
        project.tags.forEach(tag => {
            tagsContainer.appendChild(createElement('span', 'date-chip', tag));
        });
        card.appendChild(tagsContainer);
        const headerFlex = createElement('div', 'flex items-center mb-3');
        headerFlex.innerHTML = `<i data-lucide="${project.icon}" class="w-6 h-6 text-blue-400 mr-3"></i>`;
        headerFlex.appendChild(createElement('h3', 'text-2xl font-bold text-white', project.title));
        card.appendChild(headerFlex);
        card.appendChild(createElement('p', 'text-sm text-blue-500 mb-4 font-semibold', project.target));
        const listContainer = createElement('div', 'text-gray-400 leading-relaxed');
        const ul = createElement('ul', 'list-disc ml-5 space-y-3');
        const rawItems = project.description.split('\n').filter(item => item.trim().startsWith('*'));
        rawItems.forEach(itemText => {
            const cleanedText = itemText.replace(/^\*\s*/, '').trim();
            if (cleanedText) {
                const li = createElement('li', 'pl-1');
                li.innerHTML = cleanedText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
                ul.appendChild(li);
            }
        });
        listContainer.appendChild(ul);
        card.appendChild(listContainer);
        carouselInner.appendChild(card);
    });
    carouselWrapper.appendChild(carouselInner);
    const navContainer = createElement('div', 'flex justify-between mt-4 space-x-4');
    const prevBtn = createElement('button', 'nav-button px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition duration-200 flex items-center shadow-lg hover:shadow-xl disabled:opacity-50');
    prevBtn.id = 'carousel-prev';
    prevBtn.innerHTML = '<i data-lucide="chevron-left" class="w-5 h-5 mr-1"></i> Previous Project';
    prevBtn.disabled = true;
    const nextBtn = createElement('button', 'nav-button px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition duration-200 flex items-center shadow-lg hover:shadow-xl disabled:opacity-50 ml-auto');
    nextBtn.id = 'carousel-next';
    nextBtn.innerHTML = 'Next Project <i data-lucide="chevron-right" class="w-5 h-5 ml-1"></i>';
    if (data.items.length <= 1) {
        nextBtn.disabled = true;
    }
    navContainer.appendChild(prevBtn);
    navContainer.appendChild(nextBtn);
    section.appendChild(carouselWrapper);
    section.appendChild(navContainer);
    root.appendChild(section);
    let currentSlide = 0;
    const slides = data.items;
    const inner = document.getElementById('projects-carousel-inner');
    const slideElements = inner.children;
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
const renderBlog = () => {
    const root = document.getElementById('content-root');
    const data = resumeData.blog;
    const section = createElement('section', 'mb-6');
    section.appendChild(createElement('h2', 'section-header', data.title));
    if (!data.items || data.items.length === 0) {
        const placeholder = createElement('div', 'p-12 bg-[#161b22] rounded-xl border-2 border-dashed border-gray-700 text-center flex flex-col items-center justify-center');
        placeholder.innerHTML = `
            <i data-lucide="wrench" class="w-10 h-10 text-yellow-500 mb-4 animate-pulse"></i>
            <h3 class="text-2xl font-bold text-white mb-2">Architect's Log: Under Construction</h3>
            <p class="text-gray-400 max-w-md">The in-depth insights and articles on System Reliability and Software Architecture are planned for a future release. Check back soon for new content!</p>
        `;
        section.appendChild(placeholder);
        root.appendChild(section);
        return;
    }
    const gridContainer = createElement('div', 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6');
    data.items.forEach(post => {
        const card = createElement('a', 'section-card p-6 flex flex-col justify-between hover:bg-[#111317] transition duration-300', '');
        card.href = post.link;
        card.target = "_blank"; 
        const headerFlex = createElement('div', 'mb-4');
        headerFlex.innerHTML = `<i data-lucide="${post.icon}" class="w-8 h-8 text-yellow-400 mb-3 block"></i>`;
        headerFlex.appendChild(createElement('h3', 'text-xl font-bold text-white mb-2', post.title));
        headerFlex.appendChild(createElement('p', 'text-gray-400 text-sm mb-4 leading-relaxed', post.summary));
        card.appendChild(headerFlex);
        const footerDiv = createElement('div', '');
        footerDiv.appendChild(createElement('p', 'text-xs font-mono text-gray-500 mb-3', post.date));
        const tagsContainer = createElement('div', 'flex flex-wrap gap-2');
        post.tags.forEach(tag => {
            tagsContainer.appendChild(createElement('span', 'skill-chip text-xs bg-gray-700/50 text-gray-300', tag));
        });
        footerDiv.appendChild(tagsContainer);
        card.appendChild(footerDiv);
        gridContainer.appendChild(card);
    });
    section.appendChild(gridContainer);
    root.appendChild(section);
}
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
    renderExperience();
    renderProjects();
    renderBlog(); 
    renderFooter();
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    } else {
        console.warn("Lucide icons library not loaded or function not available.");
    }
};
window.onload = initializePortfolio;
