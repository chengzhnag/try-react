// import Loadable from '../utils/loadable.js'
import React from 'react'

const BasicLayout = React.lazy(() => import(/* webpackChunkName: "BasicLayout" */ '@/layouts/BasicLayout'))

// const Entrance = React.lazy(() => import(/* webpackChunkName: "Entrance" */ '@/routes/Entrance/index'))

// const Login = React.lazy(() => import(/* webpackChunkName: "Login" */ '@/routes/Login/index'))
const addStation = React.lazy(() => import(/* webpackChunkName: "VerticalStation" */ '@/routes/VerticalStation/addStation'))
const audit = React.lazy(() => import(/* webpackChunkName: "VerticalStation" */ '@/routes/VerticalStation/audit'))
const detail = React.lazy(() => import(/* webpackChunkName: "VerticalStation" */ '@/routes/VerticalStation/detail'))
const index = React.lazy(() => import(/* webpackChunkName: "VerticalStation" */ '@/routes/VerticalStation/index'))
const list = React.lazy(() => import(/* webpackChunkName: "VerticalStation" */ '@/routes/VerticalStation/list'))
const orgMatch = React.lazy(() => import(/* webpackChunkName: "VerticalStation" */ '@/routes/VerticalStation/orgMatch'))
const orgMatchDetail = React.lazy(() => import(/* webpackChunkName: "VerticalStation" */ '@/routes/VerticalStation/orgMatchDetail'))

const PageNotFound = React.lazy(() => import(/* webpackChunkName: "PageNotFound" */ '@/components/PageNotFound/'))

const routes = [
  {
    component: BasicLayout,
    routes: [
      {
        path: '/',
        exact: true,
        component: index
      },
      {
        path: '/stationlist',
        exact: false,
        component: list
      },
      {
        path: '/stationdetail',
        exact: false,
        component: detail
      },
      {
        path: '/stationaudit',
        exact: false,
        component: audit
      },
      {
        path: '/addstation',
        exact: false,
        component: addStation
      },
      {
        path: '/orgMatch',
        exact: false,
        component: orgMatch
      },
      {
        path: '/orgMatchdetail',
        exact: false,
        component: orgMatchDetail
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
