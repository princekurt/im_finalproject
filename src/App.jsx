import React, { useMemo, useState } from 'react'
import { LoginPage } from './pages/LoginPage.jsx'
import { DashboardLayout } from './layouts/DashboardLayout.jsx'
import { DashboardPage } from './pages/DashboardPage.jsx'
import { MembersPage } from './pages/MembersPage.jsx'
import { RegistrationPage } from './pages/RegistrationPage.jsx'
import { MemberProfileModal } from './components/MemberProfileModal.jsx'
import { MEMBERS } from './data/members.js'

export default function App() {
  const members = useMemo(() => MEMBERS, [])

  const [session, setSession] = useState({
    authenticated: false,
    staffId: '',
  })
  const [activeKey, setActiveKey] = useState('dashboard')
  const [selectedMember, setSelectedMember] = useState(null)

  if (!session.authenticated) {
    return (
      <LoginPage
        onLogin={({ staffId }) => {
          // TODO: Group will implement Admin Login here.
          setSession({ authenticated: true, staffId: staffId || 'LVL-STAFF' })
        }}
      />
    )
  }

  return (
    <DashboardLayout
      activeKey={activeKey}
      staffId={session.staffId}
      onNavigate={(key) => setActiveKey(key)}
      onLogout={() => {
        // TODO: Group will implement Logout here.
        setSession({ authenticated: false, staffId: '' })
        setActiveKey('dashboard')
        setSelectedMember(null)
      }}
    >
      {activeKey === 'dashboard' ? (
        <DashboardPage members={members} onOpenMember={(m) => setSelectedMember(m)} />
      ) : null}

      {activeKey === 'members' ? (
        <MembersPage members={members} onOpenMember={(m) => setSelectedMember(m)} />
      ) : null}

      {activeKey === 'registration' ? <RegistrationPage /> : null}

      <MemberProfileModal
        open={Boolean(selectedMember)}
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </DashboardLayout>
  )
}
