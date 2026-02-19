import { SessionResponseDtoStateCodeEnum, type SessionResponseDto } from "@brocabs/client";
import { router } from "expo-router";

export const getSessionRedirectPath = (session: SessionResponseDto | undefined | null) => {
  if (!session) {
    return "/(auth)";
  }

  const stateCode = session.state?.code;
  const stateData = session.state?.data as any;

  // Check for rejected onboarding status
  if (stateData?.onboardingStatus === "REJECTED") {
    return "/(app)/application-rejected";
  }

  switch (stateCode) {
    case SessionResponseDtoStateCodeEnum.RegisterProfile:
      return "/(auth)/create-driver-profile";
    case SessionResponseDtoStateCodeEnum.ChooseSubscription:
      return "/(auth)/driver-plans";
    case SessionResponseDtoStateCodeEnum.ChooseVehicle:
      return "/(auth)/vehicle-selection";
    case SessionResponseDtoStateCodeEnum.PayAdminFee:
      return "/(auth)/admin-fee";
    case SessionResponseDtoStateCodeEnum.SelectServiceArea:
      return "/(auth)/area-of-operation";
    case SessionResponseDtoStateCodeEnum.AddBankDetails:
      return "/(auth)/bank-details";
    case SessionResponseDtoStateCodeEnum.AddPaymentCard:
      return "/(auth)/add-card-welcome";
    case SessionResponseDtoStateCodeEnum.UploadDocuments:
      return "/(auth)/driver-documents";
    case SessionResponseDtoStateCodeEnum.PendingApproval:
      return "/(app)/pending-approval";
    case SessionResponseDtoStateCodeEnum.Dashboard:
    default:
      if (session.authenticated) {
        return "/(app)";
      } else {
        return "/(auth)";
      }
  }
};

export const navigateBasedOnSession = (session: SessionResponseDto | undefined | null) => {
  const path = getSessionRedirectPath(session);
  // @ts-ignore
  router.replace(path);
};
