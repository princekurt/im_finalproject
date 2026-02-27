import React from 'react'
import { MemberTable } from '../components/MemberTable.jsx'

export function MembersPage({ members, onOpenMember }) {
  return <MemberTable members={members} onOpenMember={onOpenMember} />
}

