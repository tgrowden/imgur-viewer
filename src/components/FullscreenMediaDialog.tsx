import { GalleryMedia } from '@/components/GalleryMedia'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { GalleryImage } from '@/lib/imgurGalleryApi'

interface FullscreenMediaDialogProps {
  open: boolean

  onOpenChange: (open: boolean) => void

  image: GalleryImage | undefined
}

export function FullscreenMediaDialog({ image, open, onOpenChange }: FullscreenMediaDialogProps) {
  return (
    <Dialog
      modal
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open)
      }}
    >
      <DialogContent className="w-screen h-screen max-w-[100vw] max-h-[100vh]">
        <div className="max-w-[100vw] max-h-[100vh] object-contain flex items-center justify-center">
          <GalleryMedia
            className="w-auto h-auto max-w-full max-h-full"
            media={image}
            videoOptions={{ controls: true, autoPlay: false, loop: false, muted: false }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
