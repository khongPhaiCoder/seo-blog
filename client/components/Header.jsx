import React, { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import NProgress from "nprogress";
import { APP_NAME } from "../config";
import { signout, isAuth } from "../actions/auth";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    NavItem,
    NavLink,
} from "reactstrap";
import ".././node_modules/nprogress/nprogress.css";
import Search from "./blog/Search";

Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [auth, setAuth] = useState(false);

    const toggle = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            setAuth(isAuth());
        }
    }, []);

    return (
        <React.Fragment>
            <Navbar color="light" light expand="md">
                <Link href="/">
                    <NavLink className="font-weight-bold">
                        <span style={{ cursor: "pointer" }}>{APP_NAME}</span>
                    </NavLink>
                </Link>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                        <React.Fragment>
                            <NavItem>
                                <Link href="/blogs">
                                    <NavLink>
                                        <span style={{ cursor: "pointer" }}>
                                            Blogs
                                        </span>
                                    </NavLink>
                                </Link>
                            </NavItem>
                            {auth?.role === 1 && (
                                <NavItem>
                                    <Link href="/contact">
                                        <NavLink>
                                            <span style={{ cursor: "pointer" }}>
                                                Contact
                                            </span>
                                        </NavLink>
                                    </Link>
                                </NavItem>
                            )}
                        </React.Fragment>
                        {!auth && (
                            <React.Fragment>
                                <NavItem>
                                    <Link href="/signin">
                                        <NavLink>
                                            <span style={{ cursor: "pointer" }}>
                                                Signin
                                            </span>
                                        </NavLink>
                                    </Link>
                                </NavItem>
                                <NavItem>
                                    <Link href="/signup">
                                        <NavLink>
                                            <span style={{ cursor: "pointer" }}>
                                                Signup
                                            </span>
                                        </NavLink>
                                    </Link>
                                </NavItem>
                            </React.Fragment>
                        )}
                        {auth && auth.role === 0 && (
                            <NavItem>
                                <Link href="/user">
                                    <NavLink>
                                        <span style={{ cursor: "pointer" }}>
                                            {`${isAuth().name}'s Dashboard`}
                                        </span>
                                    </NavLink>
                                </Link>
                            </NavItem>
                        )}
                        {auth && auth.role === 1 && (
                            <NavItem>
                                <Link href="/admin">
                                    <NavLink>
                                        <span style={{ cursor: "pointer" }}>
                                            {`${isAuth().name}'s Dashboard`}
                                        </span>
                                    </NavLink>
                                </Link>
                            </NavItem>
                        )}
                        {auth && (
                            <NavItem>
                                <NavLink
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                        signout(() => Router.replace(`/signin`))
                                    }
                                >
                                    <span style={{ cursor: "pointer" }}>
                                        Signout
                                    </span>
                                </NavLink>
                            </NavItem>
                        )}
                        {auth?.role === 0 && (
                            <NavItem>
                                <Link href="/user/crud/create">
                                    <NavLink className="btn btn-primary text-light">
                                        <span style={{ cursor: "pointer" }}>
                                            Write a blog
                                        </span>
                                    </NavLink>
                                </Link>
                            </NavItem>
                        )}
                    </Nav>
                </Collapse>
            </Navbar>
            {auth?.role !== 1 && <Search />}
        </React.Fragment>
    );
};

export default Header;
