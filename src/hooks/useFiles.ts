import { trpc } from "@/providers/trpc";

export function useFiles(projectId: number, stepId?: string) {
  const utils = trpc.useUtils();

  const listQuery = trpc.files.list.useQuery({ projectId, stepId });
  const createMutation = trpc.files.create.useMutation({
    onSuccess: () => utils.files.list.invalidate(),
  });
  const deleteMutation = trpc.files.delete.useMutation({
    onSuccess: () => utils.files.list.invalidate(),
  });

  return {
    files: listQuery.data ?? [],
    isLoading: listQuery.isLoading,
    addFile: createMutation.mutate,
    removeFile: deleteMutation.mutate,
    isAdding: createMutation.isPending,
  };
}
