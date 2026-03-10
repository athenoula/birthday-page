import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import CreatorPage from './components/CreatorPage'
import ViewPage from './components/ViewPage'

const params = new URLSearchParams(window.location.search)
const isViewMode = params.get('mode') === 'view'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isViewMode ? <ViewPage /> : <CreatorPage />}
  </React.StrictMode>
)
