import { getCache, setCache } from "./cache.js";
export const setThemeCacheOfConfig = (key, value) => {
  console.log(value);
  const history = getCache(key);
  setCache("theme", { ...history, [key]: value });
};

/**获取主题所有配置缓存，并转成arry格式 */
export const getThemeCacheOfConfig = () => {
  const theme = getCache("theme") || {};
  return Object.entries(theme).map((item) => {
    const [key, value] = item;
    return `${key}-${value}`;
  });
};
//获取单个主题缓存值
export const getThemeCaheByKey = (key) => {
  const config = getCache("theme") || {};
  return config[key];
};
