import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const activeIndex = state.index;

  const tabWidthPercent = 100 / state.routes.length;

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      left: withSpring(`${activeIndex * tabWidthPercent}%`, {
        damping: 24,
        stiffness: 300,
        mass: 0.5,
      }),
    };
  }, [activeIndex]);

  const getIconName = (routeName: string): keyof typeof Feather.glyphMap => {
    switch (routeName) {
      case 'index':
        return 'home';
      case 'learn':
        return 'book-open';
      case 'ai-teacher':
        return 'smile';
      case 'chat':
        return 'message-circle';
      case 'profile':
        return 'user';
      default:
        return 'circle';
    }
  };

  const getTabLabel = (routeName: string): string => {
    switch (routeName) {
      case 'index':
        return 'Home';
      case 'learn':
        return 'Learn';
      case 'ai-teacher':
        return 'AI Teacher';
      case 'chat':
        return 'Chat';
      case 'profile':
        return 'Profile';
      default:
        return routeName;
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.tabBarInner}>
        {/* Animated Active Indicator Background Circle */}
        <Animated.View
          style={[
            styles.activeCircleIndicator,
            { width: `${tabWidthPercent}%` },
            indicatorStyle,
          ]}
        >
          <View style={styles.activeCircle} />
        </Animated.View>

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const iconName = getIconName(route.name);
          const label = getTabLabel(route.name);

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
            >
              {isFocused ? (
                <View style={styles.activeIconWrapper}>
                  <Feather name={iconName} size={24} color="#FFFFFF" />
                </View>
              ) : (
                <View style={styles.inactiveTabContent}>
                  <Feather name={iconName} size={22} color="#94A3B8" />
                  <Text style={styles.inactiveLabel} numberOfLines={1}>
                    {label}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  tabBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    height: 56,
  },
  activeCircleIndicator: {
    position: 'absolute',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  activeCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6C5CE7',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  tabButton: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  activeIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveTabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  inactiveLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
});
