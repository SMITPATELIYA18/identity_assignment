interface Contact {
    id: number;
    phone_number: string | null;
    email: string | null;
    linked_id: number;
    linked_precedence: string;
    created_at: Date | null;
    updated_at: Date | null;
    deleted_at: Date | null;
}

export default Contact;