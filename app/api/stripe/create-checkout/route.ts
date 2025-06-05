import { NextResponse } from "next/server"
import Stripe from "stripe"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST() {
  const cookieStore =  cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [
      {
        price: "price_1RWI35CcOg8nBLRtYSOoVqss", // ✅ your actual price ID
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?canceled=true`,
    metadata: {
      user_id: user.id, // ✅ dynamically injected
    },
  })

  return NextResponse.json({ url: session.url })
}

