"use client";

import { FiTrash2 } from "react-icons/fi";
import { useRouter } from "next/navigation";

const RemoveBtn = ({ id }) => {
  const router = useRouter();

  const removePost = async () => {
    const confirmed = confirm("Are you sure?");

    if (confirmed) {
      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      }
    }
  };

  return (
    <div>
      <button onClick={removePost} className="cursor-pointer text-red-500">
        <FiTrash2 />
      </button>
    </div>
  );
};

export default RemoveBtn;
