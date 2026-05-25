import { trpc } from "@/providers/trpc";

export function useProjects(companyId?: number) {
  const utils = trpc.useUtils();

  const listQuery = trpc.projects.list.useQuery(
    companyId ? { companyId } : undefined
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

  return {
    projects: listQuery.data ?? [],
    isLoading: listQuery.isLoading,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    isCreating: createMutation.isPending,
  };
}

export function useProject(projectId: number) {
  return trpc.projects.get.useQuery({ id: projectId });
}
