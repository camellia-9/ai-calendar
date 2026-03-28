import { Calendar } from '@/components/Calendar';
import { AIInput } from '@/components/AIInput';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Header */}
      <header className="h-12 bg-slate-900 border-b border-slate-800 flex items-center px-4">
        <h1 className="text-lg font-semibold text-blue-400">AI Calendar</h1>
      </header>

      {/* Main Content */}
      <main className="p-4 h-[calc(100vh-48px)] flex flex-col gap-4">
        {/* Calendar */}
        <div className="flex-1 min-h-0">
          <Calendar />
        </div>

        {/* AI Input */}
        <div className="flex-shrink-0">
          <AIInput />
        </div>
      </main>
    </div>
  );
}
