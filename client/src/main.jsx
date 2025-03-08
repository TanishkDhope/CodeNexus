import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RoleProvider } from './context/RoleContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    <RoleProvider>
    <App />
    </RoleProvider>
)
