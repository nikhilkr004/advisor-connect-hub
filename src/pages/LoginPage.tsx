import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { auth, db } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Check if advisor exists
        const advisorDoc = await getDoc(doc(db, "advisors", user.uid));
        if (advisorDoc.exists()) {
          navigate("/dashboard");
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      // Force account selection every time
      provider.setCustomParameters({
        prompt: "select_account"
      });

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if advisor exists in Firestore
      const advisorDoc = await getDoc(doc(db, "advisors", user.uid));

      if (advisorDoc.exists()) {
        toast.success(`Welcome back, ${user.displayName || "Advisor"}!`);
        navigate("/dashboard");
      } else {
        // Advisor doesn't exist - go to onboarding
        toast.info("Please complete your profile to continue");
        navigate("/onboarding");
      }
    } catch (error: any) {
      console.error("Google sign in error:", error);

      if (error.code === "auth/popup-closed-by-user") {
        setError("Sign-in was cancelled. Please try again.");
      } else if (error.code === "auth/popup-blocked") {
        setError("Pop-up was blocked. Please allow pop-ups for this site.");
      } else if (error.code === "auth/cancelled-popup-request") {
        // Ignore this error - it happens when user clicks multiple times
      } else if (error.code === "auth/unauthorized-domain") {
        setError("This domain is not authorized in Firebase. Check console settings.");
      } else {
        setError("Failed to sign in. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-accent/80 p-12 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-accent/30 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-primary-foreground/10 blur-3xl" />
        </div>

        {/* Illustration */}
        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            {/* Icon composition */}
            <div className="relative w-64 h-64 mx-auto mb-8">
              {/* Main laptop icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-36 bg-primary-foreground/10 rounded-lg border-2 border-primary-foreground/20 flex items-center justify-center">
                  <div className="w-40 h-28 bg-gradient-to-br from-accent/40 to-primary-foreground/20 rounded flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-warning animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-destructive/30 border-4 border-destructive/40 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>

              <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-foreground/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>

              <div className="absolute bottom-4 -right-8 w-20 h-20 rounded-full bg-accent/30 flex items-center justify-center animate-float">
                <svg className="w-10 h-10 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">
              Connect with Experts
            </h2>
            <p className="text-primary-foreground/80 text-lg">
              Join thousands of professionals sharing knowledge through video consultations
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-card">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-8">
              <h1 className="font-display text-2xl font-bold mb-1">Welcome to</h1>
              <h2 className="font-display text-3xl font-bold text-accent">AssociateConnect</h2>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </motion.div>
            )}

            {/* Google Sign In Button */}
            <Button
              variant="outline"
              size="lg"
              className="w-full h-14 text-base font-medium border-2 hover:bg-secondary/50"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  {/* Google Icon */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Login with Google
                </>
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-6">
              By continuing, you agree to our{" "}
              <Link to="/" className="text-accent hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/" className="text-accent hover:underline">
                Privacy Policy
              </Link>
            </p>

            {/* New Advisor Link */}
            <div className="mt-8 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground mb-3">
                New to AssociateConnect?
              </p>
              <Link to="/onboarding">
                <Button variant="ghost" className="text-accent hover:text-accent">
                  Register as an Advisor →
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
