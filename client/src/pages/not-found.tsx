import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="text-center px-6">
        <div className="font-display font-bold text-8xl lg:text-9xl dark:text-gradient text-gradient-light mb-4" data-testid="text-404">
          404
        </div>
        <h1 className="font-display font-bold text-2xl lg:text-3xl tracking-tight mb-3" data-testid="text-404-title">
          Lost in Space
        </h1>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto" data-testid="text-404-desc">
          This sector of the network hasn't been mapped yet. Return to mission control.
        </p>
        <Link href="/">
          <Button data-testid="button-go-home">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
