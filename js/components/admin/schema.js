export const SECTION_ORDER = [
  'identity',
  'summary',
  'capabilities',
  'experience',
  'insights',
  'projects',
  'footer'
];

export const SECTION_SCHEMAS = {
    identity: {
        id: 'identity', 
        icon: 'user', 
        label: 'Identity',
        title: 'Identity & Hero',
        fields: [
            { path: 'identity.hero.title', label: 'Full Name', type: 'text', required: true },
            { path: 'identity.hero.subtitle', label: 'Professional Title', type: 'text', required: true },
            { path: 'identity.hero.slogan', label: 'Slogan / Catchphrase', type: 'text' },
            { path: 'identity.hero.logo', label: 'Logo', type: 'file', isMedia: true, value: '/assets/logo_solid.png' },
            { path: 'identity.hero.avatar', label: 'Avatar', type: 'file', isMedia: true, value: 'assets/profile_pic.png'},
            { path: 'identity.contact.email', label: 'Email Address', type: 'email', required: true },
            { path: 'identity.contact.phone', label: 'Phone Number', type: 'tel' },
            { path: 'identity.contact.linkedin', label: 'LinkedIn Profile', type: 'url' },
            { path: 'identity.contact.resumeLink', label: 'Resume PDF Link', type: 'file', value: '/assets/sobodh_jagaran_resume.pdf' }
        ]
    },
    summary: {
        id: 'summary', 
        icon: 'file-text', 
        label: 'Summary',
        title: 'Executive Summary',
        fields: [
            { path: 'summary.title', label: 'Section Title', type: 'text', required: true },
            { path: 'summary.icon', label: 'Lucide Icon', type: 'select', isIcon: true },
            { path: 'summary.paragraphs', label: 'Executive Summary', type: 'textarea', required: true }
        ]
    },
    capabilities: {
        id: 'capabilities', 
        icon: 'zap', 
        label: 'Capabilities', 
        title: 'Core Capabilities',
        fields: [
            { path: 'capabilities.title', label: 'Section Title', type: 'text', required: true},
            { 
                path: 'capabilities.items', 
                label: 'Skills', 
                type: 'list',
                fields : [
                    {path: "title", label: "Title", type: "text"},
                    {path: "icon", label: "Icon", type: "select", isIcon: true},
                    {path: "color", label: "Colour", type: "Select", isColorPicker: true },
                    {path: "skills", label: "Skills", type: "text", isTags: true }
                ]
            }
        ]
    },
    experience: {
        id: 'experience', 
        icon: 'briefcase', 
        label: 'Experience',
        title: 'Work History',
        fields: [
            { path: 'experience.title', label: 'Section Title', type: 'text' },
            { path: 'experience.intro_note', label: 'Description', type: 'textarea' },
            { 
                path: 'experience.items', 
                label: 'Roles', 
                type: 'list', 
                fields : [
                    { path: "title", label: "Company", type: "text" },
                    { path: "target", label: "Title", type: "text" },
                    { path: "description", label: "Description", type: "textarea" },
                    { path: "tags", label: "Tags", type: "select",  isTags: true  },
                    { path: "icon", label: "Icon", type: "select", isIcon: true  }
                ]
            }
        ]
    },
    insights: {
        id: 'insights', 
        icon: 'lightbulb', 
        label: 'Insights',
        title: "Arhitect Insights",
        fields: [
            { path: 'insights.title', label: 'Section Title', type: 'text' },
            { 
                path: 'insights.items', 
                label: 'Arhitect Insights', 
                type: 'list', 
                fields : [
                    { path: "title", label: "Insight Title", type: "text" },
                    { path: "icon", label: "Icon", type: "select", isIcon: true},
                    { path: "description", label: "Insight Description", type: "textarea" },
                    { path: "image", label: "Image Banner", type: "file" },
                    { path: "article", label: "Full Article Link (URL)", type: "url" },
                    { path: "tutorial", label: "Tutorial/Exercise Link", type: "url" }
                ] 
            }
        ]
    },
    projects: {
        id: 'projects', 
        icon: 'code', 
        label: 'Projects',
        title: "Project Highlights",
        fields: [
            { path: 'projects.title', label: 'Section Title', type: 'text' },
            { path: 'projects.intro_note', label: 'Section Title', type: 'textarea' },
            { 
                path: 'projects.items', 
                label: 'Project List (JSON Array)', 
                type: 'list',
                fields : [
                    { path: "title", label: "Project Title", type: "text" },
                    { path: "icon", label: "Icon", type: "select", isIcon: true},
                    { path: "target", label: "Traget", type: "text"},
                    { path: "tags", label: "Tags", type: "select",  isTags: true  },
                    { path: "description", label: "Project Description", type: "textarea" },
                    { path: "image", label: "Image Banner", type: "file" },
                ]
            }
        ]
    },
    footer: {
        id: 'footer', 
        icon: 'layout', 
        label: 'Footer',
        title: 'Footer Configuration',
        fields: [
            { path: 'footer.cta', label: 'Call to Action', type: 'text' },
            { path: 'footer.message', label: 'Footer Message', type: 'textarea' },
            { path: 'footer.contactButton.text', label: 'Button Label', type: 'text' },
            { path: 'footer.contactButton.href', label: 'Button Link', type: 'text' }
        ]
    }
}