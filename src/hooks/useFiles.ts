import { useState, useCallback, useMemo } from "react";
import { trpc } from "@/providers/trpc";
import { getToken } from "@/lib/api";
import { getDemoData, saveDemoData } from "@/lib/demo-data";

function isDemoMode(): boolean {
  const token = getToken();
  return !!token && token.startsWith("demo_");
}

export function useFiles(projectId: number, stepId?: string) {
  const utils = trpc.useUtils();
  const demo = isDemoMode();

  const listQuery = trpc.files.list.useQuery(
    { projectId, stepId },
    { enabled: !demo && projectId > 0 }
  );
  const createMutation = trpc.files.create.useMutation({
    onSuccess: () => utils.files.list.invalidate(),
  });
  const deleteMutation = trpc.files.delete.useMutation({
    onSuccess: () => utils.files.list.invalidate(),
  });

  const [demoData, setDemoData] = useState(() =>
    demo ? getDemoData() : null
  );

  const refreshDemo = useCallback(() => {
    if (demo) setDemoData(getDemoData());
  }, [demo]);

  const filteredDemoFiles = useMemo(() => {
    if (!demoData) return [];
    let files = demoData.files.filter((f) => f.projectId === projectId);
    if (stepId) files = files.filter((f) => f.stepId === stepId);
    return files;
  }, [demoData, projectId, stepId]);

  const createDemoFile = useCallback(
    (params: { projectId: number; stepId: string; name: string; fileType: "pdf" | "doc" | "xls" | "image" | "other"; size: string }) => {
      if (!demoData) return;
      const newFile = {
        id: Date.now(),
        projectId: params.projectId,
        stepId: params.stepId,
        name: params.name,
        type: params.fileType as "pdf" | "doc" | "xls" | "image",
        fileType: params.fileType,
        size: params.size,
        date: new Date().toISOString().split("T")[0],
        uploadedBy: 1,
      };
      const updated = { ...demoData, files: [...demoData.files, newFile] };
      saveDemoData(updated);
      setDemoData(updated);
    },
    [demoData]
  );

  const deleteDemoFile = useCallback(
    (params: { id: number }) => {
      if (!demoData) return;
      const updated = { ...demoData, files: demoData.files.filter((f) => f.id !== params.id) };
      saveDemoData(updated);
      setDemoData(updated);
    },
    [demoData]
  );

  return useMemo(() => {
    if (demo) {
      return {
        files: filteredDemoFiles,
        isLoading: false,
        addFile: createDemoFile,
        removeFile: deleteDemoFile,
        isAdding: false,
        refresh: refreshDemo,
      };
    }
    return {
      files: listQuery.data ?? [],
      isLoading: listQuery.isLoading,
      addFile: createMutation.mutate,
      removeFile: deleteMutation.mutate,
      isAdding: createMutation.isPending,
      refresh: () => utils.files.list.invalidate(),
    };
  }, [
    demo, filteredDemoFiles, listQuery.data, listQuery.isLoading,
    createMutation.mutate, createMutation.isPending, deleteMutation.mutate,
    createDemoFile, deleteDemoFile, refreshDemo, utils.files.list,
  ]);
}
