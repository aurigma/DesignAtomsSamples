import { Viewer } from "@aurigma/design-atoms/Viewer/Viewer";
import { IResourceUrlMap } from "./IResourceUrlMap";
import { Product } from "@aurigma/design-atoms/Model/Product/Product";

declare global {
    interface Window {
        designAtoms: {
            designAtomsBackendUrl: string;

            viewer: Viewer;
            resourceUrlMap: IResourceUrlMap;
            product: Product;
        };
    }
}