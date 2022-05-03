import { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import {
    createComment,
    deleteComment as deleteCommentAction,
    getComment,
    updateComment as updateCommentAction,
} from "../../actions/comment";
import { isAuth, getCookie } from "../../actions/auth";

const Comments = ({ blogId }) => {
    const [comments, setComments] = useState([]);
    const [activeComment, setActiveComment] = useState(null);

    const addComment = (text, parentId) => {
        createComment(text, parentId, getCookie("token")).then((data) => {
            setComments(data.nestedComment);
            setActiveComment(null);
        });
    };

    const updateComment = (text, commentId) => {
        updateCommentAction(
            text,
            commentId,
            getCookie("token"),
            isAuth()._id
        ).then((data) => {
            setComments(data);
            setActiveComment(null);
        });
    };
    const deleteComment = (commentId) => {
        if (window.confirm("Are you sure you want to remove comment?")) {
            deleteCommentAction(commentId, getCookie("token")).then((data) => {
                setComments(data.nestedComment);
            });
        }
    };

    useEffect(() => {
        getComment(blogId).then((data) => {
            console.log(data.nestedComment);
            setComments(data.nestedComment);
        });
    }, []);

    return (
        <div className="comments">
            <h3 className="comments-title">Comments</h3>
            <div className="comment-form-title">Write comment</div>
            <CommentForm
                submitLabel="Write"
                handleSubmit={addComment}
                parent={blogId}
            />
            <div className="comments-container">
                {comments.map((rootComment) => (
                    <Comment
                        key={rootComment._id}
                        comment={rootComment}
                        replies={rootComment.children}
                        activeComment={activeComment}
                        setActiveComment={setActiveComment}
                        addComment={addComment}
                        deleteComment={deleteComment}
                        updateComment={updateComment}
                        currentUserId={isAuth()._id}
                    />
                ))}
            </div>
        </div>
    );
};

export default Comments;
