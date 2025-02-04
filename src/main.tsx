// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './globals.css'
import { createHashRouter, Navigate, RouterProvider } from 'react-router-dom'
import Login from './pages/Login'
import App from './App'
import SendMessage from './pages/SendMessage'

const router = createHashRouter([
  {
    path: '/',
    element: <Navigate to='/login' replace />
  },
  {
    path: '/message',
    element: <App />,
    children: [
      {
        path: '/message/:phoneNumber',
        element: <SendMessage />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  }
  ],
  {
    basename: '/green-api'
  }
)

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router}/>
)
