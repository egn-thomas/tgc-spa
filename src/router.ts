import { createRouter, createWebHistory } from 'vue-router'

import DeckCreatePage from './pages/DeckCreatePage.vue'
import DeckDetailPage from './pages/DeckDetailPage.vue'
import DeckEditPage from './pages/DeckEditPage.vue'
import GamePage from './pages/GamePage.vue'
import HomePage from './pages/HomePage.vue'
import SignInPage from './pages/SignInPage.vue'
import SignUpPage from './pages/SignUpPage.vue'
import { useAuthStore } from './store/auth'

export const ROUTES = {
  HOME: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  DECK_CREATE: '/decks/new',
  DECK_DETAIL: (id: string | number) => `/decks/${id}`,
  DECK_EDIT: (id: string | number) => `/decks/${id}/edit`,
  GAME: '/game',
} as const

const routes = [
  { path: ROUTES.HOME, component: HomePage, meta: { requiresAuth: true } },
  {
    path: ROUTES.SIGN_IN,
    component: SignInPage,
    meta: { requiresGuest: true },
  },
  {
    path: ROUTES.SIGN_UP,
    component: SignUpPage,
    meta: { requiresGuest: true },
  },
  {
    path: ROUTES.DECK_CREATE,
    component: DeckCreatePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/decks/:id',
    component: DeckDetailPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/decks/:id/edit',
    component: DeckEditPage,
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.GAME,
    component: GamePage,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guard de navigation pour protéger les routes
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  // RG2 : Rediriger vers sign-in si route privée et non authentifié
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next(ROUTES.SIGN_IN)
  }

  // RG3 : Rediriger vers home si pages sign-in/sign-up et déjà authentifié
  if (to.meta.requiresGuest && isAuthenticated) {
    return next(ROUTES.HOME)
  }

  next()
})

export default router
