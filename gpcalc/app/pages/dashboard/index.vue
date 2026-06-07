<template>
  <div class="overview animate-fade-in">

    <!-- Empty state -->
    <div v-if="!academic.years.length" class="empty-state">
      <div class="empty-icon">🎓</div>
      <h2 class="empty-title display">Let's set up your academic record</h2>
      <p class="empty-sub">Add your first academic year and semester to start tracking your GPA.</p>
      <div class="empty-actions">
        <button class="btn btn-primary btn-lg" @click="$router.push('/dashboard/semesters')">
          Add your first semester
        </button>
        <button class="btn btn-ghost" @click="loadDemo">Load demo data</button>
      </div>
    </div>

    <template v-else>
      <!-- Welcome + CGPA hero -->
      <div class="hero-row">
        <div class="greeting">
          <p class="greeting-label">Good {{ timeOfDay }},</p>
          <h1 class="greeting-name display">{{ auth.user?.name?.split(' ')[0] }}</h1>
        </div>
        <div class="cgpa-hero">
          <div class="cgpa-ring" :style="ringStyle">
            <div class="cgpa-inner">
              <span class="cgpa-val">{{ academic.cgpa.toFixed(2) }}</span>
              <span class="cgpa-label">CGPA</span>
            </div>
          </div>
          <div class="cgpa-meta">
            <div class="cgpa-classification">
              <span :class="['badge', classificationBadge]">{{ classification }}</span>
            </div>
            <p class="cgpa-scale">out of {{ academic.maxPoints.toFixed(1) }} · {{ scaleLabel }}</p>
          </div>
        </div>
      </div>

      <!-- Stat cards -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon amber">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h16M4 10h16M4 14h10"/></svg>
          </div>
          <div class="stat-body">
            <span class="stat-val">{{ academic.totalCredits }}</span>
            <span class="stat-name">Total credits</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div class="stat-body">
            <span class="stat-val">{{ academic.completedCourses }}</span>
            <span class="stat-name">Courses completed</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon blue">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div class="stat-body">
            <span class="stat-val">{{ totalSemesters }}</span>
            <span class="stat-name">Semesters</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon amber">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
          </div>
          <div class="stat-body">
            <span class="stat-val">{{ bestSemesterGPA }}</span>
            <span class="stat-name">Best semester GPA</span>
          </div>
        </div>
      </div>

      <!-- GPA chart -->
      <div class="card chart-card">
        <div class="chart-header">
          <div>
            <h2 class="chart-title">GPA progression</h2>
            <p class="chart-sub">Semester-by-semester performance</p>
          </div>
          <div class="chart-trend" :class="trendClass">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline v-if="trend >= 0" points="18 15 12 9 6 15"/>
              <polyline v-else points="6 9 12 15 18 9"/>
            </svg>
            {{ Math.abs(trend).toFixed(2) }} vs last sem
          </div>
        </div>
        <div class="chart-wrap">
          <canvas ref="chartCanvas" height="200"></canvas>
        </div>
      </div>

      <!-- Recent semesters -->
      <div class="section-head">
        <h2 class="section-title">Recent semesters</h2>
        <NuxtLink to="/dashboard/semesters" class="view-all">View all →</NuxtLink>
      </div>

      <div class="semesters-list">
        <div v-for="sem in recentSemesters" :key="sem.id" class="sem-row">
          <div class="sem-info">
            <span class="sem-name">{{ sem.name }}</span>
            <span class="sem-year">{{ sem.year }}</span>
          </div>
          <div class="sem-courses-count">{{ sem.courses.length }} courses</div>
          <div class="sem-credits">{{ sem.totalCredits }} credits</div>
          <div class="sem-gpa-wrap">
            <span class="sem-gpa" :class="gpaClass(sem.gpa)">{{ sem.gpa.toFixed(2) }}</span>
            <div class="sem-gpa-bar">
              <div class="sem-gpa-fill" :style="{ width: (sem.gpa / academic.maxPoints * 100) + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick actions -->
      <div class="quick-actions">
        <NuxtLink to="/dashboard/semesters" class="action-card">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          Add semester
        </NuxtLink>
        <NuxtLink to="/dashboard/forecast" class="action-card">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
          Run forecast
        </NuxtLink>
        <NuxtLink to="/dashboard/settings" class="action-card">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
          Settings
        </NuxtLink>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore }    from '~/stores/auth'
import { useAcademicStore } from '~/stores/academic'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const auth     = useAuthStore()
const academic = useAcademicStore()
const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: any = null

function loadDemo() { academic.loadDemo() }

const timeOfDay = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
})

const totalSemesters = computed(() =>
  academic.years.reduce((s, y) => s + y.semesters.length, 0)
)

const allSemesters = computed(() =>
  academic.years.flatMap(y => y.semesters.map(s => ({ ...s, year: y.label })))
)

const recentSemesters = computed(() => allSemesters.value.slice(-4).reverse())

const bestSemesterGPA = computed(() => {
  const gpas = allSemesters.value.map(s => s.gpa)
  return gpas.length ? Math.max(...gpas).toFixed(2) : '—'
})

const trend = computed(() => {
  const hist = academic.semesterHistory
  if (hist.length < 2) return 0
  return hist[hist.length - 1].gpa - hist[hist.length - 2].gpa
})
const trendClass = computed(() => trend.value >= 0 ? 'trend-up' : 'trend-down')

const scaleLabel = computed(() => ({
  '4.0': '4.0 Scale', '5.0': '5.0 Scale', 'uk': 'UK Classification',
}[academic.gradingScale]))

const classification = computed(() => {
  const c = academic.cgpa
  const s = academic.gradingScale
  if (s === 'uk') {
    if (c >= 3.7) return 'First Class'
    if (c >= 3.0) return 'Upper Second'
    if (c >= 2.7) return 'Lower Second'
    if (c >= 2.0) return 'Third Class'
    return 'Fail'
  }
  const max = s === '5.0' ? 5 : 4
  const pct = c / max
  if (pct >= 0.9) return 'First Class'
  if (pct >= 0.8) return 'Second Class Upper'
  if (pct >= 0.7) return 'Second Class Lower'
  if (pct >= 0.6) return 'Third Class'
  if (pct >= 0.4) return 'Pass'
  return 'Fail'
})

const classificationBadge = computed(() => {
  if (['First Class'].includes(classification.value)) return 'badge-green'
  if (['Second Class Upper','Upper Second'].includes(classification.value)) return 'badge-amber'
  return 'badge-muted'
})

const ringStyle = computed(() => {
  const pct = academic.cgpa / academic.maxPoints
  const deg = Math.round(pct * 360)
  return {
    background: `conic-gradient(var(--accent) ${deg}deg, var(--bg-overlay) ${deg}deg)`,
  }
})

function gpaClass(gpa: number) {
  const pct = gpa / academic.maxPoints
  if (pct >= 0.85) return 'gpa-high'
  if (pct >= 0.7)  return 'gpa-mid'
  return 'gpa-low'
}

// Chart
async function renderChart() {
  if (!chartCanvas.value || !academic.semesterHistory.length) return
  const { Chart, registerables } = await import('chart.js')
  Chart.register(...registerables)
  if (chartInstance) { chartInstance.destroy() }

  const hist = academic.semesterHistory
  const isDark = document.documentElement.classList.contains('dark') ||
                 !document.documentElement.classList.contains('light')

  const gridColor  = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
  const labelColor = isDark ? '#7b93b8' : '#4a5f88'

  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: hist.map(h => h.label),
      datasets: [{
        label: 'GPA',
        data: hist.map(h => h.gpa),
        borderColor: '#f5a623',
        backgroundColor: 'rgba(245,166,35,0.08)',
        borderWidth: 2.5,
        pointBackgroundColor: '#f5a623',
        pointBorderColor: isDark ? '#111827' : '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        tension: 0.35,
        fill: true,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: {
        backgroundColor: isDark ? '#1a2438' : '#fff',
        titleColor: isDark ? '#f0f4fa' : '#0a0f1e',
        bodyColor: isDark ? '#adbdd6' : '#334466',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        borderWidth: 1, padding: 10, cornerRadius: 8,
      }},
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: labelColor, font: { family: 'DM Sans', size: 12 } } },
        y: {
          min: 0, max: academic.maxPoints,
          grid: { color: gridColor },
          ticks: { color: labelColor, font: { family: 'DM Sans', size: 12 }, stepSize: 1 },
        },
      },
    },
  })
}

onMounted(() => { nextTick(renderChart) })
watch(() => academic.semesterHistory, () => nextTick(renderChart), { deep: true })
</script>

<style scoped>
.overview { display: flex; flex-direction: column; gap: 24px; }

/* ── Empty state ── */
.empty-state { text-align: center; padding: 80px 24px; }
.empty-icon { font-size: 4rem; margin-bottom: 16px; }
.empty-title { font-size: 1.8rem; margin-bottom: 10px; }
.empty-sub { color: var(--text-muted); margin-bottom: 32px; font-size: 0.95rem; }
.empty-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

/* ── Hero row ── */
.hero-row {
  display: flex; justify-content: space-between; align-items: flex-start;
  gap: 24px; flex-wrap: wrap;
  background: var(--bg-surface); border: 1px solid var(--border);
  border-radius: var(--radius-xl); padding: 28px 32px;
}
.greeting-label { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px; }
.greeting-name { font-size: 2.2rem; }

.cgpa-hero { display: flex; align-items: center; gap: 20px; }
.cgpa-ring {
  width: 90px; height: 90px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  padding: 5px;
  transition: background 0.4s;
}
.cgpa-inner {
  width: 100%; height: 100%; border-radius: 50%;
  background: var(--bg-surface);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.cgpa-val { font-size: 1.4rem; font-weight: 600; font-family: var(--font-display); color: var(--amber-400); line-height: 1; }
.cgpa-label { font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; }
.cgpa-meta { display: flex; flex-direction: column; gap: 6px; }
.cgpa-scale { font-size: 0.78rem; color: var(--text-muted); }

/* ── Stats ── */
.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.stat-card {
  background: var(--bg-surface); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: 18px 20px;
  display: flex; align-items: center; gap: 14px;
}
.stat-icon {
  width: 40px; height: 40px; border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.stat-icon.amber { background: var(--accent-subtle); color: var(--amber-400); }
.stat-icon.green { background: rgba(34,197,94,0.1); color: var(--green-400); }
.stat-icon.blue  { background: rgba(59,130,246,0.1); color: #60a5fa; }
.stat-body { display: flex; flex-direction: column; gap: 2px; }
.stat-val { font-size: 1.5rem; font-weight: 600; font-family: var(--font-display); color: var(--text-primary); line-height: 1.1; }
.stat-name { font-size: 0.78rem; color: var(--text-muted); }

/* ── Chart ── */
.chart-card { }
.chart-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.chart-title { font-size: 1rem; font-weight: 500; }
.chart-sub { font-size: 0.8rem; color: var(--text-muted); margin-top: 2px; }
.chart-trend {
  display: flex; align-items: center; gap: 5px;
  font-size: 0.8rem; font-weight: 500;
  padding: 4px 10px; border-radius: 20px;
}
.trend-up   { background: rgba(34,197,94,0.1);  color: var(--green-400); }
.trend-down { background: rgba(239,68,68,0.1);  color: var(--red-500); }
.chart-wrap { height: 200px; position: relative; }

/* ── Recent semesters ── */
.section-head { display: flex; justify-content: space-between; align-items: center; }
.section-title { font-size: 1rem; font-weight: 500; }
.view-all { font-size: 0.82rem; color: var(--accent); }
.view-all:hover { text-decoration: underline; }

.semesters-list { display: flex; flex-direction: column; gap: 8px; }
.sem-row {
  display: grid;
  grid-template-columns: 1fr 100px 80px 160px;
  align-items: center; gap: 16px;
  background: var(--bg-surface); border: 1px solid var(--border);
  border-radius: var(--radius-md); padding: 14px 18px;
  transition: border-color 0.15s;
}
.sem-row:hover { border-color: var(--border-strong); }
.sem-info { display: flex; flex-direction: column; gap: 2px; }
.sem-name { font-size: 0.9rem; font-weight: 500; }
.sem-year { font-size: 0.75rem; color: var(--text-muted); }
.sem-courses-count, .sem-credits { font-size: 0.82rem; color: var(--text-muted); }
.sem-gpa-wrap { display: flex; align-items: center; gap: 10px; }
.sem-gpa { font-size: 0.95rem; font-weight: 600; min-width: 36px; }
.sem-gpa.gpa-high { color: var(--green-400); }
.sem-gpa.gpa-mid  { color: var(--amber-400); }
.sem-gpa.gpa-low  { color: var(--red-500); }
.sem-gpa-bar { flex: 1; height: 4px; background: var(--bg-overlay); border-radius: 2px; overflow: hidden; }
.sem-gpa-fill { height: 100%; background: var(--accent); border-radius: 2px; transition: width 0.4s; }

/* ── Quick actions ── */
.quick-actions { display: flex; gap: 12px; flex-wrap: wrap; }
.action-card {
  flex: 1; min-width: 140px;
  display: flex; align-items: center; gap: 10px;
  background: var(--bg-surface); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: 16px 20px;
  font-size: 0.88rem; font-weight: 500; color: var(--text-secondary);
  transition: all 0.15s;
}
.action-card:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-subtle); }

@media (max-width: 768px) {
  .stats-row { grid-template-columns: 1fr 1fr; }
  .sem-row { grid-template-columns: 1fr auto; }
  .sem-courses-count, .sem-credits { display: none; }
  .hero-row { flex-direction: column; }
}
@media (max-width: 480px) {
  .stats-row { grid-template-columns: 1fr; }
}
</style>
