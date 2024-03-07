This is a boilerplate project for building mobile apps, using Cordova.  

### **To build whole application, go to the root project directory and see *readme.md* file.**  
..........................................................................................  
### The following instructions are only for this module.

First, you need to have dependencies installed
```
npm ci
```  

To run app in browser:
```
npm start
```  

## Android build  
[Instructions](https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html)  

- install Java JDK 8  
oracle: [Oracle download page](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)  
open JDK: 
```
$ sudo apt-get update
$ sudo apt-get install openjdk-8-jdk
$ sudo apt install openjdk-8-jdk-headless
```  

- install [Gradle](https://gradle.org/install/)  
Linux:  
[download binary](https://gradle.org/next-steps/?version=7.1.1&format=bin), then:  
```
$ sudo mkdir /opt/gradle
$ sudo unzip -d /opt/gradle {your-download-directory}/gradle-7.1.1-bin.zip
$ sudo ln -s /opt/gradle/gradle-7.1.1/bin/gradle /usr/bin/gradle
```  

- install [Android Studio](https://developer.android.com/studio/index.html)
- add [SDK Packages](https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#adding-sdk-packages)
- add [SDK Tools](https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#android-sdk-tools)
- add env variables  
Linux:  
```
$ sudo nano /etc/environment

PATH="/home/{user}/Android/Sdk/platform-tools:/home/{user}/Android/Sdk/tools:/home/{user}/Android/Sdk/emulator"
ANDROID_SDK_ROOT=/home/{user}/Android/Sdk

$ source /etc/environment
```

- Open fresh terminal and check requirements:
```
$ cordova requirements
```  

- If everything is fine, we can finally run the build command:
```
$ cordova build android
```
### Emulator  
- open android studio  
- Tools > AVD  
- {device} Edit
- set proper Android version to meet installed Android SDK (Tools > SDK Manager)  
- then:
```
$ cordova emulate:android
```
When you face error like this:
```
emulator: ERROR: x86 emulation currently requires hardware acceleration!
```
- enable Virtualization Technology (VT) in your BIOS setup  
- and install the following package:
```
$ sudo apt-get install qemu-kvm
```
- to check VT status:  
```
$ sudo apt install cpu-checker
$ kvm-ok
```