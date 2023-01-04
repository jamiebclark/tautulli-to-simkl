var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var API_BASE = "".concat(process.env.TAUTILLI_API_BASE, "/api/v2");
import fetch from 'node-fetch';
function getDate(numericDate) {
    var d = new Date(numericDate * 1000);
    return [d.getFullYear(), '-', d.getMonth() + 1, '-', d.getDate(), ' ', d.getHours(), ':', d.getMinutes(), ':', d.getSeconds()].map(function (x) {
        if (typeof x === 'number') {
            return "".concat(x).padStart(2, '0');
        }
        return x;
    }).join('');
}
export function getApiCmd(cmd, params) {
    var q = __assign({ apikey: process.env.TAUTILLI_API_KEY, user: process.env.TAUTILLI_USER, cmd: cmd }, params);
    return API_BASE + "?" + new URLSearchParams(Object.keys(q).map(function (key) { return [key, q[key]]; })).toString();
}
function formatGuids(guidsList) {
    return guidsList.reduce(function (acc, guid) {
        var _a;
        var _b = guid.split('://'), idKey = _b[0], idValue = _b[1];
        return __assign(__assign({}, acc), (_a = {}, _a[idKey] = /^[0-9]+$/.exec(idValue) ? parseInt(idValue, 10) : idValue, _a));
    }, {});
}
export function getHistory(before, updatePayload) {
    if (updatePayload === void 0) { updatePayload = { movies: [], episodes: [] }; }
    return __awaiter(this, void 0, void 0, function () {
        var params, url, response, data, results, earliestDate, _i, results_1, entry, mediaKey, entryResponse, entryData, _a, guids, grandparent_guids, ids;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    params = {};
                    if (before) {
                        params.before = before;
                        console.log('Looking before: ', before);
                    }
                    url = getApiCmd('get_history', params);
                    return [4 /*yield*/, fetch(url)];
                case 1:
                    response = _b.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = (_b.sent());
                    results = data.response.data.data;
                    if (!results.length) {
                        return [2 /*return*/, updatePayload];
                    }
                    _i = 0, results_1 = results;
                    _b.label = 3;
                case 3:
                    if (!(_i < results_1.length)) return [3 /*break*/, 7];
                    entry = results_1[_i];
                    if (entry.percent_complete <= 90) {
                        return [3 /*break*/, 6];
                    }
                    mediaKey = entry.media_type === 'movie' ? 'movies' : 'episodes';
                    return [4 /*yield*/, fetch(getApiCmd('get_metadata', { rating_key: entry.rating_key }))];
                case 4:
                    entryResponse = _b.sent();
                    return [4 /*yield*/, entryResponse.json()];
                case 5:
                    entryData = (_b.sent());
                    _a = entryData.response.data, guids = _a.guids, grandparent_guids = _a.grandparent_guids;
                    if (!earliestDate || entry.date < earliestDate) {
                        earliestDate = entry.date;
                    }
                    if (!guids || !guids.length) {
                        return [3 /*break*/, 6];
                    }
                    switch (mediaKey) {
                        case 'episodes':
                            updatePayload[mediaKey].push({
                                title: entry.grandparent_title,
                                ids: formatGuids(grandparent_guids),
                                seasons: [
                                    {
                                        number: entry.parent_media_index,
                                        episodes: [
                                            {
                                                number: entry.media_index,
                                                watched_at: getDate(entry.date),
                                            }
                                        ]
                                    }
                                ]
                            });
                            break;
                        case 'movies':
                            ids = guids.reduce(function (acc, guid) {
                                var _a;
                                var _b = guid.split('://'), idKey = _b[0], idValue = _b[1];
                                return __assign(__assign({}, acc), (_a = {}, _a[idKey] = /^[0-9]+$/.exec(idValue) ? parseInt(idValue, 10) : idValue, _a));
                            }, {});
                            updatePayload[mediaKey].push({
                                title: entry.title,
                                watched_at: getDate(entry.date),
                                ids: ids
                            });
                            break;
                    }
                    _b.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 3];
                case 7:
                    if (getDate(earliestDate) === before) {
                        return [2 /*return*/, updatePayload];
                    }
                    return [2 /*return*/, getHistory(getDate(earliestDate), updatePayload)];
            }
        });
    });
}
//# sourceMappingURL=tautulli.js.map