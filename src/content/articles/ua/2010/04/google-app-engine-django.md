---
title: "Google App Engine + Django"
date: 2010-04-08
tags: ["appengine", "django", "GAE", "gaeutilities", "google", "itblog-ua", "zipimport", "software-engineering"]
lang: ua
category: software-engineering
---

![django-logo-negative](http://res.cloudinary.com/dsic6qnnl/image/upload/h_137,w_300/v1503359204/django-logo-negative_mf4xo8.png "django-logo-negative")

![Powered by Google App Engine](http://code.google.com/appengine/images/appengine-silver-120x30.gif)

Яким би [поганим не здався мені на перший погляд Datastore](http://graywolf.org.ua/2009/05/24/google-datastore-sucks/) у [Google App Engine](http://code.google.com/appengine/), але тим не менш для багатьох проектів і його буде цілком достатньо (тим паче, що у roadmap його розвитку майорить довгоочікуваний повнотекстовий пошук). Тому для платформи одного з нових міні-проектів, які нещодавно спали мені на думку мну вибрав саме _Google App Engine_. Водночас мну дуже вже звик до фреймворку [Django](http://www.djangoproject.com/) і мається на увазі не лише його _ORM_, тому вирішив підключити його останню версію (в комплекті з GAE йде 0.96, яка вже ну дууууже застаріла). Але не за допомогою костилів ([цього](http://code.google.com/p/google-app-engine-django/) чи [ось цього](http://code.google.com/p/app-engine-patch/)) як минулого разу, а просто напряму і викинувши все зайве (тобто фактично все, що було зав’язано на _ORM_). І не дивлячись на те, що в Інеті було повно мануалів по підключенню _Django_ помучитись в неочікуваних місцях трохи довелося.

По-перше, сама збірка _Django_. Я підбирав модулі частково експериментальним шляхом і щоб не прописувати все вручну постійно зробив собі простенький **.bat**\-файл, який пакує в архів необхідну частину джанги:

```
"C:\Program Files\7-Zip\7z.exe" a django.zip
^ django\__init__.py
^ django\bin
^ django\core
^ django\conf
^ django\db
^ django\dispatch
^ django\forms
^ django\http
^ django\middleware
^ django\shortcuts
^ django\template
^ django\template\tags
^ django\test
^ django\utils
^ django\views
^ django\contrib\__init__.py
^ django\contrib\contenttypes
^ django\contrib\localflavor
^ django\contrib\markup
^ django\contrib\sitemaps
^ django\contrib\humanize
^ django\contrib\formtools
```

Зібраний цим скриптом архівний файлик я підклав у корінь новоствореного gae-проекту. Причому пакування в архів тут робиться не задля економії дискового простору. Просто у _App Engine_ є обмеження на кількість файлів, а в проекті _Django_ їх дуже багато. Тепер залишилась справа за малим: підмінити _Django_ що йде у комплекті з _GAE_ на нашу версію, яку ми завантажимо з архіву за допомогою фічі [zipimport](http://docs.python.org/release/2.6/library/zipimport.html). Тут все досить просто (це мій поточний варіант скрипта, але думаю без якихось проблем має запрацювати і той, що виклдаений на [офіційній сторінці інтеграції GAE та Django](http://code.google.com/intl/uk/appengine/articles/django10_zipimport.html)):

**[main.py](http://main.py)**

```
#!/usr/bin/env python
# main.py
import os, sys, logging

os.environ["DJANGO_SETTINGS_MODULE"] = "projectname.settings"

# Google App Engine imports.
from google.appengine.ext.webapp
import util

# Uninstall Django 0.96.
for k in [k for k in sys.modules if k.startswith('django')]:
  del sys.modules[k]

# Add Django 1.0 archive to the path.
django_path = 'django.zip'
sys.path.insert(0, django_path)

# Force Django to reload its settings.
from django.conf import settings
settings._target = None

import django.core.handlers.wsgi
import django.core.signals
import django.db

def log_exception(*args, **kwds):
  logging.exception('Exception in request:') # Log errors. 
  
django.core.signals.got_request_exception.connect(log_exception) # Unregister the rollback event handler.

django.core.signals.got_request_exception.disconnect(django.db._rollback_on_exception)

def main():
  # Create a Django application for WSGI.
  application = django.core.handlers.wsgi.WSGIHandler()
  # Run the WSGI CGI handler with that application.
  util.run_wsgi_app(application)

if __name__ == "__main__":
  main()
```

Але найцікавіша частина над якою я намучився найбільше – це налаштування файлу **[settings.py](http://settings.py)** в самому _Django_. По-перше, треба повідключати модулі зав’язані на Django ORM, тобто видалити або закоментити Middleware-класи:

```
django.contrib.sessions.middleware.SessionMiddleware
django.middleware.csrf.CsrfViewMiddleware
django.contrib.auth.middleware.AuthenticationMiddleware
django.contrib.messages.middleware.MessageMiddleware
```

\*\*NOTE:\*\*_SessionMiddleware_ варто замінити на той, що йде у комплекті з [gaeutilities](http://gaeutilities.appspot.com/) – тоді ви принаймні зможете скористатись портованим аналогом сессій.

Контекст-процесори:

```
django.contrib.auth.context_processors.auth
django.contrib.messages.context_processors.messages
```

Та додатки:

```
django.contrib.auth
django.contrib.sessions
django.contrib.sites
django.contrib.messages
```

Також, наскільки я зрозумів, портована версія Django має певні проблеми з підтримкою i18n, тому в конфігураційному файлі її варто відключити (але питання інтернаціоналізації для мене вельми актуальне, тому найближчим часом постараюсь цю проблему вирішити):

`USE_I18N = False`

Ну от в принципі і все. Мну черпав джерело натхнення з:

*   [Django on Google App Engine in 13 simple steps by Thomas Brox R?st](http://thomas.broxrost.com/2008/04/08/django-on-google-app-engine/)
*   [Django приложение на Google App Engine by diadya\_vova](http://habrahabr.ru/blogs/django/25696/)
*   [Using Django 1.0 on App Engine with Zipimport by Dan Sanderson](http://code.google.com/intl/uk/appengine/articles/django10_zipimport.html)
