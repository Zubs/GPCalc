<template>
  <div class="layout-default">
    <header class="site-header" :class="{ scrolled }">
      <div class="container header-inner">
        <NuxtLink to="/" class="logo">
          <span class="logo-icon">GP</span>
          <span class="logo-text">Calc</span>
        </NuxtLink>

        <nav class="nav-links">
          <NuxtLink to="/#features" class="nav-link">Features</NuxtLink>
          <NuxtLink to="/#how-it-works" class="nav-link">How it works</NuxtLink>
          <NuxtLink to="/#scales" class="nav-link">Grading scales</NuxtLink>
        </nav>

        <div class="header-actions">
          <ColorModeToggle/>
          <NuxtLink v-if="!auth.isAuthenticated" to="/login" class="btn btn-ghost btn-sm">Sign in</NuxtLink>
          <NuxtLink v-if="!auth.isAuthenticated" to="/register" class="btn btn-primary btn-sm">Get started</NuxtLink>
          <NuxtLink v-else to="/dashboard" class="btn btn-primary btn-sm">Dashboard →</NuxtLink>
        </div>

        <button class="mobile-menu-btn" @click="mobileOpen = !mobileOpen" aria-label="Menu">
          <span :class="['bar', { open: mobileOpen }]"></span>
        </button>
      </div>

      <!-- Mobile nav -->
      <Transition name="mobile-nav">
        <div v-if="mobileOpen" class="mobile-nav">
          <NuxtLink to="/#features" class="mobile-link" @click="mobileOpen=false">Features</NuxtLink>
          <NuxtLink to="/#how-it-works" class="mobile-link" @click="mobileOpen=false">How it works</NuxtLink>
          <NuxtLink to="/#scales" class="mobile-link" @click="mobileOpen=false">Grading scales</NuxtLink>
          <div class="mobile-actions">
            <NuxtLink to="/login" class="btn btn-ghost btn-full" @click="mobileOpen=false">Sign in</NuxtLink>
            <NuxtLink to="/register" class="btn btn-primary btn-full" @click="mobileOpen=false">Get started free
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </header>

    <main>
      <slot/>
    </main>

    <footer class="site-footer">
      <div class="container footer-inner">
        <div class="footer-brand">
          <NuxtLink to="/" class="logo">
            <span class="logo-icon">GP</span>
            <span class="logo-text">Calc</span>
          </NuxtLink>
          <p class="footer-tagline">Your academic journey, tracked.</p>
        </div>
        <div class="footer-links">
          <div class="footer-col">
            <p class="footer-col-title">Product</p>
            <NuxtLink to="/#features">Features</NuxtLink>
            <NuxtLink to="/register">Get started</NuxtLink>
          </div>
          <div class="footer-col">
            <p class="footer-col-title">Support</p>
            <a href="mailto:hello@gpcalc.app">Contact</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container">
          <p>© {{ new Date().getFullYear() }} GPCalc. Built for students, by students.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const scrolled = ref(false)
const mobileOpen = ref(false)

onMounted(() => {
  window.addEventListener('scroll', () => {
    scrolled.value = window.scrollY > 20
  })
})
</script>

<style scoped>
.layout-default {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ── Header ── */
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0;
  transition: background 0.3s, backdrop-filter 0.3s, border-color 0.3s;
  border-bottom: 1px solid transparent;
}

.site-header.scrolled {
  background: rgba(10, 15, 30, 0.85);
  backdrop-filter: blur(16px);
  border-bottom-color: var(--border);
}

.light .site-header.scrolled {
  background: rgba(244, 246, 251, 0.88);
}

.header-inner {
  display: flex;
  align-items: center;
  gap: 32px;
  height: 64px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 1.3rem;
  letter-spacing: -0.01em;
  flex-shrink: 0;
}

.logo-icon {
  background: var(--accent);
  color: var(--navy-950);
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  font-family: var(--font-body);
  letter-spacing: 0.02em;
}

.logo-text {
  color: var(--text-primary);
}

.nav-links {
  display: flex;
  gap: 4px;
  margin-left: auto;
}

.nav-link {
  padding: 6px 14px;
  font-size: 0.88rem;
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  transition: color 0.15s, background 0.15s;
}

.nav-link:hover {
  color: var(--text-primary);
  background: var(--bg-elevated);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  padding: 6px;
  margin-left: auto;
}

.bar {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--text-secondary);
  border-radius: 2px;
  position: relative;
  transition: all 0.2s;
}

.bar::before, .bar::after {
  content: '';
  position: absolute;
  left: 0;
  width: 22px;
  height: 2px;
  background: var(--text-secondary);
  border-radius: 2px;
  transition: all 0.2s;
}

.bar::before {
  top: -7px;
}

.bar::after {
  top: 7px;
}

.bar.open {
  background: transparent;
}

.bar.open::before {
  top: 0;
  transform: rotate(45deg);
}

.bar.open::after {
  top: 0;
  transform: rotate(-45deg);
}

.mobile-nav {
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mobile-link {
  padding: 10px 12px;
  font-size: 0.95rem;
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  transition: color 0.15s, background 0.15s;
}

.mobile-link:hover {
  color: var(--text-primary);
  background: var(--bg-elevated);
}

.mobile-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.mobile-nav-enter-active, .mobile-nav-leave-active {
  transition: all 0.2s var(--ease);
}

.mobile-nav-enter-from, .mobile-nav-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ── Footer ── */
.site-footer {
  margin-top: auto;
  border-top: 1px solid var(--border);
}

.footer-inner {
  display: flex;
  gap: 48px;
  padding: 48px 0;
  flex-wrap: wrap;
}

.footer-brand {
  flex: 1;
  min-width: 180px;
}

.footer-tagline {
  margin-top: 8px;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.footer-links {
  display: flex;
  gap: 48px;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-col-title {
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

.footer-col a {
  font-size: 0.88rem;
  color: var(--text-secondary);
  transition: color 0.15s;
}

.footer-col a:hover {
  color: var(--text-primary);
}

.footer-bottom {
  border-top: 1px solid var(--border);
  padding: 16px 0;
}

.footer-bottom p {
  font-size: 0.82rem;
  color: var(--text-muted);
}

main {
  flex: 1;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .header-actions .btn {
    display: none;
  }

  .mobile-menu-btn {
    display: block;
  }
}
</style>
