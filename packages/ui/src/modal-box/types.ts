import * as React from "react";
import { ModalProps } from "react-native-modal";

import { Route } from "./routes";

/** Type definitions */
export interface State {
  content?: React.ReactNode;
  isVisible: boolean;
  routeName?: Route;
  onBackdropPress?: ModalProps["onBackdropPress"];
  backdropColor?: ModalProps["backdropColor"];
  animationIn?: ModalProps["animationIn"];
  animationOut?: ModalProps["animationOut"];
  animationInTiming?: ModalProps["animationInTiming"];
  animationOutTiming?: ModalProps["animationOutTiming"];
  backdropOpacity?: ModalProps["backdropOpacity"];
  avoidKeyboard?: ModalProps["avoidKeyboard"];
  onBack?(): boolean | void;
  onCancel?(): boolean | void;
  onClose?(): boolean | void;
  onHide?(): boolean | void;
  onSubmit?(): boolean | void;
  onShow?(): boolean | void;
}

export type Config = Omit<State, "isVisible">;

export interface EventCapsule {
  payload: EventPayload;
}

export interface EventPayload {
  event: string;
  data?: ModalProperties;
}

export type Callback = () => void;
export interface ModalProperties {
  config: Config;
  onCompleted: Callback;
  routeName: Route;
}
