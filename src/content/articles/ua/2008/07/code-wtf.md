---
title: "Code WTF"
date: 2008-07-10
tags: ["life"]
lang: ua
category: life
---

Вчора потрібно було пофіксити багу в продукті і поки придивлявся місце для фіксу натрапив на таке:

```
ATL::CString strText;
SYSTEMTIME st = {0};
GetLocalTime(&st);

if (st.wHour<10)
  strText.Format(_T("%d/%d/%d, 0%d:%d"), st.wDay,st.wMonth,st.wYear, st.wHour, st.wMinute);
else
  strText.Format(_T("%d/%d/%d, %d:%d"), st.wDay,st.wMonth ,st.wYear, st.wHour, st.wMinute);
  
m_date.SetWindowText(strText);
```

Ні, код абсолютно робочий, але ж…

```
m_date.SetWindowText(CTime::GetCurrentTime().Format(_T("%d/%m/%Y %H:%M")));
```

По-моєму, краще, нє?

P.S. До речі, мабуть заведу собі в блозі відповідний розділ з wtf’ами 🙂
