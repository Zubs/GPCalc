<template>
  <div class="semesters-page animate-fade-in">

    <div class="page-head">
      <div>
        <h1 class="page-title">Semesters</h1>
        <p class="page-sub">Manage your academic years, semesters, and courses.</p>
      </div>
      <button class="btn btn-primary" @click="showAddYear = true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add academic year
      </button>
    </div>

    <!-- Empty -->
    <div v-if="!academic.years.length" class="empty-state">
      <div class="empty-icon">📚</div>
      <h2 class="empty-title display">No academic years yet</h2>
      <p class="empty-sub">Add your first academic year to begin organising your semesters and courses.</p>
      <button class="btn btn-primary" @click="showAddYear = true">Add academic year</button>
    </div>

    <!-- Years -->
    <div v-else class="years-list">
      <div v-for="year in academic.years" :key="year.id" class="year-block">
        <div class="year-header">
          <div class="year-info">
            <h2 class="year-label">{{ year.label }}</h2>
            <span class="year-stats">{{ year.semesters.length }} semester{{
                year.semesters.length !== 1 ? 's' : ''
              }}</span>
          </div>
          <div class="year-actions">
            <button class="btn btn-ghost btn-sm" @click="openAddSemester(year.id)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add semester
            </button>
            <button class="btn-icon" title="Remove year" @click="confirmRemoveYear(year.id)">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </button>
          </div>
        </div>

        <div v-if="!year.semesters.length" class="no-sems">
          No semesters yet.
          <button class="inline-link" @click="openAddSemester(year.id)">Add one →</button>
        </div>

        <div class="semesters-grid">
          <div v-for="sem in year.semesters" :key="sem.id" class="semester-card"
               :class="{ expanded: expandedSem === sem.id }">
            <div class="sem-card-header" @click="toggleSem(sem.id)">
              <div class="sem-card-info">
                <div class="sem-name-row">
                  <span class="sem-season-badge">{{ sem.season }}</span>
                  <h3 class="sem-card-name">{{ sem.name }}</h3>
                </div>
                <div class="sem-card-stats">
                  <span>{{ sem.courses.length }} courses</span>
                  <span class="dot-sep">·</span>
                  <span>{{ sem.totalCredits }} credits</span>
                  <span class="dot-sep">·</span>
                  <span class="sem-gpa-inline" :class="gpaClass(sem.gpa)">{{ sem.gpa.toFixed(2) }} GPA</span>
                </div>
              </div>
              <div class="sem-card-actions">
                <button class="btn-icon danger" title="Remove semester"
                        @click.stop="academic.removeSemester(year.id, sem.id)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
                <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
            </div>

            <Transition name="expand">
              <div v-if="expandedSem === sem.id" class="sem-courses">
                <!-- Courses table -->
                <div class="courses-table-wrap">
                  <table class="courses-table">
                    <thead>
                    <tr>
                      <th>Course name</th>
                      <th>Code</th>
                      <th class="num">Credits</th>
                      <th class="num">Grade</th>
                      <th class="num">Points</th>
                      <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="course in sem.courses" :key="course.id" class="course-row">
                      <td>
                        <input v-model="course.name" class="cell-input" placeholder="e.g. Algorithms"
                               @change="saveCourse(year.id, sem.id, course)"/>
                      </td>
                      <td>
                        <input v-model="course.code" class="cell-input code-input" placeholder="CSC301"
                               @change="saveCourse(year.id, sem.id, course)"/>
                      </td>
                      <td class="num">
                        <input v-model.number="course.credits" type="number" min="1" max="12"
                               class="cell-input num-input"
                               @change="saveCourse(year.id, sem.id, course)"/>
                      </td>
                      <td class="num">
                        <select v-model="course.grade" class="cell-select"
                                @change="onGradeChange(year.id, sem.id, course)">
                          <option value="">—</option>
                          <option v-for="g in academic.scaleGrades" :key="g.grade" :value="g.grade">{{
                              g.grade
                            }}
                          </option>
                        </select>
                      </td>
                      <td class="num">
                          <span class="points-val"
                                :class="gpaClass(course.gradePoints / academic.maxPoints * academic.maxPoints)">
                            {{ course.gradePoints.toFixed(1) }}
                          </span>
                      </td>
                      <td>
                        <button class="btn-icon danger" @click="academic.removeCourse(year.id, sem.id, course.id)">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                               stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>

                <div class="courses-footer">
                  <button class="btn btn-ghost btn-sm" @click="addCourse(year.id, sem.id)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         stroke-width="2.5">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Add course
                  </button>
                  <div class="sem-summary">
                    <span class="sum-label">Semester GPA</span>
                    <span class="sum-val" :class="gpaClass(sem.gpa)">{{ sem.gpa.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Year Modal -->
    <Teleport to="body">
      <div v-if="showAddYear" class="modal-overlay" @click.self="showAddYear = false">
        <div class="modal animate-fade-up">
          <h2 class="modal-title">Add academic year</h2>
          <p class="modal-sub">Enter the academic year label, e.g. 2023/2024</p>
          <div class="form-group" style="margin: 20px 0">
            <label class="form-label">Year label</label>
            <input v-model="newYearLabel" class="form-input" placeholder="2024/2025"
                   @keydown.enter="addYear" autofocus/>
          </div>
          <div class="modal-actions">
            <button class="btn btn-ghost" @click="showAddYear = false">Cancel</button>
            <button class="btn btn-primary" :disabled="!newYearLabel.trim()" @click="addYear">Add year</button>
          </div>
        </div>
      </div>

      <div v-if="addSemFor" class="modal-overlay" @click.self="addSemFor = null">
        <div class="modal animate-fade-up">
          <h2 class="modal-title">Add semester</h2>
          <p class="modal-sub">Choose a semester to add to this academic year.</p>
          <div class="season-buttons">
            <button v-for="s in seasons" :key="s"
                    :class="['season-btn', { active: newSeason === s }]"
                    @click="newSeason = s">{{ s }}
            </button>
          </div>
          <div class="modal-actions">
            <button class="btn btn-ghost" @click="addSemFor = null">Cancel</button>
            <button class="btn btn-primary" @click="addSemester">Add semester</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useAcademicStore } from '~/stores/academic'
import type { Course } from '~/stores/academic'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const academic = useAcademicStore()
const expandedSem = ref<string | null>(null)
const showAddYear = ref(false)
const newYearLabel = ref('')
const addSemFor = ref<string | null>(null)
const newSeason = ref<'First' | 'Second' | 'Summer'>('First')
const seasons = ['First', 'Second', 'Summer'] as const

function toggleSem(id: string) {
  expandedSem.value = expandedSem.value === id ? null : id
}

function addYear() {
  if (!newYearLabel.value.trim()) {
    return
  }

  academic.addYear(newYearLabel.value.trim())
  newYearLabel.value = ''
  showAddYear.value = false
}

function openAddSemester(yearId: string) {
  addSemFor.value = yearId
  newSeason.value = 'First'
}

function addSemester() {
  if (!addSemFor.value) {
    return
  }

  const sem = academic.addSemester(addSemFor.value, newSeason.value)
  addSemFor.value = null
  if (sem) {
    nextTick(() => {
      expandedSem.value = sem.id
    })
  }
}

function addCourse(yearId: string, semId: string) {
  academic.upsertCourse(yearId, semId, {})
}

function onGradeChange(yearId: string, semId: string, course: Course) {
  const gradeData = academic.scaleGrades.find(g => g.grade === course.grade)
  course.gradePoints = gradeData?.points ?? 0
  academic.upsertCourse(yearId, semId, { ...course })
}

function saveCourse(yearId: string, semId: string, course: Course) {
  academic.upsertCourse(yearId, semId, { ...course })
}

function gpaClass(gpa: number) {
  const pct = gpa / academic.maxPoints
  if (pct >= 0.85) {
    return 'high'
  }

  if (pct >= 0.7) {
    return 'mid'
  }

  return 'low'
}

function confirmRemoveYear(yearId: string) {
  if (confirm('Remove this academic year and all its semesters?')) {
    academic.removeYear(yearId)
  }
}
</script>

<style scoped>
.semesters-page {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.page-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
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

/* Empty */
.empty-state {
  text-align: center;
  padding: 80px 0;
}

.empty-icon {
  font-size: 3.5rem;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 1.6rem;
  margin-bottom: 8px;
}

.empty-sub {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-bottom: 28px;
}

/* Years */
.year-block {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.year-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-elevated);
}

.year-info {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.year-label {
  font-size: 1.05rem;
  font-weight: 500;
}

.year-stats {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.year-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.no-sems {
  padding: 24px;
  font-size: 0.88rem;
  color: var(--text-muted);
}

.inline-link {
  background: none;
  border: none;
  color: var(--accent);
  cursor: pointer;
  font-size: inherit;
}

/* Semesters grid */
.semesters-grid {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.semester-card {
  border-bottom: 1px solid var(--border);
}

.semester-card:last-child {
  border-bottom: none;
}

.sem-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  cursor: pointer;
  transition: background 0.15s;
}

.sem-card-header:hover {
  background: var(--bg-elevated);
}

.sem-card-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sem-name-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sem-season-badge {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 2px 8px;
  border-radius: 12px;
  background: var(--accent-subtle);
  color: var(--amber-400);
}

.sem-card-name {
  font-size: 0.95rem;
  font-weight: 500;
}

.sem-card-stats {
  font-size: 0.78rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
}

.dot-sep {
  opacity: 0.4;
}

.sem-gpa-inline {
  font-weight: 500;
}

.sem-gpa-inline.high {
  color: var(--green-400);
}

.sem-gpa-inline.mid {
  color: var(--amber-400);
}

.sem-gpa-inline.low {
  color: var(--red-500);
}

.sem-card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chevron {
  color: var(--text-muted);
  transition: transform 0.2s;
}

.semester-card.expanded .chevron {
  transform: rotate(180deg);
}

/* Courses */
.sem-courses {
  padding: 0 24px 20px;
  border-top: 1px solid var(--border);
  background: var(--bg-base);
}

.courses-table-wrap {
  overflow-x: auto;
  margin-top: 16px;
}

.courses-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 560px;
}

.courses-table th {
  font-size: 0.73rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  padding: 8px 10px;
  text-align: left;
  border-bottom: 1px solid var(--border);
}

.courses-table th.num {
  text-align: center;
}

.course-row {
  transition: background 0.1s;
}

.course-row:hover {
  background: var(--bg-elevated);
}

.course-row td {
  padding: 6px 10px;
  border-bottom: 1px solid var(--border);
}

.cell-input {
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  padding: 5px 8px;
  color: var(--text-primary);
  font-size: 0.86rem;
  width: 100%;
  transition: border-color 0.15s, background 0.15s;
}

.cell-input:focus {
  outline: none;
  border-color: var(--accent);
  background: var(--bg-elevated);
}

.code-input {
  font-family: monospace;
  font-size: 0.82rem;
}

.num-input {
  text-align: center;
  width: 60px;
}

.cell-select {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 5px 8px;
  color: var(--text-primary);
  font-size: 0.86rem;
  appearance: none;
  text-align: center;
  cursor: pointer;
}

.cell-select:focus {
  outline: none;
  border-color: var(--accent);
}

td.num {
  text-align: center;
}

.points-val {
  font-size: 0.88rem;
  font-weight: 500;
}

.points-val.high {
  color: var(--green-400);
}

.points-val.mid {
  color: var(--amber-400);
}

.points-val.low {
  color: var(--red-500);
}

.courses-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.sem-summary {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sum-label {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.sum-val {
  font-size: 1.1rem;
  font-weight: 600;
  font-family: var(--font-display);
}

.sum-val.high {
  color: var(--green-400);
}

.sum-val.mid {
  color: var(--amber-400);
}

.sum-val.low {
  color: var(--red-500);
}

.btn-icon {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  background: none;
  border: 1px solid var(--border);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.btn-icon:hover {
  border-color: var(--border-strong);
  color: var(--text-secondary);
  background: var(--bg-elevated);
}

.btn-icon.danger:hover {
  border-color: var(--red-500);
  color: var(--red-500);
  background: rgba(239, 68, 68, 0.08);
}

/* Expand transition */
.expand-enter-active, .expand-leave-active {
  transition: all 0.2s var(--ease);
  overflow: hidden;
}

.expand-enter-from, .expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to, .expand-leave-from {
  max-height: 600px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 24px;
  backdrop-filter: blur(4px);
}

.modal {
  background: var(--bg-surface);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-xl);
  padding: 32px;
  width: 100%;
  max-width: 420px;
  box-shadow: var(--shadow-lg);
}

.modal-title {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 6px;
}

.modal-sub {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.season-buttons {
  display: flex;
  gap: 8px;
  margin: 20px 0;
}

.season-btn {
  flex: 1;
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.15s;
}

.season-btn.active {
  background: var(--accent-subtle);
  border-color: var(--amber-400);
  color: var(--amber-400);
}

.season-btn:hover:not(.active) {
  background: var(--bg-elevated);
}
</style>
