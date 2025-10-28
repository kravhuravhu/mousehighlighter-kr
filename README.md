📄 README.md
# Mouse Highlighter (KR Edition)

**UUID:** `mousehighlighter-kr@kravhuravhu.github.io`  
A GNOME Shell extension that shows an animated blue pulse around your mouse pointer.  
Toggle available directly in the **Date & Time panel**, next to “Do Not Disturb button”.

---

## ✨ Features

- Blue animated pulse follows your mouse
- Slight delay (1%) for a smooth trailing effect
- Toggle switch integrated into the GNOME calendar menu
- Lightweight and easy to use

---

## 📦 Installation

1. Clone or download this repository into your local GNOME Shell extensions folder:

```bash
git clone https://github.com/kravhuravhu/mousehighlighter-kr.git
```

2. Copy or move the directory to:

```bash
  ~/.local/share/gnome-shell/extensions/mousehighlighter-kr@kravhuravhu.github.io
```

3. Restart GNOME Shell:
#### _X11_:
```bash
Alt + F2
```
```bash
type → r → press Enter
```
or type this command on your terminal:
```bash
  gnome-shell --replace &
```

#### _Wayland_:
```bash
  Log out and log back in
```

4. Enable the extension:
####_Rename The Folder To_:
```
mousehighlighter-kr@kravhuravhu.github.io
```
#####_And then run_:
```bash
  gnome-extensions enable mousehighlighter-kr@kravhuravhu.github.io
```

---

## 📁 File Structure
```bash
mousehighlighter-kr@kravhuravhu.github.io/
├── extension.js
├── highlight.js
├── style.css
├── metadata.json
└── README.md
```

## 🧪 Tested On
```bash
  GNOME Shell 46
  Ubuntu 24.04.2 LTS
  Dell Latitude 7410
```
X11 and Wayland (note: pointer tracking may vary on Wayland)

---

## 🛠 Author
##### Made by Khuliso J. Ravhuravhu
- This is part of a growing collection of custom GNOME extensions.

---
