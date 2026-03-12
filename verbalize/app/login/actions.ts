'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.log(error)
    redirect('/error')
  }

  //revalidatePath('/', 'layout')
  //redirect('/account')
    redirect('/course')

}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string
  }

  //console.log('Signup form data:', data)

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: { 
    data: { 
      first_name: data.firstName,
      last_name: data.lastName,
    },
  },
  })

  if (authError) {
    console.error(authError)
    throw authError
  }

  if (authData.user) {
    const { error: dbError } = await supabase.from('Users').insert({
      id: authData.user.id,        
      first_name: data.firstName, 
      last_name: data.lastName,    
      email: data.email,
    })

    //console.log('Auth signup data:', authData)

    if (dbError) {
      console.error('Error inserting user profile:', dbError)
      throw dbError
    }


  }

  //revalidatePath('/', 'layout')
  redirect('/course')
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.log(error);
    redirect("/error");
  }

  if (data.url) {
    redirect(data.url); //Go to Google
  }
}