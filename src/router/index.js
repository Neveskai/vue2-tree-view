import Vue from 'vue'
import VueRouter from 'vue-router'
import TreeView from '../pages/TreeView.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: TreeView,
    },
  ],
})

export default router
