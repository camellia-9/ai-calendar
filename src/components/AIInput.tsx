'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Send, Loader2 } from 'lucide-react';
import { useCalendarStore } from '@/store/calendarStore';
import { CalendarEvent } from '@/types/calendar';

const AI_PROMPT = `你是一个智能日程助手。用户会输入一段文字，你需要从中提取日程信息。

输出格式（JSON）：
{
  "title": "会议/事件标题",
  "startTime": "ISO 8601 格式时间",
  "endTime": "ISO 8601 格式时间（可选）",
  "allDay": false,
  "reminder": 建议提醒时间（分钟）,
  "location": "地点（可选）",
  "tags": ["标签数组"]
}

规则：
1. 只输出 JSON，不要其他内容
2. 如果无法解析，返回 {"error": "无法解析"}
3. 时间用北京时间 (Asia/Shanghai)`;

function parseNaturalLanguage(input: string): Partial<CalendarEvent> | { error: string } {
  const lower = input.toLowerCase();
  const now = new Date();
  let start = new Date(now);
  let end: Date | undefined;
  let allDay = false;
  let title = input;

  // 解析时间
  if (lower.includes('今天')) {
    start.setHours(now.getHours(), 0, 0, 0);
  } else if (lower.includes('明天')) {
    start.setDate(start.getDate() + 1);
    start.setHours(9, 0, 0, 0);
  } else if (lower.includes('周一') || lower.includes('星期一')) {
    const daysUntilMonday = (7 - start.getDay() + 1) % 7 || 7;
    start.setDate(start.getDate() + daysUntilMonday);
    start.setHours(9, 0, 0, 0);
  } else if (lower.includes('周五') || lower.includes('星期五')) {
    const daysUntilFriday = (5 - start.getDay() + 7) % 7 || 7;
    start.setDate(start.getDate() + daysUntilFriday);
    start.setHours(15, 0, 0, 0);
  }

  // 解析具体时间
  const timeMatch = input.match(/(\d{1,2})[点时](\d{0,2})/);
  if (timeMatch) {
    const hour = parseInt(timeMatch[1]);
    const minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    start.setHours(hour, minute, 0, 0);
    end = new Date(start);
    end.setHours(end.getHours() + 1);
  }

  // 解析时长
  const durationMatch = input.match(/(\d+)(分钟|小时|小时)/);
  if (durationMatch) {
    const value = parseInt(durationMatch[1]);
    if (durationMatch[2].includes('分钟')) {
      end = new Date(start.getTime() + value * 60 * 1000);
    } else {
      end = new Date(start.getTime() + value * 60 * 60 * 1000);
    }
  }

  // 解析标题
  const removePatterns = [
    /周[一二三四五六日天]/g,
    /今天|明天|后天/g,
    /上午|下午|晚上|早上/g,
    /\d{1,2}[点时]/g,
    /\d+[分钟小时]/g,
  ];
  title = input;
  removePatterns.forEach((pattern) => {
    title = title.replace(pattern, '').trim();
  });
  title = title.replace(/^[和跟与和]/, '').trim() || input;

  return {
    title,
    start,
    end,
    allDay,
    reminders: [15],
    tags: [],
    source: 'natural-language',
  };
}

export function AIInput() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<Partial<CalendarEvent> | null>(null);
  const addEvent = useCalendarStore((state) => state.addEvent);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setLoading(true);
    
    // 模拟 AI 解析（实际项目中会调用 OpenAI API）
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const parsed = parseNaturalLanguage(input);
    setLoading(false);

    if ('error' in parsed) {
      alert(parsed.error);
      return;
    }

    setPreview(parsed);
  };

  const handleConfirm = () => {
    if (!preview) return;

    const event: CalendarEvent = {
      id: crypto.randomUUID(),
      title: preview.title || '新事件',
      start: preview.start || new Date(),
      end: preview.end,
      allDay: preview.allDay || false,
      reminders: preview.reminders || [15],
      tags: preview.tags || [],
      source: preview.source || 'manual',
    };

    addEvent(event);
    setInput('');
    setPreview(null);
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Bot className="w-5 h-5 text-blue-400" />
          <span className="text-slate-300 text-sm font-medium">AI 创建日程</span>
        </div>

        <div className="flex gap-2 mb-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="例如：周五下午3点和张三开会"
            className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !input.trim()}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>

        {preview && (
          <div className="bg-slate-700 rounded-lg p-3 mb-3">
            <p className="text-slate-300 text-sm mb-2">
              <span className="text-slate-400">标题：</span>
              {preview.title}
            </p>
            <p className="text-slate-300 text-sm mb-2">
              <span className="text-slate-400">开始：</span>
              {preview.start?.toLocaleString('zh-CN')}
            </p>
            {preview.end && (
              <p className="text-slate-300 text-sm mb-2">
                <span className="text-slate-400">结束：</span>
                {preview.end.toLocaleString('zh-CN')}
              </p>
            )}
            <div className="flex gap-2 mt-3">
              <Button 
                onClick={handleConfirm}
                size="sm"
                className="bg-green-500 hover:bg-green-600"
              >
                确认创建
              </Button>
              <Button 
                onClick={() => setPreview(null)}
                size="sm"
                variant="outline"
                className="border-slate-600 text-slate-300"
              >
                取消
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
