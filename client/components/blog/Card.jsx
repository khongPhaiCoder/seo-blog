import React, { useState, useEffect } from "react";
import Link from "next/link";
import renderHTML from "react-render-html";
import moment from "moment";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { isAuth, getCookie } from "../../actions/auth";
import { react } from "../../actions/blog";

const Card = ({ blog }) => {
    const [isReact, setIsReact] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    const onReactHandler = async () => {
        const res = await react(blog.slug, getCookie("token"));
        setIsReact(!isReact);
        setLikesCount(res.likes_count);
    };

    useEffect(() => {
        setIsReact(blog.likes.includes(isAuth()._id));
        setLikesCount(blog.likes.length);
    }, []);

    const showBlogCategories = (blog) =>
        blog.categories.map((c, i) => (
            <Link key={i} href={`/categories/${c.slug}`}>
                <a className="btn btn-primary mr-1 ml-1 mt-3">{c.name}</a>
            </Link>
        ));

    const showBlogTags = (blog) =>
        blog.tags.map((t, i) => (
            <Link key={i} href={`/tags/${t.slug}`}>
                <a className="btn btn-outline-primary mr-1 ml-1 mt-3">
                    {t.name}
                </a>
            </Link>
        ));

    return (
        <div className="lead pb-4">
            <header>
                <Link href={`/blogs/${blog.slug}`}>
                    <a style={{ textDecoration: "none" }}>
                        <h2 className="pt-3 pb-3 font-weight-bold">
                            {blog.title}
                        </h2>
                    </a>
                </Link>
            </header>
            <section>
                <p className="mark ml-1 pt-2 pb-2">
                    Written by{" "}
                    <Link href={`/profile/${blog.postedBy.username}`}>
                        <a>{blog.postedBy.name}</a>
                    </Link>{" "}
                    | Published {moment(blog.updatedAt).fromNow()}
                </p>
            </section>
            <section>
                {showBlogCategories(blog)}
                {showBlogTags(blog)}
                <span
                    className="float-right mt-3 mr-1"
                    style={{ cursor: "pointer" }}
                    onClick={onReactHandler}
                >
                    {isReact ? (
                        <Favorite fontSize="large" />
                    ) : (
                        <FavoriteBorder fontSize="large" />
                    )}
                    {likesCount}
                </span>
                <br />
                <br />
            </section>

            <div className="row">
                <div className="col-md-4">
                    <section>
                        {blog.photo && (
                            <img
                                className="img img-fluid"
                                style={{ maxHeight: "auto", width: "100%" }}
                                src={`http://localhost:8080/images/${blog.photo}`}
                                alt={blog.title}
                            />
                        )}
                    </section>
                </div>
                <div className="col-md-8">
                    <section>
                        <div className="pb-3">{renderHTML(blog.excerpt)}</div>
                        <Link href={`/blogs/${blog.slug}`}>
                            <a className="btn btn-primary pt-2">Read more</a>
                        </Link>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Card;
