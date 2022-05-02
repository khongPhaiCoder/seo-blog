import Layout from "../../components/Layout";
import Admin from "../../components/auth/Admin";
import Link from "next/link";

const AdminIndex = () => {
    return (
        <Layout>
            <Admin>
                <div className="container-fluid">
                    <div className="row">
                        {/* <div className="col-md-12 pt-5 pb-5">
                            <h2>Admin Dashboard</h2>
                        </div> */}
                        <div className="col-md-4">
                            <div className="list-group">
                                <a
                                    href="/admin/crud/category-tag"
                                    className="list-group-item"
                                    style={{ textDecoration: "none" }}
                                >
                                    Create Category
                                </a>
                                <a
                                    href="/admin/crud/category-tag"
                                    className="list-group-item"
                                    style={{ textDecoration: "none" }}
                                >
                                    Create Tag
                                </a>
                                <a
                                    href="/admin/crud/blog"
                                    className="list-group-item"
                                    style={{ textDecoration: "none" }}
                                >
                                    Create Blog
                                </a>
                                <a
                                    href="/admin/crud/blogs"
                                    className="list-group-item"
                                    style={{ textDecoration: "none" }}
                                >
                                    Update/Delete Blog
                                </a>
                                <a
                                    href="/user/update"
                                    className="list-group-item"
                                    style={{ textDecoration: "none" }}
                                >
                                    Update Profile
                                </a>
                            </div>
                        </div>
                        {/* <div className="col-md-8">right</div> */}
                    </div>
                </div>
            </Admin>
        </Layout>
    );
};

export default AdminIndex;
