import * as SplashScreen from "expo-splash-screen";
import LottieView from "lottie-react-native";
import { forwardRef, useEffect, useRef } from "react";
import Modal from "react-native-modal";
import "react-native-reanimated";

import { Lottie } from "@brocabs/ui/animations";
import { Fill } from "@brocabs/ui/layout";

SplashScreen.preventAutoHideAsync();

export function SplashAnimation({ onAnimationFinish }: { onAnimationFinish: () => void }) {
  const ballRef = useRef<any>(null);

  useEffect(() => {
    if (ballRef.current) {
      ballRef.current.play();
    }
  }, []);

  const handleAnimationFinish = () => {
    onAnimationFinish();
  };

  const renderAnimation = () => {
    return <BallAnimation ref={ballRef} onAnimationFinish={handleAnimationFinish} />;
  };

  return (
    <Modal
      isVisible={true}
      style={{ flex: 1, margin: 0 }}
      animationIn="fadeIn"
      animationOut={"fadeOut"}
      animationInTiming={400}
      animationOutTiming={400}
      hideModalContentWhileAnimating
      useNativeDriver
      backdropTransitionOutTiming={0}
      hasBackdrop
      backdropOpacity={0}>
      {renderAnimation()}
    </Modal>
  );
}

const LogoAnimation = forwardRef<LottieView, AnimationEvents>(({ onAnimationFinish }, ref) => {
  return (
    <Fill backgroundColor="Primary/500" justifyContent="center" alignItems="center">
      <LottieView
        ref={ref}
        style={{ width: 120, height: 120 }}
        source={Lottie.logo}
        onAnimationFinish={onAnimationFinish}
        loop={false}
      />
    </Fill>
  );
});

const BallAnimation = forwardRef<LottieView, AnimationEvents>(({ onAnimationFinish }, ref) => {
  return (
    <Fill backgroundColor="white">
      <LottieView
        ref={ref}
        style={{ flex: 1 }}
        source={Lottie.splash}
        onAnimationFinish={onAnimationFinish}
        loop={false}
      />
    </Fill>
  );
});

BallAnimation.displayName = "BallAnimation";
LogoAnimation.displayName = "LogoAnimation";

interface AnimationEvents {
  onAnimationFinish: () => void;
}
