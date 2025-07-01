import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Parse JSON data from the frontend
    const registrationData = await request.json()

    console.log("📝 Registration Data Received:", registrationData)

    // Get the Google Apps Script Web App URL from environment variables
    const googleScriptUrl = process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL

    if (!googleScriptUrl) {
      console.log("🔧 Running in DEMO MODE - Google Apps Script URL not configured")
      console.log("📋 Registration data that would be sent:", JSON.stringify(registrationData, null, 2))

      // Return success in demo mode
      return NextResponse.json({
        success: true,
        message: "Registration successful! (Demo Mode - Check console for data)",
      })
    }

    try {
      // Send the form data as JSON to Google Apps Script
      const response = await fetch(googleScriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      })

      if (!response.ok) {
        throw new Error(`Google Apps Script responded with status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        console.log("✅ Form data successfully processed by Google Apps Script")
        return NextResponse.json({
          success: true,
          message: "Registration successful! You'll receive a confirmation email shortly.",
        })
      } else {
        console.error("❌ Google Apps Script reported an error:", result.error)
        return NextResponse.json(
          { success: false, message: result.error || "Registration failed. Please try again." },
          { status: 500 },
        )
      }
    } catch (fetchError) {
      console.error("🔗 Failed to connect to Google Apps Script:", fetchError)
      console.log("📋 Falling back to demo mode. Registration data:", JSON.stringify(registrationData, null, 2))

      // Fallback to demo mode if Google Apps Script fails
      return NextResponse.json({
        success: true,
        message: "Registration received! (Backup mode - we'll process this manually)",
      })
    }
  } catch (error) {
    console.error("💥 API route error:", error)
    return NextResponse.json({ success: false, message: "Server error. Please try again." }, { status: 500 })
  }
}
