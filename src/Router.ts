import express from "express";
import RequestBody from "./Model/Request";
import Contact from "./Model/Contact";
import ResponseBody from "./Model/Response";
import ServicePostSql from "./ServicePostSQL";

const router = express.Router();

router.post("/identity", async (req, res) => {
    const requestBody: RequestBody = RequestBody.fromJson(req.body);
    if (requestBody.getPhoneNumber() == null || requestBody.getEmail() == null) {
        const contactsQuery = await ServicePostSql.retriveQuery(requestBody);
        const responseBody = new ResponseBody(contactsQuery[0]);
        for (let i = 1; i < contactsQuery.length; i++) {
            responseBody.addContact(contactsQuery[i]);
        }
        return res.status(200).json({
            "contact": responseBody,
        });
    }

    const contactsOr: Contact[] = await ServicePostSql.getContactsOr(requestBody);
    // console.log(contactsOr);
    if (contactsOr.length == 0) {
        const newContact = await ServicePostSql.saveContact(requestBody, 0, "primary");
        const responseBody = new ResponseBody(newContact);
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

    const availability = {email: false, phoneNumber: false};
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
        const responseBody = new ResponseBody(contactsOr[0]);
        for (let i = 1; i < contactsOr.length; i++) {
            responseBody.addContact(contactsOr[i]);
        }
        const newContact: Contact = await ServicePostSql.saveContact(requestBody, contactsOr.at(contactsOr.length - 1)?.id!, "secondary");
        responseBody.addContact(newContact);
        return res.status(200).json({
            "contact": responseBody,
        });
    } else {
        const contactsQuery = await ServicePostSql.retriveQuery(requestBody);
        if (contactsQuery.length == 2) {
            const updateOrNot: boolean = await ServicePostSql.updateContacts(contactsQuery[1].id, contactsQuery[0].id, "secondary");
            if (updateOrNot) {
                contactsQuery[1].linked_id = contactsQuery[0].id;
                contactsQuery[1].linked_precedence = "secondary";
            } else
                return res.sendStatus(400);
        }
        const responseBody = new ResponseBody(contactsQuery[0]);
        for (let i = 1; i < contactsQuery.length; i++) {
            responseBody.addContact(contactsQuery[i]);
        }
        return res.status(200).json({
            "contact": responseBody,
        });
    }
});

router.get("/_testing", (req, res) => {
    return res.status(200).json({
        "message": "Working fine",
    });
})

export default router;