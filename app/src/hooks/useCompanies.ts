import { trpc } from "@/providers/trpc";

export function useCompanies() {
  const utils = trpc.useUtils();

  const listQuery = trpc.companies.list.useQuery();
  const createMutation = trpc.companies.create.useMutation({
    onSuccess: () => utils.companies.list.invalidate(),
  });
  const updateMutation = trpc.companies.update.useMutation({
    onSuccess: () => utils.companies.list.invalidate(),
  });
  const deleteMutation = trpc.companies.delete.useMutation({
    onSuccess: () => utils.companies.list.invalidate(),
  });

  return {
    companies: listQuery.data ?? [],
    isLoading: listQuery.isLoading,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    isCreating: createMutation.isPending,
  };
}
