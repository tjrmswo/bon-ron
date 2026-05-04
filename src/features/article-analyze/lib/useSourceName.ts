import { useState, useEffect } from "react";
import { getSourceName } from "./newspaperFormat";

export function useSourceName(url: string) {
  const [sourceName, setSourceName] = useState('');

  useEffect(() => {
    const fetch = async () => {
      const name = await getSourceName(url);
      setSourceName(name);
    };

    fetch();
  }, [url]);

  return sourceName;
}
