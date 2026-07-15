import CTASection from '@/components/features/landing/CTASection';
import FaqSection from '@/components/features/landing/FaqSection';
import HowItWorks from '@/components/features/landing/HowItWorksSection';
import PricingSection from '@/components/features/landing/PricingSection';
import Image from 'next/image';

export default function CombinedSections() {
    return (
        <div className="w-full bg-[#F7F0FA99] relative overflow-hidden">

            <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
                <Image
                    src="/bg-gradients.png"
                    alt="background gradient"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            <div className="relative z-10">
                <HowItWorks />
                <PricingSection />
                <FaqSection />
                <CTASection />
            </div>
        </div>
    );
}