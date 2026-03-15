export interface User {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    state: string,
    pin: string,
    password: string
}

export interface UserLogin {
    email: string;
    password: string;
}


export interface LoggedInUser {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    state: string,
    pin: string,
}

export interface LoginToken {
    token: string;
    expiresInSeconds: number;
    user: LoggedInUser;
}


