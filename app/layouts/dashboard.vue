<template>
  <div class="layout-dashboard">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-header">
        <NuxtLink to="/" class="logo">
          <span class="logo-icon">GP</span>
          <span class="logo-text">Calc</span>
        </NuxtLink>
        <button class="sidebar-close" @click="sidebarOpen=false">✕</button>
      </div>

      <nav class="sidebar-nav">
        <NuxtLink to="/dashboard" class="nav-item" exact-active-class="active" @click="sidebarOpen=false">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          Overview
        </NuxtLink>
        <NuxtLink to="/dashboard/semesters" class="nav-item" active-class="active" @click="sidebarOpen=false">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M4 6h16M4 10h16M4 14h10"/>
          </svg>
          Semesters
        </NuxtLink>
        <NuxtLink to="/dashboard/forecast" class="nav-item" active-class="active" @click="sidebarOpen=false">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
            <polyline points="16 7 22 7 22 13"/>
          </svg>
          Forecaster
        </NuxtLink>
        <NuxtLink to="/dashboard/settings" class="nav-item" active-class="active" @click="sidebarOpen=false">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="12" cy="12" r="3"/>
            <path
                d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
          </svg>
          Settings
        </NuxtLink>
      </nav>

      <div class="sidebar-footer">
        <div class="user-card">
          <div class="avatar">{{ auth.user?.avatarInitials }}</div>
          <div class="user-info">
            <p class="user-name">{{ auth.user?.name }}</p>
            <p class="user-email">{{ auth.user?.email }}</p>
          </div>
        </div>
        <div class="sidebar-footer-actions">
          <ColorModeToggle/>
          <button class="btn btn-ghost btn-sm" @click="handleLogout">Sign out</button>
        </div>
      </div>
    </aside>

    <!-- Overlay for mobile -->
    <div v-if="sidebarOpen" class="sidebar-overlay" @click="sidebarOpen=false"/>

    <!-- Main content -->
    <div class="dashboard-main">
      <header class="dash-topbar">
        <button class="mobile-menu-btn" @click="sidebarOpen=true" aria-label="Open menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <div class="topbar-breadcrumb">
          <span class="breadcrumb-page">{{ pageTitle }}</span>
        </div>
        <div class="topbar-right">
          <span class="cgpa-chip">
            CGPA <strong>{{ academic.cgpa.toFixed(2) }}</strong>
          </span>
        </div>
      </header>

      <main class="dash-content">
        <slot/>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useAcademicStore } from '~/stores/academic'

const auth = useAuthStore()
const academic = useAcademicStore()
const router = useRouter()
const route = useRoute()
const sidebarOpen = ref(false)

const pageTitle = computed(() => {
  const map: Record<string, string> = {
    '/dashboard': 'Overview',
    '/dashboard/semesters': 'Semesters',
    '/dashboard/forecast': 'Forecaster',
    '/dashboard/settings': 'Settings',
  }
  return map[route.path] || 'Dashboard'
})

async function handleLogout() {
  auth.logout()
  await router.push('/')
}
</script>

<style scoped>
.layout-dashboard {
  display: flex;
  min-height: 100vh;
}

/* ── Sidebar ── */
.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: var(--bg-surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 16px;
  border-bottom: 1px solid var(--border);
}

.logo {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-display);
  font-size: 1.2rem;
}

.logo-icon {
  background: var(--accent);
  color: var(--navy-950);
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 700;
  font-family: var(--font-body);
}

.logo-text {
  color: var(--text-primary);
}

.sidebar-close {
  display: none;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1rem;
}

.sidebar-nav {
  flex: 1;
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  font-size: 0.88rem;
  font-weight: 400;
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  transition: all 0.15s;
}

.nav-item:hover {
  color: var(--text-primary);
  background: var(--bg-elevated);
}

.nav-item.active {
  color: var(--text-primary);
  background: var(--bg-elevated);
  font-weight: 500;
}

.nav-item.active svg {
  color: var(--accent);
}

.sidebar-footer {
  border-top: 1px solid var(--border);
  padding: 14px 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--accent-subtle);
  color: var(--amber-400);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  font-weight: 600;
  flex-shrink: 0;
  border: 1px solid rgba(245, 166, 35, 0.2);
}

.user-info {
  overflow: hidden;
}

.user-name {
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 0.75rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-footer-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-overlay {
  display: none;
}

/* ── Dashboard main ── */
.dashboard-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.dash-topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  height: 56px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--bg-base);
  border-bottom: 1px solid var(--border);
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: var(--text-secondary);
}

.topbar-breadcrumb {
  flex: 1;
}

.breadcrumb-page {
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--text-primary);
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cgpa-chip {
  font-size: 0.8rem;
  color: var(--text-muted);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  padding: 4px 12px;
  border-radius: 20px;
}

.cgpa-chip strong {
  color: var(--amber-400);
  font-weight: 600;
}

.dash-content {
  flex: 1;
  padding: 28px 28px 48px;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
}

/* ── Mobile ── */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 200;
    transform: translateX(-100%);
    transition: transform 0.25s var(--ease);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .sidebar-close {
    display: block;
  }

  .sidebar-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 199;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .dash-content {
    padding: 20px 16px 48px;
  }
}
</style>
