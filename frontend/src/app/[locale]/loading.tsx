export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-6">
      <div className="relative flex flex-col items-center">
        <div className="absolute size-44 rounded-full border border-[#005C55]/20 dark:border-[#005C55]/30 animate-ping" />
        <div className="absolute size-36 rounded-full border border-slate-200 dark:border-slate-800" />
        <div className="relative size-24 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-950/10 dark:shadow-slate-950/50 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-tr from-[#005C55]/15 via-transparent to-[#005C55]/25 animate-pulse" />
          <div className="size-14 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-[#005C55] animate-spin" />
          <div className="absolute size-5 rounded-full bg-[#005C55] shadow-lg shadow-[#005C55]/30" />
        </div>
        <div className="mt-8 h-1.5 w-48 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full w-1/2 rounded-full bg-[#005C55] animate-[loading-bar_1.4s_ease-in-out_infinite]" />
        </div>
        <div className="mt-5 text-lg font-black tracking-[0.18em] text-slate-800 dark:text-slate-100">
          RENTO
        </div>
      </div>
    </main>
  );
}
