const API_URL = 'http://localhost:5000/api'

export const exportCreative = async (creativeId) => {
  const response = await fetch(`${API_URL}/export/${creativeId}`)

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Export failed')
  }

  const html = await response.text()
  const blob = new Blob([html], { type: 'text/html' })
  const url = window.URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `creative-${creativeId}.html`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  window.URL.revokeObjectURL(url)
}
