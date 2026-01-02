import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, User, Briefcase, IndianRupee, CreditCard } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { AdvisorProfile } from "@/types";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
    const [profile, setProfile] = useState<AdvisorProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

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
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setIsLoading(false);
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleSave = async () => {
        if (!profile || !auth.currentUser) return;
        setIsSaving(true);
        try {
            const docRef = doc(db, "advisors", auth.currentUser.uid);
            await updateDoc(docRef, { ...profile, updatedAt: Date.now() });
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex h-full items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    if (!profile) return null;

    return (
        <DashboardLayout>
            <div className="p-4 lg:p-8 max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="font-display text-2xl lg:text-3xl font-bold mb-2">My Profile</h1>
                        <p className="text-muted-foreground">Manage your detailed profile information</p>
                    </div>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Basic Info */}
                    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <User className="w-5 h-5" />
                            </div>
                            <h2 className="font-semibold text-lg">Basic Information</h2>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input
                                    value={profile.basicInfo.name}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            basicInfo: { ...profile.basicInfo, name: e.target.value },
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input value={profile.basicInfo.email} disabled className="bg-muted" />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <Input
                                    value={profile.basicInfo.phoneNumber}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            basicInfo: { ...profile.basicInfo, phoneNumber: e.target.value },
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>City</Label>
                                <Input
                                    value={profile.basicInfo.city}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            basicInfo: { ...profile.basicInfo, city: e.target.value },
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Professional Info */}
                    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-accent/10 rounded-lg text-accent">
                                <Briefcase className="w-5 h-5" />
                            </div>
                            <h2 className="font-semibold text-lg">Professional Details</h2>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                                <Label>Designation</Label>
                                <Input
                                    value={profile.professionalInfo.designation}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            professionalInfo: { ...profile.professionalInfo, designation: e.target.value },
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Experience (Years)</Label>
                                <Input
                                    type="number"
                                    value={profile.professionalInfo.experience}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            professionalInfo: { ...profile.professionalInfo, experience: parseInt(e.target.value) || 0 },
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Department</Label>
                                <Input
                                    value={profile.professionalInfo.department}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            professionalInfo: { ...profile.professionalInfo, department: e.target.value },
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Bio</Label>
                            <Textarea
                                rows={4}
                                value={profile.professionalInfo.bio}
                                onChange={(e) =>
                                    setProfile({
                                        ...profile,
                                        professionalInfo: { ...profile.professionalInfo, bio: e.target.value },
                                    })
                                }
                            />
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-success/10 rounded-lg text-success">
                                <IndianRupee className="w-5 h-5" />
                            </div>
                            <h2 className="font-semibold text-lg">Pricing Configuration (Fees)</h2>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Instant Chat Fee (₹)</Label>
                                <Input
                                    type="number"
                                    value={profile.pricingInfo.instantChatFee}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            pricingInfo: { ...profile.pricingInfo, instantChatFee: parseInt(e.target.value) || 0 },
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Instant Audio Fee (₹)</Label>
                                <Input
                                    type="number"
                                    value={profile.pricingInfo.instantAudioFee}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            pricingInfo: { ...profile.pricingInfo, instantAudioFee: parseInt(e.target.value) || 0 },
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Instant Video Fee (₹)</Label>
                                <Input
                                    type="number"
                                    value={profile.pricingInfo.instantVideoFee}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            pricingInfo: { ...profile.pricingInfo, instantVideoFee: parseInt(e.target.value) || 0 },
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Scheduled Video Fee (₹)</Label>
                                <Input
                                    type="number"
                                    value={profile.pricingInfo.scheduledVideoFee}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            pricingInfo: { ...profile.pricingInfo, scheduledVideoFee: parseInt(e.target.value) || 0 },
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bank Accounts (ReadOnly for MVP) */}
                    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-muted rounded-lg text-muted-foreground">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <h2 className="font-semibold text-lg">Bank Accounts</h2>
                        </div>
                        {profile.bankAccounts && profile.bankAccounts.length > 0 ? (
                            <ul className="space-y-2">
                                {profile.bankAccounts.map((account, idx) => (
                                    <li key={idx} className="p-3 bg-secondary/50 rounded-lg flex justify-between">
                                        <span>{account.bankName} - {account.accountNumber.slice(-4)}</span>
                                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">{account.isVerified ? "Verified" : "Pending"}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground text-sm">No bank accounts linked. Use the Mobile App to add accounts.</p>
                        )}
                    </div>

                </motion.div>
            </div>
        </DashboardLayout>
    );
};

export default ProfilePage;
