export * from "../generated";
export * from "./constants";
export * from "./handle-api-error";

// Re-export common enums with cleaner names
export {
  StartOtpDtoApplicationTypeEnum as ApplicationType,
  IdentityDtoGenderEnum as Gender,
} from "../generated";
