# Design Atoms Samples Project Changelog

## 01/07/2020 - Upgrade Design Atoms to 5.17.1 and New Import Sample

Updated Design Atoms to the latest 5.17.1 version. 

Added a new sample - **import**. It demonstrates how to import PSD or IDML files to states. In the user interface, you have a file input which allows uploading a PSD or IDML template. The States controller now has an Import action which demonstrates how you can convert these files to State files and save them.  

## 10/31/2019 - Upgrade Design Atoms to 5.12.1

Updated Design Atoms to 5.12.1. Several dependenices was updated to address the security warning of the `npm audit`.

## 09/30/2019 - Update Vector Mask Demo and upgrade Design Atoms to 5.10.0

Up to date list of demos in the readme file. Added website with online demo.

### Updating old demos
- **vector-mask** demo correctly removes vector mask from items.

## 08/27/2019 - New demos and upgrade Design Atoms to 5.7.1

_**IMPORTANT! Make sure that you restore NuGet packages and update npm packages before compiling the project. Now it requires Design Atoms 5.7.1. **_

### New demos

- **change-background** demo - explains how to change the background to a color or image
- **change-mockup** demo - explains how to apply or remove mockup.

### Updating old demos

- **open-type-feature** demo has been updated in accordance with the new data model


## 05/29/2019 - New features of Design Atoms 5.0.1

_**IMPORTANT! Make sure that you restore NuGet packages and update npm packages before compiling the project. Now it requires Design Atoms 5.0.1. **_

### New demos

- **open-type-feature** demo - explains how to deal with OpenType Features of a text.
- **vector-mask** demo - explains how to work with masks on elements. 
- **curved-text** demo - explains how to create different kind of curved text elements (both with plain text and rich text formatting).
- **events-demo** demo - shows how to detect changes and selection of the design

### Improvements of backend demo

Added an example how to load designs from InDesign (.idml) and Photoshop (.psd) templates. 

## 05/14/2019 - Backend demo - serialize/deserialize sample

Improved the **backend** demo - now it shows not only how to load the product from a server, but also how to upload changes to the server, save it as a State File and restore a State File back.  

## 05/08/2019 - Backend demo (initial)

Added a new demo (see the **backend** folder) which explains how to generate a product on a server and send it to the frontend. Also, it demonstrates how to render the result. 

## 04/26/2019 - Initial release

Initial project contains only one Quick Start demo explaining how to use main Design Atoms features on the front end (see the **demo** folder).
