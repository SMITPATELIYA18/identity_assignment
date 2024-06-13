"use strict";
// import Contact from "./Model/Contact";
// import connection from "./database";
// import RequestBody from "./Model/RequestMySQL";
// import {ResultSetHeader} from "mysql2";
//
// class ServiceMySql {
//     static async getContactsOr(requestBody: RequestBody): Promise<Contact[]> {
//         return new Promise<Contact[]>((resolve, reject) => {
//             const query: string = "SELECT * FROM contacts WHERE phone_number = ? OR email = ?" +
//                 " ORDER BY linked_id, created_at, id";
//             connection.query(query, [requestBody.getPhoneNumber(), requestBody.getEmail()], (err, result) => {
//                 if (err)
//                     reject(err);
//                 else {
//                     const contacts: Contact[] = result as Contact[];
//                     // console.log(result);
//                     resolve(contacts);
//                 }
//             });
//         });
//     }
//
//     static async getContactsAnd(requestBody: RequestBody): Promise<Contact[]> {
//         return new Promise<Contact[]>((resolve, reject) => {
//             const query: string = "SELECT * FROM contacts WHERE phone_number = ? AND email = ?" +
//                 " ORDER BY linked_id";
//             connection.query(query, [requestBody.getPhoneNumber(), requestBody.getEmail()], (err, result) => {
//                 if (err)
//                     reject(err);
//                 else {
//                     const contacts: Contact[] = result as Contact[];
//                     resolve(contacts);
//                 }
//             });
//         });
//     }
//
//     static async getContactById(id: number): Promise<Contact> {
//         return new Promise<Contact>((resolve, reject) => {
//             const query: string = "SELECT * FROM contacts WHERE id = ?";
//             // const [results, metadata] = connection.execute(query, [id]);
//
//             connection.execute(query, [id], (err, result) => {
//                 if (err)
//                     reject(err);
//                 else {
//                     // @ts-ignore
//                     const contact: Contact = result[0] as Contact;
//                     resolve(contact);
//                 }
//             });
//         });
//     }
//
//     static async saveContact(requestBody: RequestBody, linkedId: number, linkPrecedence: string): Promise<Contact> {
//         return new Promise<Contact>((resolve, reject) => {
//             const query: string = "INSERT INTO contacts SET phone_number = ?, email = ?," +
//                 " linked_id = ?, linked_precedence = ?"; // linked_id = ?, linkedId
//             connection.execute(query, [requestBody.getPhoneNumber(), requestBody.getEmail(), linkedId == 0 ? null : linkedId, linkPrecedence], (err, result) => {
//                 if (err)
//                     reject(err);
//                 else {
//                     const resultSetHeader: ResultSetHeader = result as ResultSetHeader; // Cast result to
//                     const contactId: number = resultSetHeader.insertId;
//                     this.getContactById(contactId).then((contact: Contact) =>
//                         resolve(contact)
//                     ).catch((err) => reject(err));
//                 }
//             })
//         })
//     }
//
//     static async updateContacts(id: number, linkedId: number, precedence: string): Promise<boolean> {
//         return new Promise<boolean>((resolve, reject) => {
//             const query: string = "UPDATE contacts SET linked_id=?, linked_precedence=? WHERE id=?";
//             connection.execute(query, [linkedId, precedence, id], (err, result) => {
//                 if (err)
//                     reject(err);
//                 else {
//                     resolve(true);
//                 }
//             })
//         });
//     }
//
//     static async retriveQuery(requestBody: RequestBody): Promise<Contact[]> {
//         const email = requestBody.getEmail();
//         const phoneNumber = requestBody.getPhoneNumber();
//         return new Promise<Contact[]>((resolve, reject) => {
//             const query: string = "SELECT * FROM ( SELECT * FROM contacts" +
//                 " WHERE email = ? OR phone_number = ?" +
//                 " UNION SELECT c.* FROM contacts c INNER JOIN contacts linked ON c.id =" +
//                 " linked.linked_id" +
//                 " WHERE linked.email = ? OR linked.phone_number = ?" +
//                 " ) AS combined_results" +
//                 " ORDER BY linked_id";
//             connection.execute(query, [email, phoneNumber, email, phoneNumber], (err, result) => {
//                 if (err)
//                     reject(err);
//                 else {
//                     // console.log(result);
//                     resolve(result as Contact[]);
//                 }
//             })
//         })
//     }
// }
//
// export default ServiceMySql;
