import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

if (import.meta.env.PROD) {
  const script = document.createElement('script')
  script.defer = true
  script.src = 'https://analytics.pulpo.cloud/script.js'
  script.dataset.websiteId = '77518c80-142f-4177-ab5a-e254eef6a228'
  document.head.appendChild(script)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
