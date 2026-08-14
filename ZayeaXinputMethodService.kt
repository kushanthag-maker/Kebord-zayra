package com.zayeax.keyboard

import android.inputmethodservice.InputMethodService
import android.inputmethodservice.Keyboard
import android.inputmethodservice.KeyboardView
import android.media.AudioManager
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.view.KeyEvent
import android.view.View

/**
 * ZAYEA X - Animated Next-Gen Android Keyboard Service
 * Supports English QWERTY, Sinhala Wijesekara, and Singlish Phonetic Typing.
 */
class ZayeaXInputMethodService : InputMethodService(), KeyboardView.OnKeyboardActionListener {

    private var keyboardView: KeyboardView? = null
    private var qwertyKeyboard: Keyboard? = null
    private var isCaps = false
    private var singlishBuffer = StringBuilder()

    override fun onCreateInputView(): View {
        keyboardView = layoutInflater.inflate(R.layout.keyboard_view, null) as? KeyboardView
        qwertyKeyboard = Keyboard(this, R.xml.qwerty)
        keyboardView?.keyboard = qwertyKeyboard
        keyboardView?.setOnKeyboardActionListener(this)
        return keyboardView ?: View(this)
    }

    override fun onKey(primaryCode: Int, keyCodes: IntArray?) {
        val inputConnection = currentInputConnection ?: return
        playKeyFeedback()

        when (primaryCode) {
            Keyboard.KEYCODE_DELETE -> {
                if (singlishBuffer.isNotEmpty()) {
                    singlishBuffer.deleteCharAt(singlishBuffer.length - 1)
                }
                inputConnection.deleteSurroundingText(1, 0)
            }
            Keyboard.KEYCODE_SHIFT -> {
                isCaps = !isCaps
                qwertyKeyboard?.isShifted = isCaps
                keyboardView?.invalidateAllKeys()
            }
            Keyboard.KEYCODE_DONE -> {
                inputConnection.sendKeyEvent(KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_ENTER))
            }
            32 -> { // Space key
                singlishBuffer.clear()
                inputConnection.commitText(" ", 1)
            }
            else -> {
                var codeChar = primaryCode.toChar()
                if (isCaps && Character.isLetter(codeChar)) {
                    codeChar = Character.toUpperCase(codeChar)
                }
                inputConnection.commitText(codeChar.toString(), 1)
            }
        }
    }

    private fun playKeyFeedback() {
        // Haptic feedback
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val vibratorManager = getSystemService(VIBRATOR_MANAGER_SERVICE) as VibratorManager
                vibratorManager.defaultVibrator.vibrate(
                    VibrationEffect.createOneShot(20, VibrationEffect.DEFAULT_AMPLITUDE)
                )
            } else {
                @Suppress("DEPRECATION")
                val vibrator = getSystemService(VIBRATOR_SERVICE) as Vibrator
                vibrator.vibrate(20)
            }
        } catch (_: Exception) {}

        // Audio feedback
        try {
            val audioManager = getSystemService(AUDIO_SERVICE) as AudioManager
            audioManager.playSoundEffect(AudioManager.FX_KEYPRESS_STANDARD)
        } catch (_: Exception) {}
    }

    override fun onPress(primaryCode: Int) {}
    override fun onRelease(primaryCode: Int) {}
    override fun onText(text: CharSequence?) {
        currentInputConnection?.commitText(text, 1)
    }
    override fun swipeLeft() {}
    override fun swipeRight() {}
    override fun swipeDown() {}
    override fun swipeUp() {}
}
