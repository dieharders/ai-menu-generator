export const waitForTimeout = (timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};
