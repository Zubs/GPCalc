<template>
  <div class="auth-box animate-fade-up">
    <div class="auth-card">
      <div class="auth-head">
        <h1 class="auth-title display">Welcome back</h1>
        <p class="auth-sub">Sign in to continue tracking your grades.</p>
      </div>

      <form class="auth-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label" for="email">Email address</label>
          <input
              id="email" v-model="form.email" type="email"
              class="form-input" placeholder="you@university.edu"
              autocomplete="email" required :disabled="loading"
          />
        </div>

        <div class="form-group">
          <div class="label-row">
            <label class="form-label" for="password">Password</label>
            <a href="#" class="forgot-link">Forgot password?</a>
          </div>
          <div class="input-wrap">
            <input
                id="password" v-model="form.password"
                :type="showPw ? 'text' : 'password'"
                class="form-input" placeholder="••••••••"
                autocomplete="current-password" required :disabled="loading"
            />
            <button type="button" class="pw-toggle" @click="showPw = !showPw" tabindex="-1">
              <svg v-if="!showPw" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
          </div>
        </div>

        <div v-if="error" class="auth-error">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {{ error }}
        </div>

        <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
          <span v-if="!loading">Sign in</span>
          <span v-else class="loading-dots">
            <span></span><span></span><span></span>
          </span>
        </button>
      </form>

      <div class="auth-divider">
        <div class="divider"></div>
        <span class="divider-text">or</span>
        <div class="divider"></div>
      </div>

      <button class="btn btn-ghost btn-full demo-btn" @click="handleDemo" :disabled="loading">
        Try with demo data
      </button>
    </div>

    <p class="auth-switch">
      Don't have an account?
      <NuxtLink to="/register" class="auth-link">Create one free</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useAcademicStore } from '~/stores/academic'

definePageMeta({ layout: 'auth', middleware: 'guest' })

const auth = useAuthStore()
const academic = useAcademicStore()
const router = useRouter()
const route = useRoute()
const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')
const showPw = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(form.email, form.password)
    const redirect = route.query.redirect as string || '/dashboard'
    await router.push(redirect)
  } catch (e) {
    error.value = 'Invalid credentials. Please try again.'
  } finally {
    loading.value = false
  }
}

async function handleDemo() {
  loading.value = true
  await auth.login('demo@student.edu', 'demo')
  academic.loadDemo()
  await router.push('/dashboard')
  loading.value = false
}
</script>

<style scoped>
.auth-box {
  width: 100%;
  max-width: 440px;
}

.auth-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-xl);
  padding: 40px 36px;
  box-shadow: var(--shadow-lg);
}

.auth-head {
  margin-bottom: 28px;
}

.auth-title {
  font-size: 2rem;
  margin-bottom: 6px;
}

.auth-sub {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 20px;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-link {
  font-size: 0.8rem;
  color: var(--text-muted);
  transition: color 0.15s;
}

.forgot-link:hover {
  color: var(--accent);
}

.input-wrap {
  position: relative;
}

.input-wrap .form-input {
  padding-right: 42px;
}

.pw-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  transition: color 0.15s;
}

.pw-toggle:hover {
  color: var(--text-secondary);
}

.auth-error {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: var(--red-500);
  border-radius: var(--radius-md);
  padding: 10px 12px;
  font-size: 0.85rem;
}

.auth-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0;
}

.divider-text {
  font-size: 0.78rem;
  color: var(--text-muted);
  flex-shrink: 0;
}

.demo-btn {
  font-size: 0.85rem;
}

.auth-switch {
  margin-top: 20px;
  text-align: center;
  font-size: 0.87rem;
  color: var(--text-muted);
}

.auth-link {
  color: var(--accent);
  font-weight: 500;
}

.auth-link:hover {
  text-decoration: underline;
}

/* Loading dots */
.loading-dots {
  display: flex;
  gap: 4px;
  align-items: center;
}

.loading-dots span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 1.2s ease-in-out infinite;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}
</style>
