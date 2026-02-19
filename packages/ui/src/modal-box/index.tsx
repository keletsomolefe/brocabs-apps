import { FC, useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import RNModal from "react-native-modal";

import { PubSub } from "../services/pubsub";

import { ModalEvents } from "./events";
import { MODAL_ROUTES, Route } from "./routes";
import type { Callback, Config, EventCapsule, State } from "./types";

const CHANNEL = "APP_MODAL";
const TIMING_ANIMATION = 400;

const DEFAULT_STATE: State = {
  isVisible: false,
  animationIn: undefined,
  animationOut: undefined,
  avoidKeyboard: undefined,
  backdropColor: "black",
  content: null,
  routeName: undefined,
  backdropOpacity: 0.4,
  onBackdropPress: undefined,
  animationInTiming: TIMING_ANIMATION,
  animationOutTiming: TIMING_ANIMATION,
  onBack: undefined,
  onCancel: undefined,
  onClose: undefined,
  onHide: undefined,
  onSubmit: undefined,
};

const styles = StyleSheet.create({
  modal: { margin: 0, padding: 0 },
});

interface ModalBoxComponentType extends FC<Record<string, unknown>> {
  hide: (onCompleted?: Callback) => void;
  show: (routeName: Route, config?: Config, onCompleted?: Callback) => void;
  update: (routeName: Route, config: Config, onCompleted?: Callback) => void;
}

const ModalBoxComponent: FC<Record<string, unknown>> = () => {
  const [state, setState] = useState<State>(DEFAULT_STATE);

  const hide = useCallback((onCompleted?: Callback) => {
    setState((prev) => ({ ...prev, isVisible: false }));

    if (onCompleted) {
      onCompleted();
    }
  }, []);

  const show = useCallback(
    (routeName: Route, config?: Config, onCompleted?: Callback) => {
      const routeConfig = MODAL_ROUTES[routeName];

      if (!routeConfig) {
        throw new Error(`[ModalBox]: Route "${routeName}" does not exist.`);
      }

      setState(() => ({
        ...DEFAULT_STATE,
        ...routeConfig,
        ...(config ?? {}),
        isVisible: true,
        routeName,
      }));

      if (onCompleted) {
        onCompleted();
      }
    },
    [],
  );

  const update = useCallback(
    (routeToUpdate: Route, config: Config, onCompleted?: Callback) => {
      let shouldCallOnCompleted = false;

      setState((prev) => {
        if (routeToUpdate !== prev.routeName) {
          return prev;
        }

        shouldCallOnCompleted = true;

        return {
          ...prev,
          ...config,
        };
      });

      if (shouldCallOnCompleted && onCompleted) {
        onCompleted();
      }
    },
    [],
  );

  const listener = useCallback(
    (eventData: EventCapsule) => {
      const { payload } = eventData;

      if (!payload || !payload.data) {
        return;
      }

      const { event, data } = payload;
      const { routeName, config, onCompleted } = data;

      switch (event) {
        case ModalEvents.Hide:
          hide(onCompleted);
          break;
        case ModalEvents.Show:
          show(routeName, config, onCompleted);
          break;
        case ModalEvents.Update:
          if (config) {
            update(routeName, config, onCompleted);
          }
          break;
        default:
          break;
      }
    },
    [hide, show, update],
  );

  useEffect(() => {
    PubSub.listen(CHANNEL, listener as Callback);

    return () => {
      PubSub.remove(CHANNEL, listener as Callback);
    };
  }, [listener]);

  const {
    isVisible,
    onBackdropPress,
    backdropColor,
    animationIn,
    animationInTiming,
    animationOut,
    animationOutTiming,
    backdropOpacity,
    content,
  } = state;

  const handleOnHide = useCallback(() => {
    if (!state.onHide || !state.onHide()) {
      hide();
    }
  }, [hide, state]);

  return (
    <RNModal
      animationIn={animationIn}
      animationOut={animationOut}
      animationInTiming={animationInTiming}
      animationOutTiming={animationOutTiming}
      backdropColor={backdropColor}
      backdropOpacity={backdropOpacity}
      isVisible={isVisible}
      useNativeDriver
      useNativeDriverForBackdrop
      hideModalContentWhileAnimating
      onBackdropPress={onBackdropPress}
      style={styles.modal}
      onModalHide={handleOnHide}
    >
      {content}
    </RNModal>
  );
};

const ModalBox = ModalBoxComponent as ModalBoxComponentType;

ModalBox.hide = (onCompleted?: Callback) => {
  PubSub.dispatch(CHANNEL, {
    event: ModalEvents.Hide,
    data: { onCompleted },
  });
};

ModalBox.update = (
  routeName: Route,
  config: Config,
  onCompleted?: Callback,
) => {
  PubSub.dispatch(CHANNEL, {
    event: ModalEvents.Update,
    data: { routeName, config, onCompleted },
  });
};

ModalBox.show = (routeName: Route, config?: Config, onCompleted?: Callback) => {
  PubSub.dispatch(CHANNEL, {
    event: ModalEvents.Show,
    data: { routeName, config, onCompleted },
  });
};

export { ModalBox };
