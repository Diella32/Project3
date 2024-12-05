import { createRouter, createWebHistory } from "vue-router";
import Utils from '../src/config/utils'; 
import Login from "./views/Login.vue";
import home from "./views/home.vue";
import AddResume from "./views/AddResume.vue";
import ResumeList from "./views/ResumeList.vue";
import EditResume from "./views/EditResume.vue";
import ViewResume from "./views/ViewResume.vue";
import Skill from "./views/Skill.vue";
import CertificationsPage from "../src/views/Certifications.vue"
import personalInterests from "./views/personalInterests.vue";
import AddProjects from "./views/AddProjects.vue";
import PersonalLinks from "./views/PersonalLinks.vue";
import AddContact from "./views/AddContact.vue"; 
import Experience from "./views/Experience.vue";
import AdminPage from "./views/adminPage.vue";
import AddEducation from "./views/AddEducation.vue";
import GenerateResume from "./views/GenerateResume.vue";
import AdminUserManager from "./views/adminUserManager.vue";
import AdminRequests from "./views/adminRequests.vue";
import AddComment from "./views/AddComment.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: Login,
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      meta: { requiresAuth: true }
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
      path: '/certifications',
      name: 'enterCertifications',
      component: CertificationsPage,
    },

    {

      path: '/ai',
      name: 'ai',
      component: AiPage  // Define the route for the AI page
    },

    {
      path: "/edit/:id",  // Edit resume path with dynamic id
      name: "edit",
      component: EditResume
    },
    {
      path: "/AddContact",
      name: "AddContact",
      component: AddContact,
      props: true,
    },
    {
      path: '/certification',
      name: 'Certifications',
      component: CertificationsPage,
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
      path: "/view/:id",  // View resume path with dynamic id
      name: "view",
      component: ViewResume,
      props: true,
    },

    {
      path: "/edit/:id",  // View resume path with dynamic id
      name: "edit",
      component: EditResume,
      props: true,
    },
    {
      path: "/Education",
      name: "AddEducation",
      component: AddEducation,
      props: true,
    },
    {
      path: "/EditResume/", // Path for editing a resume
      name: "EditResume",
      component: EditResume,
      props: true,
    },

    {
        path: '/adminUserManager',
        name: 'adminUserManager',
        component: AdminUserManager,
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/adminRequests',
      name: 'adminRequests',
      component: AdminRequests,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/add-comment/:id',
      name: 'AddComment',
      component: AddComment
    },

    {
      path: "/Experiences",  // Path for adding education
      name: "Experiences",
      component: Experience,  // Component for adding a new education entry
      props: true,

    }
   


  ],
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const user = Utils.getStore("user");
  
  // If route requires auth and user is not logged in
  if (to.meta.requiresAuth && !user) {
    next({ name: 'login' });
    return;
  }
  
  // If trying to access admin routes without admin role
  if (to.meta.requiresAdmin && user?.role !== 'admin') {
    next({ name: 'home' });
    return;
  }
  
  next();
});

export default router;
