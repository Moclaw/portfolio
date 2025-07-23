export const TAB_CONFIGS = [
  { id: 'dashboard', name: 'Dashboard', endpoint: null },
  { id: 'projects', name: 'Projects', endpoint: 'projects' },
  { id: 'experiences', name: 'Experiences', endpoint: 'experiences' },
  { id: 'technologies', name: 'Technologies', endpoint: 'technologies' },
  { id: 'services', name: 'Services', endpoint: 'services' },
  { id: 'testimonials', name: 'Testimonials', endpoint: 'testimonials' },
  { id: 'contacts', name: 'Contacts', endpoint: 'contacts' },
  { id: 'users', name: 'Users', endpoint: 'users' },
  { id: 'uploads', name: 'File Manager', endpoint: null },
];

export const getFormFields = (tabId) => {
  switch (tabId) {
    case 'projects':
      return [
        { name: 'name', label: 'Project Name', placeholder: 'Enter project name', required: true },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter project description', required: true },
        { name: 'source_code_link', label: 'Source Code Link', placeholder: 'https://github.com/...', type: 'url' },
        { name: 'live_demo_link', label: 'Live Demo Link', placeholder: 'https://...', type: 'url' },
        { 
          name: 'image', 
          label: 'Project Image', 
          type: 'file',
          accept: 'image/*',
          placeholder: 'Upload project image',
          description: 'Upload project screenshot or image'
        },
        { name: 'order', label: 'Order', placeholder: '1', type: 'number' },
        { name: 'is_active', label: 'Status', type: 'select', options: [
          { value: 'true', label: 'Active' },
          { value: 'false', label: 'Inactive' }
        ]},
      ];
    case 'experiences':
      return [
        { name: 'title', label: 'Job Title', placeholder: 'Full Stack Developer', required: true },
        { name: 'company_name', label: 'Company Name', placeholder: 'MaicoGroup', required: true },
        { 
          name: 'icon', 
          label: 'Company Logo', 
          type: 'file',
          accept: 'image/*',
          placeholder: 'Upload company logo',
          description: 'Upload company logo or icon'
        },
        { name: 'icon_bg', label: 'Icon Background Color', placeholder: '#ffffff' },
        { name: 'date', label: 'Date Range', placeholder: 'Apr 2021 - Jan 2022', required: true },
        { name: 'order', label: 'Order', placeholder: '1', type: 'number' },
        { name: 'is_active', label: 'Status', type: 'select', options: [
          { value: 'true', label: 'Active' },
          { value: 'false', label: 'Inactive' }
        ]},
      ];
    case 'technologies':
      return [
        { name: 'name', label: 'Technology Name', placeholder: 'C#', required: true },
        { 
          name: 'icon', 
          label: 'Technology Icon', 
          type: 'file',
          accept: 'image/*',
          placeholder: 'Upload technology icon',
          description: 'Upload technology logo or icon'
        },
        { name: 'category', label: 'Category', type: 'select', options: [
          { value: 'programming', label: 'Programming' },
          { value: 'framework', label: 'Framework' },
          { value: 'database', label: 'Database' },
          { value: 'cloud', label: 'Cloud' },
          { value: 'frontend', label: 'Frontend' },
          { value: 'backend', label: 'Backend' },
          { value: 'container', label: 'Container' },
          { value: 'ci/cd', label: 'CI/CD' },
          { value: 'messaging', label: 'Messaging' },
          { value: 'os', label: 'Operating System' },
          { value: 'project-management', label: 'Project Management' },
          { value: 'other', label: 'Other' }
        ], required: true },
        { name: 'order', label: 'Order', placeholder: '1', type: 'number' },
        { name: 'is_active', label: 'Status', type: 'select', options: [
          { value: 'true', label: 'Active' },
          { value: 'false', label: 'Inactive' }
        ]},
      ];
    case 'services':
      return [
        { name: 'title', label: 'Service Title', placeholder: 'Full Stack Developer', required: true },
        { 
          name: 'icon', 
          label: 'Service Icon', 
          type: 'file',
          accept: 'image/*',
          placeholder: 'Upload service icon',
          description: 'Upload service icon or illustration'
        },
        { name: 'order', label: 'Order', placeholder: '1', type: 'number' },
        { name: 'is_active', label: 'Status', type: 'select', options: [
          { value: 'true', label: 'Active' },
          { value: 'false', label: 'Inactive' }
        ]},
      ];
    case 'testimonials':
      return [
        { name: 'testimonial', label: 'Testimonial', type: 'textarea', placeholder: 'I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.', required: true },
        { name: 'name', label: 'Client Name', placeholder: 'Sara Lee', required: true },
        { name: 'designation', label: 'Designation', placeholder: 'CFO', required: true },
        { name: 'company', label: 'Company', placeholder: 'Acme Co', required: true },
        { 
          name: 'image', 
          label: 'Client Photo', 
          type: 'file',
          accept: 'image/*',
          placeholder: 'Upload client photo',
          description: 'Upload client profile photo'
        },
        { name: 'order', label: 'Order', placeholder: '1', type: 'number' },
        { name: 'is_active', label: 'Status', type: 'select', options: [
          { value: 'true', label: 'Active' },
          { value: 'false', label: 'Inactive' }
        ]},
      ];
    case 'contacts':
      return [
        { name: 'name', label: 'Name', placeholder: 'Contact Name', required: true },
        { name: 'email', label: 'Email', placeholder: 'contact@example.com', type: 'email', required: true },
        { name: 'subject', label: 'Subject', placeholder: 'Message Subject' },
        { name: 'message', label: 'Message', type: 'textarea', placeholder: 'Contact message', required: true },
        { name: 'status', label: 'Status', type: 'select', options: [
          { value: 'unread', label: 'Unread' },
          { value: 'read', label: 'Read' },
          { value: 'replied', label: 'Replied' }
        ]},
      ];
    default:
      return [];
  }
};

// Helper function to get the correct image path
export const getImagePath = (imagePath, type = 'general') => {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http') || imagePath.startsWith('//')) {
    return imagePath;
  }
  
  // Handle different asset paths based on type
  const assetPaths = {
    company: '/src/assets/company/',
    tech: '/src/assets/tech/',
    project: '/src/assets/',
    general: '/src/assets/'
  };
  
  const basePath = assetPaths[type] || assetPaths.general;
  
  // If path already starts with /src/assets, return as is
  if (imagePath.startsWith('/src/assets/')) {
    return imagePath;
  }
  
  // If it's just a filename, prepend the appropriate path
  return basePath + imagePath;
};
