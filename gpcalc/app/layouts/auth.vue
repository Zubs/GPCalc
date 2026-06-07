<template>
  <div class="layout-auth">
    <div class="auth-bg">
      <div class="bg-blob b1"></div>
      <div class="bg-blob b2"></div>
      <div class="bg-grid"></div>
    </div>

    <header class="auth-header">
      <NuxtLink to="/" class="logo">
        <span class="logo-icon">GP</span>
        <span class="logo-text">Calc</span>
      </NuxtLink>
      <ColorModeToggle />
    </header>

    <main class="auth-main">
      <slot />
    </main>

    <footer class="auth-footer">
      <p>© {{ new Date().getFullYear() }} GPCalc &mdash; Built for students.</p>
    </footer>
  </div>
</template>

<style scoped>
.layout-auth {
  min-height: 100vh;
  display: flex; flex-direction: column;
  position: relative; overflow: hidden;
}

.auth-bg {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
}
.bg-blob {
  position: absolute; border-radius: 50%;
  filter: blur(100px); opacity: 0.18;
}
.b1 {
  width: 600px; height: 600px;
  background: var(--accent);
  top: -200px; right: -100px;
}
.b2 {
  width: 500px; height: 500px;
  background: #3b82f6;
  bottom: -200px; left: -100px;
  opacity: 0.1;
}
.bg-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 48px 48px;
}
.light .bg-grid {
  background-image:
    linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
}

.auth-header {
  position: relative; z-index: 1;
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 32px;
}
.logo {
  display: flex; align-items: center; gap: 6px;
  font-family: var(--font-display); font-size: 1.2rem;
}
.logo-icon {
  background: var(--accent); color: var(--navy-950);
  width: 30px; height: 30px; border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.72rem; font-weight: 700; font-family: var(--font-body);
}
.logo-text { color: var(--text-primary); }

.auth-main {
  flex: 1; display: flex; align-items: center; justify-content: center;
  padding: 24px; position: relative; z-index: 1;
}
.auth-footer {
  position: relative; z-index: 1;
  text-align: center; padding: 16px;
  font-size: 0.78rem; color: var(--text-muted);
}
</style>
