import React, { useMemo, useState } from 'react'
import { LoginPage } from './pages/LoginPage.jsx'
import { DashboardLayout } from './layouts/DashboardLayout.jsx'
import { DashboardPage } from './pages/DashboardPage.jsx'
import { MembersPage } from './pages/MembersPage.jsx'
import { RegistrationPage } from './pages/RegistrationPage.jsx'
// --- ADD THESE TWO IMPORTS ---
import { WalkInPage } from './pages/WalkInPage.jsx'
import { MembershipTransactionPage } from './pages/MembershipTransactionPage.jsx'
// -----------------------------
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
        setSession({ authenticated: false, staffId: '' })
        setActiveKey('dashboard')
        setSelectedMember(null)
      }}
    >
      {/* 1. Dashboard */}
      {activeKey === 'dashboard' && (
        <DashboardPage members={members} onOpenMember={(m) => setSelectedMember(m)} />
      )}

      {/* 2. Members List */}
      {activeKey === 'members' && (
        <MembersPage members={members} onOpenMember={(m) => setSelectedMember(m)} />
      )}

      {/* 3. Customer Registration */}
      {activeKey === 'registration' && <RegistrationPage />}

      {/* 4. NEW: Walk-In Transaction */}
      {activeKey === 'walkin' && <WalkInPage />}

      {/* 5. NEW: Membership Transaction */}
      {activeKey === 'membership_txn' && <MembershipTransactionPage />}

      {/* Member Details Modal */}
      <MemberProfileModal
        open={Boolean(selectedMember)}
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </DashboardLayout>
  )
}