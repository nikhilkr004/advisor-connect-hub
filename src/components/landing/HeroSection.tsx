import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Video, MessageCircle, Phone, Shield } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-8"
          >
            <Shield className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-foreground">Trusted by 10,000+ professionals</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            Connect with Expert
            <span className="block text-accent"> Advisors Instantly</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Get personalized guidance through video calls, voice chats, or messaging. 
            Our verified advisors are ready to help you succeed.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link to="/login">
              <Button variant="hero" size="xl">
                Start Consulting
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="hero-outline" size="xl">
                Become an Advisor
              </Button>
            </Link>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {[
              { icon: Video, label: "Video Calls" },
              { icon: Phone, label: "Voice Calls" },
              { icon: MessageCircle, label: "Live Chat" },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-card border border-border/50"
              >
                <feature.icon className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">{feature.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 relative"
        >
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="rounded-2xl overflow-hidden shadow-xl border border-border/50 bg-card">
              <div className="p-1 bg-gradient-to-r from-muted to-secondary">
                <div className="flex items-center gap-2 px-4 py-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive/50" />
                    <div className="w-3 h-3 rounded-full bg-warning/50" />
                    <div className="w-3 h-3 rounded-full bg-success/50" />
                  </div>
                  <div className="flex-1 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-background/50 text-xs text-muted-foreground">
                      <Shield className="w-3 h-3" />
                      app.associateconnect.com/dashboard
                    </div>
                  </div>
                </div>
              </div>
              <div className="aspect-[16/9] bg-gradient-to-br from-secondary via-card to-muted flex items-center justify-center">
                <div className="grid grid-cols-3 gap-6 p-8 w-full max-w-4xl">
                  {/* Stats Cards */}
                  {[
                    { label: "Total Sessions", value: "2,847", change: "+12%" },
                    { label: "Earnings", value: "₹1,24,500", change: "+8%" },
                    { label: "Rating", value: "4.9★", change: "+0.2" },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="bg-card rounded-xl p-6 shadow-card border border-border/50"
                    >
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                        <span className="text-xs text-success font-medium">{stat.change}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
