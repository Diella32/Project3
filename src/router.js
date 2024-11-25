import { createRouter, createWebHistory } from "vue-router";
import Login from "./views/Login.vue";
import home from "./views/home.vue";
import AddResume from "./views/AddResume.vue";
import ResumeList from "./views/ResumeList.vue";
import EditResume from "./views/EditResume.vue";
import ViewResume from "./views/ViewResume.vue";
import Experience from "./views/Experience.vue";
import Skill from "./views/Skill.vue";
import CertificationsPage from "../src/views/Certifications.vue"
import personalInterests from "./views/personalInterests.vue";
import AddProjects from "./views/AddProjects.vue";
import PersonalLinks from "./views/PersonalLinks.vue";
import AddContact from "./views/AddContact.vue"; 
import AddEducation from "./views/AddEducation.vue";  // To add a new education entry
import GenerateResume from "./views/GenerateResume.vue"; // This is the component where you generate PDF
//import Experience from "./views/Experience.vue";
import template1 from "./views/template1.vue";


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
      path: "/add",
      name: "add",
      component: AddResume,
    },
    {
      path: "/resumes",
      name: "resumes",
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

      path: '/interest',
      name: 'enterInterests',
      component: personalInterests,
    },

    {
      path: "/edit",  // Edit resume path with dynamic id
     // path: "/edit/:id",
      name: "edit",
      component: EditResume,
      props: true,
    },
    {
      path: "/experience",
      name: "Experience",
      component: Experience,
    },
    {
      path: "/AddContact",
      name: "AddContact",
      component: AddContact,
      props: true,
    },
    {
      path: "/skills",
      name: "Skill",
      component: Skill,
      props: true,
    },
    {
      path: "/GenerateResume",
      name: "GenerateResume",
      component: GenerateResume,
    },
    {
      path: '/',
      name: 'Template1',
      component: template1,
    },

    {
      path: "/view/:id",  // View resume path with dynamic id
      name: "view",
      component: ViewResume,
      props: true,
    },
    {
      path: "/Education",
      name: "AddEducation",
      component: AddEducation,
      props: true,
    },
    {
      path: '/certifications',
      name: 'enterCertifications',
      component: CertificationsPage
    },

    {
      path: "/Experiences",  // Path for adding education
      name: "Experiences",
      component: Experience,  // Component for adding a new education entry
      props: true,

    },

  ],
});

export default router;