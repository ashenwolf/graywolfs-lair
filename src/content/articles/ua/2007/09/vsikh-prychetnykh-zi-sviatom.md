---
title: "Всіх причетних зі святом!"
date: 2007-09-13
tags: ["life"]
lang: ua
category: life
---

А причетні самі знають з яким 🙂

Сьогодні я дивлюсь найпопулярніша річ – це вітати у вигляді вихідного коду. Зустрічались мені сьогодні варіанти на php та AS3. Нарешті є і наш, C++ варіант 😀 І взагалі день сьогодні якийсь дивний. Багато розмов в асьці зі співробітниками мають приблизно такий вигляд:

```
<hand> http://cards.yandex.ru/card.xml?card_id=2289
<hand> http://www.arte.ru/main.phtml?aid=5010127
<hand>http://flash-ripper.com/archives/001859.php](http://flash-ripper.com/archives/001859.php

int main()
  {
  while(true)
    {
    Programmer* pProg = God::GetInstance()->CreateProgrammer();
    pProg->SetHappiness(pProg->GetHappiness() + 1);
    pProg->SetHealth(pProg->GetHealth() + 1);
    pProg->SetWealth(pProg->GetWealth() + 1);
    while(!pProg->IsDrunk())
      {
      Beer beer;
      pProg->AcceptVisitor(&beer)
      }
    Mate* pMate = God::GetInstance()->CreateMateForPerson(pProg);
    if(pMate)
      {
      Bed* pBed = pProg->GetBed();
      if(!pBed) pBed = pMate->GetBed();
      if(pBed) pBed->HostSex(pProg,pMate);
      // God::GetInstance()->DisposeOfPerson(pMate);
      }
    // God::GetInstance()->DisposeOfPerson(pProg);
    }
  }

<graywolf> ликает %)  
<hand> лучше так, чем иначе 🙂  
<graywolf> согласен 😀  
<graywolf> Кстати, может вместо:

Programmer* pProg = God::GetInstance()->CreateProgrammer();

Лучше что-то типа:

Programmer* pProg = God::GetInstance()->CreateHumanInstance(CLSID_PROGRAMMER);

😀  
<Hand> 🙂
```
