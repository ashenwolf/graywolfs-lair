---
title: "Wordpress: додаємо RSS у FeedBurner"
date: 2008-05-09
tags: ["category filtering", "feedburner", "feeds", "filtering", "htaccess", "itblog-ua", "rss", "rss aggregator", "tag filtering", "tip", "wordpress", life]
lang: ua
category: life
---

Захотілося мені нещодавно додати свою [RSS](http://graywolf.org.ua/feed/)\-ку з блогу у [Feedburner](http://feedburner.com/) для статистики. Здавалося б: немає нічого простіше, адже для цього у Вордпреса є навіть [спеціальний плагін](http://www.google.com/support/feedburner/bin/topic.py?topic=13252). Та насправді не все йде по маслу, якщо ви використовуєте фільтрацію по тегам чи категоріям (tag/category filtering), а плагін редіректить будь-який feed (повний він чи фільтрований) на повний feed у Фідбьорнері. Ясно було, що потрібно якось їх розмежувати, наприклад, за допомогою файлу _.htaccess_. Покопавшись трохи в інеті знайшов-таки симпатичне рішення:

```
 RewriteCond %{THE_REQUEST} ^[A-Z]{3,9}\ /(feed|wp-atom|wp-feed|wp-rss|wp-rdf)(.+)\ HTTP/ [NC,OR]  
 RewriteCond %{QUERY_STRING} ^feed [NC]  
 RewriteCond %{HTTP_USER_AGENT} !^(FeedBurner|FeedValidator) [NC]  
 RewriteRule .* http://feeds.feedburner.com/адреса_фіду_на_feedburner [R=307,L]  
```

P.S. До речі, зверніть увагу на рядок з фільтрацією по User-Agent. Його не варто видаляти – пересвідчився на власному досвіді – я першим ділом його “прооптимізував”. Але без нього Feedburner при опитуванні фіду з вашого сайту редіректиться сам на себе, а не читає оригінал і виходить, звісно, дурня.
