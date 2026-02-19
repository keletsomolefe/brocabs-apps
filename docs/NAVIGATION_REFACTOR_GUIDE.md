# Navigation Refactor Guide: Moving Screens Outside `(app)` Group

## Overview

This document captures the learnings from refactoring the **Driver App** navigation structure to move screens outside the `(app)` route group. The purpose is to enable smoother navigation transitions and prevent drawer interference during stack navigation.

## Problem Statement

When screens are nested inside the `(app)` Drawer navigator group, navigation between screens can experience:

1. **Drawer gesture conflicts** - Swipe gestures may trigger drawer open/close instead of back navigation
2. **Animation stutters** - Drawer re-renders can cause janky transitions
3. **Header inconsistencies** - Managing headers within a Drawer context requires custom header components on every screen
4. **State management complexity** - Drawer state affects nested screen lifecycle

## Solution: Root-Level Stack Screens

Move full-screen flows (settings, history, contacts, etc.) to the root `_layout.tsx` as direct `Stack.Screen` children, outside the `(app)` Drawer group.

---

## Before vs After: Structure Comparison

### ❌ Before (Rider App - Current State)

```
apps/rider/app/
├── _layout.tsx              # Root layout with minimal Stack
├── (app)/
│   ├── _layout.tsx          # Drawer navigator
│   ├── home/                # Main screens
│   ├── ride-history/        # ⚠️ Inside drawer
│   ├── notifications/       # ⚠️ Inside drawer
│   ├── sos-contacts/        # ⚠️ Inside drawer
│   ├── favorite-addresses/  # ⚠️ Inside drawer
│   ├── profile-settings/    # ⚠️ Inside drawer
│   ├── complaints/          # ⚠️ Inside drawer
│   └── bro-scholar/         # ⚠️ Inside drawer
└── (auth)/
```

### ✅ After (Driver App - Refactored)

```
apps/driver/app/
├── _layout.tsx              # Root layout with all Stack.Screens
├── (app)/
│   ├── _layout.tsx          # Drawer navigator (minimal)
│   └── home/                # Only home screens in drawer
├── ride-history/            # ✅ Root-level stack screen
├── notifications/           # ✅ Root-level stack screen
├── sos-contacts/            # ✅ Root-level stack screen
├── service-areas/           # ✅ Root-level stack screen
├── profile-settings/        # ✅ Root-level stack screen
├── complaints/              # ✅ Root-level stack screen
├── chat/                    # ✅ Root-level stack screen
└── (auth)/
```

---

## Critical File Changes

### 1. Root `_layout.tsx` - Add Stack.Screen Declarations

The root layout must explicitly declare each moved screen with proper navigation options:

```tsx
// apps/driver/app/_layout.tsx

<Stack
  screenOptions={{
    headerShown: false,
    freezeOnBlur: false, // Important for state preservation
  }}
>
  {/* Core routes */}
  <Stack.Screen name="index" options={{ headerShown: false }} />
  <Stack.Screen name="(auth)" options={{ headerShown: false }} />
  <Stack.Screen name="(app)" options={{ headerShown: false }} />

  {/* Moved screens - outside (app) drawer group */}
  <Stack.Screen
    name="sos-contacts"
    options={{
      headerShown: false,
      presentation: "card",
      animation: "slide_from_right",
      gestureEnabled: true,
    }}
  />
  <Stack.Screen
    name="ride-history"
    options={{
      headerShown: false,
      presentation: "card",
      animation: "slide_from_right",
      gestureEnabled: true,
    }}
  />
  <Stack.Screen
    name="notifications"
    options={{
      headerShown: false,
      presentation: "card",
      animation: "slide_from_right",
      gestureEnabled: true,
    }}
  />
  <Stack.Screen
    name="service-areas"
    options={{
      headerShown: false,
      presentation: "card",
      animation: "slide_from_right",
      gestureEnabled: true,
    }}
  />
  <Stack.Screen
    name="complaints"
    options={{
      headerShown: false,
      presentation: "card",
      animation: "slide_from_right",
      gestureEnabled: true,
    }}
  />
  <Stack.Screen
    name="profile-settings"
    options={{
      headerShown: false,
      presentation: "card",
      animation: "slide_from_right",
      gestureEnabled: true,
    }}
  />
</Stack>
```

**Key options explained:**

- `presentation: "card"` - Standard card-style push animation
- `animation: "slide_from_right"` - Consistent slide animation
- `gestureEnabled: true` - Allows swipe-back gesture
- `headerShown: false` - Each screen folder manages its own header

---

### 2. Screen Folder `_layout.tsx` - Self-Contained Header Management

Each moved screen folder needs its own `_layout.tsx` that handles headers internally:

```tsx
// apps/driver/app/sos-contacts/_layout.tsx

import { Container } from "@brocabs/ui/layout";
import { Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { Stack, router, useSegments } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "~/shared/ui/icons";

// Map segments to titles for dynamic header
const SOSContactsSegmentsMap: Record<string, string> = {
  "sos-contacts": "Emergency Contacts",
  index: "Emergency Contacts",
  "[id]": "Edit Emergency Contact",
  add: "Add Emergency Contact",
};

function SOSHeaderLeft({ canGoBack }: { canGoBack: boolean }) {
  const segments = useSegments();
  const lastSegment = segments[segments.length - 1] || "sos-contacts";
  const title = SOSContactsSegmentsMap[lastSegment] || "Emergency Contacts";

  return (
    <Container flexDirection="row" alignItems="center" gap={14}>
      {/* IMPORTANT: Navigate to (app)/home when no back history */}
      <TouchableOpacity
        onPress={() =>
          canGoBack ? router.back() : router.replace("/(app)/home")
        }
      >
        <Icon
          name="arrow-back"
          width={22}
          height={18}
          color={Colors["Primary/50"]}
        />
      </TouchableOpacity>
      <Regular fontSize={18} color="Primary/50">
        {title}
      </Regular>
    </Container>
  );
}

export default function SOSContactsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom }}>
      <Stack
        screenOptions={{
          animation: "slide_from_right",
          presentation: "card",
          headerShown: true,
          headerLeft: ({ canGoBack }) => (
            <SOSHeaderLeft canGoBack={!!canGoBack} />
          ),
          headerTitle: "",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors["Bg Color"],
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: "" }} />
        <Stack.Screen name="[id]" options={{ title: "" }} />
        <Stack.Screen name="add" options={{ title: "" }} />
      </Stack>
    </View>
  );
}
```

**Pattern highlights:**

- Use `useSegments()` to determine current route for dynamic titles
- Fall back to `router.replace("/(app)/home")` when `canGoBack` is false
- Handle safe area insets at the layout level
- Declare all nested screens explicitly

---

### 3. Drawer Navigation - Update Menu Items

The drawer content must navigate to the new root-level routes:

```tsx
// apps/driver/app/(app)/_layout.tsx - CustomDrawerContent

const menuItems = useMemo(
  () => [
    { label: t("drawer.myRidesHistory"), route: "ride-history" }, // Root route
    { label: t("drawer.notifications"), route: "notifications" }, // Root route
    { label: t("drawer.sosContacts"), route: "sos-contacts" }, // Root route
    { label: t("drawer.serviceAreas"), route: "service-areas" }, // Root route
    { label: t("drawer.makeComplaint"), route: "complaints" }, // Root route
    { label: t("drawer.support"), route: "profile-settings/support" }, // Nested under root
    { label: t("drawer.profileSettings"), route: "profile-settings" }, // Root route
  ],
  [t],
);

// Navigation handler uses router.push (not router.navigate to drawer screen)
const handleMenuPress = (route: string) => {
  props.navigation.closeDrawer();
  router.push(route);
};
```

---

### 4. Simplify `(app)/_layout.tsx` Drawer

Remove screens that were moved out:

```tsx
// apps/driver/app/(app)/_layout.tsx

export default function AppLayout() {
  return (
    <Drawer
      drawerContent={CustomDrawerContent}
      screenOptions={{...}}>
      {/* Only keep truly drawer-specific screens */}
      <Drawer.Screen
        name="home"
        options={{
          headerShown: false,
          title: "Home",
          drawerLabel: "Home",
        }}
      />
      <Drawer.Screen
        name="index"
        options={{
          headerShown: false,
          drawerItemStyle: { display: "none" },
        }}
      />
      {/* Remove ride-history, notifications, sos-contacts, etc. */}
    </Drawer>
  );
}
```

---

## Rider App Migration Checklist

### Step 1: Create Folder Structure

Move these folders from `apps/rider/app/(app)/` to `apps/rider/app/`:

- [ ] `ride-history/`
- [ ] `notifications/`
- [ ] `sos-contacts/`
- [ ] `favorite-addresses/`
- [ ] `profile-settings/`
- [ ] `complaints/`
- [ ] `bro-scholar/` (optional, if used as full-screen)

### Step 2: Update Root `_layout.tsx`

Add Stack.Screen declarations for each moved folder in `apps/rider/app/_layout.tsx`:

```tsx
<Stack screenOptions={{ headerShown: false }}>
  <Stack.Screen name="index" options={{ headerShown: false }} />
  <Stack.Screen name="(auth)" options={{ headerShown: false }} />
  <Stack.Screen name="(app)" options={{ headerShown: false }} />

  {/* Add these */}
  <Stack.Screen
    name="ride-history"
    options={{
      headerShown: false,
      presentation: "card",
      animation: "slide_from_right",
      gestureEnabled: true,
    }}
  />
  <Stack.Screen
    name="notifications"
    options={{
      headerShown: false,
      presentation: "card",
      animation: "slide_from_right",
      gestureEnabled: true,
    }}
  />
  <Stack.Screen
    name="sos-contacts"
    options={{
      headerShown: false,
      presentation: "card",
      animation: "slide_from_right",
      gestureEnabled: true,
    }}
  />
  <Stack.Screen
    name="favorite-addresses"
    options={{
      headerShown: false,
      presentation: "card",
      animation: "slide_from_right",
      gestureEnabled: true,
    }}
  />
  <Stack.Screen
    name="profile-settings"
    options={{
      headerShown: false,
      presentation: "card",
      animation: "slide_from_right",
      gestureEnabled: true,
    }}
  />
  <Stack.Screen
    name="complaints"
    options={{
      headerShown: false,
      presentation: "card",
      animation: "slide_from_right",
      gestureEnabled: true,
    }}
  />
</Stack>
```

### Step 3: Create `_layout.tsx` for Each Moved Folder

Each folder needs a `_layout.tsx` following the pattern shown above. Key things to include:

1. **Segment-to-title mapping** for dynamic headers
2. **Custom header component** with back button logic
3. **Safe area handling** via `useSafeAreaInsets()`
4. **Fallback navigation** to `/(app)/home` when no back history

### Step 4: Update Drawer Content

In `apps/rider/src/shared/ui/drawer-content.tsx`, update menu item routes:

```tsx
const menuItems = [
  { label: t("drawer.rideHistory"), route: "ride-history" },
  { label: t("drawer.notifications"), route: "notifications" },
  { label: t("drawer.favoriteAddresses"), route: "favorite-addresses" },
  { label: t("drawer.sosContacts"), route: "sos-contacts" },
  { label: t("drawer.complaints"), route: "complaints" },
  { label: t("drawer.profileSettings"), route: "profile-settings" },
];
```

### Step 5: Clean Up `(app)/_layout.tsx`

Remove Drawer.Screen declarations for moved screens from `apps/rider/app/(app)/_layout.tsx`.

### Step 6: Remove Unused Header Components

The shared headers in `apps/rider/src/shared/ui/headers.tsx` can be simplified or removed since each folder now manages its own header.

---

## Benefits After Refactor

| Aspect                | Before                  | After                      |
| --------------------- | ----------------------- | -------------------------- |
| **Gesture handling**  | Conflicts with drawer   | Clean swipe-back           |
| **Animation**         | Drawer re-renders       | Smooth stack transitions   |
| **Header management** | Centralized, complex    | Self-contained per feature |
| **Code organization** | Tightly coupled         | Feature-based isolation    |
| **Deep linking**      | Drawer context required | Direct route access        |

---

## Common Pitfalls to Avoid

1. **Don't forget the fallback navigation** - When `canGoBack` is false, use `router.replace("/(app)/home")` not `router.back()`

2. **Handle safe areas consistently** - Apply `paddingBottom: insets.bottom` at the layout level, not individual screens

3. **Use `presentation: "card"`** - This ensures proper stacking behavior vs modal presentation

4. **Set `freezeOnBlur: false`** if you need screens to stay mounted when navigating away

5. **Update TypeScript types** if using typed routes with `expo-router`

---

## Related Files Reference (Driver App)

| File                                                                                             | Purpose                                 |
| ------------------------------------------------------------------------------------------------ | --------------------------------------- |
| [apps/driver/app/\_layout.tsx](../apps/driver/app/_layout.tsx)                                   | Root stack with all screen declarations |
| [apps/driver/app/(app)/\_layout.tsx](<../apps/driver/app/(app)/_layout.tsx>)                     | Simplified drawer with only home        |
| [apps/driver/app/sos-contacts/\_layout.tsx](../apps/driver/app/sos-contacts/_layout.tsx)         | Example of moved screen layout          |
| [apps/driver/app/profile-settings/\_layout.tsx](../apps/driver/app/profile-settings/_layout.tsx) | Complex nested example                  |
| [apps/driver/app/ride-history/\_layout.tsx](../apps/driver/app/ride-history/_layout.tsx)         | Another example pattern                 |

---

## Timeline Estimate for Rider App

| Task                         | Estimated Time |
| ---------------------------- | -------------- |
| Move folder structure        | 15 min         |
| Update root `_layout.tsx`    | 20 min         |
| Create/update folder layouts | 1-2 hours      |
| Update drawer content        | 20 min         |
| Testing & fixes              | 1 hour         |
| **Total**                    | **~3-4 hours** |

---

_Document created: January 2026_  
_Based on: Driver App navigation refactor_
