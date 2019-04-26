import { ImageItemHandler } from "@aurigma/design-atoms/ItemHandlers/ImageItemHandler";
import { ImageItem } from "@aurigma/design-atoms/Model/Product/Items/ImageItem";

export async function loadImage(imgItem: ImageItem, url: string): Promise<string> {
    const handler = window.designAtoms.viewer.getHandler<ImageItemHandler>(imgItem);

    const storageId = await handler.loadImage(url, { downloadToServerCache: true });

    if (window.designAtoms.resourceUrlMap == null)
        window.designAtoms.resourceUrlMap = new Map();

    window.designAtoms.resourceUrlMap.set(storageId, url);

    return storageId;
}