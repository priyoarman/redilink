import EditPostPage from "@/app/components/EditPostPage";
export const dynamic = "force-dynamic";

const getPostById = async (id) => {
  const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${origin}/api/posts/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to fetch post");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
};

export default async function EditPost({ params }) {
  const { id } = await params;
  const result = await getPostById(id);
  
  if (!result || !result.post) {
    return (
      <div className="flex h-screen items-center justify-center bg-panel">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-2">Post Not Found</h1>
          <p className="text-secondary">The post you're looking for doesn't exist or has been deleted.</p>
        </div>
      </div>
    );
  }

  const { post } = result;
  const { body } = post;
  return <EditPostPage id={id} body={body} />;
}
