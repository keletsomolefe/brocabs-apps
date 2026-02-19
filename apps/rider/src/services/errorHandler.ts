import { ErrorWithReasonCode } from "mqtt";
import { envConfig } from "src/config/environment";
import { MqttError } from "./mqttService";

function processError(error: Error | ErrorWithReasonCode) {
  if ("code" in error) {
    return `Name: ${error?.name} || Message: ${error?.message} || Reason Code: ${error?.code}`;
  }

  return `Name: ${error?.name} || Message: ${error?.message}`;
}

function logError(type: string, error: Error | ErrorWithReasonCode) {
  const errorMsg = processError(error);
  console.log(`${"[Error:" + type + "]"} || ${errorMsg}`);
}

function emitStateError(
  callback: (error: MqttError) => void,
  type: string,
  error: Error | ErrorWithReasonCode
) {
  const errorMsg = processError(error).replace(/ \|\|{0,2} /g, "\n");

  callback({
    type: "[Error:" + type + "]",
    msg: errorMsg,
  });

  if (envConfig.EMIT_CONSOLE_LOGS) {
    logError(type, error);
  }
}

export { emitStateError, logError };
