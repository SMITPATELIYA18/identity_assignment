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
const database_1 = __importDefault(require("./database"));
class ServicePostSql {
    static getContactsOr(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const query = 'SELECT * FROM public."contacts" WHERE phone_number = $1 OR' +
                    " email = $2" +
                    " ORDER BY linked_id, created_at, id";
                database_1.default.query(query, [requestBody.getPhoneNumber(), requestBody.getEmail()], (err, result) => {
                    if (err)
                        reject(err);
                    else {
                        const contacts = result.rows;
                        // console.log(result);
                        resolve(contacts);
                    }
                });
            });
        });
    }
    static getContactsAnd(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const query = 'SELECT * FROM public."contacts" WHERE phone_number = $1 AND' +
                    " email = $2" +
                    " ORDER BY linked_id";
                database_1.default.query(query, [requestBody.getPhoneNumber(), requestBody.getEmail()], (err, result) => {
                    if (err)
                        reject(err);
                    else {
                        const contacts = result.rows;
                        resolve(contacts);
                    }
                });
            });
        });
    }
    static getContactById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const query = 'SELECT * FROM public."contacts" WHERE id = $1';
                // const [results, metadata] = connection.execute(query, [id]);
                database_1.default.query(query, [id], (err, result) => {
                    if (err)
                        reject(err);
                    else {
                        const contact = result.rows[0];
                        resolve(contact);
                    }
                });
            });
        });
    }
    static saveContact(requestBody, linkedId, linkPrecedence) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const query = 'INSERT INTO public."contacts" (phone_number, email,' +
                    ' linked_id,  linked_precedence) VALUES ($1, $2, $3, $4) RETURNING id';
                database_1.default.query(query, [requestBody.getPhoneNumber(), requestBody.getEmail(), linkedId == 0 ? null : linkedId, linkPrecedence], (err, result) => {
                    if (err)
                        reject(err);
                    else {
                        const createdId = result.rows[0].id;
                        this.getContactById(createdId).then((contact) => resolve(contact)).catch((err) => reject(err));
                    }
                });
            });
        });
    }
    static updateContacts(id, linkedId, precedence) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const query = 'UPDATE public."contacts" SET linked_id=$1,' +
                    " linked_precedence=$2 WHERE id=$3";
                database_1.default.query(query, [linkedId, precedence, id], (err, result) => {
                    if (err)
                        reject(err);
                    else {
                        resolve(true);
                    }
                });
            });
        });
    }
    static retriveQuery(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = requestBody.getEmail();
            const phoneNumber = requestBody.getPhoneNumber();
            return new Promise((resolve, reject) => {
                const query = 'SELECT * FROM ( SELECT * FROM public."contacts"' +
                    " WHERE email = $1 OR phone_number = $2" +
                    ' UNION SELECT c.* FROM public."contacts" c INNER JOIN public."contacts" linked ON c.id =' +
                    " linked.linked_id" +
                    " WHERE linked.email = $3 OR linked.phone_number = $4" +
                    " ) AS combined_results" +
                    " ORDER BY linked_id desc";
                database_1.default.query(query, [email, phoneNumber, email, phoneNumber], (err, result) => {
                    if (err)
                        reject(err);
                    else {
                        console.log(result.rows);
                        resolve(result.rows);
                    }
                });
            });
        });
    }
}
exports.default = ServicePostSql;
