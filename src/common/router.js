// import Loadable from '../utils/loadable.js'
import React from 'react'

const BasicLayout = React.lazy(() => import(/* webpackChunkName: "BasicLayout" */ '@/layouts/BasicLayout'))

const Entrance = React.lazy(() => import(/* webpackChunkName: "Entrance" */ '@/routes/Entrance/index'))
const Login = React.lazy(() => import(/* webpackChunkName: "Login" */ '@/routes/Login/index'))

const PageNotFound = React.lazy(() => import(/* webpackChunkName: "PageNotFound" */ '@/components/PageNotFound/'))

const routes = [
  {
    component: BasicLayout,
    routes: [
      {
        path: '/',
        exact: true,
        component: Entrance
      },
      {
        path: '/login',
        exact: false,
        component: Login
      },
      /* {
        path: '/index',
        component: IndexLayout,
        routes: [
          {
            name: '模特图',
            path: '/index/PictureModel/',
            component: PictureModel
          }
        ]
      }, */
      {
        path: '*',
        component: PageNotFound
      }
    ]
  }
]

export default routes
