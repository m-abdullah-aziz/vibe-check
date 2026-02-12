import React from 'react'
import ReactDOM from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import VibeCheck from './VibeCheck.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <VibeCheck />
    <Analytics />
  </React.StrictMode>,
)
