interface IRequest {
    body?: {
        regPassword1: string;
    };
}

const verifyPasswordsMatch = (regPassword2: string, req: IRequest) => {
    if (regPassword2 !== req.body?.regPassword1) {
        throw new Error("The passwords don't match");
    } else {
        return regPassword2;
    }
};

export default verifyPasswordsMatch;
