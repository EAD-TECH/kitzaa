
export const toUserDTO = (user) => {

    // find dizi dondurdugu icin list yaparken buraya dusmuyordu. result dizisinde birden fazla obje olabilirdi o yuzden asagidaki dizi mi kontrolunu yaptik.
  if (Array.isArray(user)) {
    return user.map((item) => toUserDTO(item));
  }

  if (!user) return null;

  return {
    id: user._id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    language: user.language,
    location: user.location,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};