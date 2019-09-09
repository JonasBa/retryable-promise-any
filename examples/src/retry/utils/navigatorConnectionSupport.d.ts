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
export declare const DEFAULT_CONNECTION_API: Connection;
declare const getNavigatorConnectionAPI: (navigator: INavigator) => Connection;
export default getNavigatorConnectionAPI;
