import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Brain, Send, User, LogOut, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

interface Message {
  sender: "user" | "agent";
  text: string;
  data?: {
    mongoQuery?: any;
    tableData?: any;
  };
}

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: input }),
      });

      const data = await response.json();

      if (data.status) {
        const agentMessage: Message = {
          sender: "agent",
          text: data.finalAnswer,
          data: {
            mongoQuery: data.mongoQuery,
            tableData: data.tableData,
          },
        };
        setMessages((prev) => [...prev, agentMessage]);
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to send message", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">IntelliQuery</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 container mx-auto px-6 py-8 flex flex-col max-w-5xl">
        <div className="flex-1 overflow-y-auto space-y-6 mb-6">
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <Brain className="h-16 w-16 text-primary mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-semibold mb-2">Ask me anything about your data</h2>
              <p className="text-muted-foreground">
                Try: "Show me users registered this month" or "What are the top products by sales?"
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.sender === "user"
                      ? "bg-gradient-primary text-primary-foreground"
                      : "bg-card border border-border"
                  }`}
                >
                  {msg.sender === "agent" ? (
                    <div className="space-y-4">
                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                      {msg.data?.tableData && <DataTable tableData={msg.data.tableData} />}
                    </div>
                  ) : (
                    <p>{msg.text}</p>
                  )}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-card border border-border rounded-2xl p-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <Card className="p-4 shadow-card border-border">
          <div className="flex gap-2">
            <Input
              placeholder="Ask a question about your data..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !loading && handleSend()}
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={loading} className="bg-gradient-primary">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

const DataTable = ({ tableData }: { tableData: any }) => {
  if (!tableData?.tableConfig?.columns || !tableData?.rows) return null;

  const { columns } = tableData.tableConfig;
  const { rows } = tableData;

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-secondary">
          <tr>
            {columns.map((col: any, idx: number) => (
              <th key={idx} className="px-4 py-3 text-left font-semibold">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 10).map((row: any, rowIdx: number) => (
            <tr key={rowIdx} className="border-t border-border hover:bg-secondary/50">
              {columns.map((col: any, colIdx: number) => (
                <td key={colIdx} className="px-4 py-3">
                  {renderCell(row[col.key], col.renderAs, col.sourceField)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const renderCell = (value: any, renderAs: string, sourceField?: string) => {
  if (value === null || value === undefined) return "-";

  switch (renderAs) {
    case "date":
      return new Date(value).toLocaleDateString();
    case "currency":
      return `$${Number(value).toFixed(2)}`;
    case "count":
      return Array.isArray(value) ? `${value.length} items` : value;
    case "list":
      return Array.isArray(value)
        ? value.map((item) => (sourceField ? item[sourceField] : item)).join(", ")
        : value;
    default:
      return String(value);
  }
};

export default Dashboard;
