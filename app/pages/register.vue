<template>
  <div class="auth-box animate-fade-up">
    <div class="auth-card">
      <div class="auth-head">
        <h1 class="auth-title display">Create your account</h1>
        <p class="auth-sub">Free forever. No credit card needed.</p>
      </div>

      <form class="auth-form" @submit.prevent="handleRegister">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="name">Full name</label>
            <input id="name" v-model="form.name" type="text" class="form-input"
                   placeholder="Your name" required :disabled="loading"/>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="email">Email address</label>
          <input id="email" v-model="form.email" type="email" class="form-input"
                 placeholder="you@university.edu" autocomplete="email" required :disabled="loading"/>
        </div>

        <div class="form-group">
          <label class="form-label" for="institution">Institution <span class="optional">(optional)</span></label>
          <input id="institution" v-model="form.institution" type="text" class="form-input"
                 placeholder="University of Lagos" :disabled="loading"/>
        </div>

        <div class="form-group">
          <label class="form-label" for="scale">Grading scale</label>
          <select id="scale" v-model="form.scale" class="form-input form-select" :disabled="loading">
            <option value="4.0">4.0 Scale (US)</option>
            <option value="5.0">5.0 Scale (Nigeria)</option>
            <option value="uk">UK Degree Classifications</option>
          </select>
          <span class="form-hint">You can change this at any time in Settings.</span>
        </div>

        <div class="form-group">
          <label class="form-label" for="password">Password</label>
          <div class="input-wrap">
            <input id="password" v-model="form.password" :type="showPw ? 'text' : 'password'"
                   class="form-input" placeholder="At least 8 characters"
                   autocomplete="new-password" required minlength="8" :disabled="loading"/>
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
          <!-- Strength meter -->
          <div class="pw-strength" v-if="form.password">
            <div class="strength-bars">
              <div v-for="n in 4" :key="n" class="strength-bar"
                   :class="{ active: n <= strength.level, [`level-${strength.level}`]: n <= strength.level }"></div>
            </div>
            <span class="strength-label" :class="`level-${strength.level}`">{{ strength.label }}</span>
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

        <button type="submit" class="btn btn-primary btn-full" :disabled="loading || strength.level < 1">
          <span v-if="!loading">Create account</span>
          <span v-else class="loading-dots"><span></span><span></span><span></span></span>
        </button>

        <p class="terms-note">
          By creating an account you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </p>
      </form>
    </div>

    <p class="auth-switch">
      Already have an account?
      <NuxtLink to="/login" class="auth-link">Sign in</NuxtLink>
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
const form = reactive({
  name: '',
  email: '',
  institution: '',
  scale: '4.0',
  password: ''
})
const loading = ref(false)
const error = ref('')
const showPw = ref(false)

const strength = computed(() => {
  const p = form.password
  if (!p) {
    return { level: 0, label: '' }
  }

  let score = 0
  if (p.length >= 8) {
    score++
  }

  if (p.length >= 12) {
    score++
  }

  if (/[A-Z]/.test(p) && /[0-9]/.test(p)) {
    score++
  }

  if (/[^A-Za-z0-9]/.test(p)) {
    score++
  }

  const labels = [
    '',
    'Weak',
    'Fair',
    'Good',
    'Strong'
  ]

  return { level: score, label: labels[score] }
})

async function handleRegister() {
  error.value = ''
  loading.value = true
  try {
    await auth.register(
      form.name,
      form.email,
      form.password,
      form.institution
    )

    academic.setScale(form.scale as any)
    await router.push('/dashboard')
  } catch (e) {
    error.value = 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-box {
  width: 100%;
  max-width: 460px;
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
  font-size: 1.9rem;
  margin-bottom: 6px;
}

.auth-sub {
  font-size: 0.88rem;
  color: var(--text-muted);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.optional {
  font-size: 0.76rem;
  color: var(--text-muted);
  font-weight: 400;
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

.pw-strength {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}

.strength-bars {
  display: flex;
  gap: 4px;
}

.strength-bar {
  height: 3px;
  width: 36px;
  border-radius: 2px;
  background: var(--bg-overlay);
  transition: background 0.2s;
}

.strength-bar.active.level-1 {
  background: var(--red-500);
}

.strength-bar.active.level-2 {
  background: #f59e0b;
}

.strength-bar.active.level-3 {
  background: #84cc16;
}

.strength-bar.active.level-4 {
  background: var(--green-500);
}

.strength-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.strength-label.level-1 {
  color: var(--red-500);
}

.strength-label.level-2 {
  color: #f59e0b;
}

.strength-label.level-3 {
  color: #84cc16;
}

.strength-label.level-4 {
  color: var(--green-500);
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

.terms-note {
  font-size: 0.78rem;
  color: var(--text-muted);
  text-align: center;
  line-height: 1.5;
}

.terms-note a {
  color: var(--accent);
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
