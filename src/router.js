import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";
import ResumeList from "./views/ResumeList.vue";
import EditResume from "./views/EditResume.vue";
import AddResume from "./views/AddResume.vue";
import ViewResume from "./views/ViewResume.vue";
import Experience from "./views/Experience.vue";
import Skill from "./views/Skill.vue";
import home from "./views/home.vue";

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
      path: "/edit/:id",  // Edit resume path with dynamic id
      name: "edit",
      component: EditResume,
      props: true,
    },
    {
      // path: "/experience/:resumeId?", // Use `?` to make `resumeId` optional
      path: "/experience", // Use `?` to make `resumeId` optional

      name: "Experience",
      component: Experience,
      props: true,
    },

    {
      path: "/skills", // Path to the Skill component
      name: "Skill",  // Route name changed to lowercase
      component: Skill,
      props: true,
    },
    
    {
      path: "/view/:id",  // View resume path with dynamic id
      name: "view",
      component: ViewResume,
      props: true,
    },
  ],
});

export default router;
