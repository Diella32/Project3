
import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";
import home from "./views/home.vue";
import AddResume from "./views/AddResume.vue";
import ResumeList from "./views/ResumeList.vue";
import EditResume from "./views/EditResume.vue";
import ViewResume from "./views/ViewResume.vue";
import CertificationsPage from "../src/views/Certifications.vue"
import personalInterests from "./views/personalInterests.vue";
import AddProjects from "./views/AddProjects.vue";
import PersonalLinks from "./views/PersonalLinks.vue";
import AddContact from "./views/AddContact.vue"; 
import AddEducation from "./views/AddEducation.vue";  // To add a new education entry
import GenerateResume from "./views/GenerateResume.vue"; // This is the component where you generate PDF
import AiPage from "./views/AiPage.vue";  // Add this import



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
      props: true,

    },


    {
      path: '/projects',
      name: 'AddProjects',
      component: AddProjects,
      props: true,

    },

    {
      path: '/PersonalLinks',
      name: 'PersonalLinks',
      component: PersonalLinks,
      props: true,

    },
    {
      path: '/interest', // 
      name: 'enterInterests',
      component: personalInterests,
    },
    {
      path: '/ai',
      name: 'ai',
      component: AiPage  // Define the route for the AI page
    },

    {
      path: "/edit/:id",  // Edit resume path with dynamic id
      name: "edit",
      component: EditResume,
      props: true,
    },
    {
      path: "/AddContact",  // New route for AddContact
      name: "AddContact",  // Name for the route
      component: AddContact,  // The component that will be shown for this route
      props: true,
    },

    {
      path: "/GenerateResume",
      name: "GenerateResume",
      component: GenerateResume,
    },

    {
      path: "/view/:id",  // View resume path with dynamic id
      name: "view",
      component: ViewResume,
      props: true,
    },
  


    // Add Education route
    {
      path: "/Education",  // Path for adding education
      name: "AddEducation",
      component: AddEducation,  // Component for adding a new education entry
      props: true,

    },
    
    {
      path: '/certifications',
      name: 'enterCertifications',
      component: CertificationsPage
    },
  ],
});

export default router;
