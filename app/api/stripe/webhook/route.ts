import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { supabase } from "../../../../lib/supabase-server" // server-side client (not the regular one)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Stripe needs raw body to validate the signature
export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook signature verification failed.", err)
    return new NextResponse("Webhook Error", { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    const userId = session.metadata?.user_id
    if (!userId) {
      console.error("No user_id in metadata")
      return new NextResponse("Missing user ID", { status: 400 })
    }

    // Update Supabase
    const { error } = await supabase
      .from("users")
      .update({ is_premium: true })
      .eq("id", userId)

    if (error) {
      console.error("Supabase update failed:", error)
      return new NextResponse("Database error", { status: 500 })
    }

    console.log(`✅ Premium activated for user ${userId}`)
  }

  return new NextResponse("Webhook received", { status: 200 })
}
