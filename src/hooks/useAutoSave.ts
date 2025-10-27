import { useEffect, useRef, useState } from "react";

export const useAutoSave = (
  saveFunction: (data: any) => void,
  delay: number = 1000
) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const triggerSave = (data: any) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsSaving(true);
    
    timeoutRef.current = setTimeout(() => {
      saveFunction(data);
      setIsSaving(false);
      setLastSaved(new Date());
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { triggerSave, isSaving, lastSaved };
};
