<template>
  <div class="landing">

    <!-- ── Hero ── -->
    <section class="hero">
      <div class="hero-bg">
        <div class="blob b1"></div>
        <div class="blob b2"></div>
        <div class="grid-overlay"></div>
      </div>
      <div class="container hero-inner">
        <div class="hero-content animate-fade-up">
          <div class="hero-badge badge badge-amber">
            <span class="badge-dot"></span>
            Track every grade, every semester
          </div>
          <h1 class="hero-title display">
            Your academic<br>
            journey,<br>
            <em class="accent-em">tracked.</em>
          </h1>
          <p class="hero-subtitle">
            Calculate your GPA, forecast the grades you need, and visualise progress across every semester — from freshman year to graduation.
          </p>
          <div class="hero-actions">
            <NuxtLink to="/register" class="btn btn-primary btn-lg">
              Start tracking free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
            </NuxtLink>
            <button class="btn btn-ghost btn-lg" @click="loadDemo">
              See a demo
            </button>
          </div>
          <p class="hero-hint">No credit card. No nonsense. Just your grades.</p>
        </div>

        <div class="hero-visual animate-fade-up delay-3">
          <div class="dashboard-preview">
            <div class="preview-header">
              <div class="preview-dots">
                <span></span><span></span><span></span>
              </div>
              <span class="preview-title">GPCalc — Overview</span>
            </div>
            <div class="preview-body">
              <div class="preview-stat-row">
                <div class="preview-stat">
                  <span class="preview-stat-label">CGPA</span>
                  <span class="preview-stat-val cgpa-val">3.65</span>
                </div>
                <div class="preview-stat">
                  <span class="preview-stat-label">Credits</span>
                  <span class="preview-stat-val">54</span>
                </div>
                <div class="preview-stat">
                  <span class="preview-stat-label">Semesters</span>
                  <span class="preview-stat-val">3</span>
                </div>
              </div>
              <div class="preview-chart">
                <div class="chart-label">GPA progression</div>
                <div class="chart-bars">
                  <div v-for="(b, i) in bars" :key="i" class="chart-bar-wrap">
                    <div class="chart-bar" :style="{ height: b.h + '%', '--delay': i * 0.1 + 's' }"></div>
                    <span class="chart-bar-label">{{ b.l }}</span>
                  </div>
                </div>
              </div>
              <div class="preview-courses">
                <div v-for="c in previewCourses" :key="c.name" class="preview-course-row">
                  <span class="preview-course-name">{{ c.name }}</span>
                  <span :class="['preview-grade', c.cls]">{{ c.grade }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Social proof strip ── -->
    <div class="proof-strip">
      <div class="container proof-inner">
        <span class="proof-text">Works with every grading scale</span>
        <div class="proof-scales">
          <span class="scale-chip">4.0 GPA (US)</span>
          <span class="scale-chip">5.0 GPA (NG)</span>
          <span class="scale-chip">UK Degree Classifications</span>
          <span class="scale-chip">Custom scales</span>
        </div>
      </div>
    </div>

    <!-- ── Features ── -->
    <section id="features" class="section features-section">
      <div class="container">
        <div class="section-label">Features</div>
        <h2 class="section-title display">Everything a serious<br>student needs</h2>
        <p class="section-sub">No ads. No paywalls. The tools your academic career actually requires.</p>

        <div class="features-grid">
          <div v-for="(feat, i) in features" :key="feat.title" class="feature-card" :style="{ '--i': i }">
            <div class="feature-icon" v-html="feat.icon"></div>
            <h3 class="feature-title">{{ feat.title }}</h3>
            <p class="feature-desc">{{ feat.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── How it works ── -->
    <section id="how-it-works" class="section how-section">
      <div class="container">
        <div class="section-label">How it works</div>
        <h2 class="section-title display">Three steps to clarity</h2>

        <div class="steps">
          <div v-for="(step, i) in steps" :key="step.title" class="step">
            <div class="step-num">0{{ i + 1 }}</div>
            <div class="step-content">
              <h3 class="step-title">{{ step.title }}</h3>
              <p class="step-desc">{{ step.desc }}</p>
            </div>
            <div v-if="i < steps.length - 1" class="step-connector"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Grading scales ── -->
    <section id="scales" class="section scales-section">
      <div class="container">
        <div class="section-label">Grading scales</div>
        <h2 class="section-title display">Your system,<br>not ours</h2>
        <p class="section-sub">Switch between grading systems in one click. GPCalc adapts to your institution's standards.</p>

        <div class="scales-grid">
          <div v-for="scale in scales" :key="scale.name" class="scale-card">
            <div class="scale-flag">{{ scale.flag }}</div>
            <h3 class="scale-name">{{ scale.name }}</h3>
            <p class="scale-desc">{{ scale.desc }}</p>
            <div class="scale-grades">
              <div v-for="g in scale.grades" :key="g.grade" class="scale-grade-row">
                <span class="sg-grade">{{ g.grade }}</span>
                <div class="sg-bar-wrap">
                  <div class="sg-bar" :style="{ width: (g.points / scale.max * 100) + '%' }"></div>
                </div>
                <span class="sg-points">{{ g.points }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CTA ── -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-card">
          <div class="cta-bg-blob"></div>
          <h2 class="cta-title display">Ready to take control<br>of your GPA?</h2>
          <p class="cta-sub">Join students who track their academic progress with GPCalc.</p>
          <div class="cta-actions">
            <NuxtLink to="/register" class="btn btn-primary btn-lg">Create your free account</NuxtLink>
            <NuxtLink to="/login" class="btn btn-ghost btn-lg">Sign in</NuxtLink>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { useAcademicStore } from '~/stores/academic'
const academic = useAcademicStore()
const router   = useRouter()

function loadDemo() {
  academic.loadDemo()
  router.push('/dashboard')
}

const bars = [
  { h: 82, l: 'S1' }, { h: 88, l: 'S2' }, { h: 75, l: 'S3' }, { h: 91, l: 'S4' }, { h: 95, l: 'S5' },
]

const previewCourses = [
  { name: 'Algorithms', grade: 'A', cls: 'grade-a' },
  { name: 'Operating Systems', grade: 'A', cls: 'grade-a' },
  { name: 'Computer Networks', grade: 'B+', cls: 'grade-b' },
  { name: 'Database Systems', grade: 'A-', cls: 'grade-a' },
]

const features = [
  {
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-6"/></svg>`,
    title: 'CGPA tracking',
    desc: 'Group courses by semester and academic year. Watch your cumulative GPA evolve in real time.',
  },
  {
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
    title: 'Target forecaster',
    desc: 'Set a CGPA goal. The forecaster tells you exactly what grades you need in upcoming semesters to hit it.',
  },
  {
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>`,
    title: 'Semester history',
    desc: 'Every grade, every semester. Your complete academic record, organised and always accessible.',
  },
  {
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>`,
    title: 'Multiple grading scales',
    desc: 'Switch between 4.0 GPA, 5.0 GPA, or UK degree classifications. Your institution\'s system, supported.',
  },
  {
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
    title: 'PDF export',
    desc: 'Download a polished semester report for academic advisor meetings, scholarship applications, or internships.',
  },
  {
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    title: 'Persistent & private',
    desc: 'Your data is saved locally and synced to your account. Close the tab, come back next week — it\'s all there.',
  },
]

const steps = [
  { title: 'Add your courses', desc: 'Enter your course names, credit units, and the grades you earned (or expect to earn).' },
  { title: 'See your GPA instantly', desc: 'GPCalc calculates your semester GPA and running CGPA the moment you enter data.' },
  { title: 'Plan your next move', desc: 'Use the forecaster to find out what scores you need to reach your academic goals.' },
]

const scales = [
  {
    flag: '🇺🇸', name: '4.0 Scale', desc: 'Standard US university grading',
    max: 4.0,
    grades: [
      { grade: 'A', points: 4.0 }, { grade: 'B+', points: 3.3 },
      { grade: 'B', points: 3.0 }, { grade: 'C', points: 2.0 }, { grade: 'D', points: 1.0 },
    ],
  },
  {
    flag: '🇳🇬', name: '5.0 Scale', desc: 'Common in Nigerian universities',
    max: 5.0,
    grades: [
      { grade: 'A', points: 5.0 }, { grade: 'B', points: 4.0 },
      { grade: 'C', points: 3.0 }, { grade: 'D', points: 2.0 }, { grade: 'E', points: 1.0 },
    ],
  },
  {
    flag: '🇬🇧', name: 'UK Classifications', desc: 'Degree classification system',
    max: 4.0,
    grades: [
      { grade: 'First (1st)', points: 4.0 }, { grade: 'Upper 2nd (2:1)', points: 3.3 },
      { grade: 'Lower 2nd (2:2)', points: 2.7 }, { grade: 'Third (3rd)', points: 2.0 },
    ],
  },
]
</script>

<style scoped>
/* ── Hero ── */
.hero { position: relative; overflow: hidden; padding: 80px 0 100px; min-height: 90vh; display: flex; align-items: center; }
.hero-bg { position: absolute; inset: 0; z-index: 0; }
.blob {
  position: absolute; border-radius: 50%;
  filter: blur(120px);
}
.b1 { width: 700px; height: 700px; background: rgba(245,166,35,0.15); top: -200px; right: -100px; }
.b2 { width: 500px; height: 500px; background: rgba(59,130,246,0.08); bottom: -100px; left: 0; }
.grid-overlay {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 60px 60px;
}
.light .grid-overlay {
  background-image:
    linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
}

.hero-inner {
  position: relative; z-index: 1;
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 64px; align-items: center;
}

.hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  margin-bottom: 24px; font-size: 0.82rem;
}
.badge-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--amber-400);
  animation: pulse 2s ease-in-out infinite;
}

.hero-title {
  font-size: clamp(2.8rem, 5vw, 4.2rem);
  color: var(--text-primary);
  margin-bottom: 20px;
  line-height: 1.05;
}
.accent-em { font-style: italic; color: var(--amber-400); }
.hero-subtitle {
  font-size: 1.05rem; color: var(--text-secondary);
  line-height: 1.7; max-width: 420px; margin-bottom: 32px;
}
.hero-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
.hero-hint { font-size: 0.8rem; color: var(--text-muted); }

/* ── Dashboard preview ── */
.hero-visual { position: relative; }
.dashboard-preview {
  background: var(--bg-surface);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg), 0 0 0 1px var(--border);
  transform: perspective(800px) rotateY(-4deg) rotateX(2deg);
  transition: transform 0.3s var(--ease);
}
.dashboard-preview:hover { transform: perspective(800px) rotateY(-1deg) rotateX(1deg); }

.preview-header {
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--border);
  padding: 12px 16px;
  display: flex; align-items: center; gap: 12px;
}
.preview-dots { display: flex; gap: 6px; }
.preview-dots span { width: 10px; height: 10px; border-radius: 50%; background: var(--border-strong); }
.preview-dots span:nth-child(1) { background: #ef4444; }
.preview-dots span:nth-child(2) { background: #f59e0b; }
.preview-dots span:nth-child(3) { background: #22c55e; }
.preview-title { font-size: 0.8rem; color: var(--text-muted); }

.preview-body { padding: 20px; display: flex; flex-direction: column; gap: 20px; }

.preview-stat-row { display: flex; gap: 12px; }
.preview-stat {
  flex: 1; background: var(--bg-elevated);
  border: 1px solid var(--border); border-radius: var(--radius-md);
  padding: 12px; display: flex; flex-direction: column; gap: 4px;
}
.preview-stat-label { font-size: 0.7rem; color: var(--text-muted); font-weight: 500; }
.preview-stat-val { font-size: 1.4rem; font-weight: 600; color: var(--text-primary); font-family: var(--font-display); }
.cgpa-val { color: var(--amber-400); }

.preview-chart { background: var(--bg-elevated); border-radius: var(--radius-md); padding: 14px; border: 1px solid var(--border); }
.chart-label { font-size: 0.75rem; color: var(--text-muted); font-weight: 500; margin-bottom: 12px; }
.chart-bars { display: flex; align-items: flex-end; gap: 6px; height: 70px; }
.chart-bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; height: 100%; justify-content: flex-end; }
.chart-bar {
  width: 100%; background: var(--accent);
  border-radius: 4px 4px 0 0; opacity: 0.8;
  animation: growUp 0.6s var(--delay, 0s) var(--ease) both;
  transform-origin: bottom;
}
@keyframes growUp {
  from { transform: scaleY(0); }
  to   { transform: scaleY(1); }
}
.chart-bar-label { font-size: 0.65rem; color: var(--text-muted); }

.preview-courses { display: flex; flex-direction: column; gap: 6px; }
.preview-course-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 8px 10px; background: var(--bg-elevated);
  border-radius: var(--radius-sm); border: 1px solid var(--border);
}
.preview-course-name { font-size: 0.8rem; color: var(--text-secondary); }
.preview-grade { font-size: 0.78rem; font-weight: 600; padding: 2px 8px; border-radius: 4px; }
.grade-a { background: rgba(34,197,94,0.12); color: var(--green-400); }
.grade-b { background: var(--accent-subtle); color: var(--amber-400); }

/* ── Proof strip ── */
.proof-strip {
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: var(--bg-surface);
  padding: 16px 0;
}
.proof-inner { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
.proof-text { font-size: 0.82rem; color: var(--text-muted); font-weight: 500; flex-shrink: 0; }
.proof-scales { display: flex; gap: 8px; flex-wrap: wrap; }
.scale-chip {
  font-size: 0.78rem; padding: 4px 12px;
  background: var(--bg-elevated); border: 1px solid var(--border);
  border-radius: 20px; color: var(--text-secondary);
}

/* ── Sections ── */
.section { padding: 96px 0; }
.section-label {
  font-size: 0.75rem; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.1em; color: var(--amber-400);
  margin-bottom: 12px;
}
.section-title { font-size: clamp(2rem, 3.5vw, 3rem); color: var(--text-primary); margin-bottom: 16px; }
.section-sub { font-size: 1rem; color: var(--text-secondary); max-width: 500px; line-height: 1.7; margin-bottom: 56px; }

/* ── Features grid ── */
.features-section { background: var(--bg-surface); }
.features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.feature-card {
  background: var(--bg-elevated); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: 28px 24px;
  transition: border-color 0.2s, transform 0.2s;
}
.feature-card:hover { border-color: var(--border-strong); transform: translateY(-2px); }
.feature-icon {
  width: 44px; height: 44px; border-radius: var(--radius-md);
  background: var(--accent-subtle); color: var(--amber-400);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 16px;
}
.feature-title { font-size: 1rem; font-weight: 500; margin-bottom: 8px; }
.feature-desc { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.65; }

/* ── Steps ── */
.how-section { background: var(--bg-base); }
.steps { display: flex; gap: 0; position: relative; }
.step { flex: 1; position: relative; padding: 32px 24px; }
.step:not(:last-child) { border-right: 1px solid var(--border); }
.step-num {
  font-family: var(--font-display); font-size: 3rem; font-weight: 300;
  color: var(--accent); opacity: 0.6; line-height: 1; margin-bottom: 16px;
}
.step-title { font-size: 1.05rem; font-weight: 500; margin-bottom: 10px; }
.step-desc { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.65; }

/* ── Scales ── */
.scales-section { background: var(--bg-surface); }
.scales-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.scale-card {
  background: var(--bg-elevated); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: 28px 24px;
}
.scale-flag { font-size: 2rem; margin-bottom: 12px; }
.scale-name { font-size: 1rem; font-weight: 500; margin-bottom: 6px; }
.scale-desc { font-size: 0.82rem; color: var(--text-muted); margin-bottom: 20px; }
.scale-grades { display: flex; flex-direction: column; gap: 8px; }
.scale-grade-row { display: flex; align-items: center; gap: 10px; font-size: 0.82rem; }
.sg-grade { width: 80px; color: var(--text-secondary); flex-shrink: 0; font-size: 0.78rem; }
.sg-bar-wrap { flex: 1; height: 6px; background: var(--bg-overlay); border-radius: 3px; overflow: hidden; }
.sg-bar { height: 100%; background: var(--accent); border-radius: 3px; opacity: 0.7; }
.sg-points { width: 28px; text-align: right; color: var(--text-muted); font-size: 0.78rem; }

/* ── CTA ── */
.cta-section { padding: 80px 0 100px; }
.cta-card {
  position: relative; overflow: hidden;
  background: var(--bg-surface); border: 1px solid var(--border-strong);
  border-radius: var(--radius-xl); padding: 72px 64px;
  text-align: center;
}
.cta-bg-blob {
  position: absolute; top: -100px; left: 50%; transform: translateX(-50%);
  width: 600px; height: 400px; border-radius: 50%;
  background: var(--accent); filter: blur(120px); opacity: 0.07;
  pointer-events: none;
}
.cta-title { font-size: clamp(1.8rem, 3vw, 2.8rem); margin-bottom: 16px; position: relative; }
.cta-sub { font-size: 1rem; color: var(--text-secondary); margin-bottom: 36px; position: relative; }
.cta-actions { display: flex; gap: 12px; justify-content: center; position: relative; }

/* ── Responsive ── */
@media (max-width: 900px) {
  .hero-inner { grid-template-columns: 1fr; }
  .hero-visual { display: none; }
  .features-grid, .scales-grid { grid-template-columns: 1fr 1fr; }
  .steps { flex-direction: column; }
  .step:not(:last-child) { border-right: none; border-bottom: 1px solid var(--border); }
}
@media (max-width: 600px) {
  .features-grid, .scales-grid { grid-template-columns: 1fr; }
  .hero-actions { flex-direction: column; }
  .cta-card { padding: 40px 24px; }
  .cta-actions { flex-direction: column; }
}
</style>
