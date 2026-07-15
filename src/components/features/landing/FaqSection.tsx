import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/data-display/accordion";
import { TagSectionPrimary } from "@/components/features/landing/TagSectionPrimary";
import { FAQ_DATA } from "@/lib/constants/landing/faq-data";

export default function FaqSection() {
    return (
        <section className="w-full py-24 bg-transparent relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-4xl flex flex-col items-center relative z-10">

                {/* Section Header */}
                <div className="text-center mb-16 flex flex-col items-center">
                    <TagSectionPrimary label="FREQUENTLY ASKED QUESTIONS" />
                    <h2 className="text-4xl md:text-5xl font-bold text-purple-950 mt-6">
                        Common questions answered
                    </h2>
                </div>

                {/* Configured Accordion Component */}
                <Accordion type="single" collapsible className="w-full space-y-4">
                    {FAQ_DATA.map((item) => (
                        <AccordionItem
                            key={item.id}
                            value={item.id}
                            className="border border-transparent bg-white rounded-[20px] px-8 overflow-hidden shadow-sm transition-[box-shadow,border-color,opacity] duration-300 will-change-[opacity,transform] hover:shadow-sm hover:border-amber-200/40 data-[state=open]:shadow-md data-[state=open]:border-amber-300/60"
                        >
                            <AccordionTrigger className="text-left text-[17px] font-semibold text-purple-950 hover:no-underline py-6">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-[#6B7280] text-[15px] leading-relaxed pb-6">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>

            </div>
        </section>
    );
}