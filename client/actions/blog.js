import fetch from "isomorphic-fetch";
import queryString from "query-string";
import { API } from "../config";
import { isAuth, handleResponse } from "./auth";

export const createBlog = (blog, token) => {
    let createBlogEndpoint;

    if (isAuth() && isAuth().role === 1) {
        createBlogEndpoint = `${API}/blog`;
    } else if (isAuth() && isAuth().role === 0) {
        createBlogEndpoint = `${API}/blog/user/blog`;
    }

    return fetch(createBlogEndpoint, {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: blog,
    })
        .then((response) => {
            handleResponse(response);
            return response.json();
        })
        .catch((err) => console.log(err));
};

export const listBlogsWithCategoriesAndTags = (skip, limit) => {
    const data = {
        limit,
        skip,
    };
    return fetch(`${API}/blog/blogs-categories-tags`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            return response.json();
        })
        .catch((err) => console.log(err));
};

export const singleBlog = (slug) => {
    return fetch(`${API}/blog/${slug}`, {
        method: "GET",
    })
        .then((response) => {
            return response.json();
        })
        .catch((err) => console.log(err));
};

export const listRelated = (blog) => {
    return fetch(`${API}/blog/blogs/related`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: blog._id, categories: blog.categories }),
    })
        .then((response) => {
            return response.json();
        })
        .catch((err) => console.log(err));
};

export const list = (username) => {
    let listBlogEndpoint;

    if (isAuth() && isAuth().role === 1) {
        listBlogEndpoint = `${API}/blog/blogs`;
    } else if (isAuth() && isAuth().role === 0 && username) {
        listBlogEndpoint = `${API}/blog/${username}/blogs`;
    }

    return fetch(listBlogEndpoint, {
        method: "GET",
    })
        .then((response) => {
            return response.json();
        })
        .catch((err) => console.log(err));
};

export const removeBlog = (slug, token) => {
    let deleteBlogEndpoint;

    if (isAuth() && isAuth().role === 1) {
        deleteBlogEndpoint = `${API}/blog/${slug}`;
    } else if (isAuth() && isAuth().role === 0) {
        deleteBlogEndpoint = `${API}/blog/user/blog/${slug}`;
    }

    return fetch(deleteBlogEndpoint, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => {
            handleResponse(response);
            return response.json();
        })
        .catch((err) => console.log(err));
};

export const updateBlog = (blog, token, slug) => {
    let updateBlogEndpoint;

    if (isAuth() && isAuth().role === 1) {
        updateBlogEndpoint = `${API}/blog/${slug}`;
    } else if (isAuth() && isAuth().role === 0) {
        updateBlogEndpoint = `${API}/blog/user/blog/${slug}`;
    }

    return fetch(updateBlogEndpoint, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: blog,
    })
        .then((response) => {
            handleResponse(response);
            return response.json();
        })
        .catch((err) => console.log(err));
};

export const listSearch = (params) => {
    console.log("search params", params);
    let query = queryString.stringify(params);
    console.log("query params", query);
    return fetch(`${API}/blog/blogs/search?${query}`, {
        method: "GET",
    })
        .then((response) => {
            return response.json();
        })
        .catch((err) => console.log(err));
};

export const react = (slug, token) => {
    return fetch(`${API}/blog/user/blog/${slug}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => {
            return response.json();
        })
        .catch((err) => console.log(err));
};
