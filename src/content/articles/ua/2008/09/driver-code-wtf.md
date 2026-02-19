---
title: "Driver code WTF"
date: 2008-09-25
tags: ["code", "wtf", "software-engineering"]
lang: ua
category: software-engineering
---

Вчора наш драйверщик шукаючи одну багу в коді драйвера знайшов іншу, непримітну, залишену колишнім розробником цього драйвера. Знайдіть її і ви. Це гарна вправа на знання деяких хитрих програмістських методик.

Сирці я трохи підравив, повикидавши згадки назви драйверу та більшу частину несуттєвого до баги коду і додавши своє визначення SecurityCookie (це, до речі, теж підказка 😉 ).

```
ULONG SecurityCookie = 0xDEADBEEF;
[ ... skipped ... ]

pUserNotificationMap->MappedSize = FloatingUnitSize + sizeof(NOTIFICATION_MAP) + sizeof(SecurityCookie);
pUserNotificationMap->MappedUnits = 1;
RtlCopyBytes( &pUserNotificationMap->NotificationUnit[0].NotificationInfo, &NotifInfo, sizeof(NotifInfo) );
*((PULONG)((PCHAR)pUserNotificationMap+pUserNotificationMap->MappedSize)) = SecurityCookie;
status = CommitNotificationUnit( pContext, pInternalPolicyRule, pCtxString, pCtxThread, &pUserNotificationMap->NotificationUnit[0], sizeof(NOTIFICATION_UNIT) + FloatingUnitSize );
//
// Overflowed? Check out!
// 
if( *((PULONG)((PCHAR)pUserNotificationMap+pUserNotificationMap->MappedSize)) != SecurityCookie )
  {
  status = STATUS_HEAP_CORRUPTION;
  ReportDesignError_Leave( "Memory corruption detected!" );
  }
```

P.S. Підказка: “за що боролись, на те й напоролись” 😉
