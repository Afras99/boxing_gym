// app/api/register/route.ts
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Parse JSON data instead of form data
    const data = await request.json();

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.phone) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ONLY include the fields that are actually sent from your frontend form
    const registrationData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      age: data.age,
      experience: data.experience,
      agreeTerms: data.agreeTerms,
    };

    // Get the Google Apps Script Web App URL from your environment variables
    const googleScriptUrl = process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL;

    console.log(googleScriptUrl)

    if (!googleScriptUrl) {
      console.error("GOOGLE_APPS_SCRIPT_WEB_APP_URL is not set in environment variables.");
      return NextResponse.json(
        { success: false, message: "Server configuration error. Please try again later." },
        { status: 500 }
      );
    }

    // Send the form data as JSON to your Google Apps Script Web App
    const response = await fetch(googleScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registrationData),
    });

    // The Google Apps Script will return a JSON response (success: true/false)
    const result = await response.json();

    if (result.success) {
      console.log("Form data successfully processed by Google Apps Script.");
      return NextResponse.json({
        success: true,
        message: "Registration successful! You'll receive a confirmation email shortly.",
      });
    } else {
      console.error("Google Apps Script reported an error:", result.error);
      return NextResponse.json(
        { success: false, message: result.error || "Registration failed. Please try again." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Next.js API route error during registration:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred during registration." },
      { status: 500 }
    );
  }
}
