const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const singularize = (string) => {
  if (string.charAt(string.length - 1) === "s") return string.slice(0, string.length - 1);
  else return string;
};

const statusPriorityVal = (status) => {
  let ret;
  switch (status) {
    case "Planning":
      ret = 1;
      break;
    case "In Progress":
      ret = 2;
      break;
    case "Finished":
      ret = 3;
      break;
    case "Dropped":
      ret = 4;
      break;
    default:
      ret = 1;
  }
  return ret;
};

export { capitalize, singularize, statusPriorityVal };
