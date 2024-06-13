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
const express_1 = __importDefault(require("express"));
const Request_1 = __importDefault(require("./Model/Request"));
const Response_1 = __importDefault(require("./Model/Response"));
const ServicePostSQL_1 = __importDefault(require("./ServicePostSQL"));
const router = express_1.default.Router();
router.post("/identity", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const requestBody = Request_1.default.fromJson(req.body);
    if (requestBody.getPhoneNumber() == null || requestBody.getEmail() == null) {
        const contactsQuery = yield ServicePostSQL_1.default.retriveQuery(requestBody);
        const responseBody = new Response_1.default(contactsQuery[0]);
        for (let i = 1; i < contactsQuery.length; i++) {
            responseBody.addContact(contactsQuery[i]);
        }
        return res.status(200).json({
            "contact": responseBody,
        });
    }
    const contactsOr = yield ServicePostSQL_1.default.getContactsOr(requestBody);
    // console.log(contactsOr);
    if (contactsOr.length == 0) {
        const newContact = yield ServicePostSQL_1.default.saveContact(requestBody, 0, "primary");
        const responseBody = new Response_1.default(newContact);
        return res.status(200).json({
            "contact": responseBody,
        });
    }
    // const contactsAnd: Contact[] = await ServicePostSql.getContactsAnd(requestBody);
    // if (contactsAnd.length != 0) {
    //     const responseBody = new ResponseBody(contactsOr[0]);
    //     for (let i = 1; i < contactsOr.length; i++) {
    //         responseBody.addContact(contactsOr[i]);
    //     }
    //     return res.status(200).json({
    //         "contact": responseBody,
    //         "yes1": true,
    //     });
    // }
    const availability = { email: false, phoneNumber: false };
    for (const contact of contactsOr) {
        if (contact.email == requestBody.getEmail()) {
            availability.email = true;
        }
        if (contact.phone_number == requestBody.getPhoneNumber()) {
            availability.phoneNumber = true;
        }
        if (availability.email && availability.phoneNumber)
            break;
    }
    // console.log(contactsOr);
    if (!availability.email || !availability.phoneNumber) {
        const responseBody = new Response_1.default(contactsOr[0]);
        for (let i = 1; i < contactsOr.length; i++) {
            responseBody.addContact(contactsOr[i]);
        }
        const newContact = yield ServicePostSQL_1.default.saveContact(requestBody, (_a = contactsOr.at(contactsOr.length - 1)) === null || _a === void 0 ? void 0 : _a.id, "secondary");
        responseBody.addContact(newContact);
        return res.status(200).json({
            "contact": responseBody,
        });
    }
    else {
        const contactsQuery = yield ServicePostSQL_1.default.retriveQuery(requestBody);
        if (contactsQuery.length == 2) {
            const updateOrNot = yield ServicePostSQL_1.default.updateContacts(contactsQuery[1].id, contactsQuery[0].id, "secondary");
            if (updateOrNot) {
                contactsQuery[1].linked_id = contactsQuery[0].id;
                contactsQuery[1].linked_precedence = "secondary";
            }
            else
                return res.sendStatus(400);
        }
        const responseBody = new Response_1.default(contactsQuery[0]);
        for (let i = 1; i < contactsQuery.length; i++) {
            responseBody.addContact(contactsQuery[i]);
        }
        return res.status(200).json({
            "contact": responseBody,
        });
    }
}));
router.get("/_testing", (req, res) => {
    return res.status(200).json({
        "message": "Working fine",
    });
});
exports.default = router;
