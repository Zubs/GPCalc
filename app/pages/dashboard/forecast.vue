<template>
  <div class="forecast-page animate-fade-in">
    <div class="page-head">
      <div>
        <h1 class="page-title">Target Forecaster</h1>
        <p class="page-sub">Find out exactly what grades you need to hit your academic goal.</p>
      </div>
    </div>

    <!-- Current state card -->
    <div class="current-card">
      <div class="current-stat">
        <span class="cs-label">Current CGPA</span>
        <span class="cs-val amber">{{ academic.cgpa.toFixed(2) }}</span>
      </div>
      <div class="current-divider"></div>
      <div class="current-stat">
        <span class="cs-label">Credits earned</span>
        <span class="cs-val">{{ academic.totalCredits }}</span>
      </div>
      <div class="current-divider"></div>
      <div class="current-stat">
        <span class="cs-label">Classification</span>
        <span class="cs-val sm">{{ classification }}</span>
      </div>
      <div class="current-divider"></div>
      <div class="current-stat">
        <span class="cs-label">Scale</span>
        <span class="cs-val sm">{{ scaleLabel }}</span>
      </div>
    </div>

    <!-- Forecaster form -->
    <div class="forecast-body">
      <div class="forecast-form-col">
        <div class="card">
          <h2 class="card-title">Set your target</h2>

          <div class="form-group">
            <label class="form-label">Target CGPA</label>
            <div class="target-input-wrap">
              <input v-model.number="targetCGPA" type="number" class="form-input target-input"
                     :min="0" :max="academic.maxPoints" :step="0.01"
                     :placeholder="`0.00 – ${academic.maxPoints.toFixed(2)}`"/>
              <span class="target-max">/ {{ academic.maxPoints.toFixed(1) }}</span>
            </div>
            <div v-if="targetCGPA" class="target-classification">
              <span class="form-hint">That puts you in: </span>
              <span :class="['badge', targetBadge]">{{ targetClassification }}</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Upcoming credits</label>
            <input v-model.number="upcomingCredits" type="number" class="form-input"
                   min="1" max="300" placeholder="e.g. 60"/>
            <span class="form-hint">Total credit units you'll take going forward.</span>
          </div>

          <!-- Quick targets -->
          <div class="quick-targets">
            <p class="qt-label">Quick targets</p>
            <div class="qt-buttons">
              <button v-for="t in quickTargets" :key="t.label"
                      class="qt-btn"
                      :class="{ active: targetCGPA === t.value }"
                      @click="targetCGPA = t.value">
                <span class="qt-val">{{ t.value }}</span>
                <span class="qt-name">{{ t.label }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Result column -->
      <div class="forecast-result-col">
        <div class="result-card" :class="resultStatus">
          <template v-if="!result">
            <div class="result-empty">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"
                   opacity="0.3">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
                <polyline points="16 7 22 7 22 13"/>
              </svg>
              <p>Fill in your target to see the forecast</p>
            </div>
          </template>
          <template v-else>
            <p class="result-label">You need an average GPA of</p>
            <div class="result-gpa">{{ result.toFixed(2) }}</div>
            <p class="result-sublabel">across {{ upcomingCredits }} credits</p>

            <div class="result-status-row">
              <span v-if="result > academic.maxPoints" class="status-badge danger">
                ⚠ Target not achievable at this scale
              </span>
              <span v-else-if="result <= 0" class="status-badge success">
                ✓ You've already hit this target!
              </span>
              <span v-else-if="result >= academic.maxPoints * 0.9" class="status-badge warning">
                This is a stretch goal — stay focused
              </span>
              <span v-else class="status-badge success">
                This is within reach — keep it up
              </span>
            </div>

            <!-- Grade guide -->
            <div class="grade-guide">
              <p class="gg-title">What that looks like per course</p>
              <div v-for="g in gradeGuide" :key="g.grade" class="gg-row">
                <span class="gg-grade">{{ g.grade }}</span>
                <div class="gg-bar-wrap">
                  <div class="gg-bar"
                       :style="{ width: (g.points / academic.maxPoints * 100) + '%', background: g.points >= result ? 'var(--green-500)' : 'var(--red-500)' }"></div>
                </div>
                <span class="gg-points" :class="g.points >= result ? 'hit' : 'miss'">{{ g.points.toFixed(1) }}</span>
                <span class="gg-status">{{ g.points >= result ? '✓' : '✗' }}</span>
              </div>
            </div>
          </template>
        </div>

        <!-- Scenario table -->
        <div class="card scenarios-card" v-if="targetCGPA && upcomingCredits">
          <h3 class="card-title">Scenarios</h3>
          <p class="card-sub">How different upcoming GPAs affect your final CGPA</p>
          <div class="scenarios-table">
            <div class="scen-head">
              <span>Upcoming GPA</span>
              <span>Resulting CGPA</span>
              <span>Classification</span>
            </div>
            <div v-for="scen in scenarios" :key="scen.upcoming" class="scen-row"
                 :class="{ target: scen.upcoming === result }">
              <span class="scen-upcoming">{{ scen.upcoming.toFixed(2) }}</span>
              <span class="scen-cgpa" :class="cgpaClass(scen.cgpa)">{{ scen.cgpa.toFixed(2) }}</span>
              <span class="scen-class">{{ scen.classification }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAcademicStore } from '~/stores/academic'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const academic = useAcademicStore()
const targetCGPA = ref<number | ''>('')
const upcomingCredits = ref<number | ''>(60)

const result = computed(() => {
  if (!targetCGPA.value || !upcomingCredits.value) {
    return null
  }

  return academic.forecastRequiredGPA(+targetCGPA.value, +upcomingCredits.value)
})

const resultStatus = computed(() => {
  if (!result.value) {
    return ''
  }

  if (result.value > academic.maxPoints) {
    return 'status-impossible'
  }

  if (result.value <= 0) {
    return 'status-achieved'
  }

  if (result.value >= academic.maxPoints * 0.9) {
    return 'status-stretch'
  }

  return 'status-reachable'
})

const scaleLabel = computed(() => ({
  '4.0': '4.0 Scale', '5.0': '5.0 Scale', 'uk': 'UK Classification',
}[academic.gradingScale]))

function classify(cgpa: number) {
  const s = academic.gradingScale
  if (s === 'uk') {
    if (cgpa >= 3.7) {
      return 'First Class'
    }

    if (cgpa >= 3.0) {
      return 'Upper Second'
    }

    if (cgpa >= 2.7) {
      return 'Lower Second'
    }

    if (cgpa >= 2.0) {
      return 'Third Class'
    }

    return 'Fail'
  }

  const pct = cgpa / academic.maxPoints
  if (pct >= 0.9) {
    return 'First Class'
  }

  if (pct >= 0.8) {
    return '2nd Class Upper'
  }

  if (pct >= 0.7) {
    return '2nd Class Lower'
  }

  if (pct >= 0.6) {
    return 'Third Class'
  }

  if (pct >= 0.4) {
    return 'Pass'
  }

  return 'Fail'
}

const classification = computed(() => classify(academic.cgpa))
const targetClassification = computed(() => targetCGPA.value ? classify(+targetCGPA.value) : '')

const targetBadge = computed(() => {
  const c = targetClassification.value
  if (c === 'First Class') {
    return 'badge-green'
  }

  if (['2nd Class Upper', 'Upper Second'].includes(c)) {
    return 'badge-amber'
  }

  return 'badge-muted'
})

const quickTargets = computed(() => {
  const max = academic.maxPoints
  return [
    { label: 'First Class', value: parseFloat((max * 0.9).toFixed(2)) },
    { label: '2nd Upper', value: parseFloat((max * 0.8).toFixed(2)) },
    { label: '2nd Lower', value: parseFloat((max * 0.7).toFixed(2)) },
    { label: 'Third', value: parseFloat((max * 0.6).toFixed(2)) },
  ]
})

const gradeGuide = computed(() => academic.scaleGrades)

function cgpaClass(cgpa: number) {
  const pct = cgpa / academic.maxPoints
  if (pct >= 0.85) {
    return 'high'
  }

  if (pct >= 0.7) {
    return 'mid'
  }

  return 'low'
}

const scenarios = computed(() => {
  if (!targetCGPA.value || !upcomingCredits.value) {
    return []
  }

  const cur = academic.cgpa
  const curCredits = academic.totalCredits
  const upcoming = +upcomingCredits.value
  const step = academic.maxPoints / 10
  return Array.from({ length: 11 }, (_, i) => {
    const upcomingGPA = parseFloat((i * step).toFixed(2))
    const total = curCredits + upcoming
    const cgpa = total ? Math.round(((cur * curCredits + upcomingGPA * upcoming) / total) * 100) / 100 : 0
    return {
      upcoming: upcomingGPA,
      cgpa,
      classification: classify(cgpa)
    }
  }).reverse()
})
</script>

<style scoped>
.forecast-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 4px;
}

.page-sub {
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* Current card */
.current-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 24px 32px;
  display: flex;
  gap: 0;
  flex-wrap: wrap;
}

.current-stat {
  flex: 1;
  min-width: 120px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 20px;
}

.current-stat:first-child {
  padding-left: 0;
}

.cs-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 500;
}

.cs-val {
  font-size: 1.6rem;
  font-weight: 600;
  font-family: var(--font-display);
  color: var(--text-primary);
}

.cs-val.amber {
  color: var(--amber-400);
}

.cs-val.sm {
  font-size: 1rem;
}

.current-divider {
  width: 1px;
  background: var(--border);
  align-self: stretch;
  flex-shrink: 0;
}

/* Body */
.forecast-body {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 20px;
}

.card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
}

.card-title {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 20px;
}

.card-sub {
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-top: -14px;
  margin-bottom: 16px;
}

.forecast-form-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.forecast-form-col .card {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* Target input */
.target-input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.target-input {
  font-size: 1.5rem;
  font-weight: 600;
  font-family: var(--font-display);
}

.target-max {
  font-size: 1.1rem;
  color: var(--text-muted);
  white-space: nowrap;
}

.target-classification {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

/* Quick targets */
.qt-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.qt-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.qt-btn {
  flex: 1;
  min-width: 80px;
  padding: 10px 8px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  transition: all 0.15s;
}

.qt-btn:hover {
  border-color: var(--amber-400);
  background: var(--accent-subtle);
}

.qt-btn.active {
  border-color: var(--amber-400);
  background: var(--accent-subtle);
}

.qt-val {
  font-size: 1rem;
  font-weight: 600;
  color: var(--amber-400);
  font-family: var(--font-display);
}

.qt-name {
  font-size: 0.68rem;
  color: var(--text-muted);
  white-space: nowrap;
}

/* Result */
.result-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 280px;
  justify-content: center;
}

.result-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--text-muted);
  font-size: 0.88rem;
  text-align: center;
}

.result-label {
  font-size: 0.82rem;
  color: var(--text-muted);
}

.result-gpa {
  font-size: 4rem;
  font-weight: 300;
  font-family: var(--font-display);
  color: var(--text-primary);
  line-height: 1;
}

.result-sublabel {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.status-impossible .result-gpa {
  color: var(--red-500);
}

.status-achieved .result-gpa {
  color: var(--green-400);
}

.status-stretch .result-gpa {
  color: var(--amber-400);
}

.status-reachable .result-gpa {
  color: var(--green-400);
}

.result-status-row {
  margin-top: 4px;
}

.status-badge {
  display: inline-flex;
  padding: 6px 12px;
  border-radius: var(--radius-md);
  font-size: 0.82rem;
  font-weight: 500;
}

.status-badge.success {
  background: rgba(34, 197, 94, 0.1);
  color: var(--green-400);
}

.status-badge.warning {
  background: var(--accent-subtle);
  color: var(--amber-400);
}

.status-badge.danger {
  background: rgba(239, 68, 68, 0.1);
  color: var(--red-500);
}

/* Grade guide */
.grade-guide {
  margin-top: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.gg-title {
  font-size: 0.78rem;
  color: var(--text-muted);
  font-weight: 500;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.gg-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.gg-grade {
  width: 60px;
  font-size: 0.8rem;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.gg-bar-wrap {
  flex: 1;
  height: 5px;
  background: var(--bg-overlay);
  border-radius: 3px;
  overflow: hidden;
}

.gg-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s;
}

.gg-points {
  width: 28px;
  font-size: 0.78rem;
}

.gg-points.hit {
  color: var(--green-400);
}

.gg-points.miss {
  color: var(--red-500);
}

.gg-status {
  width: 16px;
  font-size: 0.78rem;
}

/* Scenarios */
.scenarios-card {
  margin-top: 0;
}

.scenarios-table {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.scen-head {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  padding: 8px 12px;
  border-bottom: 1px solid var(--border);
}

.scen-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  font-size: 0.85rem;
  padding: 9px 12px;
  border-bottom: 1px solid var(--border);
  transition: background 0.15s;
}

.scen-row:last-child {
  border-bottom: none;
}

.scen-row:hover {
  background: var(--bg-elevated);
}

.scen-row.target {
  background: var(--accent-subtle);
}

.scen-upcoming {
  color: var(--text-secondary);
}

.scen-cgpa {
  font-weight: 500;
}

.scen-cgpa.high {
  color: var(--green-400);
}

.scen-cgpa.mid {
  color: var(--amber-400);
}

.scen-cgpa.low {
  color: var(--red-500);
}

.scen-class {
  font-size: 0.78rem;
  color: var(--text-muted);
}

@media (max-width: 900px) {
  .forecast-body {
    grid-template-columns: 1fr;
  }

  .current-card {
    gap: 16px;
  }

  .current-divider {
    display: none;
  }

  .current-stat {
    padding: 0;
  }
}
</style>
