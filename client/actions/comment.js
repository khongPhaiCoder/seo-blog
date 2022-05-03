import fetch from "isomorphic-fetch";
import { API } from "../config";
import { handleResponse } from "./auth";

export const createComment = (body, parent, token) => {
    return fetch(`${API}/comment`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            body,
            parent,
        }),
    })
        .then((response) => {
            handleResponse(response);
            return response.json();
        })
        .catch((err) => console.log(err));
};

export const updateComment = (body, id, token, user) => {
    const payload = JSON.stringify({
        body,
        commentId: id,
        user,
    });
    return fetch(`${API}/comment`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: payload,
    })
        .then((response) => {
            handleResponse(response);
            return response.json();
        })
        .catch((err) => console.log(err));
};

export const deleteComment = (id, token) => {
    return fetch(`${API}/comment`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            commentId: id,
        }),
    })
        .then((response) => {
            handleResponse(response);
            return response.json();
        })
        .catch((err) => console.log(err));
};

export const getComment = (id) => {
    return fetch(`${API}/comment?parent=${id}`, {
        method: "GET",
    })
        .then((response) => {
            return response.json();
        })
        .catch((err) => console.log(err));
};
