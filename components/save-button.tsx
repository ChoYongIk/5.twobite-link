export function SaveButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary px-6 py-3 text-[17px] leading-[1.5] font-medium"
    >
      {pending ? "저장 중…" : "저장"}
    </button>
  );
}
