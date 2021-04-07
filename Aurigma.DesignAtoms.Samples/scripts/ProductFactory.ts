import { Product, Surface, PrintArea, SurfaceContainer, MockupContainer, SafetyLine, PdfBox } from "@aurigma/design-atoms-model/Product";
import { RectangleF, PointF } from "@aurigma/design-atoms-model/Math";
import { RgbColor } from "@aurigma/design-atoms-model/Colors";
import { BaseTextItem, PlainTextItem, BoundedTextItem, ImageItem, TextAlignment } from "@aurigma/design-atoms-model/Product/Items";
import { assignProperties } from "@aurigma/design-atoms-model/Utils/Utils";
import { Margin } from "@aurigma/design-atoms-model/Math/Margin";

export class ProductFactory {
    static createProduct(backendUrl: string) {
        const surface = new Surface();
        const product = new Product([surface]);
        product.name = "Sample product";

        let mainContainer: SurfaceContainer;

        surface.width = 492;
        surface.height = 667;

        const printArea = new PrintArea(new RectangleF(36, 36, 420, 595));

        printArea.safetyLines.add(assignProperties(new SafetyLine(), {
            margin: new Margin({ left: 5, top: 10, right: 15, bottom: 20 }),
            pdfBox: PdfBox.Trim,
            altColor: new RgbColor("green")
        })
        );

        surface.printAreas.add(printArea);

        surface.containers.setRange([
            mainContainer = assignProperties(new SurfaceContainer(), { name: "main" })
        ]);

        const mockupImg = assignProperties(new ImageItem(), {
            sourceRectangle: new RectangleF(0, 0, surface.width, surface.height),
            source: new ImageItem.ImageSource(null, backendUrl + "/assets/test-page-square.png")
        });

        surface.mockup.overContainers.add(new MockupContainer([mockupImg]));

        mainContainer.items.add(
            assignProperties(new PlainTextItem(), {
                name: "header",
                baselineLocation: new PointF(95, 322),
                text: "Just about any kind\nof print product",
                color: new RgbColor("#000000"),
                font: new BaseTextItem.FontSettings("Montserrat-Bold", 24),
                alignment: TextAlignment.Left,
                locked: false
            })
        );

        mainContainer.items.add(
            assignProperties(new BoundedTextItem(), {
                name: "body",
                textRectangle: new RectangleF(95, 372, 302, 197),
                text: "Many packaged web-to-print solutions on the market today work well enough, but they can also be rigid and prevent the customizability that many printers want. Customer's Canvas provides an opportunity for printers to get a solution that is better tailored to their internal workflows and give their customers a more unique and intuitive experience.",
                color: new RgbColor("#000000"),
                font: new BaseTextItem.FontSettings("Montserrat-Regular", 15),
                alignment: TextAlignment.Left,
                locked: false
            })
        );

        mainContainer.items.add(
            assignProperties(new ImageItem(), {
                sourceRectangle: new RectangleF(65, 96, 302, 175),
                source: new ImageItem.ImageSource(null, backendUrl + "/assets/image.jpg"),
                locked: false
            })
        );

        return product;
    }
}

