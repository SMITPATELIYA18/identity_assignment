import Contact from "./Model/Contact";
import connection from "./database";
import RequestBody from "./Model/Request";

class ServicePostSql {
    static async getContactsOr(requestBody: RequestBody): Promise<Contact[]> {
        return new Promise<Contact[]>((resolve, reject) => {
            const query: string = 'SELECT * FROM public."contacts" WHERE phone_number = $1 OR' +
                " email = $2" +
                " ORDER BY linked_id, created_at, id";
            connection.query(query, [requestBody.getPhoneNumber(), requestBody.getEmail()], (err, result) => {
                if (err)
                    reject(err);
                else {
                    const contacts: Contact[] = result.rows as Contact[];
                    // console.log(result);
                    resolve(contacts);
                }
            });
        });
    }

    static async getContactsAnd(requestBody: RequestBody): Promise<Contact[]> {
        return new Promise<Contact[]>((resolve, reject) => {
            const query: string = 'SELECT * FROM public."contacts" WHERE phone_number = $1 AND' +
                " email = $2" +
                " ORDER BY linked_id";
            connection.query(query, [requestBody.getPhoneNumber(), requestBody.getEmail()], (err, result) => {
                if (err)
                    reject(err);
                else {
                    const contacts: Contact[] = result.rows as Contact[];
                    resolve(contacts);
                }
            });
        });
    }

    static async getContactById(id: number): Promise<Contact> {
        return new Promise<Contact>((resolve, reject) => {
            const query: string = 'SELECT * FROM public."contacts" WHERE id = $1';
            // const [results, metadata] = connection.execute(query, [id]);

            connection.query(query, [id], (err, result) => {
                if (err)
                    reject(err);
                else {
                    const contact: Contact = result.rows[0] as Contact;
                    resolve(contact);
                }
            });
        });
    }

    static async saveContact(requestBody: RequestBody, linkedId: number, linkPrecedence: string): Promise<Contact> {
        return new Promise<Contact>((resolve, reject) => {
            const query: string = 'INSERT INTO public."contacts" (phone_number, email,' +
                ' linked_id,  linked_precedence) VALUES ($1, $2, $3, $4) RETURNING id';

            connection.query(query, [requestBody.getPhoneNumber(), requestBody.getEmail(), linkedId == 0 ? null : linkedId, linkPrecedence], (err, result) => {
                if (err)
                    reject(err);
                else {
                    const createdId: number = result.rows[0].id;
                    this.getContactById(createdId).then((contact: Contact) =>
                        resolve(contact)
                    ).catch((err) => reject(err));
                }
            })
        })
    }

    static async updateContacts(id: number, linkedId: number, precedence: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const query: string = 'UPDATE public."contacts" SET linked_id=$1,' +
                " linked_precedence=$2 WHERE id=$3";
            connection.query(query, [linkedId, precedence, id], (err, result) => {
                if (err)
                    reject(err);
                else {
                    resolve(true);
                }
            })
        });
    }

    static async retriveQuery(requestBody: RequestBody): Promise<Contact[]> {
        const email = requestBody.getEmail();
        const phoneNumber = requestBody.getPhoneNumber();
        return new Promise<Contact[]>((resolve, reject) => {
            const query: string = 'SELECT * FROM ( SELECT * FROM public."contacts"' +
                " WHERE email = $1 OR phone_number = $2" +
                ' UNION SELECT c.* FROM public."contacts" c INNER JOIN public."contacts" linked ON c.id =' +
                " linked.linked_id" +
                " WHERE linked.email = $3 OR linked.phone_number = $4" +
                " ) AS combined_results" +
                " ORDER BY linked_id desc";
            connection.query(query, [email, phoneNumber, email, phoneNumber], (err, result) => {
                if (err)
                    reject(err);
                else {
                    console.log(result.rows);
                    resolve(result.rows as Contact[]);
                }
            })
        })
    }
}

export default ServicePostSql;