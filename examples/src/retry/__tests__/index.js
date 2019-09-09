"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require("../"));
const delayedResolve = (status, message, delay = 1000) => {
    if (status < 300) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ status, message });
            }, delay);
        });
    }
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject({ status, message });
        }, delay);
    });
};
jest.disableAutomock();
describe("RetryStrategy", () => {
    afterEach(() => {
        jest.useRealTimers();
    });
    it("first request resolves in time", () => __awaiter(this, void 0, void 0, function* () {
        const createPromise = jest
            .fn()
            .mockReturnValue(delayedResolve(200, "first success", 100));
        const data = yield __1.default(createPromise, {
            timeout: 200
        });
        expect(createPromise).toHaveBeenCalledTimes(1);
        expect(data).toEqual({ status: 200, message: "first success" });
    }));
    it("all requests reject and status is retryable", () => {
        const createPromise = jest
            .fn()
            .mockReturnValue(delayedResolve(408, "dead", 150));
        return __1.default(createPromise, {
            timeout: 200
        }).catch(errors => {
            expect(errors).toEqual([
                { status: 408, message: "dead" },
                { status: 408, message: "dead" },
                { status: 408, message: "dead" },
                { status: 408, message: "dead" }
            ]);
        });
    });
    it("requests rejects and status is not retryable", () => __awaiter(this, void 0, void 0, function* () {
        const createPromise = jest
            .fn()
            .mockReturnValue(delayedResolve(402, "dead", 150));
        const errors = yield __1.default(createPromise, {
            timeout: 200
        }).catch(e => e);
        expect(createPromise).toHaveBeenCalledTimes(1);
        expect(errors).toEqual([{ status: 402, message: "dead" }]);
    }));
    it("first request is slow, but faster than retried one", () => __awaiter(this, void 0, void 0, function* () {
        const createPromise = jest
            .fn()
            .mockReturnValueOnce(delayedResolve(200, "first resolve", 220))
            .mockReturnValueOnce(delayedResolve(200, "second resolve", 320));
        const data = yield __1.default(createPromise, {
            retryCount: 2,
            timeout: 200
        });
        expect(createPromise).toHaveBeenCalledTimes(2);
        expect(data).toEqual({ status: 200, message: "first resolve" });
    }));
    it("first request is slow, retried one is faster", () => __awaiter(this, void 0, void 0, function* () {
        const createPromise = jest
            .fn()
            .mockReturnValueOnce(delayedResolve(200, "first resolve", 800))
            .mockReturnValueOnce(delayedResolve(200, "second resolve", 100));
        const data = yield __1.default(createPromise, { timeout: 200 });
        expect(createPromise).toHaveBeenCalledTimes(2);
        expect(data).toEqual({ status: 200, message: "second resolve" });
    }));
    it("first request is slow, retried one times out", () => {
        jest.useFakeTimers();
        const createPromise = jest
            .fn()
            .mockReturnValueOnce(delayedResolve(200, "first resolve", 250))
            .mockReturnValueOnce(delayedResolve(408, "last reject", 50));
        __1.default(createPromise, { timeout: 200, retryCount: 2 })
            .then(data => {
            expect(createPromise).toHaveBeenCalledTimes(2);
            expect(data).toEqual({ status: 200, message: "first resolve" });
        });
        jest.advanceTimersByTime(300);
    });
    it("retries if first one times out", () => __awaiter(this, void 0, void 0, function* () {
        const createPromise = jest
            .fn()
            .mockReturnValueOnce(delayedResolve(408, "first reject", 100))
            .mockReturnValueOnce(delayedResolve(200, "second resolve", 10));
        const data = yield __1.default(createPromise, { timeout: 200 });
        expect(data).toEqual({ status: 200, message: "second resolve" });
        expect(createPromise).toHaveBeenCalledTimes(2);
    }));
});
