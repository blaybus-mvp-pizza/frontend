import StoryContent from '@/components/story/story-content';

type PageParams = Promise<{ id: string }>;

export default async function StoryDetailPage({
  params,
}: {
  params: PageParams;
}) {
  const { id } = await params;
  return (
    <div className='max-w-[800px] mx-auto my-15'>
      <StoryContent id={id} />
    </div>
  );
}
