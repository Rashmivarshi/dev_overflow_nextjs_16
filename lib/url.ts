import queryString from "query-string";

interface UrlProps {
  params: string;
  key: string;
  value: string | null;
}

interface RemoveUrlProps {
  params: string;
  keyToRemove: string[];
}

export const formUrlQuery = ({ params, key, value }: UrlProps) => {
  const currentUrl = queryString.parse(params);

  if (value === null) {
    delete currentUrl[key];
  } else {
    currentUrl[key] = value;
  }

  return queryString.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true },
  );
};

export const removeKeyFromUrl = ({ params, keyToRemove }: RemoveUrlProps) => {
  const currentUrl = queryString.parse(params);

  keyToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return queryString.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true },
  );
};
