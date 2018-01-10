---
weight: 20
---


## Introduction

Chat.io for iOS allows you to integrate [chat.io](https://www.chat.io) chat window into your iOS app.

[![Carthage compatible](https://img.shields.io/badge/Carthage-compatible-4BC51D.svg?style=flat)](#carthage)
[![Version](https://img.shields.io/cocoapods/v/LiveChat.svg?style=flat)](http://cocoapods.org/pods/LiveChat)
[![License](https://img.shields.io/cocoapods/l/LiveChat.svg?style=flat)](http://cocoapods.org/pods/LiveChat)
[![Platform](https://img.shields.io/cocoapods/p/LiveChat.svg?style=flat)](http://cocoapods.org/pods/LiveChat)

## Requirements

- iOS 9.0+
- Xcode 8.0+

## Installation

### Carthage

If you use [Carthage](https://github.com/Carthage/Carthage) to manage your dependencies, simply add the library to your `Cartfile`.

```
github "livechat/chat-window-ios" ~> 2.0
```

Make sure you have added `LiveChat.framework` to the "_Linked Frameworks and Libraries_" section of your target, and have include it in your Carthage framework copying build phase.

### CocoaPods

If you use [CocoaPods](http://cocoapods.org) to manage your dependencies, simply add the library to your `Podfile`.

```
pod 'LiveChat', '~> 2.0'
```

### Manual Installation

You can integrate chat.io into your project manually without using a dependency manager.

#### Swift

Just drag all files from the `LiveChat/Classes` directory into your project.

#### Objective-C

Drag all files from the `LiveChat/Classes` directory into your project. When adding first `*.swift` file to Objective-C project, Xcode will ask you to create a Bridging Header. It is not necessary for LiveChat to work, so you can decline unless you plan to call Swift code from Objective-C. More information about bridging headers and Swift and Objective-C interoperability can be found [here](https://developer.apple.com/library/ios/documentation/Swift/Conceptual/BuildingCocoaApps/MixandMatch.html). You need to put following import statement: `#import "<Your Project Name>-Swift.h"` at the top of your .m file.

Also, for Objective-C projects, you need to set the **Embedded Content Contains Swift Code** flag in your project to `Yes` (found under **Build Options** in the **Build Settings** tab).

## Usage

### Initalization

```swift
import LiveChat

LiveChat.licenseId = "YOUR_CHATIO_LICENSE_ID"
```

### Presenting Chat Widget

```swift
LiveChat.presentChat()
```

### Setting Custom Variables

You can provide customer name or email if they are known, so customer will not need to fill pre-chat survey:

```swift
LiveChat.name = "iOS Widget Example"
LiveChat.email = "example@chat.io"
```

If you want to associate some additional info with your customer, you can set Custom Variables:

```swift
LiveChat.setVariable(withKey:"Variable name", value:"Some value")
```

### Notifying user about agent response

You can notifiy your user about agent response if chat was minimized by the user. To handle incoming messages your class must implement `LiveChatDelegate` protocol and set itself as `LiveChat.delegate`.

```swift
class YOUR_CLASS_NAME : LiveChatDelegate { // Your class need to implement LiveChatDelegate protocol
	func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
		LiveChat.licenseId = "YOUR_CHATIO_LICENSE_ID"
		LiveChat.delegate = self // Set self as delegate

		return true
	}

	func received(message: LiveChatMessage) {
		print("Received message: \(message.text)")
		// Handle message here
	}
}
```

### Handling URL

By default, all links in chat messages are opened in Safari browser. To change this behavior you can use the `LiveChatDelegate` to handle URL's yourself.

```swift
func handle(URL: URL) {
	print("URL is \(URL.absoluteString)")
	// Handle URL here
}
```

### Sending Photos from device library

If you have file sharing enabled for visitors, you should provide usage description by including `NSPhotoLibraryUsageDescription` (`Privacy - Photo Library Usage Description`) key in your `Info.plist` file to avoid crash on iOS 10 or higher.

## Example Apps

Example apps can be found in the `Examples` folder. Samples for both Swift and Objective-C are provided.

## Getting help

Any questions? <a href="#" onclick="LC_API.open_chat_window();return false;">Chat with us!</a>

## License

chat.io for iOS is available under the MIT license. See the LICENSE file for more info.
