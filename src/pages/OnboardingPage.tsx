import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  ArrowRight,
  User,
  Briefcase,
  GraduationCap,
  Calendar,
  IndianRupee,
  Check,
  Upload,
  Camera,
  Loader2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { auth, db, storage } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { AdvisorProfile } from "@/types";

const steps = [
  { id: 1, title: "Personal Details", icon: User },
  { id: 2, title: "Professional", icon: Briefcase },
  { id: 3, title: "Qualification", icon: GraduationCap },
  { id: 4, title: "Availability", icon: Calendar },
  { id: 5, title: "Pricing", icon: IndianRupee },
];

const departments = [
  "Technology",
  "Finance",
  "Healthcare",
  "Legal",
  "Education",
  "Marketing",
  "Human Resources",
  "Other",
];

const specializations = [
  "Web Development",
  "Mobile Apps",
  "Data Science",
  "Machine Learning",
  "Cloud Computing",
  "Cybersecurity",
  "DevOps",
  "UI/UX Design",
];

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    // Personal
    name: "",
    email: "",
    gender: "",
    city: "",
    phoneNumber: "", // Added
    // Professional
    designation: "",
    department: "",
    specializations: [] as string[],
    experience: "",
    bio: "",
    // Qualification
    degree: "",
    university: "",
    certificateUrl: "",
    // Availability
    instantChat: true,
    instantAudio: false,
    instantVideo: false,
    workingDays: [] as string[],
    workingHours: { start: "09:00", end: "17:00" },
    // Pricing
    ratePerMinute: "",
    ratePerSession: "",
  });

  const navigate = useNavigate();

  // Pre-fill data from Auth
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.displayName || "",
        email: user.email || "",
      }));
    }
  }, []);

  const updateFormData = (field: string, value: string | number | boolean | string[] | object) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSpecialization = (spec: string) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter((s) => s !== spec)
        : [...prev.specializations, spec],
    }));
  };

  const toggleWorkingDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCertificateFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be logged in to submit application");
      return;
    }

    setIsLoading(true);

    try {
      let certUrl = "";

      // Upload Certificate if exists
      if (certificateFile) {
        const storageRef = ref(storage, `certificates/${user.uid}/${certificateFile.name}`);
        const snapshot = await uploadBytes(storageRef, certificateFile);
        certUrl = await getDownloadURL(snapshot.ref);
      }

      // Construct Profile Object
      const profile: AdvisorProfile = {
        uid: user.uid,
        basicInfo: {
          id: user.uid,
          name: formData.name || user.displayName || "",
          email: formData.email || user.email || "",
          phoneNumber: user.phoneNumber || formData.phoneNumber || "",
          gender: formData.gender,
          city: formData.city,
          profileImage: user.photoURL || "",
          status: "BUSY"
        },
        professionalInfo: {
          designation: formData.designation,
          department: formData.department,
          specializations: formData.specializations,
          experience: parseInt(formData.experience) || 0,
          bio: formData.bio,
          yearsInOrganization: 0,
          employeeId: "",
          officeLocation: "",
          certifications: [],
          languages: ["English"], // Default
          specializationUrls: {}
        },
        educationInfo: {
          highestQualification: formData.degree, // Mapping degree to highestQualification
          qualificationField: formData.degree, // reuse or leave blank
          university: formData.university,
          highestQualificationUrl: certUrl,
        },
        availabilityInfo: {
          workingDays: formData.workingDays,
          workingHoursStart: formData.workingHours.start,
          workingHoursEnd: formData.workingHours.end,
          appointmentDuration: 30,
          scheduledAvailability: {
            isChatEnabled: true,
            isAudioCallEnabled: true,
            isVideoCallEnabled: true,
            isInPersonEnabled: false,
            isOfficeVisitEnabled: false
          },
          instantAvailability: {
            isChatEnabled: formData.instantChat,
            isAudioCallEnabled: formData.instantAudio,
            isVideoCallEnabled: formData.instantVideo
          }
        },
        pricingInfo: {
          instantChatFee: parseInt(formData.ratePerMinute) || 0,
          instantAudioFee: parseInt(formData.ratePerMinute) || 0,
          instantVideoFee: parseInt(formData.ratePerMinute) || 0,
          scheduledChatFee: parseInt(formData.ratePerSession) || 0,
          scheduledAudioFee: parseInt(formData.ratePerSession) || 0,
          scheduledVideoFee: parseInt(formData.ratePerSession) || 0,
          scheduledInPersonFee: 0
        },
        earningsInfo: {
          totalLifetimeEarnings: 0,
          todayEarnings: 0,
          thisWeekEarnings: 0,
          thisMonthEarnings: 0,
          pendingBalance: 0,
          pendingWithdrawals: 0,
          totalWithdrawn: 0
        },
        bankAccounts: [],
        totalSessions: 0,
        rating: 0,
        reviewCount: 0,
        fcmToken: "",
        status: "BUSY",
        isVerified: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      // Save to Firestore
      await setDoc(doc(db, "advisors", user.uid), profile);

      toast.success("Application submitted successfully!");
      navigate("/dashboard");
    } catch (error: unknown) {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit application: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Same as before but with minor fixes if needed */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center border-2 border-dashed border-border">
                  <Camera className="w-8 h-8 text-muted-foreground" />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-lg">
                  <Upload className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  disabled // Email from auth shouldn't change easily or pre-fill
                  onChange={(e) => updateFormData("email", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={(e) => updateFormData("phoneNumber", e.target.value)}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(v) => updateFormData("gender", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Enter your city"
                  value={formData.city}
                  onChange={(e) => updateFormData("city", e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  placeholder="e.g. Senior Consultant"
                  value={formData.designation}
                  onChange={(e) => updateFormData("designation", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={formData.department} onValueChange={(v) => updateFormData("department", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept.toLowerCase()}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Specializations</Label>
              <div className="flex flex-wrap gap-2">
                {specializations.map((spec) => (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => toggleSpecialization(spec)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${formData.specializations.includes(spec)
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                placeholder="e.g. 5"
                value={formData.experience}
                onChange={(e) => updateFormData("experience", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself and your expertise..."
                rows={4}
                value={formData.bio}
                onChange={(e) => updateFormData("bio", e.target.value)}
              />
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="degree">Degree / Certification</Label>
              <Input
                id="degree"
                placeholder="e.g. Master's in Computer Science"
                value={formData.degree}
                onChange={(e) => updateFormData("degree", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="university">University / Institution</Label>
              <Input
                id="university"
                placeholder="e.g. Stanford University"
                value={formData.university}
                onChange={(e) => updateFormData("university", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Upload Certificate</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-accent/50 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept=".pdf, .jpg, .png"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
                <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  {certificateFile ? certificateFile.name : (
                    <>
                      Drag and drop your certificate here, or{" "}
                      <span className="text-accent font-medium">browse</span>
                    </>
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Supports: PDF, JPG, PNG (Max 10MB)
                </p>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <Label>Instant Availability</Label>
              <div className="space-y-3">
                {[
                  { key: "instantChat", label: "Chat" },
                  { key: "instantAudio", label: "Audio Call" },
                  { key: "instantVideo", label: "Video Call" },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border"
                  >
                    <span className="font-medium">{item.label}</span>
                    <Switch
                      checked={formData[item.key as keyof typeof formData] as boolean}
                      onCheckedChange={(checked) => updateFormData(item.key, checked)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Working Days</Label>
              <div className="flex flex-wrap gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleWorkingDay(day)}
                    className={`w-12 h-12 rounded-xl text-sm font-medium transition-colors ${formData.workingDays.includes(day)
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={formData.workingHours.start}
                  onChange={(e) =>
                    updateFormData("workingHours", {
                      ...formData.workingHours,
                      start: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={formData.workingHours.end}
                  onChange={(e) =>
                    updateFormData("workingHours", {
                      ...formData.workingHours,
                      end: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-xl bg-accent/10 border border-accent/20">
              <h3 className="font-semibold mb-2">Set Your Rates</h3>
              <p className="text-sm text-muted-foreground">
                Define how much you want to charge for your consultation services.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ratePerMinute">Rate per Minute</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="ratePerMinute"
                  type="number"
                  placeholder="e.g. 10"
                  value={formData.ratePerMinute}
                  onChange={(e) => updateFormData("ratePerMinute", e.target.value)}
                  className="pl-11"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Charged for audio and video calls
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ratePerSession">Rate per Session (30 min)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="ratePerSession"
                  type="number"
                  placeholder="e.g. 500"
                  value={formData.ratePerSession}
                  onChange={(e) => updateFormData("ratePerSession", e.target.value)}
                  className="pl-11"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                For scheduled bookings
              </p>
            </div>

            <div className="p-4 rounded-xl bg-secondary border border-border">
              <h4 className="font-medium mb-3">Estimated Earnings</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">5 sessions/day × 30 days</span>
                  <span className="font-semibold">
                    ₹{formData.ratePerSession ? parseInt(formData.ratePerSession) * 5 * 30 : 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform fee (5%)</span>
                  <span className="text-muted-foreground">
                    -₹{formData.ratePerSession ? (parseInt(formData.ratePerSession) * 5 * 30 * 0.05).toFixed(0) : 0}
                  </span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between">
                  <span className="font-medium">Your earnings</span>
                  <span className="font-bold text-accent">
                    ₹{formData.ratePerSession ? (parseInt(formData.ratePerSession) * 5 * 30 * 0.95).toFixed(0) : 0}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">A</span>
              </div>
              <span className="font-display font-bold text-xl">AssociateConnect</span>
            </Link>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Exit
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${currentStep > step.id
                      ? "bg-accent text-accent-foreground"
                      : currentStep === step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                      }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`hidden sm:block w-16 lg:w-24 h-1 mx-2 rounded-full transition-colors ${currentStep > step.id ? "bg-accent" : "bg-secondary"
                        }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              {steps.map((step) => (
                <span
                  key={step.id}
                  className={currentStep === step.id ? "text-foreground font-medium" : ""}
                >
                  {step.title}
                </span>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-card rounded-2xl border border-border shadow-card p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold">
                {steps[currentStep - 1].title}
              </h2>
              <p className="text-muted-foreground">
                Step {currentStep} of {steps.length}
              </p>
            </div>

            <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1 || isLoading}
                className={currentStep === 1 ? "invisible" : ""}
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>

              {currentStep === 5 ? (
                <Button variant="accent" onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={nextStep} disabled={isLoading}>
                  Next Step
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
