import { Institution, InstitutionTypeEnum, QueryKeys } from "@brocabs/client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { institutionsApi } from "~/api";

export interface UseInstitutionsOptions {
  q?: string;
  limit?: number;
  type?: InstitutionTypeEnum;
  enabled?: boolean;
}

export const institutionsQueryOptions = (opts: UseInstitutionsOptions = {}) =>
  queryOptions({
    queryKey: [QueryKeys.INSTITUTIONS, opts],
    queryFn: async () => {
      const response = await institutionsApi.institutionsControllerSearch({
        q: opts.q,
        limit: opts.limit,
        type: opts.type,
      });
      return response as Institution[];
    },
    enabled: opts.enabled,
  });

export function useInstitutions(opts: UseInstitutionsOptions = {}) {
  return useQuery(institutionsQueryOptions(opts));
}
