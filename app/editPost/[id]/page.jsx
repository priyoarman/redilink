import EditPostPage from "@/app/components/EditPostPage";
export const dynamic = "force-dynamic";

const getPostById = async (id) => {
  const origin = process.env.NEXT_PUBLIC_APP_URL;
  try {
    const res = await fetch(`${origin}/api/posts/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch post");
    }

    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export default async function EditPost({ params }) {
  const { id } = await params;
  const { post } = await getPostById(id);
  const { body } = post;
  return <EditPostPage id={id} body={body} />;
}
