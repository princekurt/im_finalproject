import React, { useMemo, useState } from 'react'
import { LoginPage } from './pages/LoginPage.jsx'
import { DashboardLayout } from './layouts/DashboardLayout.jsx'
import { DashboardPage } from './pages/DashboardPage.jsx'
import { MembersPage } from './pages/MembersPage.jsx'
import { RegistrationPage } from './pages/RegistrationPage.jsx'
import { WalkInPage } from './pages/WalkInPage.jsx'
import { MembershipTransactionPage } from './pages/MembershipTransactionPage.jsx'
import { ManageStaffPage } from './pages/ManageStaffPage.jsx' // Added Import
import { MemberProfileModal } from './components/MemberProfileModal.jsx'
import { MEMBERS } from './data/members.js'

export default function App() {
  const members = useMemo(() => MEMBERS, [])

  const [session, setSession] = useState({
    authenticated: !!localStorage.getItem('staff_id'),
    staffName: localStorage.getItem('staff_name') || '',
  })

  const [activeKey, setActiveKey] = useState('dashboard')
  const [selectedMember, setSelectedMember] = useState(null)

  const handleLoginSuccess = () => {
    setSession({
      authenticated: true,
      staffName: localStorage.getItem('staff_name')
    })
  }

  if (!session.authenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <DashboardLayout
      activeKey={activeKey}
      staffId={session.staffName}
      onNavigate={(key) => setActiveKey(key)}
      onLogout={() => {
        localStorage.clear()
        setSession({ authenticated: false, staffName: '' })
        setActiveKey('dashboard')
        setSelectedMember(null)
      }}
    >
      {/* Page Routing Logic */}
      {activeKey === 'dashboard' && (
        <DashboardPage members={members} onOpenMember={(m) => setSelectedMember(m)} />
      )}
      {activeKey === 'members' && (
        <MembersPage members={members} onOpenMember={(m) => setSelectedMember(m)} />
      )}
      {activeKey === 'registration' && <RegistrationPage />}
      {activeKey === 'walkin' && <WalkInPage />}
      {activeKey === 'membership_txn' && <MembershipTransactionPage />}
      
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