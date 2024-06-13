"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseBody {
    constructor(primaryContactIdOrContact, phoneNumbers, secondaryContactIds, emails) {
        if (typeof primaryContactIdOrContact === 'number') {
            // Handle constructor with primaryContactId, phoneNumbers, secondaryContactIds, and emails parameters
            this.primaryContactId = primaryContactIdOrContact;
            this.phoneNumbers = phoneNumbers || [];
            this.secondaryContactIds = secondaryContactIds || [];
            this.emails = emails || [];
        }
        else {
            // Handle constructor with contact parameter
            const contact = primaryContactIdOrContact;
            this.primaryContactId = contact.id;
            this.phoneNumbers = [contact.phone_number || ''];
            this.emails = [contact.email || ''];
            this.secondaryContactIds = [];
        }
    }
    static fromJson(json) {
        return new ResponseBody(json.primaryContactId, [...json.phoneNumbers], [...json.secondaryContactIds], [...json.emails]);
    }
    addContact(contact) {
        if (!this.emails.includes(contact.email)) {
            this.emails.push(contact.email);
        }
        if (!this.phoneNumbers.includes(contact.phone_number)) {
            this.phoneNumbers.push(contact.phone_number);
        }
        this.secondaryContactIds.push(contact.id);
    }
    setPrimaryContactId(primaryContactId) {
        this.primaryContactId = primaryContactId;
    }
    getPrimaryContactId() {
        return this.primaryContactId;
    }
    setEmails(email) {
        this.emails.push(email);
    }
    getEmails() {
        return this.emails;
    }
    setPhoneNumbers(phoneNumber) {
        this.phoneNumbers.push(phoneNumber);
    }
    getPhoneNumbers() {
        return this.emails;
    }
    setSecondaryContactIds(secondaryContactId) {
        this.secondaryContactIds.push(secondaryContactId);
    }
    getSecondaryContactIds() {
        return this.secondaryContactIds;
    }
    toJson() {
        return {
            "primaryContactId": this.primaryContactId,
            "emails": this.emails,
            "phoneNumbers": this.phoneNumbers,
            "secondaryContactIds": this.secondaryContactIds,
        };
    }
}
exports.default = ResponseBody;
