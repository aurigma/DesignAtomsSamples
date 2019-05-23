using System.Drawing;
using System.Web.Hosting;
using Aurigma.DesignAtoms.Canvas.Collection;
using Aurigma.DesignAtoms.Model;
using Aurigma.DesignAtoms.Model.Items;
using Aurigma.GraphicsMill.AdvancedDrawing;
using Path = Aurigma.DesignAtoms.Common.Math.Path;
using PointF = System.Drawing.PointF;
using Utils = Aurigma.DesignAtoms.Common.Utils;

namespace Aurigma.DesignAtoms.Samples.Code
{
    public static class DemoProducts
    {
        public static Product CreateCurvedTextProduct()
        {
            return new Product
            {
                Surfaces = { new Surface(400, 400)
                {
                    PrintAreas = { new PrintArea( new RectangleF(0, 0, 400, 400))},
                    Containers =
                    {
                        new SurfaceContainer(new Collection<BaseItem>
                        {
                            new CurvedTextItem("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", Path.CreateEllipsePath(35, 50, 175, 175)),
                            new CurvedTextItem("<p>" +
                                               "<span style=\"color:green\">Lorem ipsum dolor sit amet, </span>" +
                                               "<span style=\"color:rgb(0,255,0)\">consectetur adipiscing elit, </span>" +
                                               "<span>sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</span></p>",
                                Path.CreateEllipsePath(195, 50, 175, 175))
                        })
                    }
                }}
            };
        }

        public static Product CreateOpenTypeFeaturesProduct()
        {
            var swash = new BoundedTextItem(TestText.LoremIpsum,
                new RectangleF(20f, 20f, 350, 180), "Nautilus Pompilius", 15);
            swash.Font.OpenTypeFeatures.Add(OpenTypeFeature.Swsh);

            var ligature = new BoundedTextItem(TestText.LoremIpsum,
                new RectangleF(20f, 220f, 350, 180), "Nautilus Pompilius", 15);
            ligature.Font.OpenTypeFeatures.Add(OpenTypeFeature.Dlig);

            var smallCaps = new BoundedTextItem(TestText.LoremIpsum,
                new RectangleF(20f, 420f, 350, 180), "Montserrat-Regular", 15);
            smallCaps.Font.OpenTypeFeatures.Add(OpenTypeFeature.Smcp);

            return new Product
            {
                Surfaces =
                {
                    new Surface(492, 680)
                    {
                        PrintAreas = {new PrintArea(new RectangleF(0, 0, 419.5f, 595.2f))},
                        Containers =
                        {
                            new SurfaceContainer(new Collection<BaseItem>
                            {
                                swash,
                                smallCaps,
                                ligature
                            })
                            {
                                Name = Utils.MainContainerName
                            }
                        }
                    }
                }
            };
        }

        public static Product CreateVectorMaskProduct()
        {
            var photo = new GraphicsMill.Bitmap(HostingEnvironment.MapPath("~/assets/photo.jpg"));

            var items = new System.Collections.ObjectModel.Collection<BaseItem>();

            var imageItem = new ImageItem(photo, new PointF(10, 10), 100, 100);
            imageItem.Mask = new ItemMask
            {
                VectorMask = Path.CreateEllipsePath(
                    imageItem.SourceRectangle.X,
                    imageItem.SourceRectangle.Y,
                    imageItem.SourceRectangle.Width,
                    imageItem.SourceRectangle.Height)
            };

            items.Add(imageItem);

            var placeholderRectangle = new RectangleF(120, 10, 100, 100);
            var placeholderContent = new ImageItem(photo,
                placeholderRectangle.Location,
                placeholderRectangle.Width,
                placeholderRectangle.Height);

            var placeholder = new PlaceholderItem(placeholderContent, placeholderRectangle);
            var radius = new[] { new SizeF(5, 5), new SizeF(10, 10) };

            var placeholderMask = Path.CreateRoundedRectanglePath(
                placeholderRectangle,
                new[] { radius[0], radius[1], radius[0], radius[1] });

            placeholder.Mask = new ItemMask { VectorMask = placeholderMask };

            items.Add(placeholder);

            var shape = new ShapeItem(Path.CreateRectanglePath(230, 10, 100, 100))
            {
                Mask = new ItemMask { VectorMask = Path.CreateEllipsePath(180, 10, 100, 100) }
            };

            items.Add(shape);

            var boundedTextMask = new Path();
            boundedTextMask.MoveTo(340, 10);
            boundedTextMask.LineTo(390, 60);
            boundedTextMask.LineTo(340, 110);
            boundedTextMask.LineTo(290, 60);
            boundedTextMask.Close();

            items.Add(new BoundedTextItem(TestText.LoremIpsum, new RectangleF(290, 10, 100, 100), fontSize: 6)
            {
                Mask = new ItemMask { VectorMask = boundedTextMask }
            });

            var surface = new Surface(400, 400)
            {
                PrintAreas = { new PrintArea(new RectangleF(0, 0, 400, 200)) },
                Containers =
                {
                    new SurfaceContainer(items) { Name = Common.Utils.MainContainerName }
                }
            };

            return new Product { Surfaces = { surface } };
        }
    }
}