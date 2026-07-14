-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.swmansion.gesturehandler.** { *; }

# react-native-maps
-keep class com.google.android.gms.** { *; }
-keep class com.google.maps.** { *; }

# Firebase
-keep class com.google.firebase.** { *; }

# react-native-vector-icons
-keep class com.oblador.vectoricons.** { *; }

# Hermes
-keep class com.facebook.hermes.unicode.** { *; }

-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable
-keep public class * extends java.lang.Exception
