import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LandingHero } from "@/components/landing-hero";
import { LandingFeatures } from "@/components/landing-features";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHero />
      <LandingFeatures />
    </div>
  );
}
