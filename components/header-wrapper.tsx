import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"

// Force dynamic rendering (disable caching)
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function HeaderWrapper() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  let profile = null
  
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("email, full_name, role, avatar_url")
      .eq("id", user.id)
      .single()
    
    profile = data
  }
  
  return <Header user={profile} />
}
