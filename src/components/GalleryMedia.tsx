import { GalleryImage, isVideo } from '@/lib/imgurGalleryApi'
import { cn } from '@/lib/utils'

interface VideoOptions {
  autoPlay?: boolean

  loop?: boolean

  muted?: boolean

  controls?: boolean
}

export interface GalleryMediaProps {
  media: GalleryImage | null | undefined

  className?: string

  videoOptions?: VideoOptions
}

export function GalleryMedia({ media, className, videoOptions }: GalleryMediaProps) {
  if (!media) {
    return null
  }

  if (isVideo(media.type)) {
    return (
      <video
        data-media={JSON.stringify(media)}
        muted={videoOptions?.muted ?? true}
        autoPlay={videoOptions?.autoPlay ?? true}
        loop={videoOptions?.loop ?? true}
        controls={videoOptions?.controls ?? false}
        className={cn('w-full h-full', className)}
        width={media.width}
        height={media.height}
      >
        {'mp4' in media && typeof media.mp4 === 'string' && <source src={media.mp4} type={media.type} />}

        <source src={media.link} type={media.type} />
      </video>
    )
  }

  return (
    <img
      data-media={JSON.stringify(media)}
      loading="lazy"
      width={media.width}
      height={media.height}
      src={media.link}
      alt={media.title ?? undefined}
      className={cn('w-full h-full', className)}
    />
  )
}
