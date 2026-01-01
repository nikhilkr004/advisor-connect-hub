import { motion } from "framer-motion";
import { UserPlus, FileCheck, Video, Wallet } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Your Profile",
    description: "Sign up with your phone number and complete the verification process.",
  },
  {
    icon: FileCheck,
    step: "02",
    title: "Complete Onboarding",
    description: "Add your qualifications, experience, availability, and set your rates.",
  },
  {
    icon: Video,
    step: "03",
    title: "Start Consulting",
    description: "Accept bookings and connect with students via video, audio, or chat.",
  },
  {
    icon: Wallet,
    step: "04",
    title: "Earn & Withdraw",
    description: "Track your earnings and withdraw to your bank account anytime.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Get Started in Minutes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join our platform and start earning from your expertise in just a few simple steps.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="text-center">
                  {/* Step Number */}
                  <div className="relative inline-flex mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-card border border-border shadow-card flex items-center justify-center relative z-10">
                      <step.icon className="w-8 h-8 text-accent" />
                    </div>
                    <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-lg">
                      {step.step}
                    </span>
                  </div>

                  <h3 className="font-display font-semibold text-xl mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
