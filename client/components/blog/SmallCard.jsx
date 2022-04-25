import Link from "next/link";
import renderHTML from "react-render-html";
import moment from "moment";

const SmallCard = ({ blog }) => {
    return (
        <div className="card">
            <section>
                <Link href={`/blogs/${blog.slug}`}>
                    <a>
                        {blog.photo && (
                            <img
                                className="img img-fluid"
                                style={{ maxHeight: "auto", width: "100%" }}
                                src={`http://localhost:8080/images/${blog.photo}`}
                                alt={blog.title}
                            />
                        )}
                    </a>
                </Link>
            </section>

            <div className="card-body">
                <section>
                    <Link href={`/blogs/${blog.slug}`}>
                        <a>
                            <h5 className="card-title">{blog.title}</h5>
                        </a>
                    </Link>
                    <div className="card-text">{renderHTML(blog.excerpt)}</div>
                </section>
            </div>

            <div className="card-body">
                Posted {moment(blog.updatedAt).fromNow()} by{" "}
                <Link href={`/profile/${blog.postedBy.username}`}>
                    <a>{blog.postedBy.name}</a>
                </Link>
            </div>
        </div>
    );
};

export default SmallCard;
