# Project Coalition
This project allows users create a map based React Native application.
The maps will anyone who has this application to quickly create a private map, and share the map code with their friends.
Everyone who has the code can join this private map.
Once individuals have joined the map they can:
(1) see all the individuals in the group on the map; and
(2) place markers with descriptions to interact with other individuals.

## Technology stack
1. React Native - iOS and Android
2. Google Firebase - for storing realtime data
3. Expo - for testing and preliminary deployment of the application.
4. Jest - Snapshot testing used in development.

## Pre-requisites to run the application.
The following applications must be installed on your computer.
1. NPM (Node Packet Manager), this can be downloaded from https://www.npmjs.com/get-npm.
2. Either the Expo XDE or Expo CLI installed on your computer (Expo is the React Native Development suite used for this application), this can be downloaded from https://expo.io/tools.
3. Expo client (either Android or iOS) installed on your phone.

## Installation process
Please note. due to this application using a number of various components, the following installation process must be strictly followed:

0. After cloning the repository, navigate into the "tochurnote" folder.
1. Type "npm install react-native-elements", this will install the react-native-elements node modules.
2. Type "npm install", this will install all other remaining node module dependencies.
3. Run Expo, by either running the project on the Expo XDE (please use "tunnel" settings if using on University wifi), or typing "exp start --tunnel" (note. This step requires installation of Expo CLI and setting up of PATH dependencies under "Edit Environment variables" settings on Windows, please check alternatives for Mac users)
4. Once the project has deployed, scan the QR code on your phone to launch the project on your phone.
5. Enjoy!

Please note. the react-native-elements node module MUST be installed first for this application to work.

## Guide to use the application.

This application has specifically been set up to avoid the hassle of signing up to use the application.
Once installed and opened you can go create your first map!
There are primarily two groups of users:
1. Hosts - who set up the map and code.
2. Participants - who enter a map using a given code.

Once inside the map the functionality between the Hosts and participants are identical, except that hosts are able to delete the map.

Our application is made up of three main components.

0. Login Screen
1. Setting up Page
2. Map page

If there are any issues in the installation process please contact James Won at jwon117@aucklanduni.ac.nz.