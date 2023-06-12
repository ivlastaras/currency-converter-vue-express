import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import ExchangeRates from '../views/ExchangeRates.vue'
import ExchangeRatesBaseTarget from '../views/ExchangeRatesBaseTarget.vue'
import ExchangeRateCCU from '../views/ExchangeRateCCU.vue'
import Conversion from '../views/Conversion.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/exchangerates',
    name: 'Exchangerates',
    component: ExchangeRates
  },
  {
    path: '/exchangerates/:base/:target',
    name: 'Exchangeratesbasetarget',
    component: ExchangeRatesBaseTarget,
    props: true
  },
  {
    path: '/exchangerateccu',
    name: 'Exchangerateccu',
    component: ExchangeRateCCU,
  },
  {
    path: '/conversion',
    name: 'Conversion',
    component: Conversion,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
