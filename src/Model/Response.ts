import Contact from "./Contact";

class ResponseBody {
    private primaryContactId: number;
    private readonly emails: string[];
    private readonly phoneNumbers: string[];
    private readonly secondaryContactIds: number[];

    constructor(primaryContactId: number, phoneNumbers: string[], secondaryContactIds: number[], emails: string[]);
    constructor(contact: Contact);
    constructor(primaryContactIdOrContact: number | Contact, phoneNumbers?: string[], secondaryContactIds?: number[], emails?: string[]) {
        if (typeof primaryContactIdOrContact === 'number') {
            // Handle constructor with primaryContactId, phoneNumbers, secondaryContactIds, and emails parameters
            this.primaryContactId = primaryContactIdOrContact;
            this.phoneNumbers = phoneNumbers || [];
            this.secondaryContactIds = secondaryContactIds || [];
            this.emails = emails || [];
        } else {
            // Handle constructor with contact parameter
            const contact = primaryContactIdOrContact;
            this.primaryContactId = contact.id;
            this.phoneNumbers = [contact.phone_number || ''];
            this.emails = [contact.email || ''];
            this.secondaryContactIds = [];
        }
    }

    static fromJson(json: any): ResponseBody {
        return new ResponseBody(
            json.primaryContactId,
            [...json.phoneNumbers],
            [...json.secondaryContactIds],
            [...json.emails]
        );
    }

    addContact(contact: Contact): void {
        if (!this.emails.includes(contact.email!)) {
            this.emails.push(contact.email!);
        }
        if (!this.phoneNumbers.includes(contact.phone_number!)) {
            this.phoneNumbers.push(contact.phone_number!);
        }
        this.secondaryContactIds.push(contact.id!);
    }

    setPrimaryContactId(primaryContactId: number) {
        this.primaryContactId = primaryContactId;
    }

    getPrimaryContactId(): number {
        return this.primaryContactId;
    }

    setEmails(email: string): void {
        this.emails.push(email);
    }

    getEmails(): Array<string> {
        return this.emails;
    }

    setPhoneNumbers(phoneNumber: string): void {
        this.phoneNumbers.push(phoneNumber);
    }

    getPhoneNumbers(): Array<string> {
        return this.emails;
    }

    setSecondaryContactIds(secondaryContactId: number): void {
        this.secondaryContactIds.push(secondaryContactId);
    }

    getSecondaryContactIds(): Array<number> {
        return this.secondaryContactIds;
    }

    toJson(): any {
        return {
            "primaryContactId": this.primaryContactId,
            "emails": this.emails,
            "phoneNumbers": this.phoneNumbers,
            "secondaryContactIds": this.secondaryContactIds,
        }
    }
}

export default ResponseBody;