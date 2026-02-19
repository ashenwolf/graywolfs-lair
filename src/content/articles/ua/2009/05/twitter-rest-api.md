---
title: "Приклад використання Twitter REST API"
date: 2009-05-13
tags: ["api", "bit.ly", "python", "rest", "tricks", "twitter", "software-engineering"]
lang: ua
category: software-engineering
---

[![](http://www.python.org/images/python-logo.gif "Python logo")](http://www.python.org/)

Вчора вночі щось мене пробило і я до 2-ї ночі сидів писав одну штуку собі в допомогу, а сьогодні вранці, коли хотів вже залити виявилось, що це [вже зробили до мене](http://twitter.com/lostfilmnews/), причому найцікавіше, що виглядає все один в один як те, що зробив мну. Не розумію, правда, як я не знайшов його вчора – мабуть вже заспаний був, але суть не втому. Щоб робота марно не пропадала поділюся парою коротких сніпетів на пітоні.

Перший – для скорочення URL за допомогою сервісу [bit.ly](http://bit.ly/) (перед використанням там треба зареєструватись, щоб отримати API key):

```
import urllib, urllib2
import json # є лише Python 2.6 і старше

bitly_login = "your bitly login"
bitly_apikey = "your API key"

def ShortenURL(url):
  try:
    request = urllib2.urlopen("http://api.bit.ly/shorten?version=2.0.1&longUrl=%s&login=%s&apiKey=%s"
      % (url, bitly_login, bitly_apikey))
    result = json.loads(request.read())
    return result["results"][url]["shortUrl"]
  except:
    return None
```

Другий – для публікації повідомлення в [Twitter](http://twitter.com) (тут використовується несек’юрна Basic HTTP Authorization, бо з [oAuth](http://oauth.net/) це було б набагато складніше, а мені вночі було ліньки возитись).

```
import urllib, urllib2
import base64

login = "your twitter login"
passwd = "your twitter password"
secret = base64.encodestring("%s:%s" % (login, passwd))[:-1]

def Post(message):
  request = urllib2.Request("http://twitter.com/statuses/update.xml",
    urllib.urlencode({"status": message}),
    {"Authorization": "Basic " + secret})
  try:
    urllib2.urlopen(request)
    return message # returning message if it was successfully sent
  except:
    return None
```

Обожнюю python 🙄
