import React, { useEffect, useState } from 'react'
import { LoginPage } from './pages/LoginPage.jsx'
import { DashboardLayout } from './layouts/DashboardLayout.jsx'
import { DashboardPage } from './pages/DashboardPage.jsx'
import { MembersPage } from './pages/MembersPage.jsx'
import { RegistrationPage } from './pages/RegistrationPage.jsx'
import { WalkInPage } from './pages/WalkInPage.jsx'
import { MembershipTransactionPage } from './pages/MembershipTransactionPage.jsx'
import { ManageStaffPage } from './pages/ManageStaffPage.jsx' // Added Import
import { TransactionHistoryPage } from './pages/TransactionHistoryPage.jsx'
import { MemberProfileModal } from './components/MemberProfileModal.jsx'

export default function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme === 'light' ? 'light' : 'dark'
  })
  const [session, setSession] = useState({
    authenticated: !!localStorage.getItem('staff_id'),
    staffName: localStorage.getItem('staff_name') || '',
  })

  const [activeKey, setActiveKey] = useState('dashboard')
  const [selectedMember, setSelectedMember] = useState(null)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('theme-light', theme === 'light')
    root.classList.toggle('theme-dark', theme === 'dark')
    root.style.colorScheme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  const handleLoginSuccess = () => {
    setSession({
      authenticated: true,
      staffName: localStorage.getItem('staff_name')
    })
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  if (!session.authenticated) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    )
  }

  return (
    <DashboardLayout
      activeKey={activeKey}
      staffId={session.staffName}
      theme={theme}
      onToggleTheme={toggleTheme}
      onNavigate={(key) => setActiveKey(key)}
      onLogout={() => {
        localStorage.clear()
        localStorage.setItem('theme', theme)
        setSession({ authenticated: false, staffName: '' })
        setActiveKey('dashboard')
        setSelectedMember(null)
      }}
    >
      {/* Page Routing Logic */}
      {activeKey === 'dashboard' && (
        <DashboardPage onOpenMember={(m) => setSelectedMember(m)} />
      )}
      {activeKey === 'members' && <MembersPage />}
      {activeKey === 'registration' && <RegistrationPage />}
      {activeKey === 'walkin' && <WalkInPage />}
      {activeKey === 'membership_txn' && <MembershipTransactionPage />}
      {activeKey === 'transaction_history' && <TransactionHistoryPage />}
      
      {/* NEW: Manage Staff Page */}
      {activeKey === 'manage_staff' && <ManageStaffPage />}

      <MemberProfileModal
        open={Boolean(selectedMember)}
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </DashboardLayout>
  )
}
