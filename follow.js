"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
axios_1.default.post('https://md.otofune.net/users/otofune/inbox', require('fs').readFileSync('fake3.json'), {
    headers: {
        'Content-Type': 'application/activity+json',
        'Signature': 'keyId="https://a223ccf9.ngrok.io/@fake3#key",headers="(request-target) host date",signature="ldMYVSSGCgcBJbqceV/6m03PoHz0NusQVJb8MdbJTYbC522XsnxTehZJZtY2xaqYmtsri90MfOLh12Li032p+4zaPiAiYLnRIJOFXrdZDWeLu0U3MsPorujrbbtGQGryr4O5MPYByfhZuAS/LmYZyRTi0NAD9zCggxH+yJCuExXA5tc/JBFZDY9LSWMvEEwmj996G5k+wKNIzt5MPdKnx1WAX1699bwCxOIB/FDy0JKyLN4Yx28afKw8q4OhcGxnbG4NwHvVNkcf8LHNRSIRyxN7aEszAlqUobked2TCeIXYKTjjfp7JwPDqTWC5+z8cIEW6Oy6+8U2PQutgsUcSeg=="',
        Date: 'Tue, 18 Sep 2018 07:37:04 GMT'
    }
}).then(console.dir).catch(console.error);
