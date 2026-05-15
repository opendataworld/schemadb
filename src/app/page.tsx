import { ChatUI } from "@/components/chat"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await auth()

  if (!session) {
    redirect("/api/auth/signin")
  }

  return (
    <main className="flex-1 h-screen bg-slate-900">
      <ChatUI />
    </main>
  )
}