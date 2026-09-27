interface SwitchProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

export function Switch({ id, label, description, checked, disabled, onChange }: SwitchProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 ${
          checked ? 'bg-action' : 'bg-input'
        }`}
      >
        <span
          className={`inline-block size-5 rounded-full shadow transition-transform ${
            checked ? 'translate-x-5.5 bg-action-foreground' : 'translate-x-0.5 bg-white'
          }`}
        />
      </button>
    </div>
  );
}
