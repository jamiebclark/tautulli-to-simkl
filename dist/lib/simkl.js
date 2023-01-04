var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import dotenv from "dotenv";
dotenv.config();
import fs from 'fs';
import fetch from 'node-fetch';
var AUTH_TOKEN_FILE_PATH = './auth.json';
function getAuthCode() {
    return __awaiter(this, void 0, void 0, function () {
        var apiUrl;
        return __generator(this, function (_a) {
            apiUrl = "https://api.simkl.com/oauth/pin?" +
                new URLSearchParams([
                    ["client_id", process.env.SIMKL_CLIENT_ID],
                ]).toString();
            return [2 /*return*/, fetch(apiUrl)];
        });
    });
}
export function getAuthToken() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var authTokenFile, response, authPayload, timer, intervalTimer, intervalExpires, interval;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (fs.existsSync(AUTH_TOKEN_FILE_PATH)) {
                                    authTokenFile = JSON.parse(fs.readFileSync(AUTH_TOKEN_FILE_PATH, 'utf-8'));
                                    return [2 /*return*/, resolve(authTokenFile.access_token)];
                                }
                                return [4 /*yield*/, getAuthCode()];
                            case 1:
                                response = _a.sent();
                                return [4 /*yield*/, response.json()];
                            case 2:
                                authPayload = (_a.sent());
                                console.clear();
                                console.log('Authorization required');
                                console.log("To authorize, visit: ".concat(authPayload.verification_url, " (Ctrl-click to launch in your browser) and enter the code: ").concat(authPayload.user_code));
                                console.log('This script will update automatically');
                                timer = 0;
                                intervalTimer = authPayload.interval * 1000;
                                intervalExpires = authPayload.expires_in * 1000;
                                interval = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                                    var response, checkinPayload;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, fetch("https://api.simkl.com/oauth/pin/".concat(authPayload.user_code, "?client_id=").concat(process.env.SIMKL_CLIENT_ID))];
                                            case 1:
                                                response = _a.sent();
                                                return [4 /*yield*/, response.json()];
                                            case 2:
                                                checkinPayload = (_a.sent());
                                                if (checkinPayload.result === 'OK') {
                                                    console.log('Authorization complete. Saving authorization token so we can skip this next time.');
                                                    fs.writeFileSync(AUTH_TOKEN_FILE_PATH, JSON.stringify(checkinPayload), "utf-8");
                                                    resolve(checkinPayload.access_token);
                                                    clearInterval(interval);
                                                }
                                                timer += intervalTimer;
                                                if (timer >= intervalExpires) {
                                                    console.log('Authorization timed out. Please restart the script.');
                                                    reject('Timeout');
                                                }
                                                return [2 /*return*/];
                                        }
                                    });
                                }); }, intervalTimer);
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
export function updateHistory(body) {
    return __awaiter(this, void 0, void 0, function () {
        var token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAuthToken()];
                case 1:
                    token = _a.sent();
                    return [2 /*return*/, fetch('https://api.simkl.com/sync/history', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: "Bearer ".concat(token),
                                'simkl-api-key': process.env.SIMKL_CLIENT_ID,
                            },
                            body: JSON.stringify(body)
                        })];
            }
        });
    });
}
//# sourceMappingURL=simkl.js.map