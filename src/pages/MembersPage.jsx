import React, { useState, useEffect } from 'react'
import { Users, Loader2, AlertCircle, RefreshCw, Filter } from 'lucide-react'
import { MemberTable } from '../components/MemberTable.jsx'
import { Button } from '../components/Button.jsx'
import { supabase } from '../lib/supabase'

export function MembersPage() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: supabaseError } = await supabase
        .from('tbl_membership')
        .select(`
          membership_id,
          start_date,
          end_date,
          tbl_customer (
            full_name,
            contact_number
          ),
          tbl_membershiptype (
            membershiptype_name
          )
        `)
        .order('membership_id', { ascending: false })

      if (supabaseError) throw supabaseError

      const formattedMembers = data.map(m => ({
        id: `M-${m.membership_id}`,
        name: m.tbl_customer?.full_name || 'Unknown Member',
        contact: m.tbl_customer?.contact_number || 'No Contact',
        phone: m.tbl_customer?.contact_number || 'N/A',
        membershipType: m.tbl_membershiptype?.membershiptype_name || 'Standard Access',
        startDate: m.start_date,
        endDate: m.end_date,
      }))

      setMembers(formattedMembers)
    } catch (err) {
      console.error('Fetch Error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#CCFF00]/10 rounded-lg">
            <Users className="h-5 w-5 text-[#CCFF00]" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">
            Management
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
           <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs border border-white/10 hover:bg-white/5"
            onClick={fetchMembers}
            disabled={loading}
           >
             {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
             <span className="ml-2">Refresh</span>
           </Button>
           <Button variant="ghost" size="sm" className="text-xs border border-white/10">
             <Filter className="h-3.5 w-3.5 mr-2" />
             Filter
           </Button>
        </div>
      </header>

      <div className="p-1 min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-[#CCFF00]">
            <Loader2 className="h-10 w-10 animate-spin mb-4" />
            <p className="font-black italic tracking-widest uppercase text-sm text-zinc-400">Syncing Database...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
            <h3 className="text-white font-bold uppercase tracking-tighter">Connection Issue</h3>
            <p className="text-zinc-500 text-sm mt-1">{error}</p>
            <Button variant="primary" className="mt-6" onClick={fetchMembers}>
              Try Again
            </Button>
          </div>
        ) : (
          /* Pass the full members list and let the Table handle the search bar UI */
          <MemberTable members={members} />
        )}
      </div>
    </div>
  )
}