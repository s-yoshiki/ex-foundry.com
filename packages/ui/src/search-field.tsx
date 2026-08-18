import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";

type SearchFieldProps = {
  inputId: string;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
};

export function SearchField({ inputId, label, onChange, placeholder, value }: SearchFieldProps) {
  return (
    <div className="grid gap-2">
      <Label
        className="font-mono text-xs tracking-wider text-muted-foreground uppercase"
        htmlFor={inputId}
      >
        {label}
      </Label>
      <Input
        autoComplete="off"
        id={inputId}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type="search"
        value={value}
      />
    </div>
  );
}
