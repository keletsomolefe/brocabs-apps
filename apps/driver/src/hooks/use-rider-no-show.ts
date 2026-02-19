import { useMutation } from "@tanstack/react-query";
import { ridesApi } from "~/api";
import { useNoShowStore } from "../features/trip/stores/noShowStore";

export function useRiderNoShow() {
  const { showModal } = useNoShowStore();
  return useMutation({
    mutationFn: (id: string) => ridesApi.ridesControllerMarkRiderNoShow({ id }),
    onSuccess: () => {
      showModal();
    },
  });
}
