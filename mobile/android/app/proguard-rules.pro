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

# @react-native-async-storage/async-storage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# @react-native-firebase (messaging)
-keep class io.invertase.firebase.** { *; }
-dontwarn io.invertase.firebase.**

# @react-native-google-signin/google-signin
-keep class com.google.android.gms.auth.** { *; }
-keep class com.reactnativegooglesignin.** { *; }
-dontwarn com.google.android.gms.**

# @react-native-voice/voice
-keep class com.wenkesj.voice.** { *; }

# react-native-document-picker
-keep class com.reactnativedocumentpicker.** { *; }

# react-native-fast-image (Glide)
-keep public class com.bumptech.glide.** { *; }
-keep class * extends com.bumptech.glide.module.AppGlideModule
-dontwarn com.bumptech.glide.**

# react-native-image-picker
-keep class com.imagepicker.** { *; }

# react-native-permissions
-keep class com.zoontek.rnpermissions.** { *; }

# react-native-splash-screen
-keep class org.devio.rn.splashscreen.** { *; }

# react-native-screens / safe-area-context / gesture-handler native views
-keep class com.swmansion.rnscreens.** { *; }
-keep class com.th3rdwave.safeareacontext.** { *; }

# Production Security: Remove debug logging calls in Release build
-assumenosideeffects class android.util.Log {
    public static *** v(...);
    public static *** d(...);
    public static *** i(...);
}
