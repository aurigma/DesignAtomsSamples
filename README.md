# Design Atoms Sample Application
 
## What is Customer's Canvas and Design Atoms? 
 
Customer's Canvas is a web-to-print editor by Aurigma, Inc. you can embed to your web application. It allows for editing designs of a products like commercial printing, specialties, apparel, packaging, stickers, wide-print formating, etc. You can learn about at:
 
https://customerscanvas.com/
 
Design Atoms is a part of Customer's Canvas editor, it's "core". If you think of Customer's Canvas as about a browser, Design Atoms is similar to DOM API. In other words, it allows working with the elements of a design loaded to the editor (like images, text elements, QR codes, shapes, etc) in a similar manner as you work with HTML elements in JavaScript.
 
For example, you may create a template in InDesign, import it as a Design Atoms model and then iterate through each element and make some changes. Or you can build a model from a scratch and send it to the editor. Or... you can manipulate designs in various ways!
 
You may find some documentation here: 
 
- https://customerscanvas.com/docs/cc/design-atoms-fw.htm
- https://customerscanvas.com/docs/cc/using-design-atoms-fw.htm
- https://customerscanvas.com/docs/cc/introduction-to-iframe-api-v5.htm
 
## What you will find in this repo? 
 
This is a sample C#/TypeScript project for Customer's Canvas Design Atoms Framework. It demonstrates how to create a back end for Design Atoms and you can solve various image manipulation tasks at both front end (TypeScript) and back end (C#) using Design Atoms Framework.

From time to time we update the project and add new demos/samples. See the [CHANGELOG](CHANGELOG.md) for details.  

## Online Demo

You can [try this demo here.](https://h2.customerscanvas.com/online-demo/design-atoms-samples/)
 
## How to get started? 
 
1. Clone this project, open it in Visual Studio. 
2. Make sure that all the dependencies from Nuget and npm are loaded (including [Aurigma.DesignAtoms](https://www.nuget.org/packages/Aurigma.DesignAtoms/) Nuget package and [@aurigma/design-atoms](https://www.npmjs.com/package/@aurigma/design-atoms) npm package).
3. Obtain a license key for Design Atoms assembly. If you are a customer of Customer's Canvas, just use a license key provided by our support team or request a trial license key. Use our [help desk system](https://customerscanvas.com/account/cases/add) if you need any help from us with it.
4. Build and run the project. 
 
It should open a page in a browser which allows choosing a demo app to play around with. 
 
## Project structure
 
The Aurigma.DesignAtoms.Samples project consists the following important parts: 
 
- **samples** folder - contains the code of sample apps. Each sample app is located in its own subfolder.
- **scripts** folder - contains some helper reusable code which may be used across several samples. 
- **index.html** - a startup page, contains links to the sample apps.
- **Global.asax.cs** - contains a code which adds endpoints from the Aurigma.DesignAtoms module to your project. If you integrate Design Atoms to your own ASP.NET application, you need to copy the code from `Application_Start` to your project. See the comment in the code for more details. 
 
The most important code is located in subfolders of the **samples** folder. These folders may contain its own readme files with more instructions on how it works. So far the following samples are available.
 
### demo
 
A kind of a quick start demo. Here you can see an example how to work with front end library and CanvasViewer control. The following features are demonstrated: 
 
- Constructing a design on a client side
- Changing color of all items
- Changing font settings of a currently selected item
- Reading item properties of a currently selected item
 
### backend
 
An example how to use back end and front end libraries together. It demonstrates the following features: 
 
- Constructing a design on a server side
- Sending the design from a server to a client and backward
- Loading a template from IDML or PSD file
- Rendering a design as JPEG and PDF on the server
- Serialization/deserialization of a design to a file system (i.e. save/restore using its own file format). 

### vector-mask

A demo for the mask feature. It illustrates the following features (both client-side and server-side code): 

- Adding a vector mask to different item types
- Removing a mask

### curved-text

A demo for the curved text feature. It demonstrates how to do the following (both server-side and client-side):

- Create a curved text element based on a path and a text 
- Apply it both for the plain text and rich formatted text

### open-type-feature

An example how to work with OpenType Features of a text (such as ligatures, swash, all caps/small caps, subscript/superscript and many more). It demonstrates: 

- Adding or removing OpenType Feature from a text element on a client and server side
- Reading OpenType Features and updating the user interface based on them.

### events-demo

An example how you can detect changes in the design as well as get a selected item. The following features is illustrated: 

- Listening to the product model changes
- Determining what items and its properties are changed
- Receiving old and new values
- Detecting adding/removing elements
- Detecting element selection

### pdf-box-backend

An example how you can specify safety lines at server side. The following features is illustrated: 

- Set trim box
- Set crop box
- Set bleed box

### state-fonts-backend

An example how you can get list of used fonts from state file at server side.

### mockup-backend

An example how you can set and delete mockup at server side. The following features is illustrated:

- Set image as mockup
- Delete mockup

### background-backend
 
An example how you can set and delete background at server side. The following features is illustrated:
 
- Set color as background
- Set image as background
- Delete background

## Questions? 
 
If you have any problems or questions how to get started, feel free to post questions on [Customer's Canvas forum](https://forums.aurigma.com/yaf_topics44_Discussions--Customers-Canvas.aspx?src=github) or [submit a support ticket](https://customerscanvas.com/account/cases/add). 
