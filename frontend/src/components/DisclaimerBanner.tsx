import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const DisclaimerBanner = () => {
  return (
    <div className="border-b border-border bg-warning-background">
      <div className="container mx-auto px-4 py-2">
        <Alert variant="destructive" className="border-warning bg-warning-background">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertDescription className="text-warning-foreground font-medium">
            <strong>Important:</strong> AI can make mistakes. This information is based on MOHRE UAE labor law data and is for informational purposes only. 
            Consult official MOHRE resources or a qualified lawyer for personalized advice.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default DisclaimerBanner;