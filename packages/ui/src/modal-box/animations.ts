import { ModalProps } from "react-native-modal";

export const animationIn: ModalProps["animationIn"] = {
  0: {
    opacity: 0,
    // @ts-expect-error Missing type definition for 'scale' property.
    scale: 0.95,
  },
  0.6: {
    opacity: 1,
    // @ts-expect-error Missing type definition for 'scale' property.
    scale: 1.04,
  },
  0.85: {
    opacity: 1,
    // @ts-expect-error Missing type definition for 'scale' property.
    scale: 0.99,
  },
  1: {
    opacity: 1,
    // @ts-expect-error Missing type definition for 'scale' property.
    scale: 1,
  },
};

export const animationOut: ModalProps["animationOut"] = {
  0: {
    opacity: 1,
    // @ts-expect-error Missing type definition for 'scale' property.
    scale: 1,
  },
  0.4: {
    opacity: 0.75,
    // @ts-expect-error Missing type definition for 'scale' property.
    scale: 0.95,
  },
  0.75: {
    opacity: 0.35,
    // @ts-expect-error Missing type definition for 'scale' property.
    scale: 0.88,
  },
  1: {
    opacity: 0,
    // @ts-expect-error Missing type definition for 'scale' property.
    scale: 0.82,
  },
};
