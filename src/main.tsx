import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import logoUrl from './assets/logo.png'

function setFavicon(href: string) {
  const existing =
    (document.querySelector('link#app-favicon') as HTMLLinkElement | null) ??
    (document.querySelector('link[rel="icon"]') as HTMLLinkElement | null)

  const link = existing ?? (document.createElement('link') as HTMLLinkElement)
  link.id = 'app-favicon'
  link.rel = 'icon'
  link.href = href
  if (!existing) document.head.appendChild(link)
}

setFavicon(logoUrl)
document.title = 'JUKI REPAIR'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
