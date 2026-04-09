package com.example.emojikeyboard

import android.inputmethodservice.InputMethodService
import android.view.KeyEvent
import android.view.View
import android.view.inputmethod.EditorInfo
import android.widget.Button

/**
 * שירות מקלדת האמוג'י — מרחיב InputMethodService.
 *
 * תכונות:
 * - מקלדת QWERTY אנגלית ועברית (מעבר בכפתור EN↔עב)
 * - כשמקישים רווח: בודק את המילה האחרונה לפני הסמן
 *   - אם קיימת במילון → מוחק את המילה ומוסיף אמוג'י + רווח
 *   - אחרת → מוסיף רווח רגיל
 *
 * ארכיטקטורה:
 * - שני קבצי layout נפרדים: keyboard_english.xml ו-keyboard_hebrew.xml
 * - שניהם משתמשים באותם מזהי כפתורים (btn_q, btn_w, ...) מבוססי מיקום QWERTY
 * - hebrewCharMap ממפה כל מזהה-כפתור לתו העברי המתאים
 */
class EmojiKeyboardService : InputMethodService() {

    private var isHebrew = false

    // מיפוי מיקום QWERTY → תו עברי (מקלדת ישראלית תקנית)
    private val hebrewCharMap: List<Pair<Int, String>> by lazy {
        listOf(
            // שורה 1: q w e r t y u i o p
            R.id.btn_q to "/",
            R.id.btn_w to "'",
            R.id.btn_e to "ק",
            R.id.btn_r to "ר",
            R.id.btn_t to "א",
            R.id.btn_y to "ט",
            R.id.btn_u to "ו",
            R.id.btn_i to "ן",
            R.id.btn_o to "ם",
            R.id.btn_p to "פ",
            // שורה 2: a s d f g h j k l
            R.id.btn_a to "ש",
            R.id.btn_s to "ד",
            R.id.btn_d to "ג",
            R.id.btn_f to "כ",
            R.id.btn_g to "ע",
            R.id.btn_h to "י",
            R.id.btn_j to "ח",
            R.id.btn_k to "ל",
            R.id.btn_l to "ך",
            // שורה 3: z x c v b n m
            R.id.btn_z to "ז",
            R.id.btn_x to "ס",
            R.id.btn_c to "ב",
            R.id.btn_v to "ה",
            R.id.btn_b to "נ",
            R.id.btn_n to "מ",
            R.id.btn_m to "צ",
            // תווים עבריים נוספים (שורה 3 מורחבת במקלדת העברית)
            R.id.btn_extra_1 to "ת",
            R.id.btn_extra_2 to "ץ",
            R.id.btn_extra_3 to "ף"
        )
    }

    // מיפוי מיקום QWERTY → תו אנגלי (26 אותיות)
    private val englishCharMap: List<Pair<Int, String>> by lazy {
        listOf(
            R.id.btn_q to "q", R.id.btn_w to "w", R.id.btn_e to "e",
            R.id.btn_r to "r", R.id.btn_t to "t", R.id.btn_y to "y",
            R.id.btn_u to "u", R.id.btn_i to "i", R.id.btn_o to "o",
            R.id.btn_p to "p", R.id.btn_a to "a", R.id.btn_s to "s",
            R.id.btn_d to "d", R.id.btn_f to "f", R.id.btn_g to "g",
            R.id.btn_h to "h", R.id.btn_j to "j", R.id.btn_k to "k",
            R.id.btn_l to "l", R.id.btn_z to "z", R.id.btn_x to "x",
            R.id.btn_c to "c", R.id.btn_v to "v", R.id.btn_b to "b",
            R.id.btn_n to "n", R.id.btn_m to "m"
        )
    }

    // ─── מחזור חיים ───────────────────────────────────────────────────────

    override fun onCreateInputView(): View = inflateKeyboard()

    // ─── בניית ה-View ──────────────────────────────────────────────────────

    private fun inflateKeyboard(): View {
        val layoutRes = if (isHebrew) R.layout.keyboard_hebrew else R.layout.keyboard_english
        val view = layoutInflater.inflate(layoutRes, null)
        setupKeys(view)
        return view
    }

    private fun setupKeys(view: View) {
        val charMap = if (isHebrew) hebrewCharMap else englishCharMap
        charMap.forEach { (resId, char) ->
            view.findViewById<Button>(resId)?.setOnClickListener { commitLetter(char) }
        }

        view.findViewById<Button>(R.id.btn_space)?.setOnClickListener { onSpacePressed() }
        view.findViewById<Button>(R.id.btn_backspace)?.setOnClickListener { onBackspacePressed() }
        view.findViewById<Button>(R.id.btn_enter)?.setOnClickListener { onEnterPressed() }
        view.findViewById<Button>(R.id.btn_lang)?.setOnClickListener {
            isHebrew = !isHebrew
            setInputView(inflateKeyboard())
        }
    }

    // ─── לוגיקת לחיצות ────────────────────────────────────────────────────

    /** מחייב תו בודד לשדה הטקסט הפעיל */
    private fun commitLetter(char: String) {
        currentInputConnection?.commitText(char, 1)
    }

    /**
     * לחיצת רווח:
     * 1. קורא את הטקסט לפני הסמן (עד 100 תווים)
     * 2. מחלץ את המילה האחרונה (אחרי רווח/שורה חדשה אחרונה)
     * 3. אם המילה קיימת במילון → מוחק ומחליף באמוג'י + רווח
     * 4. אחרת → מוסיף רווח רגיל
     */
    private fun onSpacePressed() {
        val ic = currentInputConnection ?: run {
            return
        }

        val textBefore = ic.getTextBeforeCursor(100, 0)?.toString() ?: ""
        // המילה האחרונה: הטקסט אחרי הרווח/שורה חדשה האחרונים
        val lastWord = textBefore
            .trimEnd()
            .substringAfterLast(" ")
            .substringAfterLast("\n")

        val emoji = if (lastWord.isNotEmpty()) EmojiDictionary.lookup(lastWord) else null

        if (emoji != null) {
            // מחק את המילה והכנס אמוג'י + רווח
            ic.deleteSurroundingText(lastWord.length, 0)
            ic.commitText("$emoji ", 1)
        } else {
            ic.commitText(" ", 1)
        }
    }

    /** מוחק תו אחד לפני הסמן */
    private fun onBackspacePressed() {
        val ic = currentInputConnection ?: return
        // אם יש טקסט composing — נקה אותו; אחרת מחק תו אחד
        if (!ic.deleteSurroundingText(1, 0)) {
            ic.sendKeyEvent(KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_DEL))
            ic.sendKeyEvent(KeyEvent(KeyEvent.ACTION_UP, KeyEvent.KEYCODE_DEL))
        }
    }

    /**
     * מקש Enter:
     * - אם לשדה יש פעולת IME (שלח, חפש, הבא וכו') → בצע אותה
     * - אחרת → הכנס שורה חדשה
     */
    private fun onEnterPressed() {
        val editorInfo = currentInputEditorInfo
        val action = editorInfo?.imeOptions?.and(EditorInfo.IME_MASK_ACTION)
            ?: EditorInfo.IME_ACTION_NONE

        if (action != EditorInfo.IME_ACTION_NONE && action != EditorInfo.IME_ACTION_UNSPECIFIED) {
            currentInputConnection?.performEditorAction(action)
        } else {
            currentInputConnection?.commitText("\n", 1)
        }
    }
}
