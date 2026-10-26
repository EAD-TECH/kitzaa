export const redirectExternal = (url: string) => {
  const target = new URL(url, window.location.origin);
  window.location.replace(target.href);
};
