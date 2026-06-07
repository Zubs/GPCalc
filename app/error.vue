<template>
  <div class="error-page">
    <div class="error-inner animate-fade-up">
      <div class="error-num display">404</div>
      <h1 class="error-title">Page not found</h1>
      <p class="error-sub">The page you're looking for doesn't exist or has been moved.</p>
      <div class="error-actions">
        <NuxtLink to="/" class="btn btn-primary">Go home</NuxtLink>
        <NuxtLink to="/dashboard" class="btn btn-ghost">Dashboard</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
}

.error-inner {
  max-width: 400px;
}

.error-num {
  font-size: 8rem;
  font-weight: 300;
  color: var(--amber-400);
  opacity: 0.4;
  line-height: 1;
  margin-bottom: 16px;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 10px;
}

.error-sub {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin-bottom: 32px;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
