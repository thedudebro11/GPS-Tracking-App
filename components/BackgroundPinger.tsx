"use client"

import { useEffect, useRef } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function BackgroundPinger() {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const lastMode = useRef({ emergency: false, tracking: false })

    useEffect(() => {
        console.log("👀 BackgroundPinger mounted")
        let isMounted = true

        const sendPing = async () => {
            const emergencyMode = localStorage.getItem("emergencyMode") === "true"
            const trackingEnabled = localStorage.getItem("activeTrackingEnabled") === "true"
            const pingInterval = Number(localStorage.getItem("pingInterval") || "30000")

            const supabase = createClientComponentClient()
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser()

            if (userError || !user) {
                console.error("❌ No user found or failed to fetch user:", userError)
                return scheduleNext(pingInterval)
            }

            if (!emergencyMode && !trackingEnabled) {
                console.log("⏸️ No ping (inactive)")
                return scheduleNext(pingInterval)
            }

            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const { latitude, longitude, accuracy } = pos.coords

                    const payload = {
                        user_id: user.id,
                        latitude,
                        longitude,
                        accuracy,
                        is_emergency: emergencyMode,
                    }

                    const endpoint = emergencyMode
                        ? `${process.env.NEXT_PUBLIC_API_URL}/api/alerts`
                        : `${process.env.NEXT_PUBLIC_API_URL}/api/locations`

                    try {
                        const res = await fetch(endpoint, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(payload),
                        })

                        const data = await res.json()
                        console.log("📡 Ping at:", new Date().toLocaleTimeString(), data)
                        localStorage.setItem("lastPingTime", Date.now().toString())
                    } catch (err) {
                        console.error("❌ Ping failed:", err)
                    } finally {
                        if (isMounted) scheduleNext(pingInterval)
                    }
                },
                (err) => {
                    console.error("Geolocation error:", err)
                    if (isMounted) scheduleNext(pingInterval)
                },
                { enableHighAccuracy: true }
            )
        }



        const scheduleNext = (interval: number) => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            timeoutRef.current = setTimeout(sendPing, interval)
            console.log("▶️ Next ping scheduled in", interval / 1000, "sec")
        }

        const delayFirstPing = () => {
            const emergencyMode = localStorage.getItem("emergencyMode") === "true"
            const trackingEnabled = localStorage.getItem("activeTrackingEnabled") === "true"
            const pingInterval = Number(localStorage.getItem("pingInterval") || "30000")

            if (emergencyMode || trackingEnabled) {
                const lastPing = localStorage.getItem("lastPingTime")
                const now = Date.now()

                const timeSinceLastPing = lastPing ? now - Number(lastPing) : Infinity
                const delay = Math.max(pingInterval - timeSinceLastPing, 0)

                timeoutRef.current = setTimeout(() => {
                    sendPing()
                }, delay)

                console.log("⏳ First ping scheduled after", delay / 1000, "sec")
            } else {
                console.log("🚫 No tracking active on mount")
            }
        }


        const monitorStateAndStartLoop = () => {
            const emergencyMode = localStorage.getItem("emergencyMode") === "true"
            const trackingEnabled = localStorage.getItem("activeTrackingEnabled") === "true"
            const pingInterval = Number(localStorage.getItem("pingInterval") || "30000")

            const modeChanged =
                emergencyMode !== lastMode.current.emergency ||
                trackingEnabled !== lastMode.current.tracking

            if (modeChanged) {
                console.log("🔄 Tracking mode changed")

                lastMode.current = { emergency: emergencyMode, tracking: trackingEnabled }

                if (timeoutRef.current) clearTimeout(timeoutRef.current)

                delayFirstPing()

            }
        }

        const monitorInterval = setInterval(monitorStateAndStartLoop, 5000)
        monitorStateAndStartLoop()

        return () => {
            isMounted = false
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            clearInterval(monitorInterval)
        }
    }, [])

    return null
}
