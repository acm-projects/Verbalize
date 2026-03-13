'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { type User } from '@supabase/supabase-js'

// ...

export default function AccountForm({ user }: { user: User | null }) {

  if (!user) {
  return <div>Please log in</div>
  }

  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [firstName, setFirstName] = useState<string | null>("")
  const [lastName, setLastName] = useState<string | null>("")
  const [email, setEmail] = useState<string | null>("")

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('Users')
        .select(`first_name, last_name, email`)
        .eq('id', user?.id)
        .maybeSingle()

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        setFirstName(data.first_name)
        setLastName(data.last_name)
        setEmail(data.email)
      }
    } catch (error) {
      alert('Error loading user data!')
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  const upsertSignedInUser = useCallback(async () => {
    try {
      setLoading(true)
      await supabase.from('Users').upsert({
        id: user.id,
        first_name: user.user_metadata?.first_name || null,
        last_name: user.user_metadata?.last_name || null,
        email: user.email,
        updated_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error upserting signed-in user:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase, user])

  useEffect(() => {
    upsertSignedInUser().then(() => getProfile())
  }, [upsertSignedInUser, getProfile])

  async function updateProfile({
    firstName, lastName
  }: {
    firstName: string | null
    lastName: string | null
  }) {
    try {
      setLoading(true)

      const { error } = await supabase.from('Users').upsert({
        id: user?.id as string,
        first_name: firstName || null,
        last_name: lastName || null,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-widget">

      {/* ... */}

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={user?.email} disabled />
      </div>
      <div>
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          type="text"
          value={firstName || ''}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          type="text"
          value={lastName || ''}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      <div>
        <button
          className="button primary block"
          onClick={() => updateProfile({ firstName, lastName })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <form action="/auth/signout" method="post">
          <button className="button block" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}