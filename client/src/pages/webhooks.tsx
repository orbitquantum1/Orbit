import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useSEO } from "@/hooks/use-seo";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Webhook } from "@shared/schema";
import {
  Webhook as WebhookIcon,
  Plus,
  Trash2,
  Send,
  Loader2,
  Bell,
  Shield,
  Zap,
  CheckCircle2,
  AlertCircle,
  Globe,
} from "lucide-react";

const WEBHOOK_EVENTS = [
  { id: "payment_received", label: "Payment Received", desc: "Triggered when a payment is received" },
  { id: "identity_verified", label: "Identity Verified", desc: "Triggered when an identity document is verified" },
  { id: "transaction_confirmed", label: "Transaction Confirmed", desc: "Triggered when a transaction is confirmed on-chain" },
  { id: "agent_registered", label: "Agent Registered", desc: "Triggered when a new agent registers on the protocol" },
];

const DEFAULT_ADDRESS = "0x7a3B1c9E4d2F8a6b0C1d3E5f7A9b2C4D6e8F0a1";

export default function Webhooks() {
  useSEO({ title: "Webhooks", description: "Configure webhook URLs for real-time ORBIT Protocol notifications. Receive instant updates on payments, identity verification, transactions, and agent registration." });

  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; payload: any } | null>(null);

  const { data: webhooks = [], isLoading } = useQuery<Webhook[]>({
    queryKey: ["/api/webhooks", DEFAULT_ADDRESS],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { walletAddress: string; url: string; events: string[]; active: boolean }) => {
      const res = await apiRequest("POST", "/api/webhooks", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/webhooks", DEFAULT_ADDRESS] });
      setUrl("");
      setSelectedEvents([]);
      toast({ title: "Webhook created", description: "Your webhook endpoint has been registered." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/webhooks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/webhooks", DEFAULT_ADDRESS] });
      toast({ title: "Webhook deleted", description: "The webhook endpoint has been removed." });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const res = await apiRequest("PATCH", `/api/webhooks/${id}`, { active });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/webhooks", DEFAULT_ADDRESS] });
    },
  });

  const testMutation = useMutation({
    mutationFn: async (id: string) => {
      setTestingId(id);
      const res = await apiRequest("POST", `/api/webhooks/${id}/test`);
      return res.json();
    },
    onSuccess: (data, id) => {
      setTestingId(null);
      setTestResult({ id, payload: data.payload });
      toast({ title: "Test sent", description: "Sample webhook payload generated successfully." });
    },
    onError: () => {
      setTestingId(null);
    },
  });

  const handleCreate = () => {
    if (!url.trim()) {
      toast({ title: "URL required", description: "Please enter a webhook URL.", variant: "destructive" });
      return;
    }
    if (selectedEvents.length === 0) {
      toast({ title: "Events required", description: "Please select at least one event.", variant: "destructive" });
      return;
    }
    createMutation.mutate({
      walletAddress: DEFAULT_ADDRESS,
      url: url.trim(),
      events: selectedEvents,
      active: true,
    });
  };

  const toggleEvent = (eventId: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId) ? prev.filter((e) => e !== eventId) : [...prev, eventId]
    );
  };

  return (
    <div className="min-h-screen pt-20 lg:pt-32 pb-16 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="font-mono text-xs tracking-widest text-orange-500/80 uppercase mb-3 block" data-testid="label-webhooks">
            Real-Time Notifications
          </span>
          <h1 className="font-display font-bold text-3xl lg:text-5xl tracking-tight mb-4" data-testid="heading-webhooks">
            Webhook{" "}
            <span className="dark:text-gradient text-gradient-light">Manager</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base lg:text-lg leading-relaxed" data-testid="desc-webhooks">
            Configure webhook endpoints to receive real-time notifications for ORBIT Protocol events. Get instant updates on payments, identity verification, transactions, and more.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 lg:p-8 bg-card/50 dark:bg-white/[0.02] border-border/50" data-testid="card-create-webhook">
                <h2 className="font-display font-semibold text-lg tracking-tight mb-6" data-testid="heading-create-webhook">
                  Add Webhook Endpoint
                </h2>

                <div className="space-y-5">
                  <div>
                    <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
                      Endpoint URL
                    </label>
                    <Input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://your-server.com/webhook"
                      data-testid="input-webhook-url"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-3 block">
                      Events
                    </label>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {WEBHOOK_EVENTS.map((event) => {
                        const isSelected = selectedEvents.includes(event.id);
                        return (
                          <button
                            key={event.id}
                            onClick={() => toggleEvent(event.id)}
                            className={`flex items-start gap-3 p-3 rounded-md border text-left transition-colors ${
                              isSelected
                                ? "border-orange-500/40 bg-orange-500/5"
                                : "border-border/30 bg-black/10 dark:bg-white/[0.02]"
                            }`}
                            data-testid={`toggle-event-${event.id}`}
                          >
                            <div className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                              isSelected ? "border-orange-500 bg-orange-500" : "border-border/50"
                            }`}>
                              {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                            </div>
                            <div>
                              <div className="text-sm font-medium">{event.label}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">{event.desc}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Button
                    onClick={handleCreate}
                    disabled={createMutation.isPending}
                    className="w-full font-display font-semibold"
                    data-testid="button-create-webhook"
                  >
                    {createMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    Add Webhook
                  </Button>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
                <h2 className="font-display font-semibold text-lg tracking-tight" data-testid="heading-webhooks-list">
                  Registered Webhooks
                </h2>
                <Badge variant="outline" className="font-mono text-[10px]" data-testid="badge-webhook-count">
                  {webhooks.length} endpoint{webhooks.length !== 1 ? "s" : ""}
                </Badge>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                </div>
              ) : webhooks.length === 0 ? (
                <Card className="p-8 bg-card/50 dark:bg-white/[0.02] border-border/50 text-center" data-testid="card-no-webhooks">
                  <WebhookIcon className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No webhooks configured yet.</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Add an endpoint above to start receiving notifications.</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {webhooks.map((webhook) => (
                    <Card
                      key={webhook.id}
                      className="p-4 bg-card/50 dark:bg-white/[0.02] border-border/50"
                      data-testid={`card-webhook-${webhook.id}`}
                    >
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Globe className="w-4 h-4 text-orange-500 shrink-0" />
                            <span className="text-sm font-mono font-medium truncate" data-testid={`text-webhook-url-${webhook.id}`}>
                              {webhook.url}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap mt-2">
                            {(webhook.events || []).map((event) => (
                              <Badge key={event} variant="secondary" className="font-mono text-[10px]" data-testid={`badge-event-${webhook.id}-${event}`}>
                                {event}
                              </Badge>
                            ))}
                          </div>
                          <div className="text-xs text-muted-foreground/60 mt-2 font-mono">
                            {webhook.createdAt ? new Date(webhook.createdAt).toLocaleDateString() : ""}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{webhook.active ? "Active" : "Inactive"}</span>
                            <Switch
                              checked={webhook.active}
                              onCheckedChange={(checked) => toggleMutation.mutate({ id: webhook.id, active: checked })}
                              data-testid={`switch-webhook-${webhook.id}`}
                            />
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => testMutation.mutate(webhook.id)}
                            disabled={testingId === webhook.id}
                            data-testid={`button-test-webhook-${webhook.id}`}
                          >
                            {testingId === webhook.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteMutation.mutate(webhook.id)}
                            data-testid={`button-delete-webhook-${webhook.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {testResult && testResult.id === webhook.id && (
                        <div className="mt-4 p-3 rounded-md bg-black/20 border border-border/30">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                            <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Test Payload</span>
                          </div>
                          <pre className="text-xs font-mono text-muted-foreground overflow-x-auto" data-testid={`text-test-result-${webhook.id}`}>
                            {JSON.stringify(testResult.payload, null, 2)}
                          </pre>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="p-5 bg-card/50 dark:bg-white/[0.02] border-border/50" data-testid="card-webhook-info">
                <h3 className="font-mono text-xs tracking-widest text-orange-500/80 uppercase mb-4">How It Works</h3>
                <div className="space-y-4">
                  {[
                    { icon: Globe, title: "Register URL", desc: "Add your endpoint URL that will receive POST requests with event data." },
                    { icon: Bell, title: "Select Events", desc: "Choose which protocol events you want to be notified about." },
                    { icon: Zap, title: "Receive Updates", desc: "Get real-time JSON payloads when selected events occur on-chain." },
                    { icon: Shield, title: "Verify Signatures", desc: "Each payload includes a cryptographic signature for authenticity verification." },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center shrink-0">
                        <item.icon className="w-4 h-4 text-orange-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{item.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-5 bg-card/50 dark:bg-white/[0.02] border-border/50" data-testid="card-available-events">
                <h3 className="font-mono text-xs tracking-widest text-orange-500/80 uppercase mb-4">Available Events</h3>
                <div className="space-y-2">
                  {WEBHOOK_EVENTS.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-2.5 rounded-md bg-black/20 border border-border/20"
                      data-testid={`row-event-${event.id}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Bell className="w-3.5 h-3.5 text-orange-500" />
                        <span className="text-sm font-medium">{event.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-xs text-muted-foreground">Active</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Card className="p-5 bg-card/50 dark:bg-white/[0.02] border-border/50" data-testid="card-sample-payload">
                <h3 className="font-mono text-xs tracking-widest text-orange-500/80 uppercase mb-4">Sample Payload</h3>
                <pre className="text-xs font-mono text-muted-foreground overflow-x-auto leading-relaxed" data-testid="text-sample-payload">
{JSON.stringify({
  event: "payment_received",
  timestamp: "2025-01-15T12:00:00Z",
  data: {
    txHash: "0x8f3a...b2c1",
    from: "0x7a3B...0a1",
    to: "0x2b4D...8e0",
    amount: "100.00",
    currency: "ORB",
    network: "base",
  },
  signature: "0xabc...def",
}, null, 2)}
                </pre>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-5 bg-orange-500/5 border-orange-500/10" data-testid="card-webhook-security">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-display font-semibold text-sm mb-1">Security Note</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Always verify webhook signatures before processing payloads. Use HTTPS endpoints only. Rotate webhook secrets periodically for enhanced security.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
