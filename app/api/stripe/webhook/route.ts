// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"
import { supabase } from "@/lib/supabase-server"

export const config = {
  api: {
    bodyParser: false,
  },
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
})


export async function POST(req: Request) {
  const rawBody = await req.text()
  const signature = (await headers()).get("stripe-signature")!


  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("❌ Webhook signature verification failed.", err)
    return new NextResponse("Webhook Error", { status: 400 })
  }

  // 🧪 Log full event type for testing
  console.log("✅ Stripe Event:", event.type)

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    console.log("🧾 Full checkout session metadata:", JSON.stringify(session.metadata, null, 2))
    console.log("📦 Full session object:", JSON.stringify(session, null, 2))

    const userId = session.metadata?.user_id

    if (!userId) {
      console.error("❌ Missing user_id in metadata.")
      return new NextResponse("Missing user ID", { status: 400 })
    }

    // 🔐 Mark user as premium in Supabase
    const { error,data } = await supabase
      .from("users")
      .update({ is_premium: true })
      .eq("id", userId)
      .select()

    if (error) {
      console.error("❌ Supabase update failed:", error)
      return new NextResponse("Database error", { status: 500 })
    }else{
        console.log("✅ Supabase updated user:", data)
    }

    console.log(`🎉 Premium activated for user: ${userId}`)
  }

  return new NextResponse("Webhook received", { status: 200 })
}
