---
title: "Доступ до Event'у, що створюється в сервісі"
date: 2007-08-23
tags: ["life"]
lang: ua
category: life
---

Сьогодні мав кількагодинний геморой з написанням сервісу. Точніше завдяки кодпроджекту сам сервіс написався на раз ([стаття про те як написати сервіс \[англ.\]](http://www.codeproject.com/system/windows_nt_service.asp)), а от взаємодія його з експлореровським BHO вилилась в здоровецьку проблему. А все через кляті права доступу до об’єктів ядра. Проблема, власне, була в тому, що Windows service який мну написав запускається по дефолту як і всі інші сервіси – від користувача SYSTEM. І от з тим-то і халепа, бо права на доступ до об’єктів ядра, що створються в сервісі виявляються спартанськими і звичанйому смертному, чи то пак додатку запущенному користувачем його не відкрити. Була купа ідей як його зробити, але зрештою як завжди допоміг Гугль, який вивів мене спочатку [сюди](http://discuss.joelonsoftware.com/default.asp?joel.3.226319.5), а потім і [сюди](http://www.delphikingdom.ru/asp/viewitem.asp?catalogid=1322). В результаті і народилось рішення.

Некрасиве, несек’юрне, але робоче:

```
SECURITY_DESCRIPTOR sd;
InitializeSecurityDescriptor( &sd, SECURITY_DESCRIPTOR_REVISION );
SetSecurityDescriptorDacl( &sd, TRUE, NULL, FALSE );
SECURITY_ATTRIBUTES sa;
sa.nLength = sizeof(SECURITY_ATTRIBUTES);
sa.lpSecurityDescriptor = &sd;
sa.bInheritHandle = false;
ATL::CEvent event; event.Create( &sa, 1, 0, c_eventName );
```

В результаті маємо об’єкт Event з доступом для службового користувача “Everyone”. Отаке. Можна, звісно, позаморачуватись з токенами, видирати ім’я залогіненого користувача і виставляти доступ лише для нього, але то такий геморой…
