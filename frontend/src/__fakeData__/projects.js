export const PROJECTS = [{
  id: 1,
  name: 'Website Redesign',
  status: 'in-progress',
  startDate: '2024-01-15',
  endDate: '2024-03-30',
  progress: 45,
  description: 'Revamping the company website for improved usability and design.',
  members: ['/static/user/user-16.png', '/static/user/user-17.png', '/static/user/user-18.png', '/static/user/user-19.png', '/static/user/user-17.png', '/static/user/user-18.png']
}, {
  id: 2,
  name: 'Mobile App Development',
  status: 'upcoming',
  startDate: '2024-04-01',
  endDate: '2024-09-15',
  progress: 0,
  description: 'Developing a new app to enhance customer engagement.',
  members: ['/static/user/user-16.png', '/static/user/user-17.png', '/static/user/user-18.png', '/static/user/user-19.png', '/static/user/user-17.png', '/static/user/user-18.png']
}, {
  id: 3,
  name: 'Data Migration',
  status: 'completed',
  startDate: '2023-10-01',
  endDate: '2023-12-01',
  progress: 100,
  description: 'Successfully migrated company data to a secure cloud platform.',
  members: ['/static/user/user-16.png', '/static/user/user-17.png', '/static/user/user-18.png', '/static/user/user-19.png', '/static/user/user-17.png', '/static/user/user-18.png']
}, {
  id: 4,
  name: 'SEO Optimization',
  status: 'in-progress',
  startDate: '2024-02-01',
  endDate: '2024-06-30',
  progress: 30,
  description: 'Enhancing website visibility through strategic SEO practices.',
  members: ['/static/user/user-16.png', '/static/user/user-17.png', '/static/user/user-18.png', '/static/user/user-19.png', '/static/user/user-17.png', '/static/user/user-18.png']
}, {
  id: 5,
  name: 'Product Launch',
  status: 'upcoming',
  startDate: '2024-05-01',
  endDate: '2024-07-15',
  progress: 0,
  description: 'Planning and executing the launch of our next-generation product.',
  members: ['/static/user/user-16.png', '/static/user/user-17.png', '/static/user/user-18.png', '/static/user/user-19.png', '/static/user/user-17.png', '/static/user/user-18.png']
}, {
  id: 6,
  name: 'Cloud Integration',
  status: 'completed',
  startDate: '2023-07-01',
  endDate: '2023-10-01',
  progress: 100,
  description: 'Implemented cloud solutions for scalable and efficient operations.',
  members: ['/static/user/user-16.png', '/static/user/user-17.png', '/static/user/user-18.png', '/static/user/user-19.png', '/static/user/user-17.png', '/static/user/user-18.png']
}, {
  id: 7,
  name: 'HR System Upgrade',
  status: 'blocked',
  startDate: '2024-01-10',
  endDate: '2024-04-30',
  progress: 20,
  description: 'Project temporarily on hold due to resource constraints.',
  members: ['/static/user/user-16.png', '/static/user/user-17.png', '/static/user/user-18.png', '/static/user/user-19.png', '/static/user/user-17.png', '/static/user/user-18.png']
}, {
  id: 8,
  name: 'Marketing Campaign',
  status: 'upcoming',
  startDate: '2024-03-01',
  endDate: '2024-06-30',
  progress: 0,
  description: 'Designing a creative campaign to boost brand awareness.',
  members: ['/static/user/user-16.png', '/static/user/user-17.png', '/static/user/user-18.png', '/static/user/user-19.png', '/static/user/user-17.png', '/static/user/user-18.png']
}, {
  id: 9,
  name: 'Cybersecurity Enhancement',
  status: 'completed',
  startDate: '2023-08-15',
  endDate: '2023-12-15',
  progress: 100,
  description: 'Improved security infrastructure to protect sensitive data.',
  members: ['/static/user/user-16.png', '/static/user/user-17.png', '/static/user/user-18.png', '/static/user/user-19.png', '/static/user/user-17.png', '/static/user/user-18.png']
}];
export const PROJECT_STATUS = [{
  title: 'All',
  value: 'all',
  amount: 45
}, {
  title: 'In Progress',
  value: 'in-progress',
  amount: 12
}, {
  title: 'Upcoming',
  value: 'upcoming',
  amount: 12
}, {
  title: 'Blocked',
  value: 'blocked',
  amount: 12
}, {
  title: 'Completed',
  value: 'completed',
  amount: 12
}];
export const PROJECT_TASKS = [{
  title: 'Design',
  status: 'Completed'
}, {
  title: 'Development',
  status: 'Ongoing'
}, {
  title: 'Back End Development',
  status: 'Upcoming'
}];
export const PROJECT_FILES = [{
  id: 1,
  title: 'Design Homepage',
  image: '/static/files-icon/jpg.svg'
}, {
  id: 2,
  title: 'Preliminary Sketches',
  image: '/static/files-icon/zip.svg'
}, {
  id: 3,
  title: 'Preliminary Sketches',
  image: '/static/files-icon/pdf.svg'
}, {
  id: 4,
  title: 'Preliminary Sketches',
  image: '/static/files-icon/raw.svg'
}];
export const PROJECT_TOOLS = [{
  id: 1,
  position: 'Design Software',
  company: 'Adobe Illustrator',
  image: '/static/files-icon/illustrator.svg'
}, {
  id: 2,
  company: 'Sketch',
  position: 'Design Software',
  image: '/static/files-icon/sketch.svg'
}, {
  id: 3,
  company: 'Adobe Photoshop',
  position: 'Design Software',
  image: '/static/files-icon/photoshop.svg'
}];
export const PROJECT_STACKS = [{
  id: 1,
  company: 'HTML5',
  image: '/static/files-icon/html.svg',
  position: 'Code'
}, {
  id: 2,
  company: 'VueJS',
  image: '/static/files-icon/vue.svg',
  position: 'Code'
}, {
  id: 3,
  company: 'Sass',
  image: '/static/files-icon/sass.svg',
  position: 'Code'
}];