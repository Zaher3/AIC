import { useState, useEffect, useCallback } from "react";
import { getDemoData, saveDemoData, type DemoDataStore } from "@/lib/demo-data";
import { getToken } from "@/lib/api";

function isDemoMode(): boolean {
  const token = getToken();
  return !!token && token.startsWith("demo_");
}

export function useDemoData() {
  const [data, setData] = useState<DemoDataStore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemoMode()) {
      setData(getDemoData());
    }
    setLoading(false);
  }, []);

  const refresh = useCallback(() => {
    if (isDemoMode()) setData(getDemoData());
  }, []);

  const addFile = useCallback((projectId: number, stepId: string, name: string, type: string, size: string) => {
    if (!data) return;
    const newFile = {
      id: Date.now(),
      projectId,
      stepId,
      name,
      type: type as "pdf" | "doc" | "xls" | "image",
      fileType: type,
      size,
      date: new Date().toISOString().split("T")[0],
      uploadedBy: 1,
    };
    const updated = { ...data, files: [...data.files, newFile] };
    saveDemoData(updated);
    setData(updated);
  }, [data]);

  const deleteFile = useCallback((fileId: number) => {
    if (!data) return;
    const updated = { ...data, files: data.files.filter(f => f.id !== fileId) };
    saveDemoData(updated);
    setData(updated);
  }, [data]);

  return { data, loading, refresh, addFile, deleteFile, isDemo: isDemoMode() };
}
