import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { PostEditor } from '@/components/post-editor';

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: { seoMeta: true },
  });

  if (!post) {
    notFound();
  }

  return <PostEditor post={post} />;
}

