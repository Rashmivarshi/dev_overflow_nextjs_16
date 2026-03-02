import queryString from "query-string";

interface urlProps {
  params: string;
  key: string;
  value: string;
}
interface RemoveurlProps {
  params: string;
  keyToRemove: string[];
}
export const formUrlQuery = ({ params, key, value }: urlProps) => {
  const currentUrl = queryString.parse(params);
  currentUrl[key] = value;

  return queryString.stringifyUrl({
    url: window.location.pathname,
    query: currentUrl,
  });
};

export const RemoveKeyFromUrl = ({ params, keyToRemove }: RemoveurlProps) => {
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
