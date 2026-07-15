import FeaturesSection from "@/components/features/landing/FeaturesSection";
import HeroSection from "@/components/features/landing/HeroSection";

export default function HeroFeaturesWrapper() {
    return (
        <div className="w-full relative overflow-hidden bg-white">

            <div className="absolute top-0 right-0 w-[50%] h-[1000px] bg-[radial-gradient(circle_at_center,rgba(233,213,255,0.3)_0%,transparent_70%)] -z-10" />
            <div className="absolute top-[20%] left-0 w-[40%] h-[800px] bg-[radial-gradient(circle_at_center,rgba(245,243,255,0.4)_0%,transparent_70%)] -z-10" />

            <div className="relative z-10">
                <HeroSection />
                <FeaturesSection />
            </div>
        </div>
    );
}