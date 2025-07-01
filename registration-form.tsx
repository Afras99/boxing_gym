"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
// Ensure all Lucide icons used in the JSX are imported
import { Instagram, MapPin, Clock, Phone, Camera, Map } from "lucide-react"

export default function Component() {
  const [currentTime, setCurrentTime] = useState<string>("")
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    experience: "", // Initialize with an empty string for the Select component
    agreeTerms: false,
  })

  // State for form validation errors
  const [formErrors, setFormErrors] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    age: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update time on client side to prevent hydration mismatch
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Kolkata",
        }) + " IST"
      )
    }
    
    updateTime() // Set initial time
    const interval = setInterval(updateTime, 1000) // Update every second
    
    return () => clearInterval(interval)
  }, [])

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const pattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    // Accepts Indian mobile numbers: optional +91, optional hyphen/space, optional 0, then 10 digits starting with 6-9
    const pattern: RegExp = /^(\+?91[-\s]?)?[0]?[6-9]\d{9}$/
    return pattern.test(phone.trim())
  }

  const validateName = (name: string): boolean => {
    // Only allow letters, spaces, hyphens, and apostrophes, minimum 2 characters
    const pattern: RegExp = /^[a-zA-Z\s\-']+$/
    return pattern.test(name.trim()) && name.trim().length >= 2
  }

  const validateAge = (age: string): boolean => {
    const ageNum: number = Number.parseInt(age, 10) // Use radix 10 for parseInt
    return !isNaN(ageNum) && ageNum >= 16 && ageNum <= 65
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault() // Prevent default form submission
    setIsSubmitting(true)

    let isValid: boolean = true
    const newErrors = { email: "", phone: "", firstName: "", lastName: "", age: "" }

    // Perform validation for each field
    if (!validateName(formData.firstName)) {
      newErrors.firstName = "Please enter a valid first name (letters, min 2 chars)."
      isValid = false
    }
    if (!validateName(formData.lastName)) {
      newErrors.lastName = "Please enter a valid last name (letters, min 2 chars)."
      isValid = false
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format."
      isValid = false
    }
    if (!validatePhone(formData.phone)) {
      newErrors.phone = "Invalid Indian phone number format (e.g., +91 9876543210)."
      isValid = false
    }
    if (!validateAge(formData.age)) {
      newErrors.age = "Age must be between 16 and 65."
      isValid = false
    }

    setFormErrors(newErrors) // Update form errors state

    if (isValid) {
      try {
        // Prepare data for submission to your Next.js API route.
        // The API route will then forward this to the Google Apps Script.
        // The Apps Script will handle adding timestamps etc.
        const submitData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          age: formData.age,
          experience: formData.experience,
          agreeTerms: formData.agreeTerms,
        }

        // --- IMPORTANT CHANGE HERE: Fetch to your own Next.js API route ---
        const response: Response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitData),
        })

        // Parse the JSON response from your Next.js API route
        const result: { success: boolean; message?: string } = await response.json()

        if (result.success) {
          alert("🎉 Registration successful! You'll receive a confirmation email shortly.")
          // Reset form on successful submission
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            age: "",
            experience: "", // Reset experience to empty string
            agreeTerms: false,
          })
        } else {
          // Display error message from your API route
          alert(`❌ Registration failed: ${result.message || "Please try again."}`)
        }
      } catch (error: unknown) {
        console.error("Error submitting form:", error)
        alert("❌ Registration failed due to a network error. Please check your connection and try again.")
      }
    }
    setIsSubmitting(false)
  }

  // Handle input changes and clear associated errors
  const handleInputChange = (field: string, value: string | boolean): void => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when the input for a specific field changes
    if (
      field === "email" ||
      field === "phone" ||
      field === "firstName" ||
      field === "lastName" ||
      field === "age"
    ) {
      setFormErrors((prevErrors) => ({ ...prevErrors, [field]: "" }))
    }
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: "#131517",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Animated gradient backgrounds */}
      <div
        className="fixed inset-0 w-full h-full opacity-50"
        style={{
          background: "radial-gradient(50% 50% at 0% 0%, #7662fc, transparent)",
          filter: "blur(144.7px)",
          animation: "gradient-move 15s ease infinite",
        }}
      />
      <div
        className="fixed inset-0 w-full h-full opacity-10"
        style={{
          background: "radial-gradient(100% 100% at 0% 80%, #01f77e, transparent)",
          filter: "blur(144.7px)",
          animation: "gradient-move 15s ease infinite",
        }}
      />
      {/* Add keyframes animation for background gradients */}
      <style jsx>{`
        @keyframes gradient-move {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(30px, -50px) rotate(120deg);
          }
          66% {
            transform: translate(-20px, 20px) rotate(240deg);
          }
        }
        .bg-gray-850 {
          background-color: #1f2937;
        }
      `}</style>
      {/* Content wrapper with relative positioning and z-index to stay above backgrounds */}
      <div className="relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between p-6 text-white">
          <div className="flex items-center gap-3">
            <img src="/images/abbs-training-logo.jpeg" alt="AABS Training Logo" className="w-10 h-10 object-contain" />
            <div className="text-sm text-white/80 font-medium">AABS Training Fighting Club</div>
          </div>
          <div className="text-sm text-white/80 font-medium">
            {currentTime}
          </div>
        </header>

        {/* Hero Logo Section - Clean AABS Training Logo Display */}
        <section className="relative px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-12 border border-gray-600/40 shadow-2xl">
              {/* Large AABS Training Logo */}
              <div className="flex justify-center mb-8">
                <img
                  src="/images/abbs-training-logo.jpeg"
                  alt="AABS Training Fighting Club"
                  className="w-48 h-48 md:w-64 md:h-64 object-contain"
                />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                AABS Training Fighting Club
              </h1>
              <p className="text-xl md:text-2xl text-slate-200 font-medium mb-6">
                Master Multiple Fighting Disciplines
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <div className="bg-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-full px-4 py-2">
                  <span className="text-red-300 font-semibold">🥊 Muay Thai</span>
                </div>
                <div className="bg-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-full px-4 py-2">
                  <span className="text-red-300 font-semibold">🥊 Boxing</span>
                </div>
                <div className="bg-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-full px-4 py-2">
                  <span className="text-red-300 font-semibold">🥋 Kickboxing</span>
                </div>
                <div className="bg-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-full px-4 py-2">
                  <span className="text-red-300 font-semibold">🤼 Wrestling</span>
                </div>
                <div className="bg-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-full px-4 py-2">
                  <span className="text-red-300 font-semibold">💪 Strength Training</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="flex items-center justify-center px-4 py-8">
          {/* IMPORTANT FIX: Removed overflow-hidden from Card to prevent dropdown clipping. */}
          {/* If you add other content that might overflow, consider specific overflow-y for those sections. */}
          <Card className="w-full max-w-3xl bg-gray-850/95 backdrop-blur-xl border border-gray-700/50 shadow-2xl rounded-3xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-white mb-2">Registration Form</CardTitle>
              <CardDescription className="text-gray-400 text-lg">
                Join AABS Training Fighting Club. Register below to begin your martial arts journey.
              </CardDescription>

              {/* Location section with enhanced design */}
              <div className="mb-6 p-6 bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700/40 shadow-sm">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-white" />
                  Gym Location & Training Details
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Map Embed */}
                  <div className="space-y-4">
                    {/* Added relative z-10 to ensure map button is clickable and visible */}
                    <div className="w-full h-56 bg-slate-200 rounded-xl flex items-center justify-center relative overflow-hidden shadow-lg z-10">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.90089943408!2d77.46612654726562!3d12.953945614117967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1640995200000!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="rounded-xl"
                        title="Google Maps Location" // Added title for accessibility
                      ></iframe>
                    </div>
                    <Button
                      // Using your desired blue button styling
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                      asChild
                    >
                      <a href="https://maps.app.goo.gl/z1Pm5N6DeDKZq9v57" target="_blank" rel="noopener noreferrer">
                        <Map className="w-4 h-4" />
                        Open in Google Maps
                      </a>
                    </Button>
                  </div>

                  {/* Location Details */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-gray-850 rounded-xl border border-gray-700/50 shadow-sm">
                        <MapPin className="w-5 h-5 text-red-400 mt-1" />
                        <div>
                          <p className="font-semibold text-white">AABS Training Fighting Club</p>
                          <p className="text-gray-400">WJF7+G8G, Tavarekere</p>
                          <p className="text-gray-400">Cashier Layout, 1st Stage</p>
                          <p className="text-gray-400">BTM Layout, Bengaluru, Karnataka</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-gray-850 rounded-xl border border-gray-700/50 shadow-sm">
                        <Clock className="w-5 h-5 text-red-400 mt-1" />
                        <div>
                          <p className="font-semibold text-white">Training Schedule</p>
                          <p className="text-slate-300">Monday - Saturday</p>
                          <p className="text-slate-300">7:00 AM - 10:00 AM | 6:00 PM - 10:00 PM</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-gray-850 rounded-xl border border-gray-700/50 shadow-sm">
                        <Phone className="w-5 h-5 text-red-400 mt-1" />
                        <div>
                          <p className="font-semibold text-white">Contact</p>
                          <p className="text-slate-300">+91 79027 60682</p>
                          <p className="text-slate-300">+91 93834 88255</p>
                          <p className="text-slate-300">aabstraining434@gmail.com</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-red-900/50 to-red-800/50 rounded-xl border border-red-600/50 shadow-lg">
                      <p className="text-sm text-red-200">
                        <strong>What to bring:</strong> Comfortable athletic wear, hand wraps, shin guards (optional),
                        water bottle, and towel. Boxing gloves and pads will be provided for beginners.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Gym Photos Gallery */}
                <div className="mt-8">
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                    <Camera className="w-4 h-4 text-red-400" />
                    Our Training Programs
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="aspect-square rounded-xl overflow-hidden shadow-lg">
                      <img
                        src="/images/fighter-training.jpeg"
                        alt="Professional Fighter Training"
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                      />
                    </div>
                    <div className="aspect-square rounded-xl overflow-hidden shadow-lg">
                      <img
                        src="/images/boxing-hero.jpg"
                        alt="Boxing Training"
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                      />
                    </div>
                    <div className="aspect-square rounded-xl overflow-hidden shadow-lg">
                      <img
                        src="/placeholder.svg?height=150&width=150&text=Wrestling+Training+India"
                        alt="Wrestling Training"
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            {/* Card Content with Form */}
            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <span className="text-white text-lg">👤</span>
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="firstName" className="text-white font-medium">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                        className="bg-gray-850 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl h-12 shadow-sm backdrop-blur-sm font-medium"
                        placeholder="Enter your first name"
                      />
                      {formErrors.firstName && <p className="text-red-500 text-sm">{formErrors.firstName}</p>}
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="lastName" className="text-white font-medium">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                        className="bg-gray-850 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl h-12 shadow-sm backdrop-blur-sm font-medium"
                        placeholder="Enter your last name"
                      />
                      {formErrors.lastName && <p className="text-red-500 text-sm">{formErrors.lastName}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-white font-medium">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        className="bg-gray-850 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl h-12 shadow-sm backdrop-blur-sm font-medium"
                        placeholder="your.email@example.com"
                      />
                      {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="phone" className="text-white font-medium">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                        className="bg-gray-850 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl h-12 shadow-sm backdrop-blur-sm font-medium"
                        placeholder="+91 98765 43210"
                      />
                      {formErrors.phone && <p className="text-red-500 text-sm">{formErrors.phone}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="age" className="text-white font-medium">
                        Age *
                      </Label>
                      <Input
                        id="age"
                        type="number"
                        min="16"
                        max="65"
                        value={formData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                        required
                        className="bg-gray-850 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl h-12 shadow-sm backdrop-blur-sm font-medium"
                        placeholder="25"
                      />
                      {formErrors.age && <p className="text-red-500 text-sm">{formErrors.age}</p>}
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="experience" className="text-white font-medium">
                        Fighting Experience
                      </Label>
                      <Select
                        value={formData.experience} // Control the Select component with formData state
                        onValueChange={(value) => handleInputChange("experience", value)}
                      >
                        <SelectTrigger className="bg-gray-850 border-gray-700 text-white focus:border-purple-400 focus:ring-purple-400/20 rounded-xl h-12 shadow-sm backdrop-blur-sm font-medium">
                          <SelectValue placeholder="Select your experience level" className="text-gray-400" />
                        </SelectTrigger>
                        {/* IMPORTANT FIX: z-50 to ensure content appears above other elements */}
                        <SelectContent className="bg-gray-850 border-gray-700 text-white backdrop-blur-xl z-50">
                          <SelectItem
                            value="beginner"
                            className="text-white hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                          >
                            Beginner
                          </SelectItem>
                          <SelectItem
                            value="intermediate"
                            className="text-white hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                          >
                            Intermediate
                          </SelectItem>
                          <SelectItem
                            value="advanced"
                            className="text-white hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                          >
                            Advanced
                          </SelectItem>
                          <SelectItem
                            value="professional"
                            className="text-white hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                          >
                            Professional
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions Checkbox */}
                <div className="space-y-6">
                  <div className="flex items-start space-x-3 p-4 bg-gray-850/80 rounded-xl border border-gray-700/50">
                    <Checkbox
                      id="agreeTerms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => handleInputChange("agreeTerms", checked as boolean)}
                      required
                      className="mt-1 border-2 border-gray-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 data-[state=checked]:text-white w-5 h-5"
                    />
                    <Label htmlFor="agreeTerms" className="text-sm leading-relaxed text-gray-300 cursor-pointer">
                      I agree to the terms and conditions, waiver of liability, and understand that martial arts
                      training involves physical contact and risk of injury. I confirm that I am physically fit to
                      participate in this training program. *
                    </Label>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={!formData.agreeTerms || isSubmitting}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl h-14 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "⏳ Submitting..." : "🥊 Join AABS Training"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>

        {/* Enhanced Footer - Updated contact info */}
        <footer className="flex items-center justify-between p-8 text-white">
          <div className="flex items-center gap-2">{/* Empty div to maintain layout */}</div>
          <div className="flex items-center gap-6">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="group">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-red-500 transition-all duration-300">
                <Instagram className="w-5 h-5 text-white/80 group-hover:text-white" />
              </div>
            </a>
            <a href="https://wa.me/919383488255" target="_blank" rel="noopener noreferrer" className="group">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-green-600 transition-all duration-300">
                <svg className="w-5 h-5 text-slate-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
              </div>
            </a>
            <a href="mailto:aabstraining434@gmail.com" className="group">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300">
                <svg
                  className="w-5 h-5 text-slate-300 group-hover:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}
