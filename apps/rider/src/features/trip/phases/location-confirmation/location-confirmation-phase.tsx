import { LocationPoint } from "../../context/ride-context";
import { LocationConfirmTopCard } from "./location-confirm";
import { LocationConfirmSheet } from "./location-confirm-sheet";

type Props = {
  confirmingLocation: LocationPoint | null;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
  onCenterMap?: () => void;
  type: "pickup" | "destination";
};

export function LocationConfirmationPhase(props: Props) {
  const { confirmingLocation, onCancel, onConfirm, loading, onCenterMap, type } = props;
  return (
    <>
      <LocationConfirmTopCard
        address={confirmingLocation?.address || ""}
        loading={loading}
        onCancel={onCancel}
        type={type}
      />
      <LocationConfirmSheet onConfirm={onConfirm} loading={loading} onCenterMap={onCenterMap} />
    </>
  );
}
