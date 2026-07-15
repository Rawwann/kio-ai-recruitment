import Image from "next/image";
import { ButtonLink } from "./ButtonLink";
import { TagSectionPrimary } from "./TagSectionPrimary";

// ──────────────────────────────────────────────────────────────────
// FeatureBlock
// Reusable alternating feature row used inside FeaturesSection.
// Supports reversed layout via the isReverse prop.
// ──────────────────────────────────────────────────────────────────
export const FeatureBlock = ({
    badge,
    title,
    desc,
    img,
    btnText,
    isReverse = false,
}: {
    badge: string;
    title: string;
    desc: string;
    img: string;
    btnText: string;
    isReverse?: boolean;
}) => (
    <div className={`flex flex-col ${isReverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-12 py-4`}>
        {/* Text Content Container */}
        <div className="flex-1 text-left">
            <TagSectionPrimary label={badge} whiteText={false} />
            <h2 className="text-3xl font-bold text-purple-950 mt-4 mb-6 leading-tight">
                {title}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-md">
                {desc}
            </p>
            <ButtonLink text={btnText} />
        </div>

        <div className="flex-1 relative">
            <div className="absolute inset-0 bg-purple-200/20 blur-[100px] -z-10 rounded-full" />
            <div className="rounded-2xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:ring-2 hover:ring-amber-400/40">
                <Image src={img} alt="" width={600} height={450} className="w-full h-auto drop-shadow-2xl" />
            </div>
        </div>
    </div>
);