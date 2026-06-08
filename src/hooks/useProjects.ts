import { useState, useCallback, useMemo } from "react";
import { trpc } from "@/providers/trpc";
import { getToken } from "@/lib/api";
import { getDemoData, saveDemoData, type DemoProject } from "@/lib/demo-data";

function isDemoMode(): boolean {
  const token = getToken();
  return !!token && token.startsWith("demo_");
}

export function useProjects(companyId?: number) {
  const utils = trpc.useUtils();
  const demo = isDemoMode();

  const listQuery = trpc.projects.list.useQuery(
    companyId ? { companyId } : undefined,
    { enabled: !demo && !!companyId }
  );
  const createMutation = trpc.projects.create.useMutation({
    onSuccess: () => utils.projects.list.invalidate(),
  });
  const updateMutation = trpc.projects.update.useMutation({
    onSuccess: () => utils.projects.list.invalidate(),
  });
  const deleteMutation = trpc.projects.delete.useMutation({
    onSuccess: () => utils.projects.list.invalidate(),
  });

  const [demoData, setDemoData] = useState(() =>
    demo ? getDemoData() : null
  );

  const refreshDemo = useCallback(() => {
    if (demo) setDemoData(getDemoData());
  }, [demo]);

  const filteredDemoProjects = useMemo(() => {
    if (!demoData) return [];
    if (!companyId) return demoData.projects;
    return demoData.projects.filter((p) => p.companyId === companyId);
  }, [demoData, companyId]);

  const createDemoProject = useCallback(
    (params: { companyId: number; code: string; name: string; notes: string }) => {
      if (!demoData) return;
      const newProject: DemoProject = {
        id: Date.now(),
        code: params.code,
        name: params.name,
        companyId: params.companyId,
        status: "active",
        notes: params.notes,
        ownerId: 1,
        team: 1,
      };
      const updated = { ...demoData, projects: [...demoData.projects, newProject] };
      saveDemoData(updated);
      setDemoData(updated);
    },
    [demoData]
  );

  const deleteDemoProject = useCallback(
    (params: { id: number }) => {
      if (!demoData) return;
      const updated = { ...demoData, projects: demoData.projects.filter((p) => p.id !== params.id) };
      saveDemoData(updated);
      setDemoData(updated);
    },
    [demoData]
  );

  const updateDemoProject = useCallback(
    (params: { id: number; name?: string; status?: string }) => {
      if (!demoData) return;
      const updated = {
        ...demoData,
        projects: demoData.projects.map((p) =>
          p.id === params.id
            ? { ...p, ...(params.name !== undefined && { name: params.name }), ...(params.status !== undefined && { status: params.status as DemoProject["status"] }) }
            : p
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
        projects: filteredDemoProjects,
        isLoading: false,
        create: createDemoProject,
        update: updateDemoProject,
        delete: deleteDemoProject,
        isCreating: false,
        refresh: refreshDemo,
      };
    }
    return {
      projects: listQuery.data ?? [],
      isLoading: listQuery.isLoading,
      create: createMutation.mutate,
      update: updateMutation.mutate,
      delete: deleteMutation.mutate,
      isCreating: createMutation.isPending,
      refresh: () => utils.projects.list.invalidate(),
    };
  }, [
    demo, filteredDemoProjects, listQuery.data, listQuery.isLoading,
    createMutation.mutate, createMutation.isPending,
    updateMutation.mutate, deleteMutation.mutate,
    createDemoProject, updateDemoProject, deleteDemoProject,
    refreshDemo, utils.projects.list,
  ]);
}
