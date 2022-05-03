import Link from "next/link";
import CommentForm from "./CommentForm";

const Comment = ({
    comment,
    replies,
    setActiveComment,
    activeComment,
    updateComment,
    deleteComment,
    addComment,
    parentId = null,
    currentUserId,
}) => {
    const isEditing =
        activeComment &&
        activeComment._id === comment._id &&
        activeComment.type === "editing";
    const isReplying =
        activeComment &&
        activeComment._id === comment._id &&
        activeComment.type === "replying";
    const canDelete = currentUserId === comment.user._id;
    const canReply = Boolean(currentUserId);
    const canEdit = currentUserId === comment.user._id;
    const replyId = parentId ? parentId : comment._id;
    const createdAt = new Date(comment.updatedAt).toLocaleDateString();
    return (
        <div key={comment.id} className="comment">
            <div className="comment-image-container">
                <img
                    src={
                        comment.user.photo.substring(0, 5) !== "https"
                            ? `http://localhost:8080/images/${comment.user.photo}`
                            : comment.user.photo
                    }
                    className="img img-fluid img-thumbnail mb-3"
                    style={{
                        height: "48px",
                        width: "48px",
                    }}
                    alt="user profile"
                />
            </div>
            <div className="comment-right-part">
                <div className="comment-content">
                    <div className="comment-author">
                        <Link href={`/profile/${comment.user.username}`}>
                            {comment.user.name}
                        </Link>
                    </div>
                    <div>{createdAt}</div>
                </div>
                {!isEditing && (
                    <div className="comment-text">{comment.body}</div>
                )}
                {isEditing && (
                    <CommentForm
                        submitLabel="Update"
                        hasCancelButton
                        initialText={comment.body}
                        handleSubmit={(text) =>
                            updateComment(text, comment._id)
                        }
                        handleCancel={() => {
                            setActiveComment(null);
                        }}
                    />
                )}
                <div className="comment-actions">
                    {canReply && (
                        <div
                            className="comment-action"
                            onClick={() =>
                                setActiveComment({
                                    _id: comment._id,
                                    type: "replying",
                                })
                            }
                        >
                            Reply
                        </div>
                    )}
                    {canEdit && (
                        <div
                            className="comment-action"
                            onClick={() =>
                                setActiveComment({
                                    _id: comment._id,
                                    type: "editing",
                                })
                            }
                        >
                            Edit
                        </div>
                    )}
                    {canDelete && (
                        <div
                            className="comment-action"
                            onClick={() => deleteComment(comment._id)}
                        >
                            Delete
                        </div>
                    )}
                </div>
                {isReplying && (
                    <CommentForm
                        submitLabel="Reply"
                        handleSubmit={(text) => addComment(text, replyId)}
                    />
                )}
                {replies && replies.length > 0 && (
                    <div className="replies">
                        {replies.map((reply) => (
                            <Comment
                                comment={reply}
                                key={reply._id}
                                setActiveComment={setActiveComment}
                                activeComment={activeComment}
                                updateComment={updateComment}
                                deleteComment={deleteComment}
                                addComment={addComment}
                                parentId={comment.id}
                                replies={reply.children}
                                currentUserId={currentUserId}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Comment;
