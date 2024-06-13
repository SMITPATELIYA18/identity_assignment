"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RequestBody {
    constructor(email, phoneNumber) {
        this.email = email;
        this.phoneNumber = phoneNumber;
    }
    static fromJson(json) {
        return new RequestBody(json.email, json.phoneNumber);
    }
    setEmail(email) {
        this.email = email;
    }
    setPhoneNumber(phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    getEmail() {
        return this.email;
    }
    getPhoneNumber() {
        return this.phoneNumber;
    }
    toJson() {
        return {
            "email": this.email,
            "phoneNumber": this.phoneNumber,
        };
    }
}
exports.default = RequestBody;
