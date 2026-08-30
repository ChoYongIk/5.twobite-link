import { FormField, fieldClass } from "./form-field";
import { ChevronDownIcon } from "./icons";
import { ALL_FOLDER_ID, type Folder } from "@/app/lib/types";

export const FOLDER_FIELD_ID = "link-folder";

type FolderSelectProps = {
  folders: Folder[];
  /** 아직 고르지 않은 상태는 ALL_FOLDER_ID로 표현합니다. */
  value: string;
  error?: string;
  onChange: (folderId: string) => void;
};

export function FolderSelect({
  folders,
  value,
  error,
  onChange,
}: FolderSelectProps) {
  return (
    <FormField
      id={FOLDER_FIELD_ID}
      label="폴더"
      hint="링크를 담아둘 폴더를 골라 주세요."
      error={error}
    >
      <div className="relative">
        <select
          id={FOLDER_FIELD_ID}
          name="folderId"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? `${FOLDER_FIELD_ID}-error` : `${FOLDER_FIELD_ID}-hint`
          }
          className={`${fieldClass} appearance-none pr-11`}
        >
          <option value={ALL_FOLDER_ID}>폴더를 선택해 주세요</option>
          {folders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.emoji} {folder.name}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[var(--text-sub)]">
          <ChevronDownIcon className="size-[18px]" />
        </span>
      </div>
    </FormField>
  );
}
