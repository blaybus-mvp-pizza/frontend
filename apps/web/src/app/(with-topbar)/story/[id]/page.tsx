import StoryContent from '@/components/story/story-content'

type PageParams = Promise<{ id: string }>

export default async function StoryDetailPage({ params }: { params: PageParams }) {
  const { id } = await params
  return (
    <div className="mb-10">
      <StoryContent id={id} />
    </div>
  )
}
