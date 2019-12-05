import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import( '../views/data-scan.vue')

  },
  {
    path: '/keyword',
    name: 'keyword',
    component: () => import( '../views/keyword.vue')
  },
  {
    path: '/share',
    name: 'share',
    component: () => import( '../views/share.vue'),
    children:[
        {
          path:'',
          name:'member',
          component:() => import( '../components/share/card/member.vue'),
        },
        {
          path:'request',
          name:'request',
          component:() => import( '../components/share/card/request.vue'),
        },
        {
          path:'invite',
          name:'invite',
          component:() => import( '../components/share/card/invite.vue'),
        }
    ]
  },
  {
    name:'shop',
    path:'/shop',
    component:() => import( '../views/shop.vue'),
    children:[
      {
        name:'cua-hang',
        path:'',
        component:() => import( '../components/shop/cua-hang')
      },
      {
        name:'cua-hang',
        path:'doi-thu',
        component:() => import( '../components/shop/doi-thu')
      },

    ]
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router
