export const getColors = (theme: 'dark' | 'light' = 'light') => {
  if (theme === 'dark') {
    return ['var(--dsw-color-bg-2)', '#182131', '#182123'];
  }

  return ['var(--dsw-color-bg-2)', '#eef4ff', '#eef4f1'];
};
