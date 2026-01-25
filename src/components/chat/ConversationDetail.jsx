
import { ScrollArea, Button, Separator, Avatar, AvatarImage, AvatarFallback } from "../ui"
import { Bell, BellOff, ImageIcon, File, Link2, Star, Trash2, X } from "lucide-react"

export function ConversationDetail({ conversation, onClose }) {
    if (!conversation) return null

    const sharedMedia = [
        { id: "1", type: "image", name: "photo_1.jpg" },
        { id: "2", type: "image", name: "photo_2.jpg" },
        { id: "3", type: "image", name: "photo_3.jpg" },
        { id: "4", type: "image", name: "photo_4.jpg" },
    ]

    const sharedFiles = [
        { id: "1", name: "document.pdf", size: "2.4 MB" },
        { id: "2", name: "presentation.pptx", size: "5.1 MB" },
    ]

    const sharedLinks = [
        { id: "1", title: "Design System Guide", url: "figma.com" },
        { id: "2", title: "Project Repository", url: "github.com" },
    ]

    return (
        <div className="flex h-full w-80 flex-col border-l border-border bg-background">
            <div className="flex items-center justify-between border-b border-border p-4">
                <h2 className="font-semibold">Details</h2>
                <Button variant="ghost" size="icon-sm" onClick={onClose}>
                    <X className="size-4" />
                </Button>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4">
                    {/* User Profile */}
                    <div className="flex flex-col items-center text-center">
                        <div className="relative">
                            <Avatar className="size-20">
                                <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt={conversation.name} />
                                <AvatarFallback className="text-xl">{conversation.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            {conversation.online && (
                                <span className="absolute bottom-1 right-1 size-4 rounded-full border-2 border-background bg-green-500" />
                            )}
                        </div>
                        <h3 className="mt-3 text-lg font-semibold">{conversation.name}</h3>
                        <p className="text-sm text-muted-foreground">
                            {conversation.online ? "Active now" : "Last seen recently"}
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-6 flex justify-center gap-2">
                        <Button variant="outline" size="sm">
                            <Bell className="mr-1 size-4" />
                            Mute
                        </Button>
                        <Button variant="outline" size="sm">
                            <Star className="mr-1 size-4" />
                            Star
                        </Button>
                    </div>

                    <Separator className="my-6" />

                    {/* Shared Media */}
                    <div>
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">Shared Media</h4>
                            <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                                See all
                            </Button>
                        </div>
                        <div className="mt-3 grid grid-cols-4 gap-2">
                            {sharedMedia.map((media) => (
                                <div
                                    key={media.id}
                                    className="flex aspect-square items-center justify-center rounded-lg bg-muted"
                                >
                                    <ImageIcon className="size-5 text-muted-foreground" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Shared Files */}
                    <div>
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">Shared Files</h4>
                            <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                                See all
                            </Button>
                        </div>
                        <div className="mt-3 flex flex-col gap-2">
                            {sharedFiles.map((file) => (
                                <div
                                    key={file.id}
                                    className="flex items-center gap-3 rounded-lg border border-border p-2"
                                >
                                    <div className="flex size-9 items-center justify-center rounded bg-muted">
                                        <File className="size-4 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="truncate text-sm font-medium">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">{file.size}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Shared Links */}
                    <div>
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">Shared Links</h4>
                            <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                                See all
                            </Button>
                        </div>
                        <div className="mt-3 flex flex-col gap-2">
                            {sharedLinks.map((link) => (
                                <div
                                    key={link.id}
                                    className="flex items-center gap-3 rounded-lg border border-border p-2"
                                >
                                    <div className="flex size-9 items-center justify-center rounded bg-muted">
                                        <Link2 className="size-4 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="truncate text-sm font-medium">{link.title}</p>
                                        <p className="text-xs text-muted-foreground">{link.url}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Danger Zone */}
                    <div className="flex flex-col gap-2">
                        <Button variant="ghost" className="justify-start text-muted-foreground hover:text-foreground">
                            <BellOff className="mr-2 size-4" />
                            Mute notifications
                        </Button>
                        <Button variant="ghost" className="justify-start text-destructive hover:bg-destructive/10 hover:text-destructive">
                            <Trash2 className="mr-2 size-4" />
                            Delete conversation
                        </Button>
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}
