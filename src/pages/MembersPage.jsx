import React, { useState } from 'react'
import { Users, Filter } from 'lucide-react'
import { MemberTable } from '../components/MemberTable.jsx'
import { MEMBERS } from '../data/members.js'
import { Button } from '../components/Button.jsx'

export function MembersPage() {
  const [members] = useState(MEMBERS) // Using the mock data from your members.js

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#CCFF00]/10 rounded-lg">
              <Users className="h-5 w-5 text-[#CCFF00]" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase">
              Management
            </h1>
          </div>
          <p className="text-zinc-500 text-sm max-w-md">
            Overview of all active and expired memberships within the facility.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="sm" className="text-xs border border-white/10">
             <Filter className="h-3.5 w-3.5 mr-2" />
             Filter List
           </Button>
        </div>
      </header>

      <div className="p-1">
        <MemberTable members={members} />
      </div>
    </div>
  )
}