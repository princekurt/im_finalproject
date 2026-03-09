import React, { useState, useEffect } from 'react'
import { UserPlus, ShieldCheck, Users, Loader2, UserCog } from 'lucide-react'
import { Card, CardBody, CardHeader } from '../components/Card.jsx'
import { Button } from '../components/Button.jsx'
import { FieldLabel, TextField } from '../components/Field.jsx'
import { supabase } from '../lib/supabase'

export function ManageStaffPage() {
  const [loading, setLoading] = useState(false)
  const [staffList, setStaffList] = useState([])
  const [form, setForm] = useState({ name: '', user: '', pass: '' })

  // 1. Fetch all staff members
  const fetchStaff = async () => {
    const { data } = await supabase
      .from('tbl_receptionist')
      .select('*')
      .order('receptionist_id', { ascending: true })
    if (data) setStaffList(data)
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  // 2. Add New Staff (Defaults to 'Active')
  const handleAddStaff = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('tbl_receptionist')
      .insert([{
        receptionist_name: form.name,
        username: form.user,
        password: form.pass,
        is_admin: false,
        account_status: 'Active'
      }])

    if (error) {
      alert("Error: " + error.message)
    } else {
      alert("Staff account created successfully!")
      setForm({ name: '', user: '', pass: '' })
      fetchStaff()
    }
    setLoading(false)
  }

  // 3. Update Status (The Professional "Soft Delete")
  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('tbl_receptionist')
      .update({ account_status: newStatus })
      .eq('receptionist_id', id)

    if (error) {
      alert(error.message)
    } else {
      fetchStaff()
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* CREATE STAFF FORM */}
        <Card className="lg:col-span-1 border-t-2 border-[#CCFF00]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <UserPlus className="text-[#CCFF00] h-5 w-5" />
              <div className="text-sm font-black text-white uppercase italic tracking-wider">Authorize Personnel</div>
            </div>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div className="space-y-2">
                <FieldLabel>FULL NAME</FieldLabel>
                <TextField 
                  value={form.name} 
                  onChange={(e) => setForm({...form, name: e.target.value})} 
                  placeholder="Juan Dela Cruz" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <FieldLabel>USERNAME</FieldLabel>
                <TextField 
                  value={form.user} 
                  onChange={(e) => setForm({...form, user: e.target.value})} 
                  placeholder="juan_lvlup" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <FieldLabel>INITIAL PASSWORD</FieldLabel>
                <TextField 
                  type="password"
                  value={form.pass} 
                  onChange={(e) => setForm({...form, pass: e.target.value})} 
                  placeholder="••••••••" 
                  required 
                />
              </div>
              <Button type="submit" variant="primary" className="w-full mt-2" disabled={loading}>
                {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
                {loading ? "Processing..." : "Create Staff Account"}
              </Button>
            </form>
          </CardBody>
        </Card>

        {/* STAFF DIRECTORY */}
        <Card className="lg:col-span-2 bg-black/40">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="text-[#CCFF00] h-5 w-5" />
                <div className="text-sm font-black text-white uppercase italic tracking-wider">Staff Directory</div>
              </div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Total Members: {staffList.length}
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-zinc-500 uppercase text-[10px] font-bold tracking-widest">
                    <th className="pb-4 pl-2">Status</th>
                    <th className="pb-4">Name</th>
                    <th className="pb-4">Username</th>
                    <th className="pb-4 text-right pr-2">Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {staffList.map((staff) => (
                    <tr key={staff.receptionist_id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 pl-2">
                        <span className={`inline-flex items-center h-2 w-2 rounded-full mr-2 ${
                          staff.account_status === 'Active' ? 'bg-[#CCFF00]' : 
                          staff.account_status === 'On Leave' ? 'bg-orange-500' : 'bg-zinc-600'
                        }`} />
                        <span className="text-[10px] font-bold uppercase text-zinc-400">{staff.account_status}</span>
                      </td>
                      <td className="py-4 font-bold text-zinc-200">
                        {staff.receptionist_name}
                        {staff.is_admin && <span className="ml-2 text-[10px] bg-white/10 text-white border border-white/20 px-2 py-0.5 rounded-full italic font-black">ADMIN</span>}
                      </td>
                      <td className="py-4 font-mono text-xs text-zinc-500">{staff.username}</td>
                      <td className="py-4 text-right pr-2">
                        {!staff.is_admin ? (
                          <div className="flex items-center justify-end gap-2">
                            <UserCog className="h-3 w-3 text-zinc-600" />
                            <select 
                              value={staff.account_status}
                              onChange={(e) => updateStatus(staff.receptionist_id, e.target.value)}
                              className="bg-zinc-900 border border-white/10 rounded-lg text-[10px] font-bold px-2 py-1 text-zinc-300 outline-none focus:ring-1 focus:ring-[#CCFF00] cursor-pointer"
                            >
                              <option value="Active">SET ACTIVE</option>
                              <option value="Inactive">SET INACTIVE</option>
                              <option value="On Leave">ON LEAVE</option>
                            </select>
                          </div>
                        ) : (
                          <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter">System Master</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}