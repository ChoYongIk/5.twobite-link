import { FormField, fieldBorderClass, fieldClass } from "./form-field";
import { LinkIcon } from "./icons";

export const URL_FIELD_ID = "link-url";

type UrlInputProps = {
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

export function UrlInput({ value, error, onChange }: UrlInputProps) {
  return (
    <FormField
      id={URL_FIELD_ID}
      label="링크 주소"
      hint="담아둘 페이지의 주소를 붙여넣어 주세요."
      error={error}
    >
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400 dark:text-zinc-600">
          <LinkIcon className="size-4.5" />
        </span>
        <input
          id={URL_FIELD_ID}
          name="url"
          type="url"
          inputMode="url"
          autoComplete="url"
          placeholder="https://example.com/article"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? `${URL_FIELD_ID}-error` : `${URL_FIELD_ID}-hint`
          }
          className={`${fieldClass} ${fieldBorderClass(Boolean(error))} pr-3 pl-10`}
        />
      </div>
    </FormField>
  );
}
