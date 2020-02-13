# Design Atoms Sample Application
 
## What is Customer's Canvas and Design Atoms? 
 
Customer's Canvas is an SDK for web-to-print solutions developed by Aurigma, Inc. For example, you can embed the Customer's Canvas editor into your web application and allow your users to edit designs of such products as commercial printing, specialty items, apparel, packaging, stickers, wide-print formatting, etc. You can learn more details about this SDK at:
 
https://customerscanvas.com/
 
Design Atoms can be considered as the _core_ of the  Customer's Canvas editor. If you think of Customer's Canvas as a browser, Design Atoms is similar to the DOM API. In other words, it allows users to work with the elements of a design loaded into the editor (like images, text elements, QR codes, shapes, etc) in a similar manner as you would work with HTML elements in JavaScript.
 
For example, you may create a template in InDesign, import it as a Design Atoms model and then iterate through each element and make some changes. Or, you can build a model from scratch and send it to the editor. Or... you can manipulate designs in various ways!
 
You can find some documentation here: 
 
- https://customerscanvas.com/docs/cc/design-atoms-fw.htm
- https://customerscanvas.com/docs/cc/using-design-atoms-fw.htm
- https://customerscanvas.com/docs/cc/introduction-to-iframe-api-v5.htm
 
## What you will find in this repo? 
 
This is a sample C#/TypeScript project for the Customer's Canvas Design Atoms Framework. It demonstrates how to create a back end for Design Atoms and how you can solve various image manipulation tasks at both the front end (TypeScript) and back end (C#) by using the Design Atoms Framework.

From time to time, we will update this project and add new demos/samples. See the [CHANGELOG](CHANGELOG.md) for details.  

## Online Demo

You can [try this demo here.](https://h2.customerscanvas.com/online-demo/design-atoms-samples/)
 
## How to get started? 
 
1. Clone this project, then open it in Visual Studio. 
2. Make sure that all the dependencies from Nuget and npm are loaded (including the [Aurigma.DesignAtoms](https://www.nuget.org/packages/Aurigma.DesignAtoms/) Nuget package and the [@aurigma/design-atoms](https://www.npmjs.com/package/@aurigma/design-atoms) npm package).
3. Obtain a license key for the Design Atoms assembly. If you are a customer of Customer's Canvas, just use a license key provided by our support team or request a trial license key. Use our [help desk system](https://customerscanvas.com/account/cases/add) if you need any help from us with it.
4. Build and run the project. 
 
It should open a page in the browser that allows for selecting a demo sample.
 
## Project structure
 
The `Aurigma.DesignAtoms.Samples` project consists of the following important parts: 
 
- **samples** folder - contains the code of sample apps. Each sample app is located in its own subfolder.
- **scripts** folder - contains some helper reusable code that may be used across several samples. 
- **index.html** - a startup page: contains links to the sample apps.
- **Global.asax.cs** - contains a code that adds endpoints from the Aurigma.DesignAtoms module to your project. If you integrate Design Atoms into your own ASP.NET application, you need to copy the code from `Application_Start` to your project. See the comment in the code for more details. 
 
The most important code is located in subfolders of the **samples** folder. These folders may contain their own readme files with more instructions on how it works. So far, the following samples are available.
 
### demo
 
A kind of a quick start demo. Here, you can see an example of how to work with the front-end library and `CanvasViewer` control. The following features are demonstrated: 
 
- Constructing a design on the client side.
- Changing the colors of all items.
- Changing font settings of a currently selected item.
- Reading item properties of a currently selected item.
 
### backend
 
An example of how to use back-end and front-end libraries together. It demonstrates the following features: 
 
- Constructing a design on the server side.
- Sending the design from a server to a client and vice versa.
- Loading a template from an IDML or PSD file.
- Rendering a design to a JPEG or PDF file on the server.
- Serialization/deserialization of a design to a file system (i.e. save/restore in its own file format). 

### vector-mask

A demo for the mask feature. It illustrates the following features (both client-side and server-side code): 

- Adding a vector mask to different design item types.
- Removing a mask.

### curved-text

A demo for the curved text feature. It demonstrates how to do the following (both server-side and client-side):

- Create a curved text item based on a path and text. 
- Apply it to both plain text and rich formatted text.

### open-type-feature

An example of how to work with OpenType Features of text (such as ligatures, swash, all caps/small caps, subscript/superscript, and many more). It demonstrates: 

- Adding and removing OpenType Features to/from text items on the client and server side.
- Reading OpenType Features and updating the user interface based on them.

### events-demo

An example of how you can detect changes in the design as well as get a selected item. The following features are illustrated: 

- Listening to the product model changes.
- Determining what items and properties are changed.
- Receiving the old and new values.
- Detecting elements being added or removed.
- Detecting an element selection.

### pdf-box-backend

An example of how you can specify safety lines on the server side. The following features are illustrated: 

- Setting the trim box.
- Setting the crop box.
- Setting the bleed box.

### state-fonts-backend

An example of how you can get a list of used fonts from a state file on the server side.

### mockup-backend

An example of how you can assign and delete mockups on the server side. The following features are illustrated:

- Setting images as mockups.
- Deleting mockups.

### background-backend
 
An example of how you can set and delete the background on the server side. The following features are illustrated:
 
- Setting a color as the background.
- Setting an image as the background.
- Deleting the background.

### import
 
An example of how you can upload a PSD or IDML file (with embedded resources) and convert it to a state file on the server side. You can use a controller implemented in this demo as a starting point if you want to use state files as the single design format used in Customer's Canvas.

Note that, to keep things brief, this sample does not implement any validation of the uploaded files. For example, if your application doesn't contain fonts that were applied in a PSD file, it will throw an exception.

## Questions? 
 
If you have any problems or questions on how to get started, feel free to post your questions on the [Customer's Canvas forum](https://forums.aurigma.com/yaf_topics44_Discussions--Customers-Canvas.aspx?src=github) or [submit a support ticket](https://customerscanvas.com/account/cases/add). 
