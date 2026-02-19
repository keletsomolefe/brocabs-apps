import { Colors } from "@brocabs/ui/theme/colors";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView, WebViewNavigation } from "react-native-webview";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// Success URL patterns - match specific callback URLs
const SUCCESS_PATTERNS = [
  "/payment/success",
  "/payment-success",
  "/checkout/success",
  "/callback/success",
  "?status=success",
  "?result=success",
  "?payment=success",
  "/thank-you",
  "/thankyou",
  "/confirmation",
];

// Cancel/Failure URL patterns - specific paths only
const CANCEL_PATTERNS = [
  "/payment/cancel",
  "/payment-cancel",
  "/payment/failed",
  "/payment-failed",
  "/checkout/cancel",
  "/checkout/failed",
  "/callback/cancel",
  "/callback/failed",
  "?status=cancel",
  "?status=failed",
  "?result=cancel",
  "?result=failed",
  "?payment=cancelled",
  "?payment=failed",
];

interface CheckoutWebViewProps {
  url: string;
  onSuccess: () => void;
  onCancel: () => void;
  onError: (error: string) => void;
}

/**
 * CheckoutWebView Component
 *
 * Opens TradeSafe checkout in a WebView inside the app.
 * The TradeSafe page has its own header with back/cancel functionality.
 */
export function CheckoutWebView({ url, onSuccess, onCancel, onError }: CheckoutWebViewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hasCompleted, setHasCompleted] = useState(false);
  const webViewRef = useRef<WebView>(null);

  // Wrapper functions to prevent multiple calls
  const handleSuccess = useCallback(() => {
    if (hasCompleted) {
      console.log("[CheckoutWebView] Success already handled, ignoring duplicate");
      return;
    }
    console.log("[CheckoutWebView] Handling success");
    setHasCompleted(true);
    onSuccess();
  }, [hasCompleted, onSuccess]);
  const insets = useSafeAreaInsets();

  const handleCancel = useCallback(() => {
    if (hasCompleted) {
      console.log("[CheckoutWebView] Cancel already handled, ignoring duplicate");
      return;
    }
    console.log("[CheckoutWebView] Handling cancel");
    setHasCompleted(true);
    onCancel();
  }, [hasCompleted, onCancel]);

  // Log the URL we're trying to load
  useEffect(() => {
    console.log("[CheckoutWebView] Component mounted with URL:", url);
    console.log("[CheckoutWebView] URL valid:", url && url.startsWith("http"));
  }, [url]);

  // Check if URL matches any pattern (exact path matching)
  const matchesPattern = (urlString: string, patterns: string[]) => {
    const lowerUrl = urlString.toLowerCase();
    return patterns.some((pattern) => lowerUrl.includes(pattern.toLowerCase()));
  };

  // Handle navigation state changes to detect success/failure redirects
  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    console.log("[CheckoutWebView] Navigation:", navState.url, "loading:", navState.loading);

    // Only check when not loading (page has finished loading)
    if (!navState.loading) {
      // Check for success redirect patterns
      if (matchesPattern(navState.url, SUCCESS_PATTERNS)) {
        console.log("[CheckoutWebView] Payment success detected at:", navState.url);
        handleSuccess();
        return;
      }

      // Check for cancel/failure patterns
      if (matchesPattern(navState.url, CANCEL_PATTERNS)) {
        console.log("[CheckoutWebView] Payment cancelled/failed at:", navState.url);
        handleCancel();
        return;
      }
    }
  };

  // Handle URL requests - can intercept and redirect
  const handleShouldStartLoadWithRequest = (request: { url: string }) => {
    console.log("[CheckoutWebView] Should start load:", request.url);

    // Check for success patterns in the URL being loaded
    if (matchesPattern(request.url, SUCCESS_PATTERNS)) {
      console.log("[CheckoutWebView] Intercepted success redirect:", request.url);
      // Delay to let any final processing complete
      setTimeout(() => handleSuccess(), 100);
      return false; // Don't load this URL, we're handling it
    }

    // Check for cancel/failure patterns
    if (matchesPattern(request.url, CANCEL_PATTERNS)) {
      console.log("[CheckoutWebView] Intercepted cancel/fail redirect:", request.url);
      setTimeout(() => handleCancel(), 100);
      return false;
    }

    // Allow all other URLs to load
    return true;
  };

  // If URL is invalid, show error
  if (!url || !url.startsWith("http")) {
    console.error("[CheckoutWebView] Invalid URL provided:", url);
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Invalid checkout URL</Text>
        </View>
      </View>
    );
  }

  const injectedJavaScript = `
    (function() {
      // Fix viewport
      var meta = document.querySelector('meta[name=viewport]');
      if (meta) {
        meta.setAttribute(
          'content',
          'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
        );
      }

      // Rewrite target="_blank" links so 3DS and other popups open in the same WebView
      document.querySelectorAll('a[target="_blank"]').forEach(function(a) {
        a.setAttribute('target', '_self');
      });

      // Observe DOM changes to catch dynamically added target="_blank" links
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(m) {
          m.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) {
              if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
                node.setAttribute('target', '_self');
              }
              node.querySelectorAll && node.querySelectorAll('a[target="_blank"]').forEach(function(a) {
                a.setAttribute('target', '_self');
              });
            }
          });
        });
      });
      observer.observe(document.body || document.documentElement, { childList: true, subtree: true });

      // Override window.open so 3DS verification loads in the same view
      if (!window.__brocabsOpenPatched) {
        window.__brocabsOpenPatched = true;
        var origOpen = window.open;
        window.open = function(url, target, features) {
          if (url) {
            window.location.href = url;
          }
          return null;
        };
      }

      // Intercept parent.postMessage for TradeSafe checkout communication
      // TradeSafe embedded checkout sends messages via parent.postMessage
      // In a React Native WebView there is no parent frame, so we bridge
      // these messages to ReactNativeWebView.postMessage
      if (!window.__brocabsPostMessagePatched) {
        window.__brocabsPostMessagePatched = true;

        // Override parent.postMessage to forward to React Native
        if (window.parent && window.parent !== window) {
          var origParentPostMessage = window.parent.postMessage.bind(window.parent);
          window.parent.postMessage = function(data, targetOrigin) {
            // Forward to React Native WebView bridge
            if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
              window.ReactNativeWebView.postMessage(
                typeof data === 'string' ? data : JSON.stringify(data)
              );
            }
            // Also call original in case it's needed
            try { origParentPostMessage(data, targetOrigin || '*'); } catch(e) {}
          };
        }

        // Also listen for message events on the window (for same-frame postMessage)
        window.addEventListener('message', function(event) {
          if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
            try {
              var payload = typeof event.data === 'string' ? event.data : JSON.stringify(event.data);
              window.ReactNativeWebView.postMessage(payload);
            } catch(e) {}
          }
        });
      }
    })();
    true;
  `;

  return (
    <View style={styles.container}>
      {loadError && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>Error: {loadError}</Text>
        </View>
      )}

      <WebView
        ref={webViewRef}
        nestedScrollEnabled
        contentInset={{ bottom: insets.bottom + 20 }}
        source={{ uri: url }}
        injectedJavaScript={injectedJavaScript}
        originWhitelist={["*"]}
        style={{ flex: 1, minHeight: SCREEN_HEIGHT - 100 }}
        onLoadStart={(e) => {
          console.log("[CheckoutWebView] Load started:", e.nativeEvent.url);
          setIsLoading(true);
          setLoadError(null);
        }}
        onLoadEnd={(e) => {
          console.log("[CheckoutWebView] Load ended:", e.nativeEvent.url);
          // Hide loader after a short delay to let SvelteKit hydrate
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        }}
        onLoad={(e) => {
          console.log("[CheckoutWebView] onLoad:", e.nativeEvent.url);
        }}
        onLoadProgress={(e) => {
          if (e.nativeEvent.progress === 1) {
            console.log("[CheckoutWebView] Load progress complete");
            // Also dismiss loading here — some pages (e.g. 3DS /acs)
            // fire onLoadProgress(1) but never fire onLoadEnd
            setTimeout(() => {
              setIsLoading(false);
            }, 300);
          }
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error("[CheckoutWebView] WebView error:", JSON.stringify(nativeEvent));

          // Check if this error is due to a redirect to success/cancel URL
          // iOS ATS can block redirects with code -1022
          const errorUrl = (nativeEvent as { url?: string }).url || "";
          if (matchesPattern(errorUrl, SUCCESS_PATTERNS)) {
            console.log("[CheckoutWebView] Error on success URL, treating as success:", errorUrl);
            handleSuccess();
            return;
          }
          if (matchesPattern(errorUrl, CANCEL_PATTERNS)) {
            console.log("[CheckoutWebView] Error on cancel URL, treating as cancel:", errorUrl);
            handleCancel();
            return;
          }

          setIsLoading(false);
          setLoadError(nativeEvent.description || "Failed to load page");
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error("[CheckoutWebView] HTTP error:", nativeEvent.statusCode, nativeEvent.url);

          // Check if this is a redirect to success/cancel page
          if (nativeEvent.url && matchesPattern(nativeEvent.url, SUCCESS_PATTERNS)) {
            console.log("[CheckoutWebView] HTTP error on success URL, treating as success");
            handleSuccess();
            return;
          }
          if (nativeEvent.url && matchesPattern(nativeEvent.url, CANCEL_PATTERNS)) {
            console.log("[CheckoutWebView] HTTP error on cancel URL, treating as cancel");
            handleCancel();
            return;
          }
        }}
        onMessage={(event) => {
          const rawData = event.nativeEvent.data;
          console.log("[CheckoutWebView] Message from web:", rawData);

          try {
            const data = typeof rawData === "string" ? JSON.parse(rawData) : rawData;

            // Handle TradeSafe postMessage events
            // TradeSafe checkout sends messages like:
            // { event: "tradesafe", action: "success" }
            // { event: "tradesafe", action: "close" }
            // { type: "payment", status: "success" }
            // { status: "success" }
            if (
              data?.action === "success" ||
              data?.status === "success" ||
              data?.event === "payment_success" ||
              (data?.event === "tradesafe" && data?.action === "success") ||
              (data?.type === "payment" && data?.status === "success")
            ) {
              console.log("[CheckoutWebView] Payment success via postMessage");
              handleSuccess();
              return;
            }

            if (
              data?.action === "close" ||
              data?.action === "cancel" ||
              data?.status === "cancel" ||
              data?.status === "cancelled" ||
              data?.status === "failed" ||
              data?.event === "payment_cancelled" ||
              data?.event === "payment_failed" ||
              (data?.event === "tradesafe" &&
                (data?.action === "close" || data?.action === "cancel"))
            ) {
              console.log("[CheckoutWebView] Payment cancelled/closed via postMessage");
              handleCancel();
              return;
            }
          } catch (e) {
            // Not JSON or parsing failed, check raw string
            if (typeof rawData === "string") {
              const lower = rawData.toLowerCase();
              if (lower.includes("success") || lower.includes("complete")) {
                console.log("[CheckoutWebView] Payment success via raw postMessage");
                handleSuccess();
                return;
              }
              if (lower.includes("cancel") || lower.includes("close") || lower.includes("fail")) {
                console.log("[CheckoutWebView] Payment cancelled via raw postMessage");
                handleCancel();
                return;
              }
            }
          }
        }}
        onNavigationStateChange={handleNavigationStateChange}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        onContentProcessDidTerminate={(e) => {
          console.error("[CheckoutWebView] Content process terminated, reloading...");
          webViewRef.current?.reload();
        }}
        // Removed startInLoadingState and renderLoading - they may block the view
        // Enable JavaScript and DOM storage for payment forms
        javaScriptEnabled={true}
        domStorageEnabled={true}
        // Allow third-party cookies for PSP integration
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        // Allow mixed content (some PSPs load resources over HTTP)
        mixedContentMode="compatibility"
        // Allow JavaScript to open windows (for 3DS popups)
        javaScriptCanOpenWindowsAutomatically={true}
        // Enable media playback without user gesture (some PSPs use this)
        mediaPlaybackRequiresUserAction={false}
        // Set proper user agent to avoid being blocked
        userAgent={
          Platform.OS === "ios"
            ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
            : undefined
        }
        // Allow file access for some PSP requirements
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={false}
        bounces={true}
        // Cache mode
        cacheEnabled={true}
        // Scroll enabled
        scrollEnabled={true}
        scalesPageToFit={true}
        // Incognito mode off to allow cookies
        incognito={false}
        // Allow inline media playback
        allowsInlineMediaPlayback={true}
      />

      {/* Loading overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors["Primary/600"]} />
          <Text style={styles.loadingText}>Loading payment page...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: "#6B7280",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#DC2626",
    textAlign: "center",
  },
  errorBanner: {
    backgroundColor: "#FEE2E2",
    padding: 8,
  },
  errorBannerText: {
    color: "#B91C1C",
    fontSize: 12,
    textAlign: "center",
  },
});
