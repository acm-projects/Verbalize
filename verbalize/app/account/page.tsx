import AccountForm from './account-form'
import { createClient } from '@/lib/supabase/server'

export default async function Account() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: students, error } = await supabase
    .from("Students")
    .select("*")

  if (error) {
    console.error(error)
  }

  console.log(students)

  return (
    <>
      <AccountForm user={user} />
      <div>
        <h2>Students</h2>
        {students?.map((student) => (
          <p key={student.id}>{student.name}</p>
        ))}
      </div>
    </>
  )
}