import type { ReactNode } from "react";
import React, {
    createContext,
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
} from "react";
import type {
    GlobalOptions as ConfettiGlobalOptions,
    CreateTypes as ConfettiInstance,
    Options as ConfettiOptions,
} from "canvas-confetti";
import confetti from "canvas-confetti";

import { cn } from "@/lib/utils";
import { Api, Props, ConfettiRef } from "@/types";

const ConfettiContext = createContext<Api>({} as Api);

// eslint-disable-next-line react/display-name
const Confetti = forwardRef<ConfettiRef, Props>(
    (
        { options, globalOptions = { resize: true, useWorker: true }, manualstart = false, children, ...rest },
        ref,
    ) => {
        const instanceRef = useRef<ConfettiInstance | null>(null);
        const canvasRef = useCallback(
            (node: HTMLCanvasElement) => {
                if (node !== null) {
                    if (instanceRef.current) return;
                    instanceRef.current = confetti.create(node, {
                        ...globalOptions,
                        resize: true,
                    });
                } else {
                    if (instanceRef.current) {
                        instanceRef.current.reset();
                        instanceRef.current = null;
                    }
                }
            },
            [globalOptions],
        );

        const fire = useCallback(
            (opts = {}) => instanceRef.current?.({ ...options, ...opts }),
            [options],
        );

        const api = useMemo(
            () => ({
                fire,
            }),
            [fire],
        );

        useImperativeHandle(ref, () => api, [api]);

        useEffect(() => {
            if (!manualstart) {
                fire();
            }
        }, [manualstart, fire]);

        return (
            <ConfettiContext.Provider value={api}>
                <canvas ref={canvasRef} {...rest} />
                {children}
            </ConfettiContext.Provider>
        );
    },
);

export default Confetti;
