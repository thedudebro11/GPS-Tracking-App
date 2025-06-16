import "./globals.css"
import { BackgroundPinger } from "@/components/BackgroundPinger"
import { Toaster } from "@/components/ui/toaster"
import { UserProvider } from "../app/context/UserContext"

export const metadata = {
  title: "SafeSteps",
  description: "Real-time GPS emergency tracking",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <BackgroundPinger />
          {children}
          <Toaster />
        </UserProvider>
      </body>
    </html>
  )
}
