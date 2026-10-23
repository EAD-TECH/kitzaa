type ProfileFields = {
  username?: string | null;
  location?: {
    zipCode?: string | null;
    city?: string | null;
    state?: string | null;
  } | null;
};

export function isProfileComplete(user: ProfileFields): boolean {
  const location = user.location;
  return Boolean(
    user.username &&
      location?.zipCode &&
      location.city &&
      location.state,
  );
}
