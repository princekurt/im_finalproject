import React, { useState } from 'react'
import { UserPlus, Loader2 } from 'lucide-react'
import { Button } from '../components/Button.jsx'
import { Card, CardBody, CardHeader } from '../components/Card.jsx'
import { FieldLabel, SelectField, TextField } from '../components/Field.jsx'
import { supabase } from '../lib/supabase'

export function RegistrationPage() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    full_name: '',
    contact_number: '',
    address: '',
    gender_id: '1', 
    dob: '',
    relation_status_id: '1',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('tbl_customer')
        .insert([
          {
            full_name: form.full_name,
            contact_number: form.contact_number,
            address: form.address,
            gender_id: parseInt(form.gender_id),
            dob: form.dob,
            relation_status_id: parseInt(form.relation_status_id),
          },
        ])

      if (error) throw error

      alert('Customer successfully registered!')
      
      setForm({
        full_name: '',
        contact_number: '',
        address: '',
        gender_id: '1',
        dob: '',
        relation_status_id: '1',
      })

    } catch (error) {
      console.error('Error:', error.message)
      alert('Error registering customer: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-black tracking-tight text-zinc-100 uppercase italic">Customer Registration</div>
              <div className="mt-1 text-xs text-zinc-500">
                Create a new profile in <strong>tbl_customer</strong>.
              </div>
            </div>
            <div className="rounded-2xl bg-black/30 p-3 ring-1 ring-white/10 text-zinc-200">
              <UserPlus className="h-5 w-5 text-[#CCFF00]" />
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2">
              <div className="md:col-span-2 space-y-2">
                <FieldLabel>FULL NAME</FieldLabel>
                <TextField 
                  required
                  value={form.full_name} 
                  onChange={(e) => setForm({...form, full_name: e.target.value})}
                  placeholder="Juan Dela Cruz"
                />
              </div>

              <div className="space-y-2">
                <FieldLabel>CONTACT NUMBER</FieldLabel>
                <TextField 
                  required
                  value={form.contact_number} 
                  onChange={(e) => setForm({...form, contact_number: e.target.value})}
                  placeholder="0917 000 0000"
                />
              </div>

              <div className="space-y-2">
                <FieldLabel>DATE OF BIRTH</FieldLabel>
                <TextField 
                  required
                  type="date" 
                  value={form.dob} 
                  onChange={(e) => setForm({...form, dob: e.target.value})} 
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <FieldLabel>HOME ADDRESS</FieldLabel>
                <TextField 
                  required
                  value={form.address} 
                  onChange={(e) => setForm({...form, address: e.target.value})}
                  placeholder="Street Name, Barangay, City"
                />
              </div>

              {/* UPDATED GENDER CHOICES */}
              <div className="space-y-2">
                <FieldLabel>GENDER</FieldLabel>
                <SelectField 
                  value={form.gender_id} 
                  onChange={(e) => setForm({...form, gender_id: e.target.value})}
                >
                  <option value="1">Male</option>
                  <option value="2">Female</option>
                  <option value="3">Non-binary</option>
                </SelectField>
              </div>

              {/* UPDATED RELATIONSHIP CHOICES */}
              <div className="space-y-2">
                <FieldLabel>RELATIONSHIP STATUS</FieldLabel>
                <SelectField 
                  value={form.relation_status_id} 
                  onChange={(e) => setForm({...form, relation_status_id: e.target.value})}
                >
                  <option value="1">Single</option>
                  <option value="2">In a relationship</option>
                  <option value="3">Married</option>
                  <option value="4">Separated</option>
                  <option value="5">Annulled</option>
                  <option value="6">Widowed</option>
                  <option value="7">Prefer not to say</option>
                </SelectField>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-between border-t border-white/5 pt-5">
              <div className="text-[10px] uppercase font-bold text-zinc-600">
                Customer ID will be auto-generated by the database.
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  type="button" 
                  variant="ghost" 
                  disabled={loading}
                  onClick={() => setForm({ full_name: '', contact_number: '', address: '', gender_id: '1', dob: '', relation_status_id: '1' })}
                >
                  Clear
                </Button>
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Customer Profile'}
                </Button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* RIGHT SIDE: INFORMATION CARD */}
      <Card>
        <CardHeader>
          <div className="text-sm font-black tracking-tight text-zinc-100 uppercase">Operational Note</div>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="rounded-2xl bg-zinc-900/50 p-4 border border-white/5">
            <p className="text-xs text-zinc-400 leading-relaxed italic">
              "Ensure the customer's legal name matches their ID for insurance and waiver purposes."
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
