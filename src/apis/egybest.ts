const EGYBEST_API = {
  search: (name: string) => {
    return 'https://geer.egybest.cool/autoComplete.php?q=' + encodeURI(name);
  },
  movieUrl: (name: string) => {
    return `https://geer.egybest.cool/movie/${name}/#download`;
  },
  movieRedirect: (apiCall: string) => {
    return `https://geer.egybest.cool${apiCall}`;
  },
};

export { EGYBEST_API };
