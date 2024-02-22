import { getCache, setCache } from "./cache.js";
export const setThemeCacheOfConfig = (key, value) => {
  const history = getCache(key);
  setCache("theme", { ...history, [key]: value });
};

export const getThemeCacheOfConfig = () => {
  const theme = getCache("theme");
  return Object.entries(theme).map((item) => {
    const [key, value] = item;
    return `${key}-${value}`;
  });
};
