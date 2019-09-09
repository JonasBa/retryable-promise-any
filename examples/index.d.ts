export declare type RetryStrategyOptions = {
    timeout: number;
    retryCount: number;
    retryStatuses: number[];
};
declare type PartialRetryStrategyOptions = {
    [T in keyof RetryStrategyOptions]?: RetryStrategyOptions[T];
};
declare const RetryStrategy: (createPromise: (options: RetryStrategyOptions) => Promise<any>, options?: PartialRetryStrategyOptions) => Promise<any>;
export default RetryStrategy;
