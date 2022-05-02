import Layout from "../../components/Layout";
import Private from "../../components/auth/Private";
import Link from "next/link";

const UserIndex = () => {
    return (
        <Layout>
            <Private>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 pt-5 pb-5">
                            <h2>User Dashboard</h2>
                        </div>
                        <div className="col-md-4">
                            <div className="list-group">
                                <a
                                    href="/user/crud/create"
                                    className="list-group-item"
                                    style={{ textDecoration: "none" }}
                                >
                                    Create Blog
                                </a>
                                <a
                                    href="/user/crud/blogs"
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
                                    Update profile
                                </a>
                            </div>
                        </div>
                        {/* <div className="col-md-8">right</div> */}
                    </div>
                </div>
            </Private>
        </Layout>
    );
};

export default UserIndex;
