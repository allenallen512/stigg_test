import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { StiggProvider } from '@stigg/react-sdk'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Pricing from './pages/Pricing'
import { getUsage, addEvent as apiAddEvent, reportUsage as apiReportUsage } from './api-methods'

function Home() {
  const CUSTOMER_ID = import.meta.env.VITE_CUSTOMER_ID || 'customer-1'
  const [usage, setUsage] = useState(null)
  const [loadingUsage, setLoadingUsage] = useState(false)

  // Hardset two projects with initial tasks
  const [projects, setProjects] = useState([
    { id: 'p1', name: 'Project Alpha', tasks: [{ id: 't1', title: 'Design UI' }, { id: 't2', title: 'Setup repo' }] },
    { id: 'p2', name: 'Project Beta', tasks: [{ id: 't3', title: 'Write tests' }] }
  ])

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsage()
  }, [])

  async function fetchUsage() {
    try {
      setLoadingUsage(true)
      const data = await getUsage(CUSTOMER_ID)
      setUsage(data)
    } catch (e) {
      console.error('fetchUsage error', e)
    } finally {
      setLoadingUsage(false)
    }
  }

  const projectCount = 2 // hardset

  const currentTaskCount = projects.reduce((acc, p) => acc + p.tasks.length, 0)

  async function addTask(projectId) {
    const title = `Task ${Date.now().toString().slice(-4)}`
    setProjects(prev =>
      prev.map(p => (p.id === projectId ? { ...p, tasks: [...p.tasks, { id: `t${Date.now()}`, title }] } : p))
    )

    // call local APIs
    try {
      await apiAddEvent(CUSTOMER_ID, { projectId, title })
    } catch (e) {
      console.error('addEvent failed', e)
    }
    try {
      const res = await apiReportUsage(CUSTOMER_ID, 'feature-tasks-created')
      // optionally refresh usage after reporting
      await fetchUsage()
      console.log('reportUsage sent value', res.value)
    } catch (e) {
      console.error('reportUsage failed', e)
    }
  }

  async function removeTask(projectId, taskId) {
    setProjects(prev =>
      prev.map(p => (p.id === projectId ? { ...p, tasks: p.tasks.filter(t => t.id !== taskId) } : p))
    )
    // optional: you could report a negative usage or an event here
  }

  // determine whether we can add more projects (if usage known, enforce maxProjects)
  const canAddProject = !(usage && typeof usage.maxProjects === 'number' && projects.length >= usage.maxProjects)

  async function addProject() {
    if (!canAddProject) {
      // optional: show a user-friendly message instead of throwing
      console.warn('Cannot add project: reached maxProjects limit')
      return
    }
    const newId = `p${Date.now()}`
    const newProject = { id: newId, name: `Project ${projects.length + 1}`, tasks: [] }
    setProjects(prev => [...prev, newProject])
    // optionally fetch usage after adding (if your server updates project count)
    // await fetchUsage()
  }

  // new: remove project helper
  function removeProject(projectId) {
    setProjects(prev => prev.filter(p => p.id !== projectId))
  }

  // updated: export handler (ensure project exists)
  async function exportAsPdf(projectId) {
    const project = projects.find(p => p.id === projectId)
    if (!project) return

    // if user does not have export access, send them to pricing
    if (!usage?.exportPDF) {
      navigate('/pricing')
      return
    }

    try {
      await apiAddEvent(CUSTOMER_ID, { projectId, action: 'export_pdf', projectName: project.name })
    } catch (e) {
      console.error('export event failed', e)
    }
    alert(`Exporting "${project.name}" as PDF`)
  }

  return (
    <>

      <h1>Task App — Vite + React</h1>

      <section style={{ border: '1px solid #ddd', padding: 12, marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong>User usage & limits</strong>
          <div>
            <button onClick={fetchUsage} disabled={loadingUsage}>
              {loadingUsage ? 'Refreshing...' : 'Refresh usage'}
            </button>
            <button style={{ marginLeft: 8 }} onClick={() => navigate('/pricing')}>Go to Pricing</button>
            <button
              style={{ marginLeft: 8 }}
              onClick={addProject}
              disabled={!canAddProject}
            >
              Add Project
            </button>
          </div>
        </div>

        {usage ? (
          <div style={{ marginTop: 8 }}>
            <div>Export PDF access: {usage.exportPDF ? 'Yes' : 'No'}</div>
            <div>Max projects: {usage.maxProjects}</div>
            <div>Task usage - current: {usage.taskCount} / max: {usage.taskMax} / hasAccess: {String(usage.hasTaskAccess)}</div>
            <div>AI summaries: current {usage.aiSummaries?.current} limit {usage.aiSummaries?.limit}</div>
            <div>Project count (hardset): {projectCount}</div>
            <div>Current task count (local): {currentTaskCount}</div>
            {!canAddProject && <div style={{ color: 'crimson', marginTop: 6 }}>Project limit reached — cannot add more projects.</div>}
          </div>
        ) : (
          <div style={{ marginTop: 8 }}>No usage data loaded</div>
        )}
      </section>

      <div>
        {projects.map(project => (
          <div key={project.id} style={{ border: '1px solid #eee', padding: 12, marginBottom: 8 }}>
            <h3>{project.name}</h3>
            <div>
              <button onClick={() => addTask(project.id)}>Add Task</button>
              {/* always show Export as PDF; handler will redirect to pricing if no access */}
              <button style={{ marginLeft: 8 }} onClick={() => exportAsPdf(project.id)}>
                Export as PDF
              </button>
              {/* new: Remove Project button */}
              <button style={{ marginLeft: 8 }} onClick={() => removeProject(project.id)}>
                Remove Project
              </button>
            </div>
            <ul>
              {project.tasks.map(task => (
                <li key={task.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span>{task.title}</span>
                  <button onClick={() => removeTask(project.id, task.id)}>Remove</button>
                </li>
              ))}
              {project.tasks.length === 0 && <li>No tasks</li>}
            </ul>
          </div>
        ))}
      </div>

      <p className="read-the-docs">Click Add Task to create tasks (reports event & usage)</p>
    </>
  )
}

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
        </Routes>
      </Router>
  )
}

export default App
