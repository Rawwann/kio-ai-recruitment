import { TagSectionPrimary } from '@/components/features/landing/TagSectionPrimary';
import { ButtonLink } from '@/components/features/landing/ButtonLink';
import { COMPARISON_DATA } from '@/lib/constants/landing/comparison-data';

export default function ComparisonSection() {
    return (
        <section className="w-full bg-purple-950 py-24 pb-54 text-white overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <TagSectionPrimary label="The Smart Way to Hire" whiteText={true} />

                    <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">Why Modern Companies Choose KIO</h2>
                    <p className="text-purple-200/60 max-w-2xl mx-auto">
                        When candidates work on real projects, their skills, collaboration, and problem-solving abilities
                        become clear.
                    </p>
                </div>

                <div className="relative max-w-5xl mx-auto overflow-x-auto pb-28 lg:overflow-visible">
                    <div className="min-w-[640px] lg:min-w-0">
                        <div className="grid grid-cols-3 py-6 border-b border-white/10 text-sm font-bold uppercase tracking-wider text-purple-200/40">
                            <div>Feature</div>
                            <div className="text-center">Traditional Recruitment</div>
                            <div className="text-center text-purple-300">With KIO Platform</div>
                        </div>

                        {COMPARISON_DATA.map((row, index) => (
                            <div key={index} className="grid grid-cols-3 py-8 border-b border-white/5 items-center">
                                <div className="text-sm font-medium text-purple-200/80">{row.feature}</div>
                                <div className="text-center text-sm text-white/60">{row.traditional}</div>
                                <div className="text-center text-sm font-semibold text-white">{row.kio}</div>
                            </div>
                        ))}
                    </div>

                    <div
                        className="
                        absolute top-[-30px] right-[-10px] w-[35%] h-[calc(100%+190px)]
                        border-2 border-solid border-purple-300/40
                        rounded-[28px]
                        bg-purple-500/5 pointer-events-none -z-0
                    "
                    />

                    {/* Third column (KIO) — ~33% from the right; button centered within that strip */}
                    <div className="absolute bottom-0 right-0 z-10 flex w-[211px] flex-col items-center gap-4 px-1 lg:bottom-[-100px] lg:w-[33%]">
                        <ButtonLink
                            text="Subscribe Now"
                            showIcon={false}
                            className="w-full max-w-[20.625rem] min-w-0 focus-visible:ring-offset-purple-950"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
