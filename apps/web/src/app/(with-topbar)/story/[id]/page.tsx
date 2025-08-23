import StoryContent from '@/components/story/story-content'

type PageParams = Promise<{ id: string }>

export default async function StoryDetailPage({ params }: { params: PageParams }) {
  const { id } = await params
  return (
    <div className="mx-auto my-10 max-w-[800px]">
      <StoryContent id={id} />
    </div>
  )
}
