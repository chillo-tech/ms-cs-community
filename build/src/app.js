"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const serve_favicon_1 = __importDefault(require("serve-favicon"));
const dotenv_1 = __importDefault(require("dotenv"));
const connect_1 = require("./components/db/connect");
const suggest_routes_1 = __importDefault(require("./components/suggest/suggest.routes"));
const jwt_routes_1 = __importDefault(require("./components/jwt/jwt.routes"));
dotenv_1.default.config();
const port = process.env.PORT || 9000;
const app = (0, express_1.default)();
app
    .use((0, cors_1.default)({
    origin: '*',
}))
    .use(express_1.default.json())
    .use((0, morgan_1.default)('dev'));
app
    .use('/public', express_1.default.static('assets'))
    .use((0, serve_favicon_1.default)('./assets/images/favicon.ico'));
app.get('/', (req, res) => {
    res.send('it works. Done by BrightkyEfoo');
});
app.use('/api/v1/suggest', suggest_routes_1.default);
app.use('/api/v1/tokens', jwt_routes_1.default);
// Do your logic here
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server listening on port ${port}`);
    const res = yield (0, connect_1.dbInit)();
    if (res)
        console.log('succesfully connected to mongodb');
}));
