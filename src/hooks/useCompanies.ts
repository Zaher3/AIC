import { useState, useCallback, useMemo } from "react";
import { trpc } from "@/providers/trpc";
import { getToken } from "@/lib/api";
import { getDemoData, saveDemoData } from "@/lib/demo-data";

function isDemoMode(): boolean {
  const token = getToken();
  return !!token && token.startsWith("demo_");
}

export function useCompanies() {
  const utils = trpc.useUtils();
  const demo = isDemoMode();

  const listQuery = trpc.companies.list.useQuery(undefined, {
    enabled: !demo,
  });
  const createMutation = trpc.companies.create.useMutation({
    onSuccess: () => utils.companies.list.invalidate(),
  });
  const updateMutation = trpc.companies.update.useMutation({
    onSuccess: () => utils.companies.list.invalidate(),
  });
  const deleteMutation = trpc.companies.delete.useMutation({
    onSuccess: () => utils.companies.list.invalidate(),
  });

  const [demoData, setDemoData] = useState(() =>
    demo ? getDemoData() : null
  );

  const refreshDemo = useCallback(() => {
    if (demo) setDemoData(getDemoData());
  }, [demo]);

  const createDemoCompany = useCallback(
    (params: { name: string; notes: string }) => {
      if (!demoData) return;
      const newCompany = {
        id: Date.now(),
        name: params.name,
        notes: params.notes,
        color: "#1E3A5F",
      };
      const updated = {
        ...demoData,
        companies: [...demoData.companies, newCompany],
      };
      saveDemoData(updated);
      setDemoData(updated);
    },
    [demoData]
  );

  const deleteDemoCompany = useCallback(
    (params: { id: number }) => {
      if (!demoData) return;
      const updated = {
        ...demoData,
        companies: demoData.companies.filter((c) => c.id !== params.id),
      };
      saveDemoData(updated);
      setDemoData(updated);
    },
    [demoData]
  );

  const updateDemoCompany = useCallback(
    (params: { id: number; name?: string; notes?: string }) => {
      if (!demoData) return;
      const updated = {
        ...demoData,
        companies: demoData.companies.map((c) =>
          c.id === params.id ? { ...c, ...params } : c
        ),
      };
      saveDemoData(updated);
      setDemoData(updated);
    },
    [demoData]
  );

  return useMemo(() => {
    if (demo) {
      return {
        companies: demoData?.companies ?? [],
        isLoading: false,
        create: createDemoCompany,
        update: updateDemoCompany,
        delete: deleteDemoCompany,
        isCreating: false,
        refresh: refreshDemo,
      };
    }
    return {
      companies: listQuery.data ?? [],
      isLoading: listQuery.isLoading,
      create: createMutation.mutate,
      update: updateMutation.mutate,
      delete: deleteMutation.mutate,
      isCreating: createMutation.isPending,
      refresh: () => utils.companies.list.invalidate(),
    };
  }, [
    demo, demoData, listQuery.data, listQuery.isLoading,
    createMutation.mutate, createMutation.isPending,
    updateMutation.mutate, deleteMutation.mutate,
    createDemoCompany, updateDemoCompany, deleteDemoCompany,
    refreshDemo, utils.companies.list,
  ]);
}
