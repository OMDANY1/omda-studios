import ProjectForm from '@/components/admin/ProjectForm'

export default function NewProjectPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal font-display">New Project</h1>
        <p className="text-sm text-gray-500 mt-1">Create a new project entry</p>
      </div>
      <ProjectForm />
    </div>
  )
}
