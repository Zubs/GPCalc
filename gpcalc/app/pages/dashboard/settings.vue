<template>
  <div class="settings-page animate-fade-in">
    <div class="page-head">
      <div>
        <h1 class="page-title">Settings</h1>
        <p class="page-sub">Manage your profile, grading scale, and data.</p>
      </div>
    </div>

    <div class="settings-body">
      <!-- Left column -->
      <div class="settings-col">

        <!-- Profile -->
        <div class="card settings-card">
          <h2 class="card-title">Profile</h2>
          <div class="avatar-row">
            <div class="avatar-lg">{{ auth.user?.avatarInitials }}</div>
            <div>
              <p class="avatar-name">{{ auth.user?.name }}</p>
              <p class="avatar-email">{{ auth.user?.email }}</p>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Full name</label>
            <input v-model="profile.name" class="form-input" placeholder="Your name" />
          </div>
          <div class="form-group">
            <label class="form-label">Email address</label>
            <input v-model="profile.email" type="email" class="form-input" placeholder="you@university.edu" />
          </div>
          <div class="form-group">
            <label class="form-label">Institution <span class="optional">(optional)</span></label>
            <input v-model="profile.institution" class="form-input" placeholder="University name" />
          </div>

          <div v-if="profileSaved" class="save-toast">✓ Profile updated</div>

          <button class="btn btn-primary" @click="saveProfile" :disabled="profileSaving">
            {{ profileSaving ? 'Saving…' : 'Save profile' }}
          </button>
        </div>

        <!-- Appearance -->
        <div class="card settings-card">
          <h2 class="card-title">Appearance</h2>
          <div class="form-group">
            <label class="form-label">Theme</label>
            <div class="theme-options">
              <button
                v-for="mode in ['dark', 'light', 'system']" :key="mode"
                :class="['theme-btn', { active: $colorMode.preference === mode }]"
                @click="$colorMode.preference = mode">
                <span class="theme-icon">
                  <svg v-if="mode === 'dark'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                  <svg v-else-if="mode === 'light'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                </span>
                {{ mode.charAt(0).toUpperCase() + mode.slice(1) }}
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- Right column -->
      <div class="settings-col">

        <!-- Grading scale -->
        <div class="card settings-card">
          <h2 class="card-title">Grading scale</h2>
          <p class="card-sub">This affects how GPA points are calculated across all your semesters.</p>

          <div class="scale-options">
            <label
              v-for="s in scales" :key="s.value"
              :class="['scale-option', { active: academic.gradingScale === s.value }]">
              <input type="radio" :value="s.value" v-model="selectedScale" class="sr-only" />
              <div class="scale-option-inner">
                <div class="scale-flag">{{ s.flag }}</div>
                <div class="scale-info">
                  <span class="scale-name">{{ s.name }}</span>
                  <span class="scale-desc">{{ s.desc }}</span>
                </div>
                <div class="scale-check" v-if="academic.gradingScale === s.value">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              </div>
            </label>
          </div>

          <div class="scale-warning" v-if="selectedScale !== academic.gradingScale">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Changing scale will recalculate all GPAs. Your grades remain unchanged.
          </div>

          <button class="btn btn-primary" :disabled="selectedScale === academic.gradingScale" @click="saveScale">
            Apply scale
          </button>
        </div>

        <!-- Data management -->
        <div class="card settings-card">
          <h2 class="card-title">Data</h2>
          <p class="card-sub">Export or reset your academic data.</p>

          <div class="data-actions">
            <div class="data-action-row">
              <div class="data-action-info">
                <span class="da-title">Export data</span>
                <span class="da-desc">Download all your academic records as JSON.</span>
              </div>
              <button class="btn btn-ghost btn-sm" @click="exportData">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Export
              </button>
            </div>

            <div class="divider"></div>

            <div class="data-action-row">
              <div class="data-action-info">
                <span class="da-title">Load demo data</span>
                <span class="da-desc">Populate with sample courses and semesters.</span>
              </div>
              <button class="btn btn-ghost btn-sm" @click="academic.loadDemo()">Load demo</button>
            </div>

            <div class="divider"></div>

            <div class="data-action-row danger-row">
              <div class="data-action-info">
                <span class="da-title danger-text">Clear all data</span>
                <span class="da-desc">Permanently delete all semesters and courses.</span>
              </div>
              <button class="btn btn-danger btn-sm" @click="confirmClear">Clear</button>
            </div>
          </div>
        </div>

        <!-- Account -->
        <div class="card settings-card">
          <h2 class="card-title">Account</h2>
          <div class="account-actions">
            <div class="data-action-row danger-row">
              <div class="data-action-info">
                <span class="da-title">Sign out</span>
                <span class="da-desc">Sign out from this device.</span>
              </div>
              <button class="btn btn-ghost btn-sm" @click="logout">Sign out</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore }    from '~/stores/auth'
import { useAcademicStore } from '~/stores/academic'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const auth     = useAuthStore()
const academic = useAcademicStore()
const router   = useRouter()

const profile = reactive({
  name:        auth.user?.name        ?? '',
  email:       auth.user?.email       ?? '',
  institution: auth.user?.institution ?? '',
})

const profileSaving = ref(false)
const profileSaved  = ref(false)
const selectedScale = ref(academic.gradingScale)

const scales = [
  { value: '4.0', flag: '🇺🇸', name: '4.0 Scale', desc: 'Standard US university system' },
  { value: '5.0', flag: '🇳🇬', name: '5.0 Scale', desc: 'Common in Nigerian universities' },
  { value: 'uk',  flag: '🇬🇧', name: 'UK Classifications', desc: 'First, 2:1, 2:2, Third' },
]

async function saveProfile() {
  profileSaving.value = true
  await new Promise(r => setTimeout(r, 600))
  auth.updateUser({ name: profile.name, email: profile.email, institution: profile.institution })
  profileSaving.value = false
  profileSaved.value  = true
  setTimeout(() => { profileSaved.value = false }, 2500)
}

function saveScale() {
  academic.setScale(selectedScale.value as any)
}

function exportData() {
  const data = { years: academic.years, scale: academic.gradingScale, exportedAt: new Date().toISOString() }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = 'gpcalc-export.json'; a.click()
  URL.revokeObjectURL(url)
}

function confirmClear() {
  if (confirm('This will permanently delete all your academic data. Continue?')) {
    academic.years.splice(0)
    if (import.meta.client) localStorage.removeItem('gpcalc_years')
  }
}

async function logout() {
  auth.logout()
  await router.push('/')
}
</script>

<style scoped>
.settings-page { display: flex; flex-direction: column; gap: 24px; }
.page-head { display: flex; justify-content: space-between; align-items: flex-start; }
.page-title { font-size: 1.5rem; font-weight: 500; margin-bottom: 4px; }
.page-sub { font-size: 0.85rem; color: var(--text-muted); }

.settings-body { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start; }
.settings-col { display: flex; flex-direction: column; gap: 20px; }

.card { background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.card-title { font-size: 1rem; font-weight: 500; }
.card-sub { font-size: 0.82rem; color: var(--text-muted); margin-top: -8px; }
.optional { font-size: 0.76rem; color: var(--text-muted); font-weight: 400; }

/* Profile */
.avatar-row { display: flex; align-items: center; gap: 14px; }
.avatar-lg {
  width: 52px; height: 52px; border-radius: 50%;
  background: var(--accent-subtle); color: var(--amber-400);
  border: 1px solid rgba(245,166,35,0.25);
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem; font-weight: 600; flex-shrink: 0;
}
.avatar-name { font-size: 0.95rem; font-weight: 500; }
.avatar-email { font-size: 0.8rem; color: var(--text-muted); }
.save-toast {
  background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2);
  color: var(--green-400); border-radius: var(--radius-md);
  padding: 8px 12px; font-size: 0.85rem;
}

/* Theme */
.theme-options { display: flex; gap: 8px; }
.theme-btn {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
  padding: 9px 12px; background: var(--bg-elevated);
  border: 1px solid var(--border); border-radius: var(--radius-md);
  color: var(--text-secondary); font-size: 0.85rem; cursor: pointer;
  transition: all 0.15s;
}
.theme-btn:hover { border-color: var(--border-strong); color: var(--text-primary); }
.theme-btn.active { border-color: var(--amber-400); background: var(--accent-subtle); color: var(--amber-400); }
.theme-icon { display: flex; }

/* Scale options */
.scale-options { display: flex; flex-direction: column; gap: 8px; }
.scale-option {
  border: 1px solid var(--border); border-radius: var(--radius-md);
  padding: 14px 16px; cursor: pointer; transition: all 0.15s;
}
.scale-option:hover { border-color: var(--border-strong); background: var(--bg-elevated); }
.scale-option.active { border-color: var(--amber-400); background: var(--accent-subtle); }
.scale-option-inner { display: flex; align-items: center; gap: 12px; }
.scale-flag { font-size: 1.4rem; }
.scale-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.scale-name { font-size: 0.9rem; font-weight: 500; }
.scale-desc { font-size: 0.78rem; color: var(--text-muted); }
.scale-check { color: var(--amber-400); }
.scale-warning {
  display: flex; align-items: flex-start; gap: 8px;
  background: rgba(245,166,35,0.08); border: 1px solid rgba(245,166,35,0.2);
  color: var(--amber-400); border-radius: var(--radius-md);
  padding: 10px 12px; font-size: 0.82rem; line-height: 1.5;
}

/* Data actions */
.data-actions { display: flex; flex-direction: column; gap: 0; }
.data-action-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px 0; }
.data-action-info { display: flex; flex-direction: column; gap: 3px; }
.da-title { font-size: 0.88rem; font-weight: 500; }
.da-desc  { font-size: 0.78rem; color: var(--text-muted); }
.danger-text { color: var(--red-500); }
.account-actions { display: flex; flex-direction: column; gap: 0; }

@media (max-width: 768px) {
  .settings-body { grid-template-columns: 1fr; }
}
</style>
