export function hasCompletedOnboarding(
  profileOnboardingCompleted: boolean | null | undefined,
  localOnboardingComplete: boolean,
): boolean {
  if (profileOnboardingCompleted === true) return true;
  return localOnboardingComplete;
}
