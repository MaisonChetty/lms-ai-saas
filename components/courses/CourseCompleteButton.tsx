"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Circle, Loader2, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleCourseCompletion } from "@/lib/actions";

interface CourseCompleteButtonProps {
  courseId: string;
  courseSlug: string;
  isCompleted: boolean;
  completedLessons: number;
  totalLessons: number;
}

export function CourseCompleteButton({
  courseId,
  courseSlug,
  isCompleted: initialCompleted,
  completedLessons,
  totalLessons,
}: CourseCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [isPending, startTransition] = useTransition();

  const allLessonsCompleted =
    completedLessons === totalLessons && totalLessons > 0;
  const progressPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleCourseCompletion(
        courseId,
        courseSlug,
        !isCompleted,
      );
      if (result.success) {
        setIsCompleted(result.isCompleted);
      }
    });
  };

  if (isCompleted) {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20">
            <Trophy className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="font-semibold text-emerald-400">Course Completed!</p>
            <p className="text-sm text-muted-foreground">
              {completedLessons} of {totalLessons} lessons completed
            </p>
          </div>
        </div>
        <Button
          onClick={handleToggle}
          disabled={isPending}
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground hover:bg-secondary/70 sm:ml-auto"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Circle className="w-4 h-4 mr-2" />
          )}
          Mark Incomplete
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 flex-1">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-violet-500/20 shrink-0">
          <span className="text-base font-bold text-violet-400">
            {progressPercent}%
          </span>
        </div>
        <div>
          <p className="font-semibold text-foreground">Your Progress</p>
          <p className="text-sm text-muted-foreground">
            {completedLessons} of {totalLessons} lessons completed
          </p>
        </div>
      </div>

      <Button
        onClick={handleToggle}
        disabled={isPending || !allLessonsCompleted}
        className={
          allLessonsCompleted
            ? "bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-foreground border-0"
            : "bg-secondary text-muted-foreground cursor-not-allowed"
        }
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <CheckCircle2 className="w-4 h-4 mr-2" />
        )}
        {allLessonsCompleted
          ? "Mark Course Complete"
          : "Complete all lessons first"}
      </Button>
    </div>
  );
}
