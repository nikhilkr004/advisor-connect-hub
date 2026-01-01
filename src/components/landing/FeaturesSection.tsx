import { motion } from "framer-motion";
import { 
  Video, 
  MessageCircle, 
  Wallet, 
  Shield, 
  Calendar, 
  BarChart3,
  Headphones,
  Users
} from "lucide-react";

const features = [
  {
    icon: Video,
    title: "HD Video Consultations",
    description: "Crystal-clear video calls with screen sharing, recording, and real-time collaboration tools.",
  },
  {
    icon: MessageCircle,
    title: "Secure Messaging",
    description: "End-to-end encrypted chat with file sharing, voice messages, and quick responses.",
  },
  {
    icon: Wallet,
    title: "Smart Earnings",
    description: "Track your earnings, manage withdrawals, and view detailed financial analytics.",
  },
  {
    icon: Calendar,
    title: "Flexible Scheduling",
    description: "Set your availability, accept instant bookings, or schedule sessions in advance.",
  },
  {
    icon: Shield,
    title: "Verified Profiles",
    description: "Multi-step verification ensures all advisors are qualified professionals.",
  },
  {
    icon: BarChart3,
    title: "Performance Insights",
    description: "Detailed analytics on sessions, ratings, and earnings to grow your practice.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated support team ready to help with any technical or account issues.",
  },
  {
    icon: Users,
    title: "Growing Network",
    description: "Join thousands of advisors and students in our thriving community.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete platform designed for professional advisors and their clients.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 rounded-2xl bg-card border border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <feature.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
