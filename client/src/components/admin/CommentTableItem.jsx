import React from "react";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import { useAppContext } from "../../context/AppContext";

const CommentTableItem = ({ comment, fetchComments }) => {
  const { blog, createdAt, _id, isApproved, name, content } = comment;
  const BlogDate = new Date(createdAt);
  const { axios } = useAppContext();

  const approveComment = async () => {
    try {
      const { data } = await axios.post("/api/admin/approve-comment", {
        id: _id,
      });
      if (data.success) {
        toast.success(data.message);
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to approve comment."
      );
    }
  };

  const deleteComment = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (!confirmDelete) return;

    try {
      const { data } = await axios.delete(`/api/admin/delete-comment/${_id}`);

      if (data.success) {
        toast.success(data.message);
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete comment.");
    }
  };

  return (
    <tr className="border-b border-gray-300">
      <td className="px-6 py-4">
        <p>
          <b className="text-gray-600">Blog:</b> {blog?.title || "Untitled"}
        </p>
        <p>
          <b className="text-gray-600">Name:</b> {name}
        </p>
        <p>
          <b className="text-gray-600">Comment:</b> {content}
        </p>
      </td>
      <td className="px-6 py-4 max-sm:hidden">
        {BlogDate.toLocaleDateString()}
      </td>
      <td className="px-6 py-4">
        <div className="inline-flex items-center gap-4">
          {!comment.isApproved ? (
            <img
              onClick={approveComment}
              src={assets.tick_icon}
              alt="Approve"
              className="w-5 cursor-pointer hover:scale-110 transition-all"
            />
          ) : (
            <span className="text-xs border border-green-600 bg-green-100 text-green-600 rounded-full px-3 py-1">
              Approved
            </span>
          )}
          <img
            onClick={deleteComment}
            src={assets.bin_icon}
            alt="Delete"
            className="w-5 cursor-pointer hover:scale-110 transition-all"
          />
        </div>
      </td>
    </tr>
  );
};

export default CommentTableItem;
