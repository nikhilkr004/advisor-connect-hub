import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

const ChatsPage = () => {
    return (
        <DashboardLayout>
            <div className="p-4 lg:p-8 h-[calc(100vh-theme(spacing.20))] flex flex-col">
                <div className="mb-6">
                    <h1 className="font-display text-3xl font-bold mb-2">Messages</h1>
                    <p className="text-muted-foreground">Chat with your students.</p>
                </div>

                <div className="flex-1 grid md:grid-cols-[300px_1fr] gap-6 h-full min-h-0 border rounded-xl overflow-hidden bg-card shadow-sm">
                    {/* Chat List */}
                    <div className="border-r bg-muted/30 p-4">
                        <div className="space-y-4">
                            {/* Placeholder items */}
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-background cursor-pointer transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        S{i}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-medium truncate text-sm">Student {i}</h4>
                                            <span className="text-[10px] text-muted-foreground">12:30 PM</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate">Hi, I have a question about...</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="bg-background flex flex-col items-center justify-center text-muted-foreground p-8">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                            <MessageCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                        <p className="text-center max-w-xs">Values connections over transactional interactions. Start chatting to make a difference.</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ChatsPage;
