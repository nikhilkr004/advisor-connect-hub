import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  TrendingUp,
  Users,
  Clock,
  Star,
  Video,
  Phone,
  MessageCircle,
  ArrowUpRight,
  Calendar,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { AdvisorProfile, BookingRequest } from "@/types";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const [profile, setProfile] = useState<AdvisorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (profile?.uid) {
      const fetchBookings = async () => {
        try {
          // Querying 'bookings' collection (covers both instant and scheduled if unified, or we pick one)
          // As per spec, docs are in 'instant_bookings' or 'scheduled_bookings'. 
          // For this 'Master App', we'll assume a unified 'bookings' view or just query 'instant_bookings' for now as a demo.
          // Ideally we query both and merge, or use a root 'bookings' collection. 
          // Let's use 'bookings' as the primary collection for now.
          const q = query(
            collection(db, "bookings"),
            where("advisorId", "==", profile.uid),
            // orderBy("bookingTimestamp", "desc"), // Requires index, skipping for now to avoid error
            limit(5)
          );
          const querySnapshot = await getDocs(q);
          const fetchedBookings: BookingRequest[] = [];
          querySnapshot.forEach((doc) => {
            fetchedBookings.push(doc.data() as BookingRequest);
          });
          setBookings(fetchedBookings);
        } catch (error) {
          console.error("Error fetching bookings:", error);
        }
      };
      fetchBookings();
    }
  }, [profile]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const docRef = doc(db, "advisors", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data() as AdvisorProfile);
        }
        // No redirect to onboarding if missing
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = [
    {
      label: "Total Sessions",
      value: (profile?.totalSessions || 0).toString(),
      change: "+0%",
      icon: Video,
      color: "bg-info/10 text-info"
    },
    {
      label: "Total Earnings",
      value: `₹${profile?.earningsInfo?.totalLifetimeEarnings || 0}`,
      change: "+0%",
      icon: TrendingUp,
      color: "bg-accent/10 text-accent"
    },
    {
      label: "Experience",
      value: `${profile?.professionalInfo.experience || 0} Yrs`,
      change: "Level Up",
      icon: Clock,
      color: "bg-warning/10 text-warning"
    },
    {
      label: "Rating",
      value: profile?.rating ? profile.rating.toFixed(1) : "New",
      change: profile?.reviewCount ? `${profile.reviewCount} Reviews` : "No reviews",
      icon: Star,
      color: "bg-success/10 text-success"
    },
  ];

  // Bookings fetched via effect
  const notifications = [
    { id: 1, message: "Welcome to AssociateConnect!", time: "Just now" },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-2xl lg:text-3xl font-bold mb-2"
          >
            Welcome back, {profile?.basicInfo.name || "Advisor"}! 👋
          </motion.h1>
          <p className="text-muted-foreground">
            Here's what's happening with your consultations today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl border border-border p-6 shadow-card hover:shadow-card-hover transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-card"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="font-display font-semibold text-lg">Recent Bookings</h2>
              <Button variant="ghost" size="sm">
                View All
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-4">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <div
                    key={booking.bookingId}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-colors border border-transparent hover:border-border/50"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {booking.studentName?.[0] || <Users className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{booking.studentName || "Unknown Student"}</h4>
                      <p className="text-xs text-muted-foreground truncate">{booking.purpose || "No purpose specified"}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${booking.bookingStatus === 'completed' ? 'bg-success/10 text-success' :
                          booking.bookingStatus === 'pending' ? 'bg-warning/10 text-warning' :
                            'bg-secondary text-secondary-foreground'
                        }`}>
                        {booking.bookingStatus}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No recent bookings found.
                </div>
              )}
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card rounded-2xl border border-border shadow-card"
          >
            <div className="p-6 border-b border-border">
              <h2 className="font-display font-semibold text-lg">Notifications</h2>
            </div>
            <div className="p-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 rounded-xl hover:bg-secondary/50 transition-colors"
                >
                  <p className="text-sm mb-1">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-xl font-semibold mb-1">
                Ready to start your day?
              </h3>
              <p className="text-primary-foreground/80">
                Update your availability to start receiving calls.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" size="lg">
                <Calendar className="w-4 h-4" />
                Availability
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
