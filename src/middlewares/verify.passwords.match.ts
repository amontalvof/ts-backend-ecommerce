interface IRequest {
    body?: {
        regPassword1: string;
        updPassword1: string;
    };
}

const verifyPasswordsMatch = (password2: string, req: IRequest) => {
    if (
        password2 !== req.body?.regPassword1 &&
        password2 !== req.body?.updPassword1
    ) {
        throw new Error("The passwords don't match");
    } else {
        return password2;
    }
};

export default verifyPasswordsMatch;
