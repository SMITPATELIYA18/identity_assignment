class RequestBody {
    private email: string;
    private phoneNumber: string;

    constructor(email: string, phoneNumber: string) {
        this.email = email;
        this.phoneNumber = phoneNumber;
    }

    static fromJson(json: any): RequestBody {
        return new RequestBody(json.email, json.phoneNumber);
    }

    setEmail(email: string): void {
        this.email = email;
    }

    setPhoneNumber(phoneNumber: string): void {
        this.phoneNumber = phoneNumber;
    }

    getEmail(): string {
        return this.email;
    }

    getPhoneNumber(): string {
        return this.phoneNumber;
    }

    toJson(): any {
        return {
            "email": this.email,
            "phoneNumber": this.phoneNumber,
        }
    }
}

export default RequestBody;