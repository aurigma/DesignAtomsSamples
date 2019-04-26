# Design Atoms Sample Application

## What is Customer's Canvas and Design Atoms? 

Customer's Canvas is a web-to-print editor by Aurigma, Inc. you can embed to your web application. It allows for editing designs of a products like commercial printing, specialties, apparel, packaging, stickers, wide-print formating, etc. You can learn about at:

https://customerscanvas.com/

Design Atoms is a part of Customer's Canvas editor, it's "core". If you think of Customer's Canvas as about a browser, Design Atoms is similar to DOM API. In other words, it allows working with the elements of a design loaded to the editor (like images, text elements, QR codes, shapes, etc) in a similar manner as you work with HTML elements in JavaScript.

For example, you may create a template in InDesign, import it as a Design Atoms model and then iterate through each element and make some changes. Or you can build a model from a scratch and send it to the editor. Or... you can manipulate designs in various ways!

You may find some documentation here: 

- https://customerscanvas.com/docs/cc/reference-cs.htm
- https://customerscanvas.com/docs/cc/introduction-to-backend-api.htm
- https://customerscanvas.com/docs/cc/introduction-to-iframe-api-v5.htm

## What you will find in this repo? 

This is a sample C#/TypeScript project for Customer's Canvas Design Atoms Framework. It demonstrates how to create a back end for Design Atoms and you can solve various image manipulation tasks at both front end (TypeScript) and back end (C#) using Design Atoms Framework. 

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

The most important code is located in subfolders of the **samples** folder. These folders may contain its own readme files with more instructions on how it works.

## Questions? 

If you have any problems or questions how to get started, feel free to post questions on [Customer's Canvas forum](https://forums.aurigma.com/yaf_topics44_Discussions--Customers-Canvas.aspx?src=github) or [submit a support ticket](https://customerscanvas.com/account/cases/add). 