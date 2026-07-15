import { useState, useEffect, useRef } from "react";
import { Step } from "@/types";

const STEPS_COUNT = 4;
const STEP_DELAY_MS = 2000;

/**
 * Drives the CV analysis progress animation.
 * Uses a ref for onComplete so the effect is only ever set up once (on mount),
 * regardless of how many times the parent re-renders while the spinner is visible.
 */
export function useCVLoadingSteps(onComplete: () => void) {
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    const [steps, setSteps] = useState<Step[]>([
        { id: 1, label: "CV uploaded successfully",  description: "Document received and validated",  completed: false, active: true  },
        { id: 2, label: "Parsing document structure", description: "Extracting text and formatting",    completed: false, active: false },
        { id: 3, label: "Identifying key sections",   description: "Skills, experience, education",    completed: false, active: false },
        { id: 4, label: "Generating profile",          description: "Creating editable sections",       completed: false, active: false },
    ]);

    useEffect(() => {
        const timers: ReturnType<typeof setTimeout>[] = [];

        for (let index = 0; index < STEPS_COUNT; index++) {
            const timer = setTimeout(() => {
                setSteps((prev) =>
                    prev.map((s, i) => ({
                        ...s,
                        completed: i < index + 1,
                        active:    i === index + 1,
                    })),
                );
            }, (index + 1) * STEP_DELAY_MS);
            timers.push(timer);
        }

        const finalTimer = setTimeout(() => {
            onCompleteRef.current();
        }, (STEPS_COUNT + 1) * STEP_DELAY_MS);
        timers.push(finalTimer);

        return () => timers.forEach(clearTimeout);
    }, []); // intentionally empty — runs once on mount only

    return { steps };
}
