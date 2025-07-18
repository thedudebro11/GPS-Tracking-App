import { Suspense } from "react"
import SafeStepsClientApp from "@/components/SafeStepsClientApp"

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading SafeSteps...</div>}>
      <SafeStepsClientApp />
    </Suspense>
  )
}
