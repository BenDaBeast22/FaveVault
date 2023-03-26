const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const singularize = (string) => {
  if (string.charAt(string.length - 1) === "s") return string.slice(0, string.length - 1);
  else return string;
};

export { capitalize, singularize };
