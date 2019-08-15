interface Connection {
  downlink: number;
  downlinkMax?: number;
  effectiveType: "slow-2g" | "2g" | "3g" | "4g";
  rtt?: number;
  saveData?: boolean;
  onChange?: () => void;
  [key: string]: any;
}

interface INavigator extends Navigator {
  connection?: Connection;
  mozConnection?: Connection;
  webkitConnection?: Connection;
}

const isNavigatorConnectionSupported = (
  navigator: INavigator
): Connection | false => {
  return (
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection ||
    false
  );
};

export const DEFAULT_CONNECTION_API: Connection = {
  downlink: Infinity,
  downlinkMax: Infinity,
  effectiveType: "4g",
  rtt: 0,
  saveData: false,
  onChange: () => void 0
};

const getNavigatorConnectionAPI = (navigator: INavigator): Connection => {
  const connectionAPI = isNavigatorConnectionSupported(navigator);

  if (!connectionAPI) {
    return DEFAULT_CONNECTION_API;
  }

  return Object.keys(connectionAPI).reduce((definition, key) => {
    if (definition[key] !== undefined) {
      return definition;
    }

    definition[key] = DEFAULT_CONNECTION_API[key];
    return definition;
  }, connectionAPI);
};

export default getNavigatorConnectionAPI;
