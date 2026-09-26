import type { FormState } from '@/lib/actions/formState';

// Toont de fout of bevestiging die een server action teruggaf
export function FormMessage({ state }: { state: FormState }) {
  if (state?.error) {
    return (
      <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
        {state.error}
      </p>
    );
  }
  if (state?.message) {
    return (
      <p role="status" className="rounded-lg bg-success-soft px-3 py-2 text-sm text-success">
        {state.message}
      </p>
    );
  }
  return null;
}
