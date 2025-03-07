package expo.modules.betterhaptics

import android.content.Context
import android.view.View
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView

class ExpoBetterHapticsView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  // Simple empty view - we don't need any UI for haptics
  init {
    // Set a minimal layout size
    layoutParams = LayoutParams(10, 10)
  }
}
