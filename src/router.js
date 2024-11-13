import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";
import ResumeList from "./views/ResumeList.vue";
import EditResume from "./views/EditResume.vue";
import AddResume from "./views/AddResume.vue";
import ViewResume from "./views/ViewResume.vue";

import home from "./views/home.vue";
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
      component: Home,
    },
    {
      path: "/add",
      name: "add",
      component: AddResume,
    },
    {
      path: "/resumes",
      name: "resumes",
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
      path: "/edit/:id",
      name: "edit",
      component: EditResume,
      props: true,
    },
    {
      path: '/Contact',
      name: 'Contact',
      component: AddContact,
      props: true,
    },
    {
      path: '/enterEducation',
      name: 'enterEducation',
      component: AddEducation,
    },
    {
      path: "/education/add",
      name: "addEducation",
      component: AddEducation,
    },
  ],
});

export default router;
