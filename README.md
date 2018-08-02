# IC-bact-tracker-2018

[![Waffle.io - Columns and their card count](https://badge.waffle.io/bkeith20/IC-bact-tracker-2018.svg?columns=all)](https://waffle.io/bkeith20/IC-bact-tracker-2018)


### To begin work on this project: <br>
  If you do not already have node and create-react-native-app installed
  1. install [Node](https://nodejs.org/en/download/)
  2. Use npm to install create-react-native-app in the terminal or command prompt using the command: <br>
      `npm install -g create-react-native-app`
  
  3. You will need to create a new app in order to copy it's node_modules folder. To do so run: <br>
      `create-react-native-app AwesomeProject`
      
  4. Next clone or download this project and copy the node_modules folder from the new project you just created into the folder named BactTracker in this project. 
  5. Again in the terminal or command prompt, make sure that you navigate into the BactTracker folder and run the following commands one at a time to install the packages being used in this project. 
      ```
      npm install react-native-keyboard-aware-scroll-view
      npm install tcomb-form-native
      npm install react-navigation
      npm install react-native-popup-menu
      npm install react-native-maps
      npm link
      ```
      
  6.  Install the expo app on your phone.
  7.  You can run the app to view it on your phone either through the terminal/command prompt using the command `npm start` within the BactTracker folder or by downloading the [expo XDE](https://github.com/expo/xde/releases) and running the project from that.
  8. Create a branch and start working! you can view live updates as you change the code by refreshing the app on your phone.Just save your changes while the project is running (step 7) and refresh to see your changes.
  
  For more information check the [React Native](https://facebook.github.io/react-native/docs/getting-started.html) and 
  [Expo](https://expo.io/) pages.
  
  Cant figure out how to implement a feature you want using the basic React Native components or the expo packages? Google it! React Native is open source and there are many great packages that you can use to acheive what you want simply by installing them to the project using npm! If you do use a new package to change something in the project or add a new feature, be sure to let the rest of the contributors know so that they can also install the package as the node_modules folder where the installed packages are stored is too large to continually commit to the github project. 
  
  Note: If a package you are interested in lists separate steps to do to link the package for android and ios, it will likely not be useable in the project without ejecting the project from expo. Talk to the rest of the contributors if you think the package is necessary to decide if the project should be ejected as ejecting from expo is not reversable. See the 
  [Expo Docs](https://docs.expo.io/versions/latest/) for more information about the ejecting process and other questions about expo.
