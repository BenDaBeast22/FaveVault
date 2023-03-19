const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const singularize = (string) => {
  return string.slice(0, string.length - 1);
};

export { capitalize, singularize };
