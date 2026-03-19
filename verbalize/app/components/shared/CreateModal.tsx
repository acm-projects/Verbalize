"use client";

type CreateModalProps = {
  open: boolean;
  mode: "assignment" | "class";
  onClose: () => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  children?: React.ReactNode;
  courseName: string;
  setCourseName: (name: string) => void;
  sectionNum: string;
  setSectionNum: (num: string) => void;
  file: File | null;
  setFile: (f: File | null) => void;
};

export default function CreateModal({
  open,
  mode,
  onClose,
  onSubmit,
  courseName,
  setCourseName,
  sectionNum,
  setSectionNum,
  file,
  setFile,
  
}: CreateModalProps) {
  if (!open) return null;


  const title = "Create a class";
  const secondLabel = "Class Name";
  const secondPlaceholder = "Enter class name";
  const thirdLabel = "Section";
  const thirdPlaceholder = "Enter section";
  const fourthLabel = "Student file";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-white/18 backdrop-blur-md"
        onClick={onClose}
      />

      {/* modal */}
      <form onSubmit={onSubmit}>
      <div className="relative z-10 w-[min(92vw,620px)] rounded-[36px] bg-white px-10 py-10 shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
        <button
          onClick={onClose}
          className="absolute right-8 top-8 text-[#c7c9cf] transition hover:text-[#8a8f98]"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            className="h-6 w-6"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-[#1f2a44]">
          {title}
        </h2>

          {/* Course Number */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="mb-3 block text-[16px] font-semibold text-[#1d1d1f]">
                {secondLabel}
              </label>
              <input
                type="text"
                value ={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="h-14 w-full rounded-[16px] bg-[#f3f4f6] px-5 text-[16px] outline-none placeholder:text-[#9ca3af]"
                placeholder={secondPlaceholder}
              />
            </div>

            <div>
              <label className="mb-3 block text-[16px] font-semibold text-[#1d1d1f]">
                {thirdLabel}
              </label>
              <input
                type="text"
                value={sectionNum}
                onChange={(e) => setSectionNum(e.target.value)}
                className="h-14 w-full rounded-[16px] bg-[#f3f4f6] px-5 text-[16px] outline-none placeholder:text-[#9ca3af]"
                placeholder={thirdPlaceholder}
              />
            </div>
          </div>

          {/* file */}
          <div>
            <label className="mb-3 block text-[16px] font-semibold text-[#1d1d1f]">
              {fourthLabel}
            </label>
            <input 
              className="flex h-14 w-full items-center justify-center rounded-[16px] bg-[#f3f4f6] text-[16px] text-[#9ca3af] transition hover:bg-[#eceef2]"
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

        {/* footer */}
        <div className="mt-8 flex items-center justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-full px-5 py-3 text-[16px] font-semibold text-[#8a8f98] transition hover:text-[#5f6672]"
          >
            Cancel
          </button>

          <button type="submit" className="rounded-[16px] bg-[#f3f4f6] px-8 py-3 text-[16px] font-semibold text-[#1f2a44] shadow-[0_4px_10px_rgba(15,23,42,0.08)] transition hover:bg-[#eceef2]">
            Submit
          </button>
        </div>
        </div>
      </form>
    </div>
  );
}