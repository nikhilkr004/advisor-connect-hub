import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { AdvisorProfile } from "@/types";
import { Loader2, CreditCard, Wallet, ArrowUpRight, History } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const WalletPage = () => {
    const [profile, setProfile] = useState<AdvisorProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [withdrawAmount, setWithdrawAmount] = useState("");

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const docSnap = await getDoc(doc(db, "advisors", user.uid));
                if (docSnap.exists()) {
                    setProfile(docSnap.data() as AdvisorProfile);
                }
            }
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleWithdraw = () => {
        const amount = parseFloat(withdrawAmount);
        if (isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }
        if (!profile || amount > profile.earningsInfo.pendingBalance) {
            toast.error("Insufficient balance");
            return;
        }
        // In real app: create withdrawal request in 'withdrawal_requests'
        toast.success(`Withdrawal request for ₹${amount} submitted!`);
        setWithdrawAmount("");
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

    const earnings = profile?.earningsInfo || { pendingBalance: 0, pendingWithdrawals: 0, totalWithdrawn: 0 };

    return (
        <DashboardLayout>
            <div className="p-4 lg:p-8 space-y-8 max-w-5xl mx-auto">
                <div className="flex flex-col gap-2">
                    <h1 className="font-display text-3xl font-bold">Wallet & Payouts</h1>
                    <p className="text-muted-foreground">Manage your balance and withdrawals.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Balance Card */}
                    <Card className="bg-primary text-primary-foreground border-none shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-primary-foreground/90 font-medium">Total Balance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold mb-2">₹{earnings.pendingBalance.toLocaleString()}</div>
                            <div className="flex gap-4 text-sm text-primary-foreground/80">
                                <span>Pending: ₹{earnings.pendingWithdrawals}</span>
                                <span>•</span>
                                <span>Withdrawn: ₹{earnings.totalWithdrawn}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <div className="w-full space-y-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                                <Label className="text-white">Request Withdrawal</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        placeholder="Amount"
                                        className="bg-white/20 border-none text-white placeholder:text-white/50"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                    />
                                    <Button variant="secondary" onClick={handleWithdraw}>
                                        Withdraw <ArrowUpRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                                <p className="text-xs text-primary-foreground/70">Minimum withdrawal: ₹100</p>
                            </div>
                        </CardFooter>
                    </Card>

                    {/* Bank Accounts */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-primary" /> Linked Accounts
                            </CardTitle>
                            <CardDescription>Accounts available for payouts</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {profile?.bankAccounts && profile.bankAccounts.length > 0 ? (
                                <ul className="space-y-3">
                                    {profile.bankAccounts.map((account, idx) => (
                                        <li key={idx} className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {account.bankName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{account.bankName}</p>
                                                    <p className="text-xs text-muted-foreground">**** {account.accountNumber.slice(-4)}</p>
                                                </div>
                                            </div>
                                            {account.isVerified && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Verified</span>}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p>No bank accounts linked.</p>
                                    <Button variant="outline" className="mt-4" size="sm">Add Bank Account</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default WalletPage;
