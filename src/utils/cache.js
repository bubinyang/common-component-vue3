export const setCache = (key, value, isSessionStorage) => {
  const actionSession = isSessionStorage ? sessionStorage : localStorage;
  actionSession.setItem(key, value.constructor === Object ? JSON.stringify(value) : value);
};

export const getCache = (key, isSessionStorage) => {
  const getSession = isSessionStorage ? sessionStorage : localStorage;
  return JSON.parse(getSession.getItem(key));
};
