declare module "react-hook-form" {
  // Type-only compatibility layer.
  // In this repository, TypeScript is not resolving react-hook-form's bundled typings
  // correctly during `next build`, so we provide minimal declarations to unblock builds.

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const useForm: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const useFormContext: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const useFormState: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Controller: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const FormProvider: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type UseFormReturn<TFieldValues = any> = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type FieldValues = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type FieldPath<TFieldValues = any> = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type ControllerProps<TFieldValues = any, TName = any> = any;
}

