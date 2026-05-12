---
title: "\"Складні речі - доступно, прості - робляться самі\""
date: 2013-07-30
tags: ["clojure", "code complexity", "icalendar", "itblog-ua", "jvm", "lisp", "parsing", "python", "software-engineering"]
lang: ua
category: software-engineering
---

Якщо перефразувати девіз мови Perl “Зробити прості речі простими, а складні можливими” для LISP, то вийде “Зробити складні речі доступними, а прості робляться самі”  
– Всеволод Дьомкін, Grammarly. З презентації на HotCode 2013

![Clojure Logo](http://res.cloudinary.com/dsic6qnnl/image/upload/v1503362119/clojure-icon_mbs5cb.gif)

У мене тут в чорновиках стільки записів -- треба їх потроху публікувати. Але вони всі вже здоровезні, і я все не можу їх довести до ладу, тому я подумав, що варто робити з них менші і таки виводити в світ. Сьогодні я вирішив написати першу замітку про [Clojure](http://clojure.org/). Це, мабуть, наразі самий новий, але вже дуже популярний діалект _LISP_, що працює поверх _JVM_. Перші спроби наковбасити щось на [Clojure](http://clojure.org/) у мене сталися ще кілька місяців тому, коли я написав простенький [конвертор тест-кейсів з Testlink в TFS](https://github.com/ashenwolf/testlink2tfs), але то було зроблено на колінці і окрім того, що я його написав дуже швидко, там пишатись особливо нема чим: це моя перша програмка на чомусь LISP-подібному не рахуючи простеньких завдань в універі, тому код страшненький, без всяких крутих ліспових фішечок типу макросів, з багами, але працює 🙂

Про _Clojure_ я дізнався суто випадково на конференції [Javascript Framework Days](http://frameworksdays.com/event/js-frameworks-day-2013) навесні цього року з презентації [Олександра Соловйова](http://solovyov.net/) про [ClojureScript](https://github.com/clojure/clojurescript) (це така підмножина мови, що транслюється в JavaScript, типу як CoffeeScript). До речі, рекомендую подивитись саму [презенташку про FRP та ClojureScript](http://www.youtube.com/watch?v=R4sTvHXkToQ) – вона весела, динамічна, а мені не потрібно буде розповідати про те, що являють собою LISPоподібні мови і _Clojure_ в тому числі.

А ось нижче приклад простенької задачки яку буквально на днях мну вирішив для себе. Суть полягає в тому, щоб розпарсити старий допотопний HTML на сайтах філармонії, театру Франка, органного залу та інших подібних закладів у iCalendar формат, аби їх можна було б собі підключити собі в Outlook чи Google Calendar. Парсити доводиться звичайний html, бо жоден з цих сайтів та агрегаторів не додумався зробити цього сам, або хоча б видавати афішу в rss-форматі (якщо хтось знає де є такі -- скажіть). Вгадайте скільки рядків займає подібна програмка навіть на Python з будь-якими лібами 😉

Готовий закластися, що навіть на Python буде більше ніж це:

```
(ns eventic.core
  (:require [net.cgrand.enlive-html :as html]
            [clj-time.format :as time]
            [clj-ical.format])
  (:import java.net.URL java.nio.charset.Charset)) 
  
; хелпер для завантаження сторінки (штатний рідер enlive не шарить кодувань)
(defn fetch-page [url]
  (-> url java.net.URL. .getContent (java.io.InputStreamReader. "WINDOWS-1251") html/html-resource))
  
; закачуємо сторінку
(def p
  (fetch-page "http://www.filarmonia.com.ua/ua.afisha"))
  
; хелпер для конвертації дат виду "30.07.2013" в datetime
(defn to-date [date]
  (time/parse (time/formatter "dd.MM.yyyy") date))
  
; переводимо усі теги <br> в n, а всі інші теги прибираємо зберігаючи текст
(defn extractor [content]
  (map #(apply str (-> % (html/at [:br] (html/content "n") [:*] html/unwrap))) content)) 

; вибираємо дати і конвертуємо в date-time формат
(def dates
  (map #(-> % :content first to-date)
        (html/select p [:table :tr :td :p :span])))
    
; вибираємо заголовки
(def titles
  (map #(-> % :content first str)
        (html/select p [:table :tr :td :h2])))

; вибираємо описи одразу переводячи їх в plain text
(def descriptions 
  (rest (extractor
    (html/select p [:table :tr :td [:p (html/attr? :align)]]))))

; робимо структуру наповнення для iCalendar
(def ical
  (map #(vec (zipmap [:dtstart :summary :description] %))
        (map vector dates titles descriptions)))

; записуємо в файл
(spit "filarmony.ics"
  (->> (clj-ical.format/write-object
         (apply conj [:vcalendar] (map #(apply conj [:vevent] %) ical)))
       with-out-str))
```

І все. На виході отримуємо готовий файл у iCalendar форматі з усім необхідним. Можливо з першого погляду здаватиметься, що це якась тарабарщина, але насправді _Clojure_ вчиться дуже швидко. Достатньо пари годин на день і вже за 3-4 дні можна писати маленькі корисні штуки для себе (я раніше постійно використовував _Python_ для цього, але тепер в мене з’явилася нова робоча конячка 🙂 ). І суть навіть не в тому, що цей код компактний сам по собі. Суть в тому, що Clojure має такі засоби, що дозволяють створювати бібліотеки на кшталт [Enlive](https://github.com/cgrand/enlive), які надзвичайно потужні і прості в користуванні одночасно, а відповідно код що їх використовує стає простішим і його легше підтримувати.

А тим часом я думаю як це все оформити в простенький сервіс, який можна буде розгорнути на Google App Engine -- все ж _Clojure_ на JVM працює. Я вже надивився прикладів і презентацій на [“Hackers with Attitude”](http://www.hackers-with-attitude.com/), тож хочу тепер сам спробувати (і згодом описати це).

P.S. Ну і хто досі не читав [“Перемогти посередність”](http://graywolf.org.ua/2011/11/16/beating-the-averages-translation/ "Перемогти посередність") Пола Грема, дуже рекомендую 😉
