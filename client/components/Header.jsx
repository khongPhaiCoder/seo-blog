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
                    <NavLink className="font-weight-bold">{APP_NAME}</NavLink>
                </Link>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                        <React.Fragment>
                            <NavItem>
                                <Link href="/blogs">
                                    <NavLink>Blogs</NavLink>
                                </Link>
                            </NavItem>
                        </React.Fragment>

                        {!auth && (
                            <React.Fragment>
                                <NavItem>
                                    <Link href="/signin">
                                        <NavLink>Signin</NavLink>
                                    </Link>
                                </NavItem>
                                <NavItem>
                                    <Link href="/signup">
                                        <NavLink>Signup</NavLink>
                                    </Link>
                                </NavItem>
                            </React.Fragment>
                        )}

                        {auth && auth.role === 0 && (
                            <NavItem>
                                <Link href="/user">
                                    <NavLink>{`${
                                        isAuth().name
                                    }'s Dashboard`}</NavLink>
                                </Link>
                            </NavItem>
                        )}

                        {auth && auth.role === 1 && (
                            <NavItem>
                                <Link href="/admin">
                                    <NavLink>{`${
                                        isAuth().name
                                    }'s Dashboard`}</NavLink>
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
                                    Signout
                                </NavLink>
                            </NavItem>
                        )}

                        <NavItem>
                            <Link href="/user/crud/create">
                                <NavLink className="btn btn-primary text-light">
                                    Write a blog
                                </NavLink>
                            </Link>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
            <Search />
        </React.Fragment>
    );
};

export default Header;
