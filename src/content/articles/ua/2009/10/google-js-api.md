---
title: "Google JS API"
date: 2009-10-22
tags: ["api", "google", "javascript", "jquery", "js"]
lang: ua
---

![Google Code](http://res.cloudinary.com/dsic6qnnl/image/upload/v1503359651/code_logo_vje0rh.png "Google Code")Ті, хто займаються Вебом, звісно, давно знають про цю фічу, тому я публікую це не стільки в розрахунку на когось, скільки на згадку собі, бо задовбався при створоенні кожного нового сайту шукати в шаблонах старих сайтів ці заповітні декілька рядків:

google.load("jquery", "1.3.2");

Фрагмент вище дозволяє завантажувати потрібну версію _jQuery_ прямо з Гугла і при виході нової версії не потрібно щось перезаливати на свій сайт – лише змінити в шаблоні заголовку сторінки номер версії і все готово.

Звісно ж таким чином можна завантажувати не лише _jQuer_y, а й декілька інших Javascript-фреймворків. На сторінці [Google AJAX Libraries API](http://code.google.com/apis/ajaxlibs/documentation/) можна знайти всі бібліотеки та їх версії, що наразі підтримуються.

Більше того, таким чином можна також завантажувати Javascript’ові сервіси Гугла, наприклад такі як [Google Maps](http://maps.google.com/), але для того доведеться звісно ж при завантаженні _JSAPI_ вказати _API Key_, який отримується [тут](http://code.google.com/apis/ajaxsearch/signup.html) під конкретний домен. Тобто загальний вигляд підключення _Google Maps API_ виглядатиме так:

google.load("maps", "2");

Детальніше про роботу з _JSAPI_ можна знайти на сторінці [Google AJAX API](http://code.google.com/intl/uk-UA/apis/ajax/documentation/).
