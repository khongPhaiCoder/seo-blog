import fetch from "isomorphic-fetch";
import cookie from "js-cookie";
import Router from "next/router";
import { API } from "../config";

export const handleResponse = (response) => {
    if (response.status === 401) {
        signout(() => {
            Router.push({
                pathname: "/signin",
                query: {
                    message: "Your session is expired. Please signin!",
                },
            });
        });
    }
};

export const signup = (user) => {
    return fetch(`${API}/auth/signup`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    })
        .then((response) => {
            return response.json();
        })
        .catch((err) => console.log(err));
};

export const signin = (user) => {
    return fetch(`${API}/auth/signin`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    })
        .then((response) => {
            return response.json();
        })
        .catch((err) => console.log(err));
};

export const signout = (next) => {
    removeCookie("token");
    removeLocalStorage("user");
    next();

    return fetch(`${API}/auth/signout`, {
        method: "GET",
    })
        .then((response) => {
            console.log("signout success");
        })
        .catch((err) => console.log(err));
};

// set cookie
export const setCookie = (key, value) => {
    if (typeof window !== "undefined") {
        cookie.set(key, value, {
            expires: 1,
        });
    }
};

export const removeCookie = (key) => {
    if (typeof window !== "undefined") {
        cookie.remove(key, {
            expires: 1,
        });
    }
};
// get cookie
export const getCookie = (key) => {
    if (typeof window !== "undefined") {
        return cookie.get(key);
    }
};
// localstorage
export const setLocalStorage = (key, value) => {
    if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

export const removeLocalStorage = (key) => {
    if (typeof window !== "undefined") {
        localStorage.removeItem(key);
    }
};
// autheticate user by pass data to cookie and localstorage
export const authenticate = (data, next) => {
    setCookie("token", data.token);
    setLocalStorage("user", data.user);
    next();
};

export const isAuth = () => {
    if (typeof window !== "undefined") {
        const cookieChecked = getCookie("token");
        if (cookieChecked !== "undefined") {
            if (
                typeof window !== "undefined" &&
                localStorage?.getItem("user") !== "undefined"
            ) {
                return JSON.parse(localStorage?.getItem("user"));
            } else {
                return false;
            }
        }
    }
};

export const updateUser = (user, next) => {
    if (typeof window !== "undefined") {
        if (localStorage.getItem("user")) {
            let auth = user;
            localStorage.setItem("user", JSON.stringify(auth));
            next();
        }
    }
};

export const forgotPassword = (email) => {
    return fetch(`${API}/auth/forgot-password`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(email),
    })
        .then((response) => {
            return response.json();
        })
        .catch((err) => console.log(err));
};

export const resetPassword = (resetInfo) => {
    return fetch(`${API}/auth/reset-password`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(resetInfo),
    })
        .then((response) => {
            return response.json();
        })
        .catch((err) => console.log(err));
};

export const loginWithGoogle = (user) => {
    return fetch(`${API}/auth/google-login`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    })
        .then((response) => {
            return response.json();
        })
        .catch((err) => console.log(err));
};
