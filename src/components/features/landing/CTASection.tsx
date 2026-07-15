import { Card, CardContent } from '@/components/ui/layout/card';
import { ButtonLink } from '@/components/features/landing/ButtonLink';
import { ScrollRevealItem } from '@/components/ui/animations/ScrollReveal';
import { KioLogoText } from '@/components/shared/KIOLogoText';

export default function CTASection() {
    return (
        <section className="flex w-full justify-center items-center bg-transparent px-4 py-24 sm:px-6">
            <Card className="group relative w-full max-w-[1000px] min-h-[446px] bg-white/40 backdrop-blur-xl border border-white/60 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden flex items-center justify-center p-8 md:p-16 transition-colors duration-300 hover:border-amber-300/50">
                <div className="absolute right-[-5%] bottom-[-5%] w-[400px] h-[400px] bg-[#ECD8F3] blur-[100px] opacity-30 rounded-full -z-10" />
                <div className="absolute top-[-10%] left-[-5%] w-[300px] h-[300px] bg-[#D0D0FF] blur-[80px] opacity-20 rounded-full -z-10" />

                <CardContent className="z-10 flex max-w-3xl flex-col items-center gap-8 text-center">
                    <ScrollRevealItem>
                        <h2 className="landing-headline text-4xl md:text-5xl font-bold text-purple-950 tracking-tight leading-tight flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
                            Ready to see <KioLogoText /> in action?
                        </h2>
                    </ScrollRevealItem>
                    <p className="text-lg text-purple-900/60 leading-relaxed max-w-2xl">
                        Book a personalized demo to experience how project-based evaluation can transform your hiring
                        process—whether you&apos;re looking to identify top talent or showcase your skills effectively.
                    </p>

                    <ButtonLink text="Book a Demo" showIcon={false} className="min-w-[14.5rem] mx-auto" />
                </CardContent>
            </Card>
        </section>
    );
}
