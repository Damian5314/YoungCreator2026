'use client';

import { startTransition, useActionState } from 'react';
import type { FormState } from '@/lib/actions/formState';

type FormAction = (prev: FormState, formData: FormData) => Promise<FormState>;

// useActionState, maar handmatig aangeroepen: zo worden ingevulde velden niet
// leeggemaakt als de server een fout teruggeeft (dat doet <form action> wel)
export function useFormAction(action: FormAction) {
  const [state, dispatch, pending] = useActionState(action, undefined);

  function submit(formData: FormData) {
    startTransition(() => dispatch(formData));
  }

  return { state, pending, submit };
}
