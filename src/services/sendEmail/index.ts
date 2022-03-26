import handlebars from 'handlebars';
import nodemailer from 'nodemailer';

interface IDocument {
    from: string;
    to: string;
    subject: string;
    replyTo?: string;
    cc?: string;
    bcc?: string;
    htmlTemplate: string;
    variables: object;
}

const sendEmail = async (document: IDocument) => {
    const { from, replyTo, to, cc, bcc, subject, htmlTemplate, variables } =
        document;
    try {
        const template = handlebars.compile(htmlTemplate);
        const html = template(variables);
        const email = { from, to, subject, replyTo, cc, bcc, html };
        const transporter = nodemailer.createTransport(
            process.env.SMTP_CONNECTION_URI
        );
        const response = await transporter.sendMail(email);
        return { ok: true, response };
    } catch (error) {
        console.error(error);
        return {
            ok: false,
            message: `There was a problem sending email verification to "${to}"`,
        };
    }
};

export default sendEmail;
