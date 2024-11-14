import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";
import ResumeList from "./views/ResumeList.vue";
import EditResume from "./views/EditResume.vue";
import AddResume from "./views/AddResume.vue";
import ViewResume from "./views/ViewResume.vue";
import CertificationsPage from "../src/views/Certifications.vue"
import home from "./views/home.vue";
import personalInterests from "./views/personalInterests.vue";
import AddProjects from "./views/AddProjects.vue";
import PersonalLinks from "./views/PersonalLinks.vue";
import ContactView from "./views/ContactView.vue"; 
import AddContact from "./views/AddContact.vue"; 
import AddEducation from "./views/AddEducation.vue";  // To add a new education entry


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      alias: "/login",
      name: "login",
      component: Login,
    },

    {
      path: '/',
      name: 'home',
      component: home,
    },

    {
      path: "/add",  // Path for adding a resume
      name: "add",
      component: AddResume,
    },

    {
      path: "/resumes",  // Path for the resume list
      name: "resumes",  // Name for this route
      component: ResumeList,
    },


    {
      path: '/projects',
      name: 'AddProjects',
      component: AddProjects,
    },

    {
      path: '/PersonalLinks',
      name: 'PersonalLinks',
      component: PersonalLinks,
    },
    {
      path: '/interest', // 
      name: 'personalInterests',
      component: personalInterests,
    },
    {
      path: "/edit/:id",  // Edit resume path with dynamic id
      name: "edit",
      component: EditResume,
      props: true,
    },
    {
      path: '/contact/:id?',
      name: 'contact-view',
      component: ContactView,
      props: true,  // Allows you to pass `id` as a prop
    },
    {
      path: "/enterContactInfo",  // New route for AddContact
      name: "enterContactInfo",  // Name for the route
      component: AddContact,  // The component that will be shown for this route
    },
    {
      path: '/view',
      name: 'view',
      component: ContactView,  // The view page after saving
    },
    {
      path: "/view/:id",  // View resume path with dynamic id
      name: "view",
      component: ViewResume,
      props: true,
    },
  
      {
        path: '/enterEducation',
        name: 'enterEducation',
        component: AddEducation,
      },

    // Add Education route
    {
      path: "/education/add",  // Path for adding education
      name: "addEducation",
      component: AddEducation,  // Component for adding a new education entry
    },
    
    {
      path: '/certifications',
      name: 'enterCertifications',
      component: CertificationsPage
    },
  ],
});

export default router;
