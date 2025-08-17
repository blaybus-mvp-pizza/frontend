import { Button } from "@workspace/ui/components/button"
import { Typography } from "@workspace/ui/components/typography"

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <Typography variant="h1">Hello World</Typography>
        <Button size="sm">Button</Button>
      </div>
    </div>
  )
}
