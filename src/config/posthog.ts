import Constants from 'expo-constants';
import PostHog from 'posthog-react-native';

type PostHogExtra = {
  POSTHOG_PROJECT_TOKEN?: string;
  POSTHOG_HOST?: string;
};

const extra = (Constants.expoConfig?.extra?.posthog ?? {}) as PostHogExtra;
const projectToken =
  process.env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN ||
  extra.POSTHOG_PROJECT_TOKEN ||
  process.env.POSTHOG_PROJECT_TOKEN;

const host =
  process.env.EXPO_PUBLIC_POSTHOG_HOST ||
  extra.POSTHOG_HOST ||
  process.env.POSTHOG_HOST;

if (__DEV__ && (!projectToken || !host)) {
  console.warn(
    '[PostHog] POSTHOG_PROJECT_TOKEN or POSTHOG_HOST environment variable is missing. PostHog tracking will be disabled.',
  );
}

export const posthog = projectToken && host
  ? new PostHog(projectToken, { host })
  : null;

