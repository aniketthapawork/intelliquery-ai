import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { Brain, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Onboarding = () => {
  const [schemaJson, setSchemaJson] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleUpload = async () => {
    setLoading(true);
    try {
      const schema = JSON.parse(schemaJson);
      const token = localStorage.getItem("token");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/onboarding/schema`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(schema),
      });

      const data = await response.json();

      if (data.status) {
        toast({ title: "Success!", description: "Schema uploaded successfully" });
        navigate("/dashboard");
      } else {
        toast({ title: "Upload failed", description: data.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Invalid JSON", description: "Please check your schema format", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const exampleSchema = {
    databaseName: "ecommerce",
    collections: [
      {
        name: "users",
        description: "User accounts",
        fields: [
          { name: "_id", type: "ObjectId", description: "User ID" },
          { name: "email", type: "string", description: "User email address" },
          { name: "name", type: "string", description: "Full name" },
          { name: "createdAt", type: "date", description: "Registration date" },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-6">
      <div className="w-full max-w-3xl space-y-6 animate-slide-up">
        <div className="text-center space-y-2">
          <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Upload Your Database Schema</h1>
          <p className="text-muted-foreground">
            Help us understand your data structure so we can provide intelligent query suggestions
          </p>
        </div>

        <Card className="shadow-card border-border">
          <CardHeader>
            <CardTitle>Schema Configuration</CardTitle>
            <CardDescription>Paste your database schema in JSON format</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={JSON.stringify(exampleSchema, null, 2)}
              value={schemaJson}
              onChange={(e) => setSchemaJson(e.target.value)}
              className="font-mono text-sm h-96"
            />
            <div className="flex gap-4">
              <Button onClick={handleUpload} disabled={loading} className="flex-1 bg-gradient-primary">
                <Upload className="mr-2 h-4 w-4" />
                {loading ? "Uploading..." : "Upload Schema"}
              </Button>
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Skip for now
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="text-lg">Schema Format Example</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs overflow-x-auto bg-secondary p-4 rounded-lg">
              {JSON.stringify(exampleSchema, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
