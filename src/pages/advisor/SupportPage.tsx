import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Send, Plus } from "lucide-react";
import { toast } from "sonner";

const SupportPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            toast.success("Support ticket created! We'll respond shortly.");
        }, 1500);
    };

    return (
        <DashboardLayout>
            <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="font-display text-3xl font-bold mb-2">Help & Support</h1>
                    <p className="text-muted-foreground">Get help with your account or report issues.</p>
                </div>

                <Tabs defaultValue="create" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="create">Create Ticket</TabsTrigger>
                        <TabsTrigger value="history">My Tickets</TabsTrigger>
                    </TabsList>

                    <TabsContent value="create">
                        <Card>
                            <CardHeader>
                                <CardTitle>Submit a Request</CardTitle>
                                <CardDescription>Describe your issue in detail. Our support team typically responds within 24 hours.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label>Issue Category</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="payment">Payment & Earnings</SelectItem>
                                                <SelectItem value="technical">Technical Issue</SelectItem>
                                                <SelectItem value="account">Account & Profile</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Subject</Label>
                                        <Input placeholder="Brief summary of the issue" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea placeholder="Please provide detailed information..." className="min-h-[150px]" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Screenshots (Optional)</Label>
                                        <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">
                                            <Plus className="w-8 h-8 mb-2" />
                                            <span>Click to upload images</span>
                                        </div>
                                    </div>
                                    <Button type="submit" disabled={isSubmitting} className="w-full">
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                                        Submit Ticket
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="history">
                        <Card>
                            <CardHeader>
                                <CardTitle>Ticket History</CardTitle>
                                <CardDescription>Track the status of your support requests.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-12 text-muted-foreground">
                                    <p>No tickets found.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
};

export default SupportPage;
