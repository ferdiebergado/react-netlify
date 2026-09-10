import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { fetchCurrentUser, signout } from './api';

export const AUTH_KEYS = {
  currentUser: ['current-user'],
};

export const fetchCurrentUserOptions = () =>
  queryOptions({
    queryKey: AUTH_KEYS.currentUser,
    queryFn: fetchCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

export const useCurrentUser = () => useSuspenseQuery(fetchCurrentUserOptions());

export function useSignout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signout,
    onSuccess: async () => {
      await queryClient.cancelQueries();
      queryClient.setQueryData(AUTH_KEYS.currentUser, null);
      queryClient.removeQueries();
    },
  });
}
