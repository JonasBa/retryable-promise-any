declare module "utils/anyPromise" {
    const anyPromise: <T>(promises: Promise<T>[]) => Promise<T>;
    export default anyPromise;
}
declare module "retryablePromiseAny" {
    export type RetryStrategyOptions = {
        timeout: number;
        retryCount: number;
        retryStatuses: number[];
    };
    type PartialRetryStrategyOptions = {
        [T in keyof RetryStrategyOptions]?: RetryStrategyOptions[T];
    };
    const retryablePromiseAny: <T>(createPromise: (options: RetryStrategyOptions) => Promise<T>, options?: PartialRetryStrategyOptions) => Promise<T>;
    export default retryablePromiseAny;
}
declare module "index" {
    export * from "retryablePromiseAny";
    export { default } from "retryablePromiseAny";
}
