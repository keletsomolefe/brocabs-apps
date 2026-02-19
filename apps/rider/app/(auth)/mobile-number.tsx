import { MobileNumberScreen } from "@brocabs/ui";
import { otpApi } from "~/api";

export default function MobileNumber() {
  return <MobileNumberScreen otpApi={otpApi} />;
}
