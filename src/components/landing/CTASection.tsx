import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 gradient-primary opacity-95" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-8">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
            <span className="text-sm font-medium text-primary-foreground">Limited Time Offer</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-10 max-w-xl mx-auto">
            Join thousands of professional advisors already earning on AssociateConnect. 
            Get started today with zero platform fees for your first month.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button 
                variant="secondary" 
                size="xl" 
                className="w-full sm:w-auto"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button 
                variant="outline" 
                size="xl" 
                className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                Schedule a Demo
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
