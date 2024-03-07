This is a boilerplate project for building web apps, using electron and electron forge.  

### **To build whole application, go to the root project directory and see *readme.md* file.**  
..........................................................................................  
### The following instructions are only for this module.

First, you need to have dependencies installed
```
npm ci
```

Then, copy your web application static files into:  
**/electron/app**  

## Linux/deb build  
To build application on linux/deb you need to install the following deps:  
```
sudo apt install dpkg
sudo apt install fakeroot
```

Then run:  
```
npm run make-linux
```

Built application is in **/electron/out**  
- linux/deb .deb installer: **/electron/out/make/deb/x64/**  